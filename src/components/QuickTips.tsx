import React from 'react';
import {
  PhoneOff,
  Unlink,
  CreditCard,
  Clock,
  Users,
  ShieldAlert,
} from 'lucide-react';


const tips = [
  {
    icon: <PhoneOff className="w-8 h-8" />,
    title: 'Hang Up on Pressure',
    description:
      'If anyone demands immediate action or threatens you over the phone, hang up. Real organizations do not do this.',
    color: 'bg-red-50 border-red-200 text-red-700',
    iconBg: 'bg-red-100',
  },
  {
    icon: <Unlink className="w-8 h-8" />,

    title: 'Never Click Unknown Links',
    description:
      'Do not click links in emails or texts from people you do not know. Go directly to the website instead.',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconBg: 'bg-orange-100',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Gift Cards Are Not Payment',
    description:
      'No real business or government agency will ever ask you to pay with gift cards. This is always a scam.',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    iconBg: 'bg-yellow-100',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Take Your Time',
    description:
      'Scammers create urgency. A real opportunity will still be there tomorrow. Sleep on it before deciding.',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconBg: 'bg-blue-100',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Ask Someone You Trust',
    description:
      'Before making any financial decision based on a call or email, talk to a family member, friend, or advisor.',
    color: 'bg-green-50 border-green-200 text-green-700',
    iconBg: 'bg-green-100',
  },
  {
    icon: <ShieldAlert className="w-8 h-8" />,
    title: 'If It Sounds Too Good...',
    description:
      'Free prizes, guaranteed returns, and miracle cures are almost always scams. Trust your instincts.',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconBg: 'bg-purple-100',
  },
];

const QuickTips: React.FC = () => {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            6 Golden Rules to Remember
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Keep these simple rules in mind every day. Print them out and put
            them next to your phone and computer.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className={`${tip.color} border-2 rounded-2xl p-6 lg:p-8 transition-all hover:shadow-lg`}
            >
              <div className={`${tip.iconBg} p-3 rounded-xl inline-block mb-4`}>
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {tip.title}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickTips;
