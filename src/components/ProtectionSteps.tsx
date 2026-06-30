import React, { useState } from 'react';
import {
  Pause,
  Search,
  Lock,
  Flag,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Phone,
  Download,
} from 'lucide-react';
import { protectionSteps } from '@/data/scamData';

const iconMap: Record<string, React.ReactNode> = {
  pause: <Pause className="w-8 h-8" />,
  search: <Search className="w-8 h-8" />,
  lock: <Lock className="w-8 h-8" />,
  flag: <Flag className="w-8 h-8" />,
  'shield-check': <ShieldCheck className="w-8 h-8" />,
};

const ProtectionSteps: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const handleDownloadChecklist = () => {
    const checklistContent = `
SCAM AGENT — PROTECTION CHECKLIST
===================================

Print this out and keep it by your phone and computer.

IF YOU RECEIVE A SUSPICIOUS CALL OR MESSAGE:

Step 1: STOP & PAUSE
- Take a deep breath — there is no real emergency
- Tell the caller you will call them back
- Do not let anyone pressure you into acting right now
- Remember: legitimate organizations will give you time

Step 2: VERIFY THE SOURCE
- Hang up and call the organization using their official number
- Look up phone numbers on official websites
- Ask a trusted family member or friend
- Check email addresses carefully

Step 3: PROTECT YOUR INFORMATION
- Never give your Social Security number over the phone
- Do not share bank account or credit card numbers
- Keep your Medicare number private
- Do not give remote access to your computer

Step 4: REPORT THE SCAM
- FTC: 1-877-382-4357
- Local police department
- Your bank (if money was sent)
- reportfraud.ftc.gov

Step 5: SECURE YOUR ACCOUNTS
- Change passwords on compromised accounts
- Place a fraud alert on credit reports
- Monitor bank and credit card statements
- Consider a credit freeze

EMERGENCY NUMBERS:
- National Elder Fraud Hotline: 1-833-372-8311
- AARP Fraud Helpline: 1-877-908-3360
- FTC: 1-877-382-4357
- Social Security: 1-800-772-1213

Remember: It is NEVER your fault. Scammers are criminals.
You are brave for reporting it.

— Scam Agent: Protecting You & Your Family
    `.trim();

    const blob = new Blob([checklistContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Scam-Agent-Protection-Checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="protection-steps"
      className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-20"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            What to Do If You Have Been Scammed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow these 5 simple steps. It is never your fault — scammers are
            criminals. Taking action quickly can help protect you.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-12">
          {protectionSteps.map((step) => {
            const isExpanded = expandedStep === step.id;
            return (
              <div
                key={step.id}
                className={`bg-white border-2 rounded-2xl transition-all duration-300 ${
                  isExpanded
                    ? 'border-blue-400 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedStep(isExpanded ? null : step.id)
                  }
                  className="w-full flex items-center gap-5 p-6 lg:p-8 text-left focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-2xl"
                >
                  {/* Step Number */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl ${
                      isExpanded ? 'bg-blue-900' : 'bg-blue-700'
                    }`}
                  >
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 p-3 rounded-xl ${
                      isExpanded
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {iconMap[step.icon]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Expand Icon */}
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-7 h-7 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-7 h-7 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8 ml-16 lg:ml-20">
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-lg text-gray-700"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadChecklist}
            className="px-8 py-5 bg-blue-900 hover:bg-blue-800 text-white text-xl font-bold rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            Download Checklist (Print It Out)
          </button>
          <a
            href="tel:18333728311"
            className="px-8 py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-3"
          >
            <Phone className="w-6 h-6" />
            Call Elder Fraud Hotline
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProtectionSteps;
