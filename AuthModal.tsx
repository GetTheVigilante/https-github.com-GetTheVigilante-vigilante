import React, { useState } from 'react';
import {
  X,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalView, closeAuthModal, signIn, signUp, openAuthModal } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isAuthModalOpen) return null;

  const isLogin = authModalView === 'login';

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const switchView = (view: 'login' | 'signup') => {
    resetForm();
    openAuthModal(view);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Please enter a password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (!isLogin) {
      if (!displayName.trim()) {
        setError('Please enter your name so we can personalize your experience.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await signIn(email, password);
        if (result.error) {
          if (result.error.includes('Invalid login')) {
            setError('Incorrect email or password. Please try again.');
          } else {
            setError(result.error);
          }
        }
      } else {
        const result = await signUp(email, password, displayName.trim());
        if (result.error) {
          if (result.error.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(result.error);
          }
        } else {
          setSuccess('Account created successfully! You are now signed in.');
          setTimeout(() => handleClose(), 1500);
        }
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-7 h-7 text-gray-500" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 pt-10 pb-8 rounded-t-3xl text-center">
          <div className="bg-white/10 p-4 rounded-2xl inline-block mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-lg text-blue-200">
            {isLogin
              ? 'Sign in to access your protection dashboard'
               : 'Join The Vigilante to save your settings and track your family protection'}

          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-lg text-red-700">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-lg text-green-700">{success}</p>
            </div>
          )}

          {/* Display Name (signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); setError(''); }}
                  placeholder="Enter your first name"
                  className="w-full pl-14 pr-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  autoComplete="name"
                />
              </div>
              <p className="text-sm text-gray-400 mt-1.5">
                This helps us personalize your experience
              </p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="your.email@example.com"
                className="w-full pl-14 pr-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder={isLogin ? 'Enter your password' : 'Create a password (6+ characters)'}
                className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-6 h-6 text-gray-400" />
                ) : (
                  <Eye className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Type your password again"
                  className="w-full pl-14 pr-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 text-xl font-bold rounded-2xl transition-all flex items-center justify-center gap-3 ${
              isSubmitting
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-900 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create My Account'}
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Switch View */}
          <div className="text-center pt-2">
            <p className="text-lg text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              type="button"
              onClick={() => switchView(isLogin ? 'signup' : 'login')}
              className="text-lg font-bold text-blue-700 hover:text-blue-900 transition-colors mt-1"
            >
              {isLogin ? 'Create a Free Account' : 'Sign In Instead'}
            </button>
          </div>

          {/* Privacy Note */}
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500">
              <Shield className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Your information is encrypted and secure. We never share your data.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
