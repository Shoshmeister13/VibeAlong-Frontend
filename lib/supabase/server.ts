import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import supabaseClient from "@/lib/supabase"

// Import and re-export the mock client
import { mockSupabase } from "./mock-client"

// Server-side Supabase client (for server components that need cookie access)
export const createClient = (cookieStore = cookies()) => {
  return createServerComponentClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY,
    },
  )
}

// Export the singleton client for direct usage in server actions
export const supabase = supabaseClient

export const createServerClient = () => mockSupabase
export default mockSupabase
