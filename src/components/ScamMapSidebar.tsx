import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Filter,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Users,
  DollarSign,
  X,
  Navigation,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface ScamReport {
  id: string;
  scam_type: string;
  description: string;
  contact_method: string;
  zip_code: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  date_occurred: string;
  money_lost: string;
  created_at: string;
  status: string;
}

interface ScamMapSidebarProps {
  reports: ScamReport[];
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearFilters: () => void;
  onSearchZip: (zip: string) => void;
  onFlyToReport: (report: ScamReport) => void;
  selectedReport: ScamReport | null;
  onCloseSelected: () => void;
  userLocation: { city: string; state: string; zip_code: string } | null;
  isSettingLocation: boolean;
  onSetMyLocation: (zip: string) => void;
}

const scamTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
  'Phone Call Scam': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  'Email Phishing': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Tech Support Fraud': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Romance Scam': { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  'Medicare/Health Fraud': { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' },
  'Grandparent Scam': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Lottery/Prize Scam': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Online Shopping Scam': { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  'Investment Scam': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Charity Scam': { bg: 'bg-lime-100', text: 'text-lime-700', dot: 'bg-lime-500' },
  'Other': { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
};

const contactMethodIcons: Record<string, React.ReactNode> = {
  'Phone Call': <Phone className="w-3.5 h-3.5" />,
  'Email': <Mail className="w-3.5 h-3.5" />,
  'Text Message': <MessageSquare className="w-3.5 h-3.5" />,
  'Social Media': <Users className="w-3.5 h-3.5" />,
  'Website/Pop-up': <Globe className="w-3.5 h-3.5" />,
};

export const getScamColor = (type: string) => scamTypeColors[type] || scamTypeColors['Other'];

const ScamMapSidebar: React.FC<ScamMapSidebarProps> = ({
  reports,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  onSearchZip,
  onFlyToReport,
  selectedReport,
  onCloseSelected,
  userLocation,
  isSettingLocation,
  onSetMyLocation,
}) => {
  const { user, openAuthModal } = useAuth();
  const [searchZip, setSearchZip] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showTrending, setShowTrending] = useState(true);
  const [locationZip, setLocationZip] = useState('');

  const allScamTypes = Object.keys(scamTypeColors).filter(t => t !== 'Other');

  // Compute trending scam types
  const trendingTypes = allScamTypes
    .map(type => ({
      type,
      count: reports.filter(r => r.scam_type === type).length,
    }))
    .filter(t => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Recent reports (last 10)
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const totalMoneyLost = reports.reduce((sum, r) => {
    const match = r.money_lost?.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(/,/g, '')) : 0);
  }, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchZip.trim()) {
      onSearchZip(searchZip.trim());
    }
  };

  const handleSetLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationZip.trim()) {
      onSetMyLocation(locationZip.trim());
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-5 py-4 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{reports.length}</div>
            <div className="text-xs text-blue-200 font-medium">Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{trendingTypes.length}</div>
            <div className="text-xs text-blue-200 font-medium">Scam Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              ${totalMoneyLost > 1000 ? `${(totalMoneyLost / 1000).toFixed(0)}K` : totalMoneyLost}
            </div>
            <div className="text-xs text-blue-200 font-medium">Money Lost</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchZip}
            onChange={(e) => setSearchZip(e.target.value)}
            placeholder="Search by ZIP code..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </form>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Selected Report Detail */}
        {selectedReport && (
          <div className="bg-white border-2 border-blue-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${getScamColor(selectedReport.scam_type).bg} ${getScamColor(selectedReport.scam_type).text}`}>
                <div className={`w-2 h-2 rounded-full ${getScamColor(selectedReport.scam_type).dot}`} />
                {selectedReport.scam_type}
              </span>
              <button onClick={onCloseSelected} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-2 line-clamp-3">{selectedReport.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedReport.city}, {selectedReport.state}
              </span>
              <span className="flex items-center gap-1">
                {contactMethodIcons[selectedReport.contact_method] || <Globe className="w-3 h-3" />}
                {selectedReport.contact_method}
              </span>
            </div>
            {selectedReport.money_lost && (
              <div className="mt-2 inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                <DollarSign className="w-3 h-3" />
                Lost: {selectedReport.money_lost}
              </div>
            )}
          </div>
        )}

        {/* User Location */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-900">My Location</span>
          </div>
          {userLocation ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-green-800">
                  {userLocation.city}, {userLocation.state}
                </div>
                <div className="text-xs text-green-600">ZIP: {userLocation.zip_code}</div>
              </div>
              <button
                onClick={() => onSetMyLocation('')}
                className="text-xs text-green-600 hover:text-green-800 underline"
              >
                Change
              </button>
            </div>
          ) : (
            <div>
              {user ? (
                <form onSubmit={handleSetLocation} className="flex gap-2">
                  <input
                    type="text"
                    value={locationZip}
                    onChange={(e) => setLocationZip(e.target.value)}
                    placeholder="Enter ZIP code"
                    maxLength={5}
                    className="flex-1 px-3 py-2 text-sm border border-green-300 rounded-lg focus:border-green-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSettingLocation}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set'}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-sm text-green-700 hover:text-green-900 underline font-semibold"
                >
                  Sign in to set your location for area alerts
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-bold text-gray-900">Filter by Scam Type</span>
              {activeFilters.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {activeFilters.length}
                </span>
              )}
            </div>
            {showFilters ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showFilters && (
            <div className="p-3 space-y-1.5">
              {activeFilters.length > 0 && (
                <button
                  onClick={onClearFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold mb-1"
                >
                  Clear all filters
                </button>
              )}
              {allScamTypes.map(type => {
                const colors = getScamColor(type);
                const count = reports.filter(r => r.scam_type === type).length;
                const isActive = activeFilters.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => onToggleFilter(type)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? `${colors.bg} ${colors.text} ring-2 ring-offset-1 ring-current`
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                      <span>{type}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-white/60' : 'bg-gray-200'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Trending Scam Types */}
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTrending(!showTrending)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-gray-900">Trending Scams</span>
            </div>
            {showTrending ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showTrending && (
            <div className="p-3 space-y-2">
              {trendingTypes.map((item, idx) => {
                const colors = getScamColor(item.type);
                const maxCount = trendingTypes[0]?.count || 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className="text-xs font-semibold text-gray-700">{item.type}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">{item.count}</span>
                    </div>
                    <div className="ml-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.dot} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-bold text-gray-900">Recent Reports</span>
          </div>
          <div className="space-y-2">
            {recentReports.map(report => {
              const colors = getScamColor(report.scam_type);
              return (
                <button
                  key={report.id}
                  onClick={() => onFlyToReport(report)}
                  className="w-full text-left bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-xs font-bold ${colors.text}`}>{report.scam_type}</span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatDate(report.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{report.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {report.city}, {report.state}
                        </span>
                        {report.money_lost && (
                          <span className="text-red-500 font-semibold">{report.money_lost}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-bold text-gray-700">Map Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {allScamTypes.slice(0, 10).map(type => {
              const colors = getScamColor(type);
              return (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} flex-shrink-0`} />
                  <span className="text-[10px] text-gray-600 truncate">{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScamMapSidebar;
