import { supabase } from './superbaseClient'

//fetch the logged-in user's role (admin or user ) from the profile table.
//falls back to the 'viewer' if no role is set, sos a missing value never accidentally grants admin access.

export async function getCurrentUserRole () {
	const { data : { session } } = await supabase.auth.getSession ()
	
	if (!session) return null 
	
	const { data, error } =await supabase
         .from('profiles')
         .select('role')
         .eq('id', session.user.id)
         .single()
    if(error || !data?.role) return 'viewer'
    return data.role	
}