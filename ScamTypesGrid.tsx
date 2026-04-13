import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Monitor,
  Heart,
  Shield,
  Users,
  Gift,
  ShoppingBag,
  HeartHandshake,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { scamTypes, ScamType } from '@/data/scamData';

const iconMap: Record<string, React.ReactNode> = {
  phone: <Phone className="w-7 h-7" />,
  mail: <Mail className="w-7 h-7" />,
  monitor: <Monitor className="w-7 h-7" />,
  heart: <Heart className="w-7 h-7" />,
  shield: <Shield className="w-7 h-7" />,
  users: <Users className="w-7 h-7" />,
  gift: <Gift className="w-7 h-7" />,
  'shopping-bag': <ShoppingBag className="w-7 h-7" />,
  'hand-heart': <HeartHandshake className="w-7 h-7" />,
  'trending-up': <TrendingUp className="w-7 h-7" />,
};


const severityLabel: Record<string, { text: string; color: string }> = {
  critical: { text: 'Very Common', color: 'bg-red-100 text-red-700' },
  high: { text: 'Common', color: 'bg-orange-100 text-orange-700' },
  medium: { text: 'Watch Out', color: 'bg-yellow-100 text-yellow-700' },
};

const ScamTypesGrid: React.FC = () => {
  const [selectedScam, setSelectedScam] = useState<ScamType | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredScams =
    filter === 'all'
      ? scamTypes
      : scamTypes.filter((s) => s.severity === filter);

  return (
    <section id="scam-types" className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Know the Most Common Scams
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Understanding how scams work is your first line of defense. Click on
            any scam type below to learn more about how to recognize and avoid
            it.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { value: 'all', label: 'All Scams' },
            { value: 'critical', label: 'Very Common' },
            { value: 'high', label: 'Common' },
            { value: 'medium', label: 'Watch Out' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-6 py-3 text-lg font-semibold rounded-xl transition-all ${
                filter === f.value
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
              <span className="ml-2 text-base opacity-75">
                (
                {f.value === 'all'
                  ? scamTypes.length
                  : scamTypes.filter((s) => s.severity === f.value).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredScams.map((scam) => {
            const sev = severityLabel[scam.severity];
            return (
              <button
                key={scam.id}
                onClick={() => setSelectedScam(scam)}
                className="text-left bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-50 group-hover:bg-blue-100 p-3 rounded-xl text-blue-900 transition-colors">
                    {iconMap[scam.icon]}
                  </div>
                  <span
                    className={`${sev.color} px-3 py-1 rounded-full text-sm font-bold`}
                  >
                    {sev.text}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                  {scam.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
                  {scam.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-blue-700 font-semibold text-base">
                  <span>Learn More</span>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Modal */}
        {selectedScam && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedScam(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedScam.image}
                  alt={selectedScam.title}
                  className="w-full h-48 object-cover rounded-t-3xl"
                />
                <button
                  onClick={() => setSelectedScam(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-900">
                    {iconMap[selectedScam.icon]}
                  </div>
                  <span
                    className={`${severityLabel[selectedScam.severity].color} px-3 py-1 rounded-full text-sm font-bold`}
                  >
                    {severityLabel[selectedScam.severity].text}
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedScam.title}
                </h3>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {selectedScam.description}
                </p>

                {/* Warning Sign */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h4 className="text-xl font-bold text-red-900">
                      Warning Sign
                    </h4>
                  </div>
                  <p className="text-lg text-red-800">
                    {selectedScam.warningSign}
                  </p>
                </div>

                {/* Prevention */}
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h4 className="text-xl font-bold text-green-900">
                      How to Protect Yourself
                    </h4>
                  </div>
                  <p className="text-lg text-green-800">
                    {selectedScam.prevention}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedScam(null)}
                  className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white text-xl font-bold rounded-xl transition-colors"
                >
                  Got It — I Will Stay Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScamTypesGrid;
