// Import and re-export the mock client
import { mockSupabase } from "./mock-client"

export const createClient = () => {
  return mockSupabase
}
