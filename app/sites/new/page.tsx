"use client"

import {useEffect, useState} from 'react'
import { supabase } from '@/lib/superbaseClient'
import { getCurrentUserRole } from '@/lib/getRole'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function NewSitePage() {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('online')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingRole, setCheckingRole] = useState(true)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      const userRole = await getCurrentUserRole()
      setRole(userRole)
      // Client-side check only — real enforcement is the RLS policy on
      // 'sites'. Never trust this check alone; it's UX, not security.
      if (userRole !== 'admin') {
        router.push('/')
        return
      }
      setCheckingRole(false)
    }
    check()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.from('sites').insert({ name, location, status })

    setLoading(false)
    if (error) setError(error.message)
    else router.push('/')
  }

  if (checkingRole) return <div className="p-10">Checking access...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role ?? undefined} />
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Site</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          {error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">{error}</p>}

          <label className="block text-sm font-medium mb-1">Site name</label>
          <input className="w-full border p-2 mb-3 rounded" value={name} onChange={e => setName(e.target.value)} required />

          <label className="block text-sm font-medium mb-1">Location</label>
          <input className="w-full border p-2 mb-3 rounded" value={location} onChange={e => setLocation(e.target.value)} />

          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full border p-2 mb-4 rounded" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="unknown">Unknown</option>
          </select>

          <button disabled={loading} className="w-full bg-black text-white p-2 rounded disabled:opacity-50">
            {loading ? 'Saving...' : 'Add Site'}
          </button>
        </form>
      </div>
    </div>
  )
}
