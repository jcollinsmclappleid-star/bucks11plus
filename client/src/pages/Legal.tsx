import { Seo } from "../components/shared/Seo";

export default function Legal({ type }: { type: 'terms' | 'privacy' | 'safeguarding' | 'refund' }) {
  const content = {
    terms: {
      title: "Terms of Service",
      date: "Last Updated: March 2026",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          body: "By accessing or using the 11+ Standard platform (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. If you are registering on behalf of a child, you confirm that you are the parent or legal guardian of that child and that you accept these terms on their behalf."
        },
        {
          heading: "2. Service Description",
          body: "11+ Standard is an independent digital education platform providing diagnostic assessments, practice questions, readiness forecasts and progress tracking tools designed to support preparation for the Buckinghamshire 11+ Secondary Transfer Test. The Service is intended for informational and educational purposes only. We do not guarantee any specific score, outcome or grammar school placement. Our readiness forecasts are modelled estimates based on observed performance patterns and are not official standardised scores."
        },
        {
          heading: "3. User Accounts and Responsibilities",
          body: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Each account is for personal, non-commercial use by a single family. You must not share your account credentials with others or allow multiple families to use a single account. You agree not to use the Service for any unlawful purpose, to reproduce or redistribute any content from the platform, or to attempt to reverse-engineer, scrape or extract data from the Service."
        },
        {
          heading: "4. Children's Accounts",
          body: "The Service is designed for use by parents and guardians on behalf of children. Children under 13 should not create accounts independently. By creating a child profile, you confirm you are the parent or legal guardian and consent to the collection and processing of your child's assessment data as described in our Privacy Policy."
        },
        {
          heading: "5. Payments and Subscriptions",
          body: "Certain features of the Service require a paid subscription. All prices are displayed in GBP and include VAT where applicable. Payment is processed securely through Stripe, our third-party payment processor. By purchasing a subscription, you authorise us to charge the payment method you provide. Subscription details, including the features included in each plan, are described on our Pricing page. We reserve the right to change our pricing at any time, though changes will not affect existing active subscriptions."
        },
        {
          heading: "6. Refund Policy",
          body: "Our refund policy is set out separately on our Refund Policy page. In summary, you have 14 days from the date of purchase to cancel and receive a full refund, provided you have not accessed any digital content. Once you begin using the platform (for example, by starting a diagnostic or accessing practice questions), your right to cancel is waived in accordance with the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013."
        },
        {
          heading: "7. Intellectual Property",
          body: "All content on the Service — including but not limited to questions, assessments, reports, text, graphics, logos, designs and software — is the property of 11+ Standard or its licensors and is protected by copyright and other intellectual property laws. You may not copy, reproduce, distribute, modify, create derivative works from, publicly display or otherwise exploit any content from the Service without our prior written consent. Your subscription grants you a limited, non-exclusive, non-transferable licence to access and use the Service for personal, non-commercial educational purposes only."
        },
        {
          heading: "8. Disclaimers and Limitations of Liability",
          body: "The Service is provided on an \"as is\" and \"as available\" basis. We make no warranties or representations, express or implied, regarding the accuracy, reliability or completeness of the Service or its content. We do not guarantee that the Service will be uninterrupted, error-free or secure. To the maximum extent permitted by law, 11+ Standard shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits, data or goodwill, arising from or in connection with your use of the Service. Our total liability to you for any claim arising from or related to the Service shall not exceed the amount you paid to us in the 12 months preceding the claim. Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law."
        },
        {
          heading: "9. Termination",
          body: "We may suspend or terminate your access to the Service at any time if you breach these terms, engage in fraudulent or abusive behaviour, or for any other reason at our reasonable discretion. You may close your account at any time by contacting us. Upon termination, your right to access the Service ceases immediately. We may retain certain data as required by law or for legitimate business purposes as described in our Privacy Policy."
        },
        {
          heading: "10. Changes to These Terms",
          body: "We may update these Terms of Service from time to time. If we make material changes, we will notify you by email or by posting a notice on the Service. Your continued use of the Service after such changes constitutes acceptance of the updated terms."
        },
        {
          heading: "11. Governing Law and Jurisdiction",
          body: "These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or in connection with these terms or the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales."
        },
        {
          heading: "12. Contact",
          body: "If you have any questions about these Terms of Service, please contact us at support@bucks11plustest.co.uk."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      date: "Last Updated: March 2026",
      sections: [
        {
          heading: "1. Data Controller",
          body: "11+ Standard is the data controller for personal data collected through this platform. We are committed to protecting your privacy and handling your data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018."
        },
        {
          heading: "2. Data We Collect",
          body: "We collect the following categories of personal data: Account information — your name, email address and password when you register. Your password is stored using industry-standard one-way hashing and cannot be viewed by anyone, including our team. Child profile data — your child's first name, age and year group, which you provide when setting up a child profile. Assessment data — answers, scores, timing data and performance metrics generated when your child completes diagnostics and practice sessions. Payment data — billing details processed securely by Stripe; we do not store full card numbers on our servers. Email communication data — records of transactional and service emails sent to you, including email type, delivery status and timestamps, to manage communication frequency and preferences. Usage data — pages visited, features used, browser type, device information and IP address, collected automatically when you use the Service."
        },
        {
          heading: "3. Lawful Basis for Processing",
          body: "We process personal data on the following lawful bases: Contract — to provide the Service you have subscribed to, including delivering assessments, generating reports and tracking progress. Legitimate interests — to improve the Service, analyse usage patterns, prevent fraud and ensure platform security. Consent — where required, for example for marketing communications. You can withdraw consent at any time. Legal obligation — to comply with applicable laws, regulations and legal processes."
        },
        {
          heading: "4. How We Use Your Data",
          body: "We use personal data to: provide, maintain and improve the Service; generate readiness forecasts, performance reports and progress tracking; process payments and manage subscriptions; send transactional emails including password reset links, diagnostic results notifications and account-related communications; send optional service emails such as practice reminders and upgrade suggestions (only where you have opted in to email communications); analyse aggregate usage patterns to improve our content and platform; and comply with legal obligations."
        },
        {
          heading: "4a. Email Communications",
          body: "We send two categories of email: Transactional emails — these are essential to the operation of your account and include password reset links, payment confirmations and critical account notifications. These are sent regardless of your marketing preferences as they are necessary for the performance of our contract with you. Service emails — these include diagnostic results summaries, practice reminders and upgrade suggestions. These are only sent if you have opted in to email communications during account setup or via your Account Settings page. You can withdraw your consent and stop receiving service emails at any time by: clicking the 'Unsubscribe' link at the bottom of any service email, or toggling off email communications in your Account Settings. Withdrawal of consent does not affect emails already sent. We log email delivery events (type, status, timestamp) to manage sending frequency and prevent duplicate communications. We do not share your email address with any third party for their own marketing purposes."
        },
        {
          heading: "5. Children's Data",
          body: "Our Service is designed for parents and guardians to use on behalf of their children. We do not knowingly collect personal data directly from children under 13 without parental consent. All child profiles are created by a parent or guardian. We collect only the minimum data necessary to provide the educational service — specifically, a first name, age and assessment performance data. We do not use children's data for marketing or advertising purposes. If you believe a child has provided us with personal data without parental consent, please contact us and we will delete the data promptly."
        },
        {
          heading: "6. Cookies and Analytics",
          body: "We use essential cookies to keep you signed in and maintain your session. We may use analytics tools to understand how the Service is used, including page views and feature usage. Analytics data is aggregated and does not personally identify individual users. You can control cookie preferences through your browser settings."
        },
        {
          heading: "7. Third-Party Processors",
          body: "We share personal data with the following third-party processors who act on our behalf: Stripe — for secure payment processing. Stripe's privacy policy governs their handling of your payment data. Resend — for transactional and service email delivery. When we send you an email, your email address and the email content are processed by Resend (resend.com) on our behalf. Resend acts as a data processor under our instruction and does not use your data for their own purposes. Their privacy policy is available at resend.com/legal/privacy-policy. Hosting and infrastructure providers — to host and deliver the Service. We ensure all third-party processors provide adequate data protection safeguards and have appropriate data processing agreements in place. We do not sell, rent or trade your personal data to any third party for their own marketing purposes."
        },
        {
          heading: "8. Data Retention",
          body: "We retain your personal data for as long as your account is active or as needed to provide the Service. Password reset tokens are temporary and expire automatically after 1 hour; they are deleted from our systems once used or expired. Email delivery logs are retained for up to 12 months to manage communication frequency and troubleshoot delivery issues. If you close your account, we will delete or anonymise your personal data within 90 days, except where we are required to retain it for legal, accounting or regulatory purposes. Assessment data may be retained in anonymised form for the purpose of improving our readiness models."
        },
        {
          heading: "9. Your Rights Under UK GDPR",
          body: "Under UK data protection law, you have the following rights: Right of access — to request a copy of the personal data we hold about you. Right to rectification — to request correction of inaccurate or incomplete data. Right to erasure — to request deletion of your personal data, subject to legal retention requirements. Right to restrict processing — to request that we limit how we use your data. Right to data portability — to receive your data in a structured, commonly used format. Right to object — to object to processing based on legitimate interests. Right to withdraw consent — where processing is based on consent, you may withdraw it at any time. To exercise any of these rights, please contact us at support@bucks11plustest.co.uk. We will respond to your request within 30 days."
        },
        {
          heading: "10. Data Security",
          body: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure or destruction. These include encryption of data in transit, secure authentication mechanisms and regular security reviews. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security."
        },
        {
          heading: "11. International Transfers",
          body: "Your data is primarily stored and processed within the United Kingdom and European Economic Area. Where data is transferred outside these regions, we ensure appropriate safeguards are in place in accordance with UK GDPR requirements."
        },
        {
          heading: "12. Changes to This Policy",
          body: "We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on the Service. We encourage you to review this policy periodically."
        },
        {
          heading: "13. Contact and Complaints",
          body: "If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at support@bucks11plustest.co.uk. If you are unsatisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk."
        }
      ]
    },
    safeguarding: {
      title: "Safeguarding Policy",
      date: "Last Updated: October 2023",
      sections: [
        {
          heading: "",
          body: "11+ Standard is committed to the safety and wellbeing of all children using our platform. Our platform is designed for parent-led administration, and we do not facilitate direct communication between children and other users on the platform."
        }
      ]
    },
    refund: {
      title: "Refund Policy",
      date: "Last Updated: 19 March 2026",
      sections: [
        {
          heading: "Overview",
          body: "11+ Standard is a digital educational platform. All purchases provide immediate access to digital content including diagnostic assessments, practice questions, analytics dashboards and progress tracking tools. Because our products are delivered digitally, our refund policy reflects the nature of digital goods under UK consumer law. Different cancellation rights apply depending on whether you have purchased a monthly subscription or a one-time programme plan — please read the relevant section below."
        },
        {
          heading: "Monthly Subscriptions (Bucks Practice Platform — £24.99/mo or Bucks Practice Platform Edge — £59.99/mo)",
          body: "If you are on a Bucks Practice Platform monthly subscription, you may cancel at any time via the in-app billing portal on your Account page. Cancellation takes effect at the end of your current billing period — your access will continue until that date and will not be renewed. We do not issue partial-month refunds once a billing period has started. The 14-day cooling-off right (see below) applies to your first monthly payment only and is automatically waived as soon as you access any digital content on the platform. Subsequent monthly renewals are not covered by a cooling-off right."
        },
        {
          heading: "Your Right to Cancel (14-Day Cooling-Off Period) — One-Time Programme Purchases",
          body: "This section applies to one-time programme plan purchases (8-week, 12-week, and Bucks Young Scholar Programme 6-month plans). Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have 14 days from the date of purchase to cancel your order and receive a full refund — provided you have not accessed, started or used any of the digital content included in your plan. This includes starting a diagnostic, accessing practice questions, viewing dashboard analytics or downloading any reports. For monthly subscriptions, see the section above."
        },
        {
          heading: "When a Refund Cannot Be Issued",
          body: "Once you begin accessing the digital content — for example by starting a diagnostic assessment, completing practice drills, or viewing personalised analytics — your right to cancel is waived. By using the platform after purchase, you acknowledge and consent to the immediate supply of digital content and confirm that you understand this means you lose your 14-day cancellation right. This is in accordance with the Consumer Contracts Regulations 2013, Regulation 37."
        },
        {
          heading: "How to Request a Refund",
          body: "If you are within the 14-day window and have not accessed any digital content, please email us at support@bucks11plustest.co.uk with your account email address and order reference. We aim to process all eligible refund requests within 5 working days. Refunds will be returned to the original payment method."
        },
        {
          heading: "Exceptional Circumstances",
          body: "If you experience a technical issue that prevents you from using the platform as intended, please contact us at support@bucks11plustest.co.uk. We will review each case individually and may offer a partial refund, credit, or extension at our discretion."
        },
        {
          heading: "Plan Changes & Upgrades",
          body: "Current plan prices: Bucks Practice Platform £24.99/month; Bucks Practice Platform Edge £59.99/month or £495/year; Bucks Young Scholar Programme £349 one-time. If you upgrade from one plan to another (e.g. from Practice Platform to Young Scholar Programme), please contact support@bucks11plustest.co.uk. Downgrades are not available once content from a higher-tier plan has been accessed."
        },
        {
          heading: "Contact",
          body: "For any questions about this refund policy or to request a refund, please email support@bucks11plustest.co.uk."
        }
      ]
    }
  };

  const current = content[type];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 min-h-[60vh]">
      <Seo 
        title={`${current.title} | 11+ Standard`} 
        description={`Read our ${current.title.toLowerCase()} to understand our policies and commitments.`} 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight" data-testid="text-legal-title">{current.title}</h1>
      <p className="text-sm text-muted-foreground mt-2">{current.date}</p>
      <hr className="my-8" />
      {current.sections.map((section, i) => (
        <div key={i} className="mb-8">
          {section.heading && (
            <h2 className="text-xl font-bold text-primary font-serif mb-3" data-testid={`text-legal-heading-${i}`}>{section.heading}</h2>
          )}
          <p className="text-slate-600 leading-relaxed" data-testid={`text-legal-body-${i}`}>{section.body}</p>
        </div>
      ))}
    </div>
  );
}
