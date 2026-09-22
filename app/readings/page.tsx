"use client"

import {useEffect, useState} from 'react'
import { supabase } from '@/lib/superbaseClient'
import { getCurrentUserRole } from '@/lib/getRole'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function ReadingPage() {
	
	const [readings, setReadings] = useState<any[]>([])
	const [sites, setSites] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(true)
	const [error, setError] =useState('')
	const [role, setRole] = useState<string | null>(null)
	const router =useRouter()
	
	
	useEffect(() => {
		const load = async ()=>
		{
			 const {data: {session} } = await supabase.auth.getSession()
			 if(!session){
				router.push('/login')
				return
			 }
			 setRole(await getCurrentUserRole())
			
			 const { data, error } = await supabase
			 .from('readings')
			 .select('*')
			 .order('recorded_at' , {ascending: fallse} )
			 .limi(50)
			 
			 if(error) setError(error.message)
				 setReadings(data || [])
			     setLoading(false)
		}
		load()	
	}, [])
	
	return(
	
	<div className="min-h-screen bg-gray-50">
	<Navbar role={role ?? undefined} />
	<div className="p-8 max-w-4xl mx-auto">
		<h1 className="text-2xl font-bold mb-6">Recent Readings</h1>
		{error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4"> {error}</p>}
		
		    {readings.length ===0 ? (
		 			<p className="bg-yellow-50 p-4 border rounded">No Readings recorded yet.</p>
		    ) : (
			     <div className="bg-white rounded shadow ovverflow-hidden">
				     <table className="w-full text-sm">
				         <thead className="bg-gray-100 text-left">
						     <tr>
							     <th className="p-3">Sites</th>
								 <th className="p-3">Metric</th>
								 <th className="p-3">Value</th>
					             <th className="p-3">Recorded</th>
							 </tr>
						 </thead>
						 <tbody>
						 {readings.map(r => ((
						    <tr key={id} className="border-t">
							     <td className="p-3">{sites[r.site_id]}</th>
								 <td className="p-3">{r.metric}</th>
								 <td className="p-3">{r.value}</th>
					             <td className="p-3 text-gray-500">{new Date(r.recorded_at).toLocaleString()}</th>
							 </tr> 
						               
			        				   ))}
						 </tbody>
				     </table>
				 </div>
			)
		}
	</div>	
	</div>
	
	
	)

}
