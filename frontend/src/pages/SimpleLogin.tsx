import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function SimpleLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      
      // Navigate based on identifier pattern
      if (identifier === '202501') {
        navigate('/admin-portal');
      } else if (identifier.startsWith('2025001')) {
        navigate('/staff-portal');
      } else {
        navigate('/learner-portal');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.png" alt="LDSS Logo" className="h-12 sm:h-16 w-auto" />
            <div className="text-left">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 leading-tight">Lukulu Day</h1>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 leading-tight">Secondary School</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
              TS Number / Learner ID
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your ID"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div><strong>Admin:</strong> 202501 / LDSSadmin123</div>
            <div><strong>Staff:</strong> 2025001 / LDSSstaff123</div>
            <div><strong>Learner:</strong> 202500123456 / LDSS2025</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
