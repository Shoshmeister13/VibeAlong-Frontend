import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="container mx-auto py-12 px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: March 20, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to VibeAlong ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Terms of
                Service") govern your use of our website located at{" "}
                <a href="https://vibealong.com" className="text-blue-600 hover:underline">
                  vibealong.com
                </a>{" "}
                (the "Service") operated by Lima Labs.
              </p>
              <p>
                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and
                disclose information that results from your use of our web pages. Please read it here:{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              <p>
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part
                of the terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
                termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any
                activities or actions under your password, whether your password is with our Service or a third-party
                service.
              </p>
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming
                aware of any breach of security or unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Developer Vetting and Responsibilities</h2>
              <p>
                Developers who apply to join our platform undergo a vetting process to verify their skills and
                experience. By applying as a developer, you consent to this vetting process and agree to provide
                accurate information about your qualifications.
              </p>
              <p>As a developer on our platform, you agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Complete tasks according to the specifications provided by vibe-coders</li>
                <li>Meet agreed-upon deadlines</li>
                <li>Communicate promptly and professionally</li>
                <li>Respect the confidentiality of code and project information</li>
                <li>Deliver high-quality work that meets industry standards</li>
              </ul>
              <p>
                We reserve the right to remove developers from our platform who consistently fail to meet these
                responsibilities or receive poor ratings from vibe-coders.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Vibe-Coder Responsibilities</h2>
              <p>As a vibe-coder on our platform, you agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide clear and detailed task descriptions</li>
                <li>Respond to developer questions in a timely manner</li>
                <li>Review completed work fairly and promptly</li>
                <li>Release payment for satisfactorily completed work</li>
                <li>Respect developers' time and expertise</li>
              </ul>
              <p>
                We reserve the right to restrict vibe-coders who consistently fail to meet these responsibilities or
                engage in unfair practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p>
                Unless otherwise specified, all code and deliverables created through our platform are subject to the
                following intellectual property terms:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Vibe-coders retain ownership of the original code they submit for tasks</li>
                <li>Developers retain ownership of their specific contributions and modifications</li>
                <li>
                  Upon completion and payment for a task, vibe-coders receive a non-exclusive license to use, modify,
                  and distribute the developer's contributions as part of the complete project
                </li>
              </ul>
              <p>
                Custom intellectual property arrangements can be made between vibe-coders and developers, but must be
                clearly documented in the task agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
              <p>Our platform uses an escrow system to ensure fair payment for completed work:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Vibe-coders fund tasks before developers begin work</li>
                <li>Funds are held in escrow until the task is completed and approved</li>
                <li>Upon approval, funds are released to the developer</li>
                <li>If a dispute arises, our support team will review the case and determine a fair resolution</li>
              </ul>
              <p>
                We charge a platform fee on each transaction, which is clearly displayed before task creation.
                Withdrawal of funds is subject to our payment processing terms, including minimum withdrawal amounts and
                processing times.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
              <p>The following activities are strictly prohibited on our platform:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Creating or distributing malicious code</li>
                <li>Violating intellectual property rights</li>
                <li>Circumventing the platform's payment system</li>
                <li>Harassment or abusive behavior toward other users</li>
                <li>Creating multiple accounts to manipulate ratings or reviews</li>
                <li>Using the platform for illegal activities</li>
              </ul>
              <p>
                Violation of these prohibitions may result in immediate termination of your account and potential legal
                action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, in no event shall VibeAlong, its affiliates,
                directors, employees, or agents be liable for any indirect, punitive, incidental, special,
                consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill,
                use, data, or other intangible losses, that result from the use of, or inability to use, the service.
              </p>
              <p>
                VibeAlong does not guarantee the quality, accuracy, or suitability of code created or modified through
                our platform. Users are responsible for testing and verifying all code before deployment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your
                account, you may simply discontinue using the Service or contact us to request account deletion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will try to provide at least 30 days' notice prior to any new terms taking
                effect.
              </p>
              <p>
                By continuing to access or use our Service after those revisions become effective, you agree to be bound
                by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@vibealong.com" className="text-blue-600 hover:underline">
                  legal@vibealong.com
                </a>
                .
              </p>
              <p>
                Lima Labs
                <br />
                Tel Aviv, Israel
              </p>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
