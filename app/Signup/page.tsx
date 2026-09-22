"use client"

import { useState } from 'react'
import { supabase } from '@/lib/superbaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
	
	 const [email, setEmail] = useState('')
	 const [password, setPassword] = useState('')
	 const router = useRouter()
	 
	 const handleSignup = async (e: any) =>{
		 e.preventDefault()
		 
		 const { error } = await supabase.auth.signUp({ email, password })
		 if(error)alert(error.message)
			 else{
				 alert('Check email or login now')
				 router.push('/login')
			 }
		 
	 }
	 
	 return(
	    <div className="min-h-screen flex item-center justify-center bg-grey-100">
		   <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow w-96">
		      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
			   <input className="w-full border p-2 mb-3 rounded" placeholder="Email" type="email" value={email} 
			      onChange={e =>setEmail(e.target.value)} required/>
			     
				 <input className="w-full border p-2 mb-4 rounded" placeholder="password" type="password" value={password} 
			      onChange={e =>setPassword(e.target.value)} required/>
				  
				   
			        <button className="w-full bg-black text-white p-2 rounded">Sign up</button>
					
	        </form>
		</div>	
    )
}