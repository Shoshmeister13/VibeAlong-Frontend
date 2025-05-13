// Make sure any forms in this component are properly initialized and handled

import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-12 bg-black text-white">
      <div className="container max-w-5xl mx-auto px-4">
        {/* REGULAR FOOTER CONTENT */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="md:w-1/3">
            <Link href="/" className="inline-block mb-4">
              <Image src="/vibealong-logo.png" alt="VibeAlong Logo" width={60} height={60} className="h-12 w-12" />
            </Link>
            <p className="text-sm text-white/70 mb-4">
              Connecting developers with vibe-coders to turn AI-generated code into production-ready applications.
            </p>
            <p className="text-sm text-white/70">
              &copy; {new Date().getFullYear()} Lima Labs. All rights reserved.
              <br />
              <span className="text-xs"></span>
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-white/70 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-white/70 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/tasks" className="text-white/70 hover:text-white">
                    Tasks Board
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-white/70 hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-white/70 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-white/70 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/for-developers" className="text-white/70 hover:text-white">
                    For Developers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/70 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
