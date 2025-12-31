import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, UserCheck, Trash2 } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatsCard } from '../components/StatsCard';
import { DataTable } from '../components/DataTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

interface Stats {
  totalUsers: number;
  adminCount: number;
  staffCount: number;
  learnerCount: number;
}

export function SimpleAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log('Fetching stats with token:', token ? 'Token exists' : 'No token');
        console.log('Token value:', token);

        const response = await fetch(getApiUrl('/api/admin/stats'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        } else {
          const errorData = await response.json();
          console.error('API Error:', errorData);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <DashboardLayout title="Admin Dashboard"><LoadingSkeleton /></DashboardLayout>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
          <StatsCard title="Admins" value={stats.adminCount} icon={UserCheck} color="green" />
          <StatsCard title="Staff" value={stats.staffCount} icon={UserCheck} color="orange" />
          <StatsCard title="Learners" value={stats.learnerCount} icon={TrendingUp} color="red" />
        </div>

        {/* Recent Activity Table */}
        <DataTable
          headers={['User', 'Role', 'Last Active', 'Actions']}
          data={[]}
          renderRow={() => (
            <>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Loading...</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">Loading...</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">Loading...</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </>
          )}
          emptyMessage="No recent activity"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-green-700 hover:bg-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded transition text-xs sm:text-sm"
        >
          Logout
        </button>
      </div>
    </DashboardLayout>
  );
}
