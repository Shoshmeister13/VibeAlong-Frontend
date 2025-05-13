import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="container mx-auto py-12 px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Last updated: March 20, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                At VibeAlong, operated by Lima Labs ("we", "our", or "us"), we respect your privacy and are committed to
                protecting your personal data. This privacy policy will inform you about how we look after your personal
                data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
              <p>
                This privacy policy applies to all information collected through our website{" "}
                <a href="https://vibealong.com" className="text-blue-600 hover:underline">
                  vibealong.com
                </a>
                , and/or any related services, sales, marketing, or events (collectively, the "Services").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p>We collect several types of information from and about users of our Services, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Personal Identifiers:</strong> Such as name, email address, phone number, billing address, and
                  payment information.
                </li>
                <li>
                  <strong>Profile Information:</strong> Including your skills, experience, portfolio, education, and
                  professional background.
                </li>
                <li>
                  <strong>Account Information:</strong> Such as username, password, account preferences, and account
                  activity.
                </li>
                <li>
                  <strong>Communication Data:</strong> Including messages, comments, and feedback exchanged on our
                  platform.
                </li>
                <li>
                  <strong>Technical Data:</strong> Such as IP address, browser type and version, time zone setting,
                  browser plug-in types and versions, operating system and platform, and other technology on the devices
                  you use to access our Services.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our website and Services, including your
                  browsing patterns, page views, and feature usage.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Collect Your Information</h2>
              <p>We use different methods to collect data from and about you, including:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Direct Interactions:</strong> You may provide us with your personal information when you
                  create an account, fill out forms, correspond with us, or interact with other users on our platform.
                </li>
                <li>
                  <strong>Automated Technologies:</strong> As you interact with our Services, we may automatically
                  collect technical data about your equipment, browsing actions, and patterns using cookies, server
                  logs, and other similar technologies.
                </li>
                <li>
                  <strong>Third Parties:</strong> We may receive personal information about you from various third
                  parties, such as payment processors, identity verification services, and analytics providers.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>To create and manage your account</li>
                <li>To provide and maintain our Services</li>
                <li>To process and facilitate transactions</li>
                <li>To match developers with appropriate tasks</li>
                <li>To enable communication between users</li>
                <li>To verify developer skills and qualifications</li>
                <li>To improve and personalize our Services</li>
                <li>To send you updates, notifications, and support messages</li>
                <li>To detect and prevent fraud and abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Disclosure of Your Information</h2>
              <p>We may share your personal information with:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Other Users:</strong> When you participate in the platform, certain information (such as your
                  profile, ratings, and communication) is visible to other users you interact with.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party vendors who perform
                  services on our behalf, such as payment processing, data analysis, email delivery, hosting, and
                  customer service.
                </li>
                <li>
                  <strong>Business Partners:</strong> We may share your information with our business partners to offer
                  you certain products, services, or promotions.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information where required by law,
                  regulation, or legal process.
                </li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational measures to protect your personal
                information from accidental loss, unauthorized access, use, alteration, and disclosure. These measures
                include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Encryption of sensitive data both in transit and at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure development practices</li>
                <li>Regular security training for our team</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p>
                We will retain your personal information only for as long as necessary to fulfill the purposes for which
                we collected it, including for the purposes of satisfying any legal, accounting, or reporting
                requirements.
              </p>
              <p>
                In some circumstances, we may anonymize your personal information (so that it can no longer be
                associated with you) for research or statistical purposes, in which case we may use this information
                indefinitely without further notice to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate or incomplete information</li>
                <li>The right to delete your personal information</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the "Contact Us" section
                below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. International Transfers</h2>
              <p>
                Your information may be transferred to, and maintained on, computers located outside of your state,
                province, country, or other governmental jurisdiction where the data protection laws may differ from
                those in your jurisdiction.
              </p>
              <p>
                If you are located outside Israel and choose to provide information to us, please note that we transfer
                the data to Israel and process it there. Your submission of such information represents your agreement
                to that transfer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p>
                Our Services are not intended for children under the age of 18, and we do not knowingly collect personal
                information from children under 18. If we learn that we have collected personal information from a child
                under 18, we will take steps to delete that information as quickly as possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new
                privacy policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
              <p>
                You are advised to review this privacy policy periodically for any changes. Changes to this privacy
                policy are effective when they are posted on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
              <p>
                Email:{" "}
                <a href="mailto:privacy@vibealong.com" className="text-blue-600 hover:underline">
                  privacy@vibealong.com
                </a>
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
