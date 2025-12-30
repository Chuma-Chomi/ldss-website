import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, UserCheck, Trash2 } from 'lucide-react';

interface Stats {
  totalUsers: number;
  adminCount: number;
  staffCount: number;
  learnerCount: number;
}

interface User {
  id: string;
  role: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export function SimpleAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'create'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newUser, setNewUser] = useState({
    id: '',
    password: '',
    role: 'STUDENT' as 'ADMIN' | 'TEACHER' | 'STUDENT',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setSuccess('User deleted successfully');
        setUsers(users.filter(u => u.id !== userId));
        fetchStats();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewUsers = () => {
    setActiveView('users');
    fetchUsers();
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      if (response.ok) {
        setSuccess('User created successfully!');
        setNewUser({
          id: '',
          password: '',
          role: 'STUDENT',
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        });
        setTimeout(() => {
          setSuccess('');
          setActiveView('users');
          fetchUsers();
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.png" alt="LDSS Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
              <div>
                <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-tight">Lukulu Day Secondary School</h1>
                <p className="text-xs sm:text-sm text-green-100">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-green-100 text-xs sm:text-sm">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-green-700 hover:bg-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded transition text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Users</p>
                <p className="text-3xl font-bold text-green-600">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Admins</p>
                <p className="text-3xl font-bold text-red-600">{stats?.adminCount || 0}</p>
              </div>
              <UserCheck className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Staff</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.staffCount || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Learners</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.learnerCount || 0}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'overview'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={handleViewUsers}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'users'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Manage Users
              </button>
              <button
                onClick={() => setActiveView('create')}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'create'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Create User
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeView === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to the LDSS Admin Portal. You have full access to manage users, view reports, and configure system settings.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleViewUsers}
                    className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-left transition shadow-lg"
                  >
                    <h3 className="font-semibold text-lg mb-2">Manage Users</h3>
                    <p className="text-sm text-green-100">View, add, edit, or remove users from the system</p>
                  </button>
                  <button className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-left transition shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">View Reports</h3>
                    <p className="text-sm text-blue-100">Access system reports and analytics</p>
                  </button>
                  <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 text-left transition shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">System Settings</h3>
                    <p className="text-sm text-purple-100">Configure system preferences and options</p>
                  </button>
                  <button className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 text-left transition shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">Announcements</h3>
                    <p className="text-sm text-orange-100">Create and manage school announcements</p>
                  </button>
                </div>
              </div>
            )}

            {activeView === 'create' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Create New User</h2>
                <form onSubmit={createUser} className="max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">User ID *</label>
                      <input
                        type="text"
                        value={newUser.id}
                        onChange={(e) => setNewUser({...newUser, id: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 202501 or 2025001 or 202500123456"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Admin: 202501, Staff: 2025001xxx, Learner: 202500xxxxxxxxxx</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher (Staff)</option>
                        <option value="STUDENT">Student (Learner)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="+260 XXX XXX XXX"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('overview')}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeView === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">User Management</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{u.id}</td>
                            <td className="px-4 py-3 text-sm">
                              {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                u.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <p className="text-center py-8 text-gray-500">No users found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
