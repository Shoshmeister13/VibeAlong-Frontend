import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="flex-1">
        <div className="container mx-auto py-12 px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">General Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is-vibealong">
                <AccordionTrigger className="text-xl font-medium">What is VibeAlong?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  VibeAlong is a developer collaboration platform that connects vibe-coders (AI code generators) with
                  professional developers to turn AI-generated code into production-ready applications. Our platform
                  streamlines the development process by leveraging the strengths of both AI and human expertise.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-does-vibealong-work">
                <AccordionTrigger className="text-xl font-medium">How does VibeAlong work?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Vibe-coders create initial code using AI tools, then post tasks on our platform. Professional
                  developers pick up these tasks, refine the code, fix bugs, and implement best practices. The platform
                  facilitates communication, collaboration, and payment between both parties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="who-can-use-vibealong">
                <AccordionTrigger className="text-xl font-medium">Who can use VibeAlong?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  VibeAlong serves two main user groups: vibe-coders who generate code using AI tools but need help
                  refining it, and professional developers looking for flexible work opportunities to apply their
                  expertise. Businesses can also use our platform to accelerate their development process.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">For Vibe-Coders</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="how-to-post-task">
                <AccordionTrigger className="text-xl font-medium">How do I post a task?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  After creating an account and setting up your profile, navigate to the dashboard and select "Create
                  New Task." Provide details about your project, upload your code, specify requirements, and set your
                  budget. Once submitted, developers can view and apply to work on your task.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="task-budget">
                <AccordionTrigger className="text-xl font-medium">
                  How much should I budget for a task?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Task budgets vary based on complexity, scope, and urgency. We recommend starting with smaller tasks to
                  get familiar with the platform. Our system provides budget suggestions based on similar tasks, but you
                  have full control over your budget allocation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="developer-qualifications">
                <AccordionTrigger className="text-xl font-medium">
                  How do I know if a developer is qualified?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  All developers on our platform undergo a rigorous vetting process, including technical assessments and
                  background checks. Each developer profile displays their skills, experience, ratings, and reviews from
                  previous tasks. You can also chat with developers before accepting their application.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">For Developers</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="become-developer">
                <AccordionTrigger className="text-xl font-medium">
                  How do I apply to become a developer?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Visit our "For Developers" page and complete the application form. You'll need to provide information
                  about your skills, experience, and availability. After submission, you'll take a technical assessment.
                  Once approved, you can create your profile and start accepting tasks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment">
                <AccordionTrigger className="text-xl font-medium">How do I get paid?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Payments are processed through our secure platform. When a task is completed and approved by the
                  vibe-coder, funds are released to your account. You can withdraw your earnings to your preferred
                  payment method (bank transfer, PayPal, etc.) at any time, subject to minimum withdrawal amounts.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="task-types">
                <AccordionTrigger className="text-xl font-medium">What types of tasks can I work on?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Tasks vary widely, from bug fixes and code optimization to implementing new features and integrating
                  APIs. You can filter tasks based on your skills, preferred technologies, and availability. The
                  platform supports various programming languages and frameworks.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">Platform and Technical</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="code-security">
                <AccordionTrigger className="text-xl font-medium">Is my code secure on the platform?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes, we take security seriously. All code and project data are encrypted both in transit and at rest.
                  Our platform uses secure collaboration tools, and all users agree to confidentiality terms. You can
                  also implement additional security measures like NDAs for sensitive projects.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="supported-technologies">
                <AccordionTrigger className="text-xl font-medium">
                  What technologies does VibeAlong support?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Our platform supports a wide range of programming languages, frameworks, and technologies. This
                  includes but is not limited to JavaScript, TypeScript, Python, React, Vue, Angular, Node.js, Django,
                  Ruby on Rails, and many more. If you have specific requirements, you can specify them in your task
                  details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="disputes">
                <AccordionTrigger className="text-xl font-medium">How do you handle disputes?</AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  We have a dedicated dispute resolution process. If issues arise between vibe-coders and developers,
                  our support team will review the case, examine the communication history and deliverables, and work
                  toward a fair resolution. Funds are held in escrow until disputes are resolved.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
            <p className="mb-4">Our support team is ready to help you with any other questions you might have.</p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
