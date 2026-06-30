import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Map,
  MapPin,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
  Globe,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ScamMapSidebar, { ScamReport, getScamColor } from '@/components/ScamMapSidebar';

declare global {
  interface Window {
    L: any;
  }
}

// Pin color hex values matching Tailwind classes
const scamPinColors: Record<string, string> = {
  'Phone Call Scam': '#ef4444',
  'Email Phishing': '#3b82f6',
  'Tech Support Fraud': '#a855f7',
  'Romance Scam': '#ec4899',
  'Medicare/Health Fraud': '#14b8a6',
  'Grandparent Scam': '#f97316',
  'Lottery/Prize Scam': '#f59e0b',
  'Online Shopping Scam': '#06b6d4',
  'Investment Scam': '#10b981',
  'Charity Scam': '#84cc16',
  'Other': '#6b7280',
};

const createCustomIcon = (scamType: string) => {
  const L = window.L;
  if (!L) return null;
  const color = scamPinColors[scamType] || scamPinColors['Other'];
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="14" cy="14" r="6" fill="#fff" opacity="0.9"/>
      <circle cx="14" cy="14" r="3" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-map-pin',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
};

const CommunityScamMap: React.FC = () => {
  const { user, profile, updateProfile, openAuthModal } = useAuth();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [reports, setReports] = useState<ScamReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ScamReport[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ city: string; state: string; zip_code: string } | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Fetch reports from Supabase
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reported_scams')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      if (data) {
        setReports(data as ScamReport[]);
      }
    } catch (err) {
      console.error('Error fetching scam reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Set user location from profile
  useEffect(() => {
    if (profile?.city && profile?.state && profile?.zip_code) {
      setUserLocation({
        city: profile.city,
        state: profile.state,
        zip_code: profile.zip_code,
      });
    }
  }, [profile]);

  // Filter reports
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(r => activeFilters.includes(r.scam_type)));
    }
  }, [reports, activeFilters]);

  // Initialize Leaflet map
  useEffect(() => {
    const L = window.L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [39.8283, -98.5795],
      zoom: 4,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Create markers layer group
    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    setMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Update markers when filtered reports change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapReady || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredReports.forEach(report => {
      if (!report.latitude || !report.longitude) return;

      const icon = createCustomIcon(report.scam_type);
      if (!icon) return;

      const marker = L.marker([report.latitude, report.longitude], { icon });

      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, sans-serif;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${scamPinColors[report.scam_type] || '#6b7280'};"></div>
            <strong style="font-size: 13px; color: #1f2937;">${report.scam_type}</strong>
          </div>
          <p style="font-size: 12px; color: #4b5563; margin: 0 0 6px 0; line-height: 1.4;">${report.description.substring(0, 120)}${report.description.length > 120 ? '...' : ''}</p>
          <div style="display: flex; gap: 8px; font-size: 11px; color: #9ca3af;">
            <span>${report.city}, ${report.state}</span>
            <span>${report.contact_method}</span>
          </div>
          ${report.money_lost ? `<div style="margin-top: 4px; font-size: 11px; color: #ef4444; font-weight: 600;">Lost: ${report.money_lost}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'scam-map-popup',
      });

      marker.on('click', () => {
        setSelectedReport(report);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [filteredReports, mapReady]);

  // Invalidate map size when sidebar toggles or expand changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [sidebarOpen, isExpanded]);

  const handleToggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleSearchZip = async (zip: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('geocode-zip', {
        body: { zip_code: zip },
      });
      if (data && data.latitude && data.longitude && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([data.latitude, data.longitude], 10, {
          duration: 1.5,
        });
      }
    } catch (err) {
      console.error('Geocode error:', err);
    }
  };

  const handleFlyToReport = (report: ScamReport) => {
    if (mapInstanceRef.current && report.latitude && report.longitude) {
      mapInstanceRef.current.flyTo([report.latitude, report.longitude], 12, {
        duration: 1.5,
      });
      setSelectedReport(report);
    }
  };

  const handleSetMyLocation = async (zip: string) => {
    if (!zip) {
      setUserLocation(null);
      return;
    }
    setIsSettingLocation(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode-zip', {
        body: { zip_code: zip },
      });
      if (data && data.latitude && data.longitude) {
        const locationData = {
          city: data.city || '',
          state: data.state || '',
          zip_code: zip,
          latitude: data.latitude,
          longitude: data.longitude,
        };
        setUserLocation({ city: data.city, state: data.state, zip_code: zip });

        // Save to profile if logged in
        if (user) {
          await updateProfile(locationData as any);
        }

        // Fly to location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([data.latitude, data.longitude], 10, {
            duration: 1.5,
          });
        }
      }
    } catch (err) {
      console.error('Error setting location:', err);
    } finally {
      setIsSettingLocation(false);
    }
  };

  return (
    <section id="scam-map" className="bg-gray-100 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full text-lg font-semibold mb-4">
            <Globe className="w-5 h-5" />
            Community Scam Map
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See Scams Reported in Your Area
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Our interactive map shows scam incidents reported by the community. Filter by type,
            search your ZIP code, and stay informed about threats near you.
          </p>
        </div>

        {/* Map Container */}
        <div
          className={`bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'fixed inset-4 z-[90] rounded-2xl' : 'relative'
          }`}
          style={{ height: isExpanded ? 'auto' : '700px' }}
        >
          {/* Map Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="hidden sm:inline">{sidebarOpen ? 'Hide' : 'Show'} Panel</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>
                  <strong className="text-gray-900">{filteredReports.length}</strong> reports shown
                  {activeFilters.length > 0 && (
                    <span className="text-indigo-600 ml-1">({activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} active)</span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchReports}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isExpanded ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4 text-gray-500" /> : <Maximize2 className="w-4 h-4 text-gray-500" />}
              </button>
              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Map + Sidebar Layout */}
          <div className="flex h-[calc(100%-48px)]" style={{ height: isExpanded ? 'calc(100% - 48px)' : '652px' }}>
            {/* Sidebar */}
            <div
              className={`border-r border-gray-200 transition-all duration-300 flex-shrink-0 overflow-hidden ${
                sidebarOpen ? 'w-80 lg:w-96' : 'w-0'
              }`}
            >
              {sidebarOpen && (
                <ScamMapSidebar
                  reports={reports}
                  activeFilters={activeFilters}
                  onToggleFilter={handleToggleFilter}
                  onClearFilters={handleClearFilters}
                  onSearchZip={handleSearchZip}
                  onFlyToReport={handleFlyToReport}
                  selectedReport={selectedReport}
                  onCloseSelected={() => setSelectedReport(null)}
                  userLocation={userLocation}
                  isSettingLocation={isSettingLocation}
                  onSetMyLocation={handleSetMyLocation}
                />
              )}
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <span className="text-lg font-semibold text-gray-700">Loading scam reports...</span>
                  </div>
                </div>
              )}
              <div
                ref={mapRef}
                className="w-full h-full"
                style={{ minHeight: '400px' }}
              />

              {/* Map Overlay - Active Filters */}
              {activeFilters.length > 0 && (
                <div className="absolute top-3 left-3 z-[5] flex flex-wrap gap-1.5 max-w-[calc(100%-80px)]">
                  {activeFilters.map(filter => {
                    const colors = getScamColor(filter);
                    return (
                      <button
                        key={filter}
                        onClick={() => handleToggleFilter(filter)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold shadow-md ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}
                      >
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        {filter}
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    );
                  })}
                  <button
                    onClick={handleClearFilters}
                    className="px-2 py-1 bg-white rounded-lg text-[11px] font-bold text-gray-600 shadow-md hover:bg-gray-50"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-red-300 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-2.5 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Report a Scam</h3>
            </div>
            <p className="text-base text-gray-600 mb-4">
              Help protect your community by reporting scams you encounter. Your report will appear on the map.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('report-scam');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-base font-bold rounded-xl transition-colors"
            >
              Report Now
            </button>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Set Your Location</h3>
            </div>
            <p className="text-base text-gray-600 mb-4">
              Set your location to receive alerts about scams trending in your area and personalized safety tips.
            </p>
            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('login');
                } else {
                  setSidebarOpen(true);
                  const el = document.getElementById('scam-map');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl transition-colors"
            >
              {user ? 'Set Location' : 'Sign In to Set Location'}
            </button>

          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-green-300 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2.5 rounded-xl">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">How It Works</h3>
            </div>
            <p className="text-base text-gray-600 mb-4">
              Community members report scams with their location. We plot them on the map so everyone can stay informed.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Updated in real-time
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for map pins */}
      <style>{`
        .custom-map-pin {
          background: transparent !important;
          border: none !important;
        }
        .scam-map-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .scam-map-popup .leaflet-popup-tip {
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom {
          border-radius: 10px !important;
          overflow: hidden;
          border: 2px solid rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </section>
  );
};

export default CommunityScamMap;
