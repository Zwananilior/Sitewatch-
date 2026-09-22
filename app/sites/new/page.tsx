"use client"

import {useEffect, useState} from 'react'
import { supabase } from '@/lib/superbaseClient'
import { getCurrentUserRole } from '@/lib/getRole'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'


export default function NewSitePage() {
	
	const [name, setName] = useState('')
	const [location, setLocation] = useState('')
	const [status, setStatus] = useState('Online')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [role, setRole] = useState<string | null>(null)
	const [checkingRole, setCheckingRole] = useState(true)
	const router = useRouter()
	
	
	useEffect(() => {
		const check = async () => {
			const { data: { session } } = await supabase.auth.getSession()
			if(!session)
			{
				router.push('/login')
				return
			}
			const useRole = await getCurrentUserRole()
			setRole(useRole)
			//Client-side check only - real enforcement 
			if(useRole !=='admin'){
				router.push('/')
				return
			}
			setCheckingRole(false)
			
		}
		check()
		
	}, [])
	
	const handleSubmit = async (e: any) =>{
	  e.preventDefault()
	  setError('')
	  setLoading(true)
	
	  const { error } = await await supabase.from('sites').insert({ name, location, status })
	
	  setLoading(false)
	  if (error) setError(error.message)
	  else router.push('/')
	}
	
	if(checkingRole) return <div className="p-10">Checking access...</div>
	
	return(
	     <div className="min-h-screen bg-gray-50">
	          <Navbar role={role ?? undefined} />
	            <div className="p-8 max-w-4xl mx-auto">
		             <h1 className="text-2xl font-bold mb-6">Add Site</h1>
				            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
							 {error && <p className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4"> {error}</p>}
							 
							 <label className="block text-sm font-medium mb-1">Site name</label>
							 <input className="w-full border p-2 mb-3 rounded" value={name} onChange={e =>setName(e.tagert.value)}/>
							 
							 <label className="block text-sm font-medium mb-1">Location</label>
							 <input className="w-full border p-2 mb-3 rounded" value={location} onChange={e =>setLocation(e.tagert.value)}/>
							 
							 <label className="block text-sm font-medium mb-1">Status</label>
							 <select className="w-full border p-2 mb-4 rounded" value={status} onClick={e.setStatus(e.target.value)}>
							     <option value="Online">Online</option>
								 <option value="Offline">Offline</option>
								 <option value="Unknown">Unknown</option>
							 </select>
							 
							 <button disabled={loading} className="w-full bg-black text-white p-2 rounded disabled:opacity-50">
								 {loading ? 'Saving...' : 'Save Changes'}
							 </button>
						 </form>  
				
				</div>

				
		 </div>
	     
	)
	
}
