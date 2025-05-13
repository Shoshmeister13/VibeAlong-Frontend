"use client"

import { createContext, useContext, useState } from "react"
import { mockSupabase } from "@/lib/supabase/mock-client"

const SupabaseContext = createContext(null)

export const SupabaseProvider = ({ children }) => {
  const [supabase] = useState(() => mockSupabase)

  return <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
