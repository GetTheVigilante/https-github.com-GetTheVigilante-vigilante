import React, { useState } from 'react';
import {
  ExternalLink,
  Phone,
  Search,
  Building2,
  Heart,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { resources } from '@/data/scamData';

const categoryIcons: Record<string, React.ReactNode> = {
  Government: <Building2 className="w-5 h-5" />,
  Nonprofit: <Heart className="w-5 h-5" />,
  Prevention: <ShieldCheck className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  Government: 'bg-blue-100 text-blue-800',
  Nonprofit: 'bg-purple-100 text-purple-800',
  Prevention: 'bg-green-100 text-green-800',
};

const ResourceLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(resources.map((r) => r.category))];

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="resources" className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Helpful Resources & Hotlines
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Trusted organizations that can help you report scams, recover from
            fraud, and protect yourself going forward.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-3 text-lg font-semibold rounded-xl transition-all capitalize ${
                  categoryFilter === cat
                    ? 'bg-blue-900 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-600 text-white rounded-2xl p-6 lg:p-8 mb-10 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <Phone className="w-12 h-12" />
          </div>
          <div className="text-center lg:text-left flex-1">
            <h3 className="text-2xl font-bold mb-2">
              Need Help Right Now?
            </h3>
            <p className="text-lg text-red-100">
              If you think you have been scammed, call the National Elder Fraud
              Hotline. Free, confidential support from trained case managers.
            </p>
          </div>
          <a
            href="tel:18333728311"
            className="flex-shrink-0 px-8 py-4 bg-white text-red-600 text-xl font-bold rounded-xl hover:bg-red-50 transition-colors"
          >
            1-833-372-8311
          </a>
        </div>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <Globe className="w-6 h-6 text-blue-900" />
                </div>
                <span
                  className={`${categoryColors[resource.category]} px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5`}
                >
                  {categoryIcons[resource.category]}
                  {resource.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                {resource.name}
              </h3>
              <p className="text-base text-gray-600 leading-relaxed mb-5">
                {resource.description}
              </p>

              <div className="space-y-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-base transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Visit Website
                </a>
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold text-base transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {resource.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              No resources found matching your search. Try a different term.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourceLibrary;
