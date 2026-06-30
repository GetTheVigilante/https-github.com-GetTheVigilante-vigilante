export interface ScamType {
  id: number;
  title: string;
  description: string;
  warningSign: string;
  prevention: string;
  icon: string;
  image: string;
  severity: 'high' | 'medium' | 'critical';
}

export interface Testimonial {
  id: number;
  name: string;
  age: number;
  location: string;
  story: string;
  scamType: string;
  outcome: string;
  image: string;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  phone?: string;
  category: string;
}

export interface ProtectionStep {
  id: number;
  title: string;
  description: string;
  details: string[];
  icon: string;
}

export const scamTypes: ScamType[] = [
  {
    id: 1,
    title: 'Phone Call Scams',
    description: 'Scammers pretend to be from the IRS, Social Security, or your bank and demand immediate payment or personal information over the phone.',
    warningSign: 'Caller demands immediate payment via gift cards or wire transfer',
    prevention: 'Never give personal info over the phone to unsolicited callers. Hang up and call the organization directly using the number on their official website.',
    icon: 'phone',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837370044_4af28d18.jpg',
    severity: 'critical',
  },
  {
    id: 2,
    title: 'Email Phishing',
    description: 'Fake emails that look like they come from trusted companies, asking you to click a link and enter your password or financial details.',
    warningSign: 'Emails with urgent language, misspellings, or suspicious links',
    prevention: 'Never click links in unexpected emails. Go directly to the website by typing the address in your browser.',
    icon: 'mail',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837393599_b3506621.png',
    severity: 'critical',
  },
  {
    id: 3,
    title: 'Tech Support Fraud',
    description: 'Pop-ups or calls claiming your computer has a virus. Scammers ask for remote access to your computer and charge for fake repairs.',
    warningSign: 'Pop-up warnings saying your computer is infected with a phone number to call',
    prevention: 'Real tech companies will never call you unsolicited. Close suspicious pop-ups and run your own antivirus software.',
    icon: 'monitor',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837369719_f4d55a98.png',
    severity: 'high',
  },
  {
    id: 4,
    title: 'Romance Scams',
    description: 'Scammers create fake profiles on dating sites or social media, build emotional relationships, then ask for money for emergencies or travel.',
    warningSign: 'Online love interest who always has excuses not to meet and asks for money',
    prevention: 'Never send money to someone you have not met in person. Be cautious of people who profess love quickly online.',
    icon: 'heart',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837370163_08c7475d.png',
    severity: 'high',
  },
  {
    id: 5,
    title: 'Medicare & Health Insurance Fraud',
    description: 'Scammers pose as Medicare representatives to steal your Medicare number, then use it to bill for fake services.',
    warningSign: 'Unsolicited calls offering free medical equipment or asking for your Medicare number',
    prevention: 'Never share your Medicare number with strangers. Medicare will never call to sell you anything.',
    icon: 'shield',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837372556_d9350b6a.png',
    severity: 'critical',
  },
  {
    id: 6,
    title: 'Grandparent Scam',
    description: 'A caller pretends to be your grandchild in trouble, begging for money and asking you not to tell anyone.',
    warningSign: '"Grandma/Grandpa, it\'s me!" followed by a request for emergency money',
    prevention: 'Hang up and call your grandchild directly at their known number. Verify the story with other family members.',
    icon: 'users',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837388885_ef0606c1.jpg',
    severity: 'critical',
  },
  {
    id: 7,
    title: 'Lottery & Prize Scams',
    description: 'You receive a message saying you have won a lottery or prize, but you must pay fees or taxes upfront to claim it.',
    warningSign: 'You "won" a contest you never entered and must pay to collect',
    prevention: 'You cannot win a lottery you did not enter. Never pay upfront fees to claim a prize.',
    icon: 'gift',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837394179_5e54fdd8.png',
    severity: 'high',
  },
  {
    id: 8,
    title: 'Online Shopping Scams',
    description: 'Fake websites or social media ads selling products at unbelievable prices. You pay but never receive the item, or receive a counterfeit.',
    warningSign: 'Prices that seem too good to be true on unfamiliar websites',
    prevention: 'Only shop on well-known websites. Look for "https" and a padlock icon in the address bar.',
    icon: 'shopping-bag',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837395121_07cff68d.jpg',
    severity: 'medium',
  },
  {
    id: 9,
    title: 'Charity Scams',
    description: 'Fake charities, especially after natural disasters, that pressure you to donate immediately. Your money goes to scammers, not those in need.',
    warningSign: 'High-pressure tactics, cash-only donations, vague about how funds are used',
    prevention: 'Research charities at give.org or charitynavigator.org before donating. Never donate cash or gift cards.',
    icon: 'hand-heart',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837393599_b3506621.png',
    severity: 'medium',
  },
  {
    id: 10,
    title: 'Investment & Cryptocurrency Scams',
    description: 'Promises of guaranteed high returns with no risk. Scammers may use fake websites or impersonate financial advisors.',
    warningSign: 'Guaranteed returns, pressure to invest now, unregistered investments',
    prevention: 'If it sounds too good to be true, it is. Always verify investments with a licensed financial advisor.',
    icon: 'trending-up',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837370044_4af28d18.jpg',
    severity: 'high',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Margaret W.',
    age: 72,
    location: 'Portland, OR',
    story: 'I received a call from someone claiming to be my grandson saying he was in jail and needed bail money. Something felt off, so I hung up and called my grandson directly. He was perfectly fine at home!',
    scamType: 'Grandparent Scam',
    outcome: 'Avoided losing $5,000',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837417465_7a8b3b55.jpg',
  },
  {
    id: 2,
    name: 'Robert T.',
    age: 68,
    location: 'Tampa, FL',
    story: 'A pop-up on my computer said I had a virus and to call a number immediately. My neighbor told me it was a scam. I closed the browser and ran my antivirus — no virus at all.',
    scamType: 'Tech Support Fraud',
    outcome: 'Saved $300 in fake repair fees',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837438488_74131291.png',
  },
  {
    id: 3,
    name: 'Dorothy L.',
    age: 75,
    location: 'Chicago, IL',
    story: 'I got an email that looked exactly like it was from my bank asking me to verify my account. I almost clicked the link, but noticed the email address was slightly different. I called my bank and they confirmed it was fake.',
    scamType: 'Email Phishing',
    outcome: 'Protected bank account with $12,000',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837419667_1ad2c2c2.png',
  },
  {
    id: 4,
    name: 'James H.',
    age: 70,
    location: 'Phoenix, AZ',
    story: 'Someone called saying I owed back taxes and would be arrested if I did not pay immediately with gift cards. I remembered reading that the IRS never calls demanding immediate payment, so I hung up.',
    scamType: 'Phone Call Scam',
    outcome: 'Avoided losing $2,500',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837440193_2367ad58.png',
  },
  {
    id: 5,
    name: 'Helen M.',
    age: 78,
    location: 'Denver, CO',
    story: 'I met someone wonderful on a dating site. After weeks of chatting, he asked for $1,000 for a plane ticket to visit me. My daughter helped me realize it was a romance scam before I sent any money.',
    scamType: 'Romance Scam',
    outcome: 'Saved $1,000 and emotional distress',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837420700_d78c09d7.jpg',
  },
  {
    id: 6,
    name: 'Frank S.',
    age: 73,
    location: 'Seattle, WA',
    story: 'I received a letter saying I won a foreign lottery. All I had to do was pay a processing fee. I showed it to my son who looked it up online — it was a well-known scam targeting seniors.',
    scamType: 'Lottery Scam',
    outcome: 'Avoided losing $500',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837440936_c9c9bf1d.png',
  },
  {
    id: 7,
    name: 'Patricia K.',
    age: 69,
    location: 'Austin, TX',
    story: 'Someone called offering a free back brace and just needed my Medicare number. I said no and reported it. Later I learned they were billing Medicare for equipment people never received.',
    scamType: 'Medicare Fraud',
    outcome: 'Protected Medicare benefits',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837419444_856c82bb.jpg',
  },
  {
    id: 8,
    name: 'George R.',
    age: 76,
    location: 'Boston, MA',
    story: 'A friend told me about a "guaranteed" investment that would double my money in 30 days. I checked with my financial advisor who confirmed it was a Ponzi scheme. Several people in our community lost thousands.',
    scamType: 'Investment Scam',
    outcome: 'Saved $10,000 retirement savings',
    image: 'https://d64gsuwffb70l.cloudfront.net/69c9dd6f2ee6b4cc3ffecc79_1774837449346_6e9da36f.jpg',
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'You receive a phone call from someone claiming to be from the IRS. They say you owe $3,000 in back taxes and must pay immediately using gift cards or face arrest. What should you do?',
    options: [
      'Pay immediately to avoid arrest — they sound very official',
      'Hang up. The IRS never demands immediate payment by gift card or threatens arrest over the phone',
      'Give them your Social Security number so they can look up your account',
      'Ask them to hold while you go buy gift cards',
    ],
    correctIndex: 1,
    explanation: 'The IRS will NEVER call demanding immediate payment, threaten arrest, or ask for gift cards. They always send official letters first. If you are unsure, hang up and call the IRS directly at 1-800-829-1040.',
  },
  {
    id: 2,
    scenario: 'You get an email from "Amazon" saying your account has been compromised. It asks you to click a link to verify your identity. The email looks official but the sender address is amazon-security@mail-verify.com. What do you do?',
    options: [
      'Click the link and enter your password to secure your account',
      'Reply to the email asking if it is real',
      'Do NOT click the link. Open a new browser tab, go to amazon.com directly, and check your account there',
      'Forward the email to all your contacts to warn them',
    ],
    correctIndex: 2,
    explanation: 'Phishing emails often look very real but use fake email addresses. Never click links in suspicious emails. Always go directly to the website by typing the address yourself. The real Amazon would never email from "mail-verify.com".',
  },
  {
    id: 3,
    scenario: 'Your computer shows a pop-up saying "VIRUS DETECTED! Call 1-800-555-0199 immediately to protect your computer!" The pop-up will not close easily. What should you do?',
    options: [
      'Call the number right away — a virus could steal your information',
      'Give them remote access to your computer so they can fix it',
      'Force-close your browser (Ctrl+Alt+Delete or restart your computer). Real antivirus software does not display phone numbers in pop-ups',
      'Enter your credit card information to pay for virus removal',
    ],
    correctIndex: 2,
    explanation: 'These pop-ups are fake! Real antivirus software never asks you to call a phone number. Force-close your browser or restart your computer. Then run your own trusted antivirus software to check for real threats.',
  },
  {
    id: 4,
    scenario: 'You receive a frantic phone call: "Grandma, it\'s me! I\'m in trouble and need $2,000 right away. Please don\'t tell Mom and Dad!" The voice sounds like it could be your grandchild. What do you do?',
    options: [
      'Send the money immediately — your grandchild is in danger',
      'Ask them personal questions only your real grandchild would know, then hang up and call your grandchild at their known phone number to verify',
      'Wire the money through Western Union as they requested',
      'Go to the store and buy gift cards to send them the codes',
    ],
    correctIndex: 1,
    explanation: 'This is the classic "Grandparent Scam." Scammers can mimic voices or use AI. Always hang up and call your grandchild directly at their known number. Never send money based on an unexpected call, no matter how real it sounds.',
  },
  {
    id: 5,
    scenario: 'You meet someone on a dating website who seems perfect. After chatting for 3 weeks, they say they need $500 for an emergency medical bill and promise to pay you back when you meet. You have never video-chatted. What do you do?',
    options: [
      'Send the money — they seem like a wonderful person and you trust them',
      'Send half the amount as a compromise',
      'Do NOT send money. Ask for a video call first. If they refuse or make excuses, it is likely a romance scam. Report the profile to the dating site',
      'Give them your bank account number so they can pay you back later',
    ],
    correctIndex: 2,
    explanation: 'Romance scammers build emotional connections before asking for money. Red flags include: never meeting in person, avoiding video calls, and requesting money for emergencies. Never send money to someone you have only met online.',
  },
  {
    id: 6,
    scenario: 'You receive a letter saying you won $500,000 in a foreign lottery! To claim your prize, you just need to pay a $50 processing fee and provide your bank details. What should you do?',
    options: [
      'Pay the $50 — it is a small price for $500,000',
      'Provide your bank details so they can deposit the winnings',
      'Throw it away. You cannot win a lottery you never entered. Legitimate lotteries never ask winners to pay fees upfront',
      'Call the number on the letter to learn more',
    ],
    correctIndex: 2,
    explanation: 'You cannot win a lottery or contest you never entered. This is a classic advance-fee scam. If you pay the $50, they will ask for more and more. Legitimate lotteries never require upfront payments. Throw the letter away or report it to the FTC.',
  },
];

export const protectionSteps: ProtectionStep[] = [
  {
    id: 1,
    title: 'Stop & Pause',
    description: 'Do not act immediately. Scammers create urgency to prevent you from thinking clearly.',
    details: [
      'Take a deep breath — there is no real emergency',
      'Tell the caller you will call them back',
      'Do not let anyone pressure you into acting right now',
      'Remember: legitimate organizations will give you time to think',
    ],
    icon: 'pause',
  },
  {
    id: 2,
    title: 'Verify the Source',
    description: 'Independently confirm who is contacting you before sharing any information.',
    details: [
      'Hang up and call the organization using their official number',
      'Look up phone numbers on official websites — not from the caller',
      'Ask a trusted family member or friend for a second opinion',
      'Check email sender addresses carefully for misspellings',
    ],
    icon: 'search',
  },
  {
    id: 3,
    title: 'Protect Your Information',
    description: 'Never share personal, financial, or medical information with unverified contacts.',
    details: [
      'Never give your Social Security number over the phone',
      'Do not share bank account or credit card numbers',
      'Keep your Medicare number private',
      'Do not give remote access to your computer to strangers',
    ],
    icon: 'lock',
  },
  {
    id: 4,
    title: 'Report the Scam',
    description: 'Reporting helps protect you and others. You are not alone and it is not your fault.',
    details: [
      'Call the FTC at 1-877-382-4357',
      'Report to your local police department',
      'Contact your bank immediately if money was sent',
      'File a complaint at reportfraud.ftc.gov',
    ],
    icon: 'flag',
  },
  {
    id: 5,
    title: 'Secure Your Accounts',
    description: 'Take immediate steps to protect your accounts and prevent further damage.',
    details: [
      'Change passwords on any compromised accounts',
      'Place a fraud alert on your credit reports',
      'Monitor your bank and credit card statements',
      'Consider a credit freeze at all three credit bureaus',
    ],
    icon: 'shield-check',
  },
];

export const resources: Resource[] = [
  {
    id: 1,
    name: 'Federal Trade Commission (FTC)',
    description: 'Report fraud and get information about the latest scams targeting consumers.',
    url: 'https://reportfraud.ftc.gov',
    phone: '1-877-382-4357',
    category: 'Government',
  },
  {
    id: 2,
    name: 'FBI Internet Crime Complaint Center',
    description: 'Report internet-related fraud and cybercrime to federal investigators.',
    url: 'https://www.ic3.gov',
    category: 'Government',
  },
  {
    id: 3,
    name: 'AARP Fraud Watch Network',
    description: 'Free fraud prevention resources, scam alerts, and a helpline specifically for older adults.',
    url: 'https://www.aarp.org/money/scams-fraud',
    phone: '1-877-908-3360',
    category: 'Nonprofit',
  },
  {
    id: 4,
    name: 'National Elder Fraud Hotline',
    description: 'Free support for older adults who are victims of financial fraud. Case managers provide personalized help.',
    url: 'https://ovc.ojp.gov/program/stop-elder-fraud',
    phone: '1-833-372-8311',
    category: 'Government',
  },
  {
    id: 5,
    name: 'Social Security Administration',
    description: 'Report Social Security scams and verify if a call from SSA is legitimate.',
    url: 'https://www.ssa.gov/scam',
    phone: '1-800-772-1213',
    category: 'Government',
  },
  {
    id: 6,
    name: 'Medicare Fraud Reporting',
    description: 'Report suspected Medicare fraud, errors, or abuse to protect your healthcare benefits.',
    url: 'https://www.medicare.gov/basics/reporting-medicare-fraud-and-abuse',
    phone: '1-800-633-4227',
    category: 'Government',
  },
  {
    id: 7,
    name: 'National Do Not Call Registry',
    description: 'Register your phone number to reduce unwanted telemarketing and scam calls.',
    url: 'https://www.donotcall.gov',
    phone: '1-888-382-1222',
    category: 'Prevention',
  },
  {
    id: 8,
    name: 'Identity Theft Resource Center',
    description: 'Free assistance for identity theft victims, including step-by-step recovery plans.',
    url: 'https://www.idtheftcenter.org',
    phone: '1-888-400-5530',
    category: 'Nonprofit',
  },
  {
    id: 9,
    name: 'Better Business Bureau Scam Tracker',
    description: 'Search and report scams in your area. See what scams are trending near you.',
    url: 'https://www.bbb.org/scamtracker',
    category: 'Nonprofit',
  },
  {
    id: 10,
    name: 'Eldercare Locator',
    description: 'Connect with local services for older adults, including legal assistance and protective services.',
    url: 'https://eldercare.acl.gov',
    phone: '1-800-677-1116',
    category: 'Government',
  },
  {
    id: 11,
    name: 'Annual Credit Report',
    description: 'Get your free credit reports from all three bureaus to check for unauthorized accounts.',
    url: 'https://www.annualcreditreport.com',
    phone: '1-877-322-8228',
    category: 'Prevention',
  },
  {
    id: 12,
    name: 'Cybersecurity & Infrastructure Security Agency',
    description: 'Tips and resources for staying safe online, including guides for seniors.',
    url: 'https://www.cisa.gov/topics/cybersecurity-best-practices',
    category: 'Government',
  },
];

export const activeScamAlerts = [
  {
    id: 1,
    title: 'AI Voice Clone Scam Alert',
    description: 'Scammers are using AI to clone the voices of family members. They call pretending to be your loved one in an emergency. Always verify by calling the person directly.',
    date: 'March 2026',
    severity: 'critical' as const,
  },
  {
    id: 2,
    title: 'Fake Medicare Open Enrollment Calls',
    description: 'Reports of scammers calling seniors claiming Medicare enrollment is expiring. Medicare will never call you to sell plans or threaten to cancel your coverage.',
    date: 'March 2026',
    severity: 'high' as const,
  },
  {
    id: 3,
    title: 'Package Delivery Text Scam',
    description: 'Fake text messages claiming a package could not be delivered with a link to "reschedule." Do not click the link — it leads to a phishing site.',
    date: 'March 2026',
    severity: 'medium' as const,
  },
];
