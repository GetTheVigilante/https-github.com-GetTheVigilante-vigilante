import React, { useState } from 'react';
import {
  Flag,
  CheckCircle2,
  AlertCircle,
  Send,
  LogIn,
  Save,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface FormData {
  scamType: string;
  description: string;
  contactMethod: string;
  dateOccurred: string;
  moneyLost: string;
  name: string;
  email: string;
  zipCode: string;
}

const initialForm: FormData = {
  scamType: '',
  description: '',
  contactMethod: '',
  dateOccurred: '',
  moneyLost: '',
  name: '',
  email: '',
  zipCode: '',
};

const scamTypeOptions = [
  'Phone Call Scam',
  'Email Phishing',
  'Tech Support Fraud',
  'Romance Scam',
  'Medicare/Health Fraud',
  'Grandparent Scam',
  'Lottery/Prize Scam',
  'Online Shopping Scam',
  'Charity Scam',
  'Investment Scam',
  'Other',
];

const contactMethods = [
  'Phone Call',
  'Email',
  'Text Message',
  'Social Media',
  'In Person',
  'Website/Pop-up',
  'Mail/Letter',
];

const ReportScamForm: React.FC = () => {
  const { user, saveReport, openAuthModal } = useAuth();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedToProfile, setSavedToProfile] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedLocation, setGeocodedLocation] = useState<{ city: string; state: string } | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.scamType) newErrors.scamType = 'Please select a scam type';
    if (!form.description.trim())
      newErrors.description = 'Please describe what happened';
    if (form.description.trim().length < 20)
      newErrors.description = 'Please provide more detail (at least 20 characters)';
    if (!form.contactMethod)
      newErrors.contactMethod = 'Please select how they contacted you';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const geocodeZip = async (zip: string) => {
    if (!zip || zip.length < 5) return null;
    setIsGeocoding(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode-zip', {
        body: { zip_code: zip },
      });
      if (data && data.latitude) {
        setGeocodedLocation({ city: data.city, state: data.state });
        return data;
      }
      return null;
    } catch (err) {
      console.error('Geocode error:', err);
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleZipBlur = async () => {
    if (form.zipCode.length >= 5) {
      await geocodeZip(form.zipCode);
    } else {
      setGeocodedLocation(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Geocode the zip code if provided
      let locationData: any = {};
      if (form.zipCode) {
        const geo = await geocodeZip(form.zipCode);
        if (geo) {
          locationData = {
            zip_code: form.zipCode,
            city: geo.city || '',
            state: geo.state || '',
            latitude: geo.latitude,
            longitude: geo.longitude,
          };
        }
      }

      // Save to database if logged in
      if (user) {
        try {
          await saveReport({
            scam_type: form.scamType,
            description: form.description,
            contact_method: form.contactMethod,
            date_occurred: form.dateOccurred,
            money_lost: form.moneyLost,
            reporter_name: form.name,
            reporter_email: form.email,
            ...locationData,
          });
          setSavedToProfile(true);
        } catch (err) {
          console.error('Failed to save report:', err);
        }
      } else if (form.zipCode && locationData.latitude) {
        // Save anonymous report with location for the map
        try {
          await supabase.from('reported_scams').insert({
            scam_type: form.scamType,
            description: form.description,
            contact_method: form.contactMethod,
            date_occurred: form.dateOccurred || null,
            money_lost: form.moneyLost,
            reporter_name: form.name,
            reporter_email: form.email,
            status: 'submitted',
            ...locationData,
          });
        } catch (err) {
          console.error('Failed to save anonymous report:', err);
        }
      }
      setSubmitted(true);
    }
  };

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  if (submitted) {
    return (
      <section id="report-scam" className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 border-2 border-green-300 rounded-3xl p-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Reporting
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-4">
              Your report helps Scam Agent protect others in your community. We encourage
              you to also report this scam to the official agencies below:
            </p>

            {savedToProfile && (
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2.5 rounded-xl text-lg font-semibold mb-6">
                <Save className="w-5 h-5" />
                Saved to your profile — track it in My Reports
              </div>
            )}

            {geocodedLocation && (
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl text-lg font-semibold mb-6 ml-2">
                <MapPin className="w-5 h-5" />
                Added to the Community Scam Map
              </div>
            )}

            {!user && (
              <button
                onClick={() => openAuthModal('signup')}
                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-2.5 rounded-xl text-lg font-semibold mb-6 transition-colors border border-blue-200"
              >
                <LogIn className="w-5 h-5" />
                Create an account to track your reports
              </button>
            )}

            <div className="space-y-3 text-left max-w-md mx-auto mb-8">
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-xl border border-green-200 text-lg text-blue-700 hover:text-blue-900 font-semibold transition-colors"
              >
                FTC — reportfraud.ftc.gov
              </a>
              <a
                href="https://www.ic3.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-xl border border-green-200 text-lg text-blue-700 hover:text-blue-900 font-semibold transition-colors"
              >
                FBI IC3 — ic3.gov
              </a>
              <a
                href="tel:18333728311"
                className="block p-4 bg-white rounded-xl border border-green-200 text-lg text-green-700 hover:text-green-900 font-semibold transition-colors"
              >
                Elder Fraud Hotline — 1-833-372-8311
              </a>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setSavedToProfile(false);
                setGeocodedLocation(null);
                setForm(initialForm);
              }}
              className="px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white text-xl font-bold rounded-xl transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="report-scam" className="bg-white py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-5 py-2.5 rounded-full text-lg font-semibold mb-4">
            <Flag className="w-5 h-5" />
            Report a Scam
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Help Scam Agent Protect Your Community
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your report helps warn others about active scams. All information is
            kept confidential.
          </p>
          {user && (
            <p className="text-base text-blue-600 font-semibold mt-2">
              <Save className="w-4 h-4 inline-block mr-1" />
              Your report will be saved to your profile for tracking.
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 lg:p-10 space-y-6"
        >
          {/* Scam Type */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              What type of scam was it? <span className="text-red-500">*</span>
            </label>
            <select
              value={form.scamType}
              onChange={(e) => handleChange('scamType', e.target.value)}
              className={`w-full px-5 py-4 text-lg border-2 rounded-xl outline-none transition-all ${
                errors.scamType
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
              } focus:ring-4`}
            >
              <option value="">Select a scam type...</option>
              {scamTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.scamType && (
              <p className="flex items-center gap-1.5 text-red-600 text-base mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.scamType}
              </p>
            )}
          </div>

          {/* Contact Method */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              How did they contact you? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {contactMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleChange('contactMethod', method)}
                  className={`px-5 py-3 text-base font-semibold rounded-xl transition-all ${
                    form.contactMethod === method
                      ? 'bg-blue-900 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
            {errors.contactMethod && (
              <p className="flex items-center gap-1.5 text-red-600 text-base mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.contactMethod}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              What happened? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              placeholder="Describe what happened in your own words. Include as much detail as you can remember..."
              className={`w-full px-5 py-4 text-lg border-2 rounded-xl outline-none transition-all resize-none ${
                errors.description
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
              } focus:ring-4`}
            />
            {errors.description && (
              <p className="flex items-center gap-1.5 text-red-600 text-base mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Location / ZIP Code */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <label className="text-lg font-bold text-indigo-900">
                Your Location (ZIP Code)
              </label>
            </div>
            <p className="text-sm text-indigo-600 mb-3">
              Adding your ZIP code places this report on the Community Scam Map to warn others in your area.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.zipCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                  handleChange('zipCode', val);
                  if (val.length < 5) setGeocodedLocation(null);
                }}
                onBlur={handleZipBlur}
                placeholder="e.g., 10001"
                maxLength={5}
                className="w-40 px-5 py-3 text-lg border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              />
              {isGeocoding && (
                <div className="flex items-center gap-2 text-sm text-indigo-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Looking up...
                </div>
              )}
              {geocodedLocation && !isGeocoding && (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  {geocodedLocation.city}, {geocodedLocation.state}
                </div>
              )}
            </div>
          </div>

          {/* Date & Money Lost */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                When did it happen?
              </label>
              <input
                type="date"
                value={form.dateOccurred}
                onChange={(e) => handleChange('dateOccurred', e.target.value)}
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Money lost (if any)
              </label>
              <input
                type="text"
                value={form.moneyLost}
                onChange={(e) => handleChange('moneyLost', e.target.value)}
                placeholder="e.g., $500"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Optional Contact */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-base text-gray-500 mb-4">
              Optional: Provide your contact info if you would like follow-up
              assistance
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Optional"
                  className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Optional"
                  className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg"
          >
            <Send className="w-6 h-6" />
            Submit Report
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReportScamForm;
