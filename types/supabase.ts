export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: string
          created_at?: string
        }
      }
      developer_applications: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          experience_level: string
          skills: Json
          vibe_coding_tools: Json | null
          github_url: string | null
          availability: string
          additional_info: string | null
          terms_accepted: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          experience_level: string
          skills: Json
          vibe_coding_tools?: Json | null
          github_url?: string | null
          availability: string
          additional_info?: string | null
          terms_accepted: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          experience_level?: string
          skills?: Json
          vibe_coding_tools?: Json | null
          github_url?: string | null
          availability?: string
          additional_info?: string | null
          terms_accepted?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      developer_quiz_results: {
        Row: {
          id: string
          developer_id: string
          quiz_attempt: number
          score: number
          status: string
          answers: Json | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          developer_id: string
          quiz_attempt?: number
          score: number
          status: string
          answers?: Json | null
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          developer_id?: string
          quiz_attempt?: number
          score?: number
          status?: string
          answers?: Json | null
          completed_at?: string
          created_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          question: string
          options: Json
          correct_answer: string
          category: string
          difficulty: string
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          options: Json
          correct_answer: string
          category: string
          difficulty: string
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          options?: Json
          correct_answer?: string
          category?: string
          difficulty?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          priority: string
          category: string
          stack: string[]
          key_points: string[] | null
          suggested_steps: Json | null
          estimated_time_hours: number | null
          estimated_cost_usd: number | null
          status: string
          vibe_coder_id: string
          developer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          priority: string
          category: string
          stack: string[]
          key_points?: string[] | null
          suggested_steps?: Json | null
          estimated_time_hours?: number | null
          estimated_cost_usd?: number | null
          status?: string
          vibe_coder_id: string
          developer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          priority?: string
          category?: string
          stack?: string[]
          key_points?: string[] | null
          suggested_steps?: Json | null
          estimated_time_hours?: number | null
          estimated_cost_usd?: number | null
          status?: string
          vibe_coder_id?: string
          developer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
