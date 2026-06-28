import { Seo } from "../components/shared/Seo";

export default function Legal({ type }: { type: 'terms' | 'privacy' | 'safeguarding' | 'refund' }) {
  const content = {
    terms: {
      title: "Terms of Service",
      date: "Last Updated: March 2026",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          body: "By accessing or using the Bucks 11 Plus Tests platform (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. If you are registering on behalf of a child, you confirm that you are the parent or legal guardian of that child and that you accept these terms on their behalf."
        },
        {
          heading: "2. Service Description",
          body: "Bucks 11 Plus Tests is an independent digital education platform providing diagnostic assessments, practice questions, readiness forecasts and progress tracking tools designed to support preparation for the Buckinghamshire 11+ Secondary Transfer Test. The Service is intended for informational and educational purposes only. We do not guarantee any specific score, outcome or grammar school placement. Our readiness forecasts are indicative estimates calculated from observed performance on GL-style questions using a fixed scoring scale and are not official standardised scores. The official GL Assessment applies proprietary age-standardised scoring tables (which adjust a child's raw score according to their date of birth) that are not available to independent providers; our model does not apply this adjustment. Accordingly, our readiness estimates may differ from a child's official GL Assessment result, and should be treated as a directional preparation guide only."
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
          body: "All content on the Service — including but not limited to questions, assessments, reports, text, graphics, logos, designs and software — is the property of Bucks 11 Plus Tests or its licensors and is protected by copyright and other intellectual property laws. You may not copy, reproduce, distribute, modify, create derivative works from, publicly display or otherwise exploit any content from the Service without our prior written consent. Your subscription grants you a limited, non-exclusive, non-transferable licence to access and use the Service for personal, non-commercial educational purposes only."
        },
        {
          heading: "8. Disclaimers and Limitations of Liability",
          body: "The Service is provided on an \"as is\" and \"as available\" basis. We make no warranties or representations, express or implied, regarding the accuracy, reliability or completeness of the Service or its content. We do not guarantee that the Service will be uninterrupted, error-free or secure. To the maximum extent permitted by law, Bucks 11 Plus Tests shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits, data or goodwill, arising from or in connection with your use of the Service. Our total liability to you for any claim arising from or related to the Service shall not exceed the amount you paid to us in the 12 months preceding the claim. Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law."
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
          body: "If you have any questions about these Terms of Service, please contact us at support@11plustesthub.co.uk."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      date: "Last Updated: May 2026",
      sections: [
        {
          heading: "1. Data Controller",
          body: "Ianson Systems Limited, trading as Bucks 11 Plus Tests, is the data controller for personal data collected through this platform. Our registered office is 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, and our ICO registration number is ZC127831. We are committed to protecting your privacy and handling your data in accordance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018 and the Privacy and Electronic Communications Regulations (PECR)."
        },
        {
          heading: "2. Data We Collect",
          body: "We collect the following categories of personal data: Account information — your email address, the password you choose, and timestamps for when your account was created and last used. Your password is stored using industry-standard one-way hashing (scrypt) and cannot be viewed by anyone, including our team. Child profile data (server-stored) — your child's year group only (Year 4, 5 or 6), used to scope question difficulty. Child first name (device-only) — if you choose to enter your child's first name to personalise the dashboard, it is stored only in your own browser's local storage and is never transmitted to or stored on our servers. Clearing your browser data or signing in from a different device will remove it. Assessment data — answers, scores, timing data and performance metrics generated when your child completes diagnostics and practice sessions. Payment data — billing details are entered directly into Stripe's payment forms; we do not see or store your full card number, only a Stripe customer reference. Email communication data — records of transactional and service emails sent to you, including email type, delivery status and timestamps, to manage communication frequency and preferences. Usage data — pages visited, features used, browser type, device information and IP address, collected automatically when you use the Service."
        },
        {
          heading: "3. Lawful Basis for Processing",
          body: "We process personal data on the following lawful bases: Contract — to provide the Service you have subscribed to, including delivering assessments, generating reports and tracking progress. Legitimate interests — to improve the Service, analyse usage patterns, prevent fraud and ensure platform security. Consent — for non-essential cookies (analytics and advertising), which only run after you accept the cookie banner, and for service/marketing emails, which only run if you opt in. You can withdraw either consent at any time. Legal obligation — to comply with applicable laws, regulations and legal processes."
        },
        {
          heading: "4. How We Use Your Data",
          body: "We use personal data to: provide, maintain and improve the Service; generate readiness forecasts, performance reports and progress tracking; process payments and manage subscriptions; send transactional emails including password reset links, diagnostic results notifications and account-related communications; send optional service emails such as practice reminders and upgrade suggestions (only where you have opted in to email communications); analyse aggregate usage patterns to improve our content and platform; and comply with legal obligations."
        },
        {
          heading: "4a. Email Communications",
          body: "We send two categories of email: Transactional emails — these are essential to the operation of your account and include password reset links, payment confirmations and critical account notifications. These are sent regardless of your marketing preferences as they are necessary for the performance of our contract with you. Service emails — these include diagnostic results summaries, practice reminders and upgrade suggestions. These are only sent if you have opted in to email communications during account setup or via your Account Settings page. You can withdraw your consent and stop receiving service emails at any time by: clicking the 'Unsubscribe' link at the bottom of any service email, or toggling off email communications in your Account Settings. Withdrawal of consent does not affect emails already sent. We log email delivery events (type, status, timestamp) to manage sending frequency and prevent duplicate communications. These delivery logs are automatically deleted after 12 months. We do not share your email address with any third party for their own marketing purposes."
        },
        {
          heading: "5. Children's Data",
          body: "Bucks 11 Plus Tests is designed exclusively for parents and guardians to use on behalf of their child. The account holder must be a parent or legal guardian aged 18 or over; we do not provide accounts directly to children. By creating a child profile, you confirm you are the parent or legal guardian of that child and that you consent — as the holder of parental responsibility under Article 8 of the UK GDPR — to our processing of your child's year group and assessment performance for the purpose of providing the educational service. The child's first name is optional and, if entered, is held only on your own device (browser local storage) — it is never transmitted to or stored on our servers. We collect the minimum data needed to deliver the Service. We do not use any child's data for marketing, advertising, profiling for advertising, or behavioural advertising. We do not share child data with any third party for their own purposes. You can update, export or delete your child's data at any time from your Account Settings, and deleting your account immediately removes every linked child profile, session and answer."
        },
        {
          heading: "6. Cookies and Analytics",
          body: "We use a small number of strictly essential cookies that are required to keep you signed in and maintain your session — these are exempt from the consent requirement under PECR. We also use Google Ads / Google Analytics cookies to measure how the Service is used and the effectiveness of our advertising. These analytics and advertising cookies only run after you give explicit consent via the cookie banner that appears on your first visit; if you click 'Reject non-essential' or close the banner, no analytics or advertising script is loaded. You can change your decision at any time by clearing this site's data in your browser. We have configured Google Analytics to anonymise IP addresses where supported. Web fonts are served from our own servers, not from third-party CDNs."
        },
        {
          heading: "7. Third-Party Processors",
          body: "We share personal data with the following third-party processors who act on our written instructions and under appropriate data processing agreements: Stripe Payments Europe, Ltd. — payment processing, invoicing and tax records. Card details are entered directly into Stripe and never reach our servers. Resend (Resend.com) — transactional and service email delivery. Your email address and email content are passed to Resend solely to send the message. Replit, Inc. — application hosting, database hosting and infrastructure for the Service. Google LLC — only when you have accepted the cookie banner: Google Ads and Google Analytics for measurement and advertising; gtag.js is loaded directly from Google's servers and may set cookies and process your IP address. Web fonts (Inter, Libre Baskerville) are NOT loaded from Google — they are self-hosted by us. We do not sell, rent or trade your personal data to any third party for their own marketing purposes."
        },
        {
          heading: "8. Data Retention",
          body: "Active accounts: we keep your personal data for as long as you have an active subscription or are actively using the free tier. Once your subscription has ended (or if you have only ever used the free tier), we keep your account so you can return — for example for a sibling, or in the next exam cycle — for 24 months from your last sign-in. We will email you 30 days before an account is automatically deleted so you have a chance to sign in and keep it. After 24 months of inactivity with no active subscription, an automated process permanently deletes your account, child profiles, test sessions, answers and email history. We chose 24 months because it covers the typical Year 4 → Year 5 → Year 6 family cycle without holding data longer than necessary. Specific data types: password-reset tokens expire automatically after 1 hour; email delivery logs are auto-deleted after 12 months; payment and tax records remain in Stripe for the period required by HMRC (currently 6 years), which is Stripe's responsibility as the regulated payment processor. Account closure: if you delete your account from the Account Settings page (or by emailing us), all account, child profile, session and answer data is removed immediately from our live systems, and any active subscription is cancelled with Stripe at the same time. Backups: our database hosting provider takes automated point-in-time backups for disaster-recovery purposes, with a rolling backup window of up to 30 days. Deleted records may persist in those backups for the duration of that window before being overwritten in the normal backup-rotation cycle. These backups are encrypted, access-controlled, used only to restore the live system in the event of a service-impacting failure, and are never used to repopulate deleted user data into the live database. The Information Commissioner's Office accepts that this kind of backup retention is compatible with the right to erasure under UK GDPR Article 17 provided the data is not actively used and is overwritten in the normal course. Anonymised aggregates that cannot be linked back to you may be retained for the purpose of improving our readiness models."
        },
        {
          heading: "9. Your Rights Under UK GDPR",
          body: "Under UK data protection law, you have the following rights: Right of access — to request a copy of the personal data we hold about you. Right to rectification — to request correction of inaccurate or incomplete data. Right to erasure — to request deletion of your personal data, subject to legal retention requirements. Right to restrict processing — to request that we limit how we use your data. Right to data portability — to receive your data in a structured, commonly used format. Right to object — to object to processing based on legitimate interests. Right to withdraw consent — where processing is based on consent (cookies, marketing emails), you may withdraw it at any time without affecting the lawfulness of processing carried out before withdrawal. How to exercise these rights: For data portability and erasure, the fastest route is the self-serve buttons in your Account Settings — 'Download my data' gives you an immediate JSON export of your account, child profiles, test sessions, answers and email history, and 'Delete account' immediately removes all of your data from our live systems. For any other right, or if you cannot access your account, please email us at support@11plustesthub.co.uk and we will respond within 30 days."
        },
        {
          heading: "10. Data Security",
          body: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure or destruction. These include TLS encryption of data in transit, scrypt password hashing with per-user salts and timing-safe comparison, rate-limited authentication endpoints, secure HTTP-only session cookies, security HTTP headers via Helmet, role-based admin access controls and regular security reviews. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security."
        },
        {
          heading: "11. International Transfers",
          body: "Some of our processors are based in the United States: Stripe Payments Europe operates servers in the EEA but its corporate parent Stripe, Inc. is US-based; Resend, Replit and Google LLC are all US-based. Where personal data is transferred outside the United Kingdom we rely on the UK Government's adequacy regulations (including the UK Extension to the EU-US Data Privacy Framework) where the recipient is certified, and on the International Data Transfer Agreement (IDTA) or the UK Addendum to the EU Standard Contractual Clauses where it is not. You can request a copy of the relevant safeguards by emailing us."
        },
        {
          heading: "12. Changes to This Policy",
          body: "We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on the Service. We encourage you to review this policy periodically."
        },
        {
          heading: "13. Contact and Complaints",
          body: "If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at support@11plustesthub.co.uk. If you are unsatisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk."
        }
      ]
    },
    safeguarding: {
      title: "Safeguarding Policy",
      date: "Last Updated: May 2026",
      sections: [
        {
          heading: "Our Approach",
          body: "Ianson Systems Limited, trading as Bucks 11 Plus Tests, is committed to the safety and wellbeing of every child whose data is entered onto our platform. The Service is designed for parent or legal guardian administration on behalf of a child preparing for the Buckinghamshire Secondary Transfer Test. Accounts are held by the parent or guardian, never by the child directly, and are only created where a parent has confirmed they are aged 18 or over and hold parental responsibility for that child."
        },
        {
          heading: "No Child–Child or Child–Adult Contact",
          body: "Our platform deliberately does not include any feature that puts a child in contact with another user. There are no chat channels, forums, comments, direct messages, profiles visible to other families, or live tutor sessions. The only inputs a child makes are answers to multiple-choice diagnostic and practice questions; no free-text content from a child is published to or shared with anyone outside the household account."
        },
        {
          heading: "Content Standards",
          body: "All practice content, comprehension passages and sample questions are reviewed before publication to ensure they are age-appropriate (typical end-of-Year-5 reading age) and free from violent, sexual, frightening or otherwise distressing material. We do not use third-party advertising on the platform — children using the Service will not be exposed to ads of any kind."
        },
        {
          heading: "Data Minimisation for Children",
          body: "We collect only the minimum data needed to deliver an indicative readiness assessment: the child's year group (Year 4, 5 or 6) and their answers to questions. The child's first name, if entered, is held only on the parent's own device (browser local storage) and is never transmitted to or stored on our servers. We do not use any child's data for marketing, advertising or behavioural profiling. Full detail is in our Privacy Policy."
        },
        {
          heading: "Raising a Concern",
          body: "If you have a safeguarding concern relating to anything you encounter on the platform — content you believe is inappropriate, a suspected technical issue affecting a child's session, or anything else — please email us at support@11plustesthub.co.uk. We aim to acknowledge safeguarding emails within one working day. If you believe a child is at immediate risk of harm, contact the NSPCC on 0808 800 5000 or, in an emergency, the police on 999."
        },
        {
          heading: "Policy Review",
          body: "This policy is reviewed at least annually and whenever there is a material change to the Service. The named safeguarding contact is the Director of Ianson Systems Limited."
        }
      ]
    },
    refund: {
      title: "Refund Policy",
      date: "Last Updated: 19 March 2026",
      sections: [
        {
          heading: "Overview",
          body: "Bucks 11 Plus Tests is a digital educational platform. All purchases provide immediate access to digital content including diagnostic assessments, practice questions, analytics dashboards and progress tracking tools. Because our products are delivered digitally, our refund policy reflects the nature of digital goods under UK consumer law. Different cancellation rights apply depending on whether you have purchased a monthly subscription or a one-time programme plan — please read the relevant section below."
        },
        {
          heading: "Monthly Subscriptions (Bucks Plus Edge — £35/mo)",
          body: "If you are on a Bucks Plus Edge monthly subscription (£35/month), you may cancel at any time via the in-app billing portal on your Account page. Cancellation takes effect at the end of your current billing period — your access will continue until that date and will not be renewed. We do not issue partial-month refunds once a billing period has started. The 14-day cooling-off right (see below) applies to your first monthly payment only and is automatically waived as soon as you access any digital content on the platform. Subsequent monthly renewals are not covered by a cooling-off right."
        },
        {
          heading: "Your Right to Cancel (14-Day Cooling-Off Period) — One-Time Programme Purchases",
          body: "Bucks Plus Edge is sold as a monthly (£35) or annual (£279) subscription. Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have 14 days from the date of your first subscription purchase to cancel and receive a full refund — provided you have not substantially used the digital content (starting a full diagnostic, accessing paid practice content, or downloading reports). See the refund policy for full details. If you purchased under a legacy one-time plan before our current pricing, contact support@11plustesthub.co.uk for plan-specific terms.",
        },
        {
          heading: "When a Refund Cannot Be Issued",
          body: "Once you begin accessing the digital content — for example by starting a diagnostic assessment, completing practice drills, or viewing personalised analytics — your right to cancel is waived. By using the platform after purchase, you acknowledge and consent to the immediate supply of digital content and confirm that you understand this means you lose your 14-day cancellation right. This is in accordance with the Consumer Contracts Regulations 2013, Regulation 37."
        },
        {
          heading: "How to Request a Refund",
          body: "If you are within the 14-day window and have not accessed any digital content, please email us at support@11plustesthub.co.uk with your account email address and order reference. We aim to process all eligible refund requests within 5 working days. Refunds will be returned to the original payment method."
        },
        {
          heading: "Exceptional Circumstances",
          body: "If you experience a technical issue that prevents you from using the platform as intended, please contact us at support@11plustesthub.co.uk. We will review each case individually and may offer a partial refund, credit, or extension at our discretion."
        },
        {
          heading: "Plan Changes & Upgrades",
          body: "Current plan prices: Bucks Plus Edge Monthly £35/month; Bucks Plus Edge Annual £279/year. If you wish to change your plan, please contact support@11plustesthub.co.uk. Downgrades are not available once content from a higher-tier plan has been accessed."
        },
        {
          heading: "Contact",
          body: "For any questions about this refund policy or to request a refund, please email support@11plustesthub.co.uk."
        }
      ]
    }
  };

  const current = content[type];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 min-h-[60vh]">
      <Seo 
        title={`${current.title} | Bucks 11 Plus Tests`} 
        description={`Read our ${current.title.toLowerCase()} to understand our policies and commitments.`} 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight" data-testid="text-legal-title">{current.title}</h1>
      <p className="text-sm text-muted-foreground mt-2" data-testid="text-legal-dates">
        {current.date} &nbsp;·&nbsp; Last reviewed: May 2026
      </p>
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
