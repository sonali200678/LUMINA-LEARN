
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssessmentsPage from './pages/AssessmentsPage';
import ProfilePage from './pages/ProfilePage';
import CoursesPage from './pages/CoursesPage';
import CertificatesPage from './pages/CertificatesPage';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Login from './components/Login';
import { User, UserRole, Course } from './types';
import { MOCK_COURSES } from './constants';

const STORAGE_KEY = 'lumina_user_session';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Shared state for courses to sync progress across pages
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to restore session", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (user: User, rememberMe: boolean) => {
    setCurrentUser(user);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#f7f6fe] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const userInitials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser} courses={courses} />;
      case 'courses':
        return <CoursesPage user={currentUser} courses={courses} onUpdateCourses={setCourses} />;
      case 'assessments':
        return <AssessmentsPage user={currentUser} />;
      case 'attendance':
        return <AttendancePage user={currentUser} />;
      case 'certificates':
        return <CertificatesPage user={currentUser} courses={courses} onNavigate={() => setActiveTab('courses')} />;
      case 'profile':
        return <ProfilePage user={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'analytics':
        return <AnalyticsPage user={currentUser} />;
      case 'settings':
        return <SettingsPage user={currentUser} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-fadeIn">
            <div className="text-6xl">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800">Section Under Development</h2>
            <p className="text-gray-500 max-w-md">The {activeTab} module is currently being optimized for high-performance delivery for {currentUser.role.toLowerCase()}s.</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="bg-[#8b5cf6] text-white px-8 py-3 rounded-2xl font-bold mt-4"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#f7f6fe]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={currentUser} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full md:w-96 group">
            <input 
              type="text" 
              placeholder="Search courses, tutors, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none rounded-2xl px-6 py-3 pl-12 shadow-sm focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none text-gray-900"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-6 self-end md:self-auto">
            <button className="relative p-2 rounded-xl bg-white shadow-sm hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 transition-all text-left"
            >
               <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#8b5cf6] font-bold text-sm">
                  {userInitials}
               </div>
               <div className="hidden sm:block">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {currentUser.role === UserRole.STUDENT ? (currentUser.branch || 'Student') : currentUser.role.toLowerCase()}
                  </p>
               </div>
               <svg className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform ${activeTab === 'profile' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </header>

        {renderContent()}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
