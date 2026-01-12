
import React from 'react';
import { ICONS } from '../constants';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, user }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.Dashboard, roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN] },
    { id: 'courses', label: 'Courses', icon: ICONS.Course, roles: [UserRole.STUDENT, UserRole.INSTRUCTOR] },
    { id: 'assessments', label: 'Assessments', icon: ICONS.Assessment, roles: [UserRole.STUDENT, UserRole.INSTRUCTOR] },
    { id: 'attendance', label: 'Attendance', icon: ICONS.Attendance, roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN] },
    { id: 'analytics', label: 'Analytics', icon: ICONS.Analytics, roles: [UserRole.INSTRUCTOR, UserRole.ADMIN] },
    { id: 'certificates', label: 'Certificates', icon: ICONS.Certificate, roles: [UserRole.STUDENT] },
    { id: 'profile', label: 'My Profile', icon: ICONS.User, roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN] },
    { id: 'settings', label: 'Settings', icon: ICONS.Settings, roles: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-20 md:w-64 bg-[#8b5cf6] min-h-screen flex flex-col items-center py-8 text-white transition-all duration-300">
      <div className="mb-12 flex items-center gap-3 px-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <ICONS.Course className="w-8 h-8 text-white" />
        </div>
        <h1 className="hidden md:block text-2xl font-bold tracking-tight">Lumina</h1>
      </div>

      <nav className="flex-1 w-full px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-white text-[#8b5cf6] shadow-lg' 
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            {item.icon({ className: `w-6 h-6 shrink-0 ${activeTab === item.id ? 'text-[#8b5cf6]' : 'text-white/70 group-hover:text-white'}` })}
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4 w-full">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
