"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create and export the supabase client instance
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)

// Also export the createClient function for cases where a new instance is needed
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. " +
        "This will cause errors on the client side. " +
        "Make sure you have set up environment variables properly.",
    )
    return null
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

export default supabase
