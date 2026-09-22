"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/superbaseClient'
import { getCurrentUserRole } from '@/lib/getRole'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [sites, setSites] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

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
      .from('alerts')
      .select('*')
      .order('triggered_at', { ascending: false })

    if (error) setError(error.message)
    setAlerts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleResolve = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession()

    const { error } = await supabase.from('alerts').update({ resolved: true }).eq('id', id)
    if (error) { setError(error.message); return }

    await supabase.from('audit_log').insert({
      user_id: session?.user.id,
      action: 'resolve_alert',
      target: id,
    })

    setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a))
  }

  if (loading) return <div className="p-10">Loading alerts...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role ?? undefined} />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Alerts</h1>
        {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">{error}</p>}

        {alerts.length === 0 ? (
          <p className="bg-yellow-50 p-4 border rounded">No alerts triggered yet.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className={`p-4 rounded border flex justify-between items-center ${a.resolved ? 'bg-gray-50' : 'bg-red-50 border-red-200'}`}>
                <div>
                  <p className="font-medium">{sites[a.site_id] || 'Unknown site'}</p>
                  <p className="text-xs text-gray-500">{new Date(a.triggered_at).toLocaleString()}</p>
                </div>
                {a.resolved ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Resolved</span>
                ) : role === 'admin' ? (
                  <button onClick={() => handleResolve(a.id)} className="text-sm bg-black text-white px-3 py-1 rounded">
                    Mark resolved
                  </button>
                ) : (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Open</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
