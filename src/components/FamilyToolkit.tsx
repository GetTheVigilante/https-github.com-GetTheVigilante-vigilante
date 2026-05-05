import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Settings,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Mail,
  PhoneCall,
  Gamepad2,
  Shield,
  Baby,
  UserCheck,
} from 'lucide-react';

const toolkitItems = [
  {
    icon: <MessageSquare className="w-7 h-7" />,
    title: 'Start the Conversation',
    description:
      'Talk to your loved ones about online safety — whether they are 8 or 80. Use real examples and ask open-ended questions.',
    tips: [
      'Share a news story about a scam or online predator and ask what they think',
      'Say "I almost fell for this" to make it relatable for adults',
      'For kids: "Has anyone online ever asked you something that felt weird?"',
      'Make it a regular topic, not a one-time lecture',
    ],
  },
  {
    icon: <Settings className="w-7 h-7" />,
    title: 'Set Up Device Protections',
    description:
      'Help configure devices and accounts with security measures for every family member.',
    tips: [
      'Enable call blocking on seniors\' phones',
      'Set up two-factor authentication on all email accounts',
      'Enable parental controls on children\'s gaming devices and apps',
      'Register phone numbers on the Do Not Call list',
      'Review privacy settings on children\'s social media accounts',
    ],
  },
  {
    icon: <Mail className="w-7 h-7" />,
    title: 'Activate Email Vigilante',
    description:
      'Connect email accounts to The Vigilante so suspicious emails are flagged automatically for seniors and teens.',
    tips: [
      'Open The Vigilante and scroll to the Email Vigilante section',
      'Help them connect their Gmail, Outlook, Yahoo, or AOL account',
      'Show them what a scam alert looks like in their inbox',
      'Enable auto-scanning so new emails are checked automatically',
    ],
  },
  {
    icon: <PhoneCall className="w-7 h-7" />,
    title: 'Enable Call Vigilante',
    description:
      'Turn on real-time call monitoring so The Vigilante alerts family members during suspicious phone calls.',
    tips: [
      'Open The Vigilante and scroll to the Call Vigilante section',
      'Help them enable call protection with one click',
      'Run the demo simulation together so they see how alerts work',
      'Explain that the app will flash a warning if scam language is detected',
    ],
  },
  {
    icon: <Gamepad2 className="w-7 h-7" />,
    title: 'Activate Child Shield',
    description:
      'Set up predator protection for your children\'s gaming apps, social media, and messaging platforms.',
    tips: [
      'Add each child\'s profile in the Child Shield dashboard',
      'Select all platforms they use (Roblox, Discord, Instagram, TikTok, etc.)',
      'Review the conversation scanner — paste any suspicious chats for AI analysis',
      'Set up alerts so you\'re notified immediately when predatory behavior is detected',
      'Talk to your kids about what grooming looks like and why they should tell you',
    ],
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: 'Create a Family Safety Plan',
    description:
      'Establish a simple system so everyone knows exactly what to do if something feels wrong.',
    tips: [
      'Agree on a family code word for emergencies',
      'Post emergency numbers by the phone and computer',
      'For seniors: "Call me first" agreement before any financial decisions',
      'For kids: "Tell a parent immediately" if anyone online makes them uncomfortable',
      'Schedule regular check-ins to discuss any suspicious contacts or messages',
    ],
  },
];

const FamilyToolkit: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  return (
    <section className="bg-violet-50 py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-5 py-2.5 rounded-full text-lg font-semibold mb-4">
            <Users className="w-5 h-5" />
            Family Protection Toolkit
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Protect Your Entire Family
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A complete toolkit for setting up The Vigilante to protect every family member — 
            from grandparents vulnerable to scams, to children at risk from online predators.
          </p>
          
          {/* Family Member Tags */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-base font-semibold">
              <UserCheck className="w-4 h-4" />
              Seniors
            </div>
            <div className="flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-2 rounded-full text-base font-semibold">
              <Users className="w-4 h-4" />
              Adults
            </div>
            <div className="flex items-center gap-2 bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-base font-semibold">
              <Baby className="w-4 h-4" />
              Teens
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-semibold">
              <Gamepad2 className="w-4 h-4" />
              Kids
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {toolkitItems.map((item, idx) => {
            const isExpanded = expandedItem === idx;
            return (
              <div
                key={idx}
                className={`bg-white border-2 rounded-2xl transition-all duration-300 ${
                  isExpanded
                    ? 'border-violet-400 shadow-lg'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : idx)}
                  className="w-full flex items-center gap-5 p-6 lg:p-8 text-left focus:outline-none focus:ring-4 focus:ring-violet-300 rounded-2xl"
                >
                  <div
                    className={`flex-shrink-0 p-3 rounded-xl ${
                      isExpanded
                        ? 'bg-violet-900 text-white'
                        : 'bg-violet-100 text-violet-900'
                    } transition-colors`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-lg text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8 ml-16 lg:ml-20">
                    <ul className="space-y-3">
                      {item.tips.map((tip, tipIdx) => (
                        <li
                          key={tipIdx}
                          className="flex items-start gap-3 text-lg text-gray-700"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FamilyToolkit;
