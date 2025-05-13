// Mock data for various entities
const MOCK_DATA = {
  projects: [
    {
      id: "proj-1",
      name: "E-commerce Platform",
      project_name: "E-commerce Platform",
      description: "A modern e-commerce platform with React and Node.js",
      platform: "Next.js",
      stage: "Development",
      vibe_coder_id: "mock-user-id-123",
      created_at: new Date().toISOString(),
    },
    {
      id: "proj-2",
      name: "Portfolio Website",
      project_name: "Portfolio Website",
      description: "Personal portfolio website with blog functionality",
      platform: "Vercel",
      stage: "Planning",
      vibe_coder_id: "mock-user-id-123",
      created_at: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: "task-1",
      title: "Implement user authentication",
      description: "Add login, signup, and password reset functionality",
      status: "open",
      priority: "high",
      project_id: "proj-1",
      estimated_hours: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "task-2",
      title: "Create product listing page",
      description: "Design and implement the product grid with filtering options",
      status: "in_progress",
      priority: "medium",
      project_id: "proj-1",
      estimated_hours: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: "task-3",
      title: "Set up payment processing",
      description: "Integrate Stripe for secure payment processing",
      status: "completed",
      priority: "high",
      project_id: "proj-1",
      estimated_hours: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: "task-4",
      title: "Design homepage layout",
      description: "Create responsive homepage design with hero section",
      status: "open",
      priority: "medium",
      project_id: "proj-2",
      estimated_hours: 5,
      created_at: new Date().toISOString(),
    },
  ],
  developers: [
    {
      id: "dev-1",
      user_id: "dev-user-1",
      full_name: "Alex Johnson",
      email: "alex@example.com",
      skills: ["React", "Node.js", "TypeScript"],
      experience_years: 5,
      hourly_rate: 85,
      availability: "part-time",
      profile_image: "/abstract-aj.png",
      rating: 4.8,
      projects_completed: 12,
    },
    {
      id: "dev-2",
      user_id: "dev-user-2",
      full_name: "Sam Rivera",
      email: "sam@example.com",
      skills: ["Next.js", "Tailwind CSS", "GraphQL"],
      experience_years: 3,
      hourly_rate: 70,
      availability: "full-time",
      profile_image: "/stylized-initials.png",
      rating: 4.6,
      projects_completed: 8,
    },
    {
      id: "dev-3",
      user_id: "dev-user-3",
      full_name: "Taylor Kim",
      email: "taylor@example.com",
      skills: ["React Native", "Firebase", "UI/UX"],
      experience_years: 4,
      hourly_rate: 75,
      availability: "part-time",
      profile_image: "/abstract-geometric-sr.png",
      rating: 4.9,
      projects_completed: 15,
    },
  ],
  profiles: [
    {
      id: "mock-user-id-123",
      email: "demo@vibealong.com",
      full_name: "Demo User",
      role: "vibe-coder",
      profile_completed: true,
    },
  ],
  vibe_coders: [
    {
      id: "vibe-1",
      user_id: "mock-user-id-123",
      full_name: "Demo User",
      email: "demo@vibealong.com",
      profile_completed: true,
    },
  ],
}

// Mock Supabase client
export const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: MOCK_DATA.profiles[0] } }, error: null }),
    getUser: async () => ({ data: { user: MOCK_DATA.profiles[0] }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { user: MOCK_DATA.profiles[0] }, error: null }),
    signUp: async () => ({ data: { user: MOCK_DATA.profiles[0] }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table) => ({
    select: (columns = "*") => ({
      eq: (column, value) => ({
        single: async () => {
          // Find the first matching item in the mock data
          const items = MOCK_DATA[table] || []
          const item = items.find((item) => item[column] === value)
          return { data: item || null, error: null }
        },
        order: () => ({
          limit: async (limit) => {
            const items = MOCK_DATA[table] || []
            const filteredItems = items.filter((item) => item[column] === value).slice(0, limit)
            return { data: filteredItems, error: null }
          },
        }),
        async get() {
          const items = MOCK_DATA[table] || []
          const filteredItems = items.filter((item) => item[column] === value)
          return { data: filteredItems, error: null }
        },
      }),
      neq: () => ({
        async get() {
          return { data: MOCK_DATA[table] || [], error: null }
        },
      }),
      order: () => ({
        limit: async (limit) => {
          const items = MOCK_DATA[table] || []
          return { data: items.slice(0, limit), error: null }
        },
        async get() {
          return { data: MOCK_DATA[table] || [], error: null }
        },
      }),
      async get() {
        return { data: MOCK_DATA[table] || [], error: null }
      },
    }),
    insert: async () => ({ data: { id: "new-mock-id" }, error: null }),
    update: async () => ({ data: {}, error: null }),
    delete: async () => ({ data: {}, error: null }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: "mock-file-path" }, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: "/abstract-geometric-sr.png" } }),
    }),
  },
}

// Export as both named and default export to match different import patterns
export const supabase = mockSupabase
export default mockSupabase
