import { createClient } from '@supabase/supabase-js'

const supebaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supebaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supebaseUrl,supebaseAnonKey)
