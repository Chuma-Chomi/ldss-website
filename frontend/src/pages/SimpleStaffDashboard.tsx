import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Calendar } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  grade: string;
  section?: string;
  enrollments: Array<{
    student: {
      id: string;
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
}

export function SimpleStaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'classes' | 'attendance'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});

  useEffect(() => {
    if (activeView === 'classes' || activeView === 'attendance') {
      fetchClasses();
    }
  }, [activeView]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/staff/classes/my-classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedClass(data.data[0]);
          initializeAttendance(data.data[0]);
        }
      } else {
        setError('Failed to fetch classes');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const initializeAttendance = (classData: Class) => {
    const records: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    classData.enrollments.forEach(enrollment => {
      records[enrollment.student.id] = 'PRESENT';
    });
    setAttendanceRecords(records);
  };

  const handleClassChange = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    if (cls) {
      setSelectedClass(cls);
      initializeAttendance(cls);
    }
  };

  const handleAttendanceChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = sessionStorage.getItem('token');
      const attendanceData = Object.entries(attendanceRecords).map(([studentId, status]) => ({
        studentId,
        status,
        remarks: ''
      }));

      const response = await fetch('/api/staff/attendance/mark', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          classId: selectedClass.id,
          date: attendanceDate,
          attendanceRecords: attendanceData
        })
      });
      
      if (response.ok) {
        setSuccess('Attendance marked successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to mark attendance');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.png" alt="LDSS Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
              <div>
                <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-tight">Lukulu Day Secondary School</h1>
                <p className="text-xs sm:text-sm text-blue-100">Staff Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-blue-100 text-xs sm:text-sm">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded transition text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">My Classes</p>
                <p className="text-3xl font-bold text-blue-600">{classes.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Students</p>
                <p className="text-3xl font-bold text-green-600">
                  {classes.reduce((sum, c) => sum + c.enrollments.length, 0)}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Today's Date</p>
                <p className="text-xl font-bold text-orange-600">{new Date().toLocaleDateString()}</p>
              </div>
              <Calendar className="w-12 h-12 text-orange-500 opacity-20" />
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
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('classes')}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'classes'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                My Classes
              </button>
              <button
                onClick={() => setActiveView('attendance')}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'attendance'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Mark Attendance
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeView === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Staff Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to the LDSS Staff Portal. Manage your classes, track attendance, and submit grades.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveView('classes')}
                    className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-left transition shadow-lg"
                  >
                    <h3 className="font-semibold text-lg mb-2">My Classes</h3>
                    <p className="text-sm text-blue-100">View and manage your assigned classes</p>
                  </button>
                  <button
                    onClick={() => setActiveView('attendance')}
                    className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-left transition shadow-lg"
                  >
                    <h3 className="font-semibold text-lg mb-2">Mark Attendance</h3>
                    <p className="text-sm text-green-100">Record student attendance for today</p>
                  </button>
                  <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 text-left transition shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">Submit Grades</h3>
                    <p className="text-sm text-purple-100">Enter and submit student grades</p>
                  </button>
                  <button className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 text-left transition shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">View Timetable</h3>
                    <p className="text-sm text-orange-100">Check your teaching schedule</p>
                  </button>
                </div>
              </div>
            )}

            {activeView === 'classes' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Classes</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading classes...</p>
                  </div>
                ) : classes.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No classes assigned</p>
                ) : (
                  <div className="grid gap-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-blue-800">{cls.name}</h3>
                            <p className="text-gray-600">Grade {cls.grade} {cls.section && `- Section ${cls.section}`}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {cls.enrollments.length} Students
                          </span>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Students:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {cls.enrollments.map((enrollment) => (
                              <div key={enrollment.student.id} className="text-sm text-gray-700">
                                • {enrollment.student.profile.firstName} {enrollment.student.profile.lastName}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeView === 'attendance' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 flex gap-4 items-center">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Class</label>
                        <select
                          value={selectedClass?.id || ''}
                          onChange={(e) => handleClassChange(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name} - Grade {cls.grade}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {selectedClass && (
                      <div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h3 className="font-semibold mb-2">{selectedClass.name}</h3>
                          <p className="text-sm text-gray-600">{selectedClass.enrollments.length} students</p>
                        </div>

                        <div className="space-y-3">
                          {selectedClass.enrollments.map((enrollment) => (
                            <div key={enrollment.student.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                              <span className="font-medium">
                                {enrollment.student.profile.firstName} {enrollment.student.profile.lastName}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAttendanceChange(enrollment.student.id, 'PRESENT')}
                                  className={`px-4 py-2 rounded ${
                                    attendanceRecords[enrollment.student.id] === 'PRESENT'
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  Present
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(enrollment.student.id, 'ABSENT')}
                                  className={`px-4 py-2 rounded ${
                                    attendanceRecords[enrollment.student.id] === 'ABSENT'
                                      ? 'bg-red-600 text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  Absent
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(enrollment.student.id, 'LATE')}
                                  className={`px-4 py-2 rounded ${
                                    attendanceRecords[enrollment.student.id] === 'LATE'
                                      ? 'bg-orange-600 text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}
                                >
                                  Late
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={submitAttendance}
                          disabled={loading}
                          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {loading ? 'Submitting...' : 'Submit Attendance'}
                        </button>
                      </div>
                    )}

                    {classes.length === 0 && (
                      <p className="text-center py-8 text-gray-500">No classes available</p>
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
