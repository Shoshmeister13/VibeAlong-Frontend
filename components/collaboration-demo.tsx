import { MacbookMockup } from "./macbook-mockup"

export function CollaborationDemo() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">💻 Real-Time Collaboration in Action</h2>
        <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Watch how developers and Vibe Coders collaborate in real-time, writing code and completing tasks together.
          VibeAlong makes remote pair programming seamless and productive.
        </p>

        {/* Hide on mobile, show on medium screens and up */}
        <div className="hidden md:block">
          <MacbookMockup />
        </div>

        {/* Mobile alternative */}
        <div className="md:hidden text-center mb-12">
          <div className="bg-[#111] p-6 rounded-lg border border-[#333] max-w-sm mx-auto">
            <p className="text-white/80 mb-4">
              Our visual demo is best viewed on larger screens. Please visit on a desktop device to see our interactive
              collaboration mockup.
            </p>
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-[#111] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3">Live Code Editing</h3>
            <p className="text-gray-400">
              See changes as they happen with real-time code synchronization between developers and Vibe Coders.
            </p>
          </div>

          <div className="bg-[#111] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3">Integrated Chat</h3>
            <p className="text-gray-400">
              Discuss implementation details without leaving your coding environment, keeping communication efficient.
            </p>
          </div>

          <div className="bg-[#111] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3">Task Tracking</h3>
            <p className="text-gray-400">
              Monitor progress and celebrate successes as tasks are completed in real-time on the VibeAlong platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
