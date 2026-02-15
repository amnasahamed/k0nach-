import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

const WriterLogin: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/writer-auth/login', { phone });
      localStorage.setItem('writer', JSON.stringify(response.data));
      navigate('/writer-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-blue-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-ios-lg hover-lift">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Writer Dashboard</h1>
          <p className="text-secondary-500 mt-2 text-sm">Enter your mobile number to continue</p>
        </div>

        <Card variant="elevated" className="shadow-premium">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-secondary-600 uppercase tracking-wide">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-secondary-500 font-medium text-sm">+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className={`
                    block w-full pl-14 pr-4 py-3
                    bg-secondary-50 border rounded-apple
                    text-secondary-900 placeholder-secondary-400
                    focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:border-primary-400
                    transition-all duration-200 ease-apple
                    disabled:opacity-50 disabled:bg-secondary-100 disabled:cursor-not-allowed
                    ${error ? 'ring-2 ring-danger-500/30 border-danger-300 bg-danger-50' : 'border-secondary-200'}
                  `}
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-secondary-500">We'll never share your number with anyone else.</p>
            </div>

            {error && (
              <div className="rounded-apple bg-danger-50 border border-danger-200 p-3">
                <p className="text-sm text-danger-700 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
              disabled={loading || phone.length !== 10}
            >
              {loading ? 'Signing in...' : 'Continue'}
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-secondary-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-xs text-secondary-400 mt-8">
          k0nach! Writer v1.0 &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default WriterLogin;
