"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase }  from '../lib/superbaseClient'

export default function Navbar({ role} : { role?: string }){
	const router = useRouter()
	
	const handleLogout = async () => {
	 await supabase.auth.signOut()
     router.push('/login')	 
	}


   return(
     <nav className="bg-black text-white px-6 flex justify-between items-center">
	   <div className="flex gap-6 itmes-center">
	    <span className="font-bold">Site Watch</span>
         <Link href="/readings" className="text-sm hover:underline">Readings</Link>
		 <Link href="/alerts" className="text-sm hover:underline">Alerts</Link>
		 {role === 'admin' &&(
		  <Link href="/sites/new" className="text-sm hover:underline"> + Add Site </Link>
		    )}
		 </div>
		 
		 <div className="flexitems-center gap-4">
		 { role && (
		     <span className="text-xs bg-white  text-black px-2 py-1 rounded capitalize">
		     { role }
			 </span>
		     
		 )}   
		 <button onClick={ handleLogout } className="text-sm border-white px-3 py-2 rounded hover:bg-white hover:text-black transition">
          Logout
		  </button>
   
        </div>
   
     </nav>
   )	
}