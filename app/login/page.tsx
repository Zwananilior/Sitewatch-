"use client"

import { useState } from 'react'
import { supabase } from '@/lib/superbaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
	
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	
	const handleLogin = async (e: any) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		const { error } = await
		supabase.auth.signInWithPassword({ email,password })
		setLoading(false)
		if(error) alert(error.message)
			else router.push('/')
	}
	return(
	   <div className="min-h-screen flex items-center justify-center bg-gray-100">
	       <form onSubmit={ handleLogin } className="bg-white p-8 rounded shadow w-96">
	         <h1 className="text-2xl font-bold mb-6">Site watch - Login</h1>
			     { error && <p className="bg-red-50 text-red-700 text-sm p-2 rounded mb-3">{error}</p>}
			    <input className="w-full border p-2 mb-3 rounded" placeholder="Email" type="email" value={email} 
  onChange={e => setEmail(e.target.value)} required/>
			   <input className="w-full border p-2 mb-4 rounded" placeholder="Password"
			      type="password" value={password} onChange={e =>setPassword(e.target.value)} 
				      required/>
					  <button disabled={loading} className="w-full bg-black text-white p-2 rounded">
					  
					  {loading ? 'Logging in...': 'Login'}
					  </button>
					     <p className="mt-4 text-sm">No account? <a href="/Signup" className="underline">Sign up</a></p>
						 
						 
						  
	
	       </form>
	    </div>
	)
}
