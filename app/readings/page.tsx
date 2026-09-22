"use client"

import {useEffect, useState} from 'react'
import { supabase } from '@/lib/superbaseClient'
import { getCurrentUserRole } from '@/lib/getRole'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function ReadingsPage() {
  const [readings, setReadings] = useState<any[]>([])
  const [sites, setSites] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setRole(await getCurrentUserRole())

      const { data: siteRows } = await supabase.from('sites').select('id, name')
      const siteMap: Record<string, string> = {}
      siteRows?.forEach(s => { siteMap[s.id] = s.name })
      setSites(siteMap)

      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50)

      if (error) setError(error.message)
      setReadings(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="p-10">Loading readings...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role ?? undefined} />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Recent Readings</h1>
        {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}

        {readings.length === 0 ? (
          <p className="bg-yellow-50 p-4 border rounded">No readings recorded yet.</p>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Site</th>
                  <th className="p-3">Metric</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Recorded At</th>
                </tr>
              </thead>
              <tbody>
                {readings.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{sites[r.site_id] || 'Unknown site'}</td>
                    <td className="p-3">{r.metric}</td>
                    <td className="p-3">{r.value}</td>
                    <td className="p-3 text-gray-500">{new Date(r.recorded_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
