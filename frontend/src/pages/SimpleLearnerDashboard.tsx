import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Calendar, Award } from 'lucide-react';

interface Course {
  name: string;
  teacher: string;
  grade: string;
}

export function SimpleLearnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'courses' | 'grades'>('overview');

  const courses: Course[] = [
    { name: 'Mathematics', teacher: 'Mr. Mwamba', grade: 'A' },
    { name: 'English', teacher: 'Mrs. Banda', grade: 'B+' },
    { name: 'Science', teacher: 'Mr. Phiri', grade: 'A-' },
    { name: 'Social Studies', teacher: 'Mrs. Mulenga', grade: 'B' },
    { name: 'Computer Studies', teacher: 'Mr. Zulu', grade: 'A' },
    { name: 'Physical Education', teacher: 'Mr. Tembo', grade: 'A' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.png" alt="LDSS Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
              <div>
                <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-tight">Lukulu Day Secondary School</h1>
                <p className="text-xs sm:text-sm text-purple-100">Learner Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-purple-100 text-xs sm:text-sm">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-purple-700 hover:bg-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded transition text-xs sm:text-sm"
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
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">My Courses</p>
                <p className="text-3xl font-bold text-purple-600">{courses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Attendance</p>
                <p className="text-3xl font-bold text-green-600">95%</p>
              </div>
              <Calendar className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Average Grade</p>
                <p className="text-3xl font-bold text-blue-600">A-</p>
              </div>
              <Award className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Rank</p>
                <p className="text-3xl font-bold text-orange-600">5th</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'overview'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('courses')}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'courses'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveView('grades')}
                className={`px-6 py-3 font-semibold ${
                  activeView === 'grades'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Grades
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeView === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Learner Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to the LDSS Learner Portal. Access your courses, grades, and timetable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveView('courses')}
                    className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 text-left transition shadow-lg"
                  >
                    <h3 className="font-semibold text-lg mb-2">My Courses</h3>
                    <p className="text-sm text-purple-100">View your enrolled courses and teachers</p>
                  </button>
                  <button
                    onClick={() => setActiveView('grades')}
                    className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-left transition shadow-lg"
                  >
                    <h3 className="font-semibold text-lg mb-2">My Grades</h3>
                    <p className="text-sm text-blue-100">Check your academic performance</p>
                  </button>
                  <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-left transition shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">Timetable</h3>
                    <p className="text-sm text-green-100">View your class schedule</p>
                  </button>
                  <button className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 text-left transition shadow-lg">
                    <h3 className="font-semibold text-lg mb-2">Announcements</h3>
                    <p className="text-sm text-orange-100">Read school announcements</p>
                  </button>
                </div>

                <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Academic Performance</h3>
                  <p className="text-gray-700 mb-4">You're doing great! Keep up the excellent work.</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">95%</p>
                      <p className="text-sm text-gray-600">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">A-</p>
                      <p className="text-sm text-gray-600">Average</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">5th</p>
                      <p className="text-sm text-gray-600">Class Rank</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'courses' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Courses</h2>
                <div className="grid gap-4">
                  {courses.map((course, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-purple-800">{course.name}</h3>
                          <p className="text-gray-600 mt-1">Teacher: {course.teacher}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                          course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          Grade: {course.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'grades' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Grades</h2>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-purple-600">A-</p>
                      <p className="text-sm text-gray-600">Overall Average</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-600">5th</p>
                      <p className="text-sm text-gray-600">Class Rank</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">87%</p>
                      <p className="text-sm text-gray-600">Overall Score</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Subject</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teacher</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Grade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {courses.map((course, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{course.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{course.teacher}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                              course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {course.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {course.grade === 'A' ? '95%' : course.grade === 'A-' ? '90%' : course.grade === 'B+' ? '87%' : '83%'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
