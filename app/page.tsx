"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/superbaseClient'
import { getCurrentUserRole } from '@/lib/getRole'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Dashboard() {
  const [sites, setSites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const userRole = await getCurrentUserRole()
    setRole(userRole)

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    setSites(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (role !== 'admin') return
    const confirmed = confirm(`Delete "${name}"? This cannot be undone.`)
    if (!confirmed) return

    const { error } = await supabase.from('sites').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    setSites(sites.filter(s => s.id !== id))
  }

  if (loading) return <div className="p-10">Loading sites...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role ?? undefined} />
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}

        {sites.length === 0 ? (
          <p className="bg-yellow-50 p-4 border rounded">
            No sites yet.{' '}
            {role === 'admin' ? (
              <Link href="/sites/new" className="underline font-medium">Add your first site</Link>
            ) : (
              'Ask an admin to add one.'
            )}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sites.map(site => (
              <div key={site.id} className="border p-4 rounded bg-white shadow relative">
                <h2 className="font-bold">{site.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{site.location}</p>
                <span className={`text-xs px-2 py-1 rounded ${site.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {site.status}
                </span>

                {role === 'admin' && (
                  <div className="flex gap-3 mt-3 text-sm">
                    <Link href={`/sites/${site.id}/edit`} className="text-blue-600 underline">Edit</Link>
                    <button onClick={() => handleDelete(site.id, site.name)} className="text-red-600 underline">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}