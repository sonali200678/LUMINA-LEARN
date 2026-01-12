
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface SettingsPageProps {
  user: User;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<'GENERAL' | 'SECURITY' | 'NOTIFICATIONS' | 'DISPLAY'>('GENERAL');
  
  const [toggles, setToggles] = useState({
    emailAnnouncements: true,
    emailGrading: true,
    pushReminders: false,
    darkMode: false,
    twoFactor: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggle = (key: keyof typeof toggles, label: string, description: string) => (
    <div className="flex items-center justify-between py-6 group">
      <div className="flex-1 pr-10">
        <p className="font-bold text-gray-800 mb-1 group-hover:text-[#8b5cf6] transition-colors">{label}</p>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">{description}</p>
      </div>
      <button 
        onClick={() => handleToggle(key)}
        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${toggles[key] ? 'bg-[#8b5cf6] shadow-lg shadow-purple-100' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ${toggles[key] ? 'left-7' : 'left-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn pb-20">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-2">Global Settings</h2>
        <p className="text-gray-500 font-medium">Personalize your learning environment and secure your credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'GENERAL', label: 'General', icon: '⚙️' },
            { id: 'SECURITY', label: 'Security', icon: '🛡️' },
            { id: 'NOTIFICATIONS', label: 'Notifications', icon: '🔔' },
            { id: 'DISPLAY', label: 'Display', icon: '✨' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                activeSection === item.id 
                  ? 'bg-white text-[#8b5cf6] shadow-sm ring-1 ring-gray-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm min-h-[500px] animate-fadeIn">
            {activeSection === 'GENERAL' && (
              <div className="space-y-8">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2">Core Identity</h3>
                   <p className="text-gray-400 text-sm font-medium">Basic information regarding your platform access.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Language Preference</label>
                     <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] font-bold text-gray-700">
                        <option>English (United States)</option>
                        <option>Spanish (ES)</option>
                        <option>French (FR)</option>
                        <option>German (DE)</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Timezone</label>
                     <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] font-bold text-gray-700">
                        <option>(GMT-08:00) Pacific Time</option>
                        <option>(GMT+00:00) London</option>
                        <option>(GMT+05:30) Mumbai</option>
                     </select>
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Platform Storage</h4>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Personal Cloud Space</span>
                        <span className="text-xs font-black text-gray-800 uppercase tracking-widest">1.2 GB / 5.0 GB</span>
                     </div>
                     <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8b5cf6] w-[24%] transition-all duration-1000"></div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'SECURITY' && (
              <div className="space-y-8">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2">Account Protection</h3>
                   <p className="text-gray-400 text-sm font-medium">Advanced tools to keep your learning records safe.</p>
                </div>

                <div className="divide-y divide-gray-50">
                  {renderToggle('twoFactor', 'Two-Factor Authentication', 'Add an extra layer of security by requiring a code from your phone.')}
                  
                  <div className="py-6 flex items-center justify-between">
                    <div className="flex-1 pr-10">
                      <p className="font-bold text-gray-800 mb-1">Update Password</p>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed">It is recommended to change your password every 6 months.</p>
                    </div>
                    <button className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">Change</button>
                  </div>

                  <div className="py-6 flex items-center justify-between">
                    <div className="flex-1 pr-10">
                      <p className="font-bold text-gray-800 mb-1">Active Sessions</p>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed">Currently logged in on 3 devices. Manage connected hardware.</p>
                    </div>
                    <button className="text-[#8b5cf6] font-bold text-sm hover:underline">Manage All</button>
                  </div>
                </div>

                <div className="p-8 bg-rose-50 rounded-[2rem] border border-rose-100 mt-10">
                   <h4 className="text-rose-900 font-black mb-2 uppercase tracking-widest text-xs">Danger Zone</h4>
                   <p className="text-rose-600 text-xs font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                   <button className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">Deactivate Account</button>
                </div>
              </div>
            )}

            {activeSection === 'NOTIFICATIONS' && (
              <div className="space-y-8">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2">Communication Hub</h3>
                   <p className="text-gray-400 text-sm font-medium">Configure when and how you receive platform updates.</p>
                </div>

                <div className="divide-y divide-gray-50">
                  {renderToggle('emailAnnouncements', 'Email Announcements', 'Stay updated on platform news, course launches, and system updates.')}
                  {renderToggle('emailGrading', 'Grading & Feedback', 'Receive email alerts when an instructor has reviewed your submission.')}
                  {renderToggle('pushReminders', 'Push Task Reminders', 'Browser notifications for upcoming deadlines and live class events.')}
                </div>
                
                <div className="pt-8 border-t border-gray-50">
                   <h4 className="text-xs font-black text-gray-400 mb-6 uppercase tracking-widest">Slack Integration</h4>
                   <button className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold group">
                      <div className="w-8 h-8 rounded-lg bg-[#4a154b] flex items-center justify-center text-white font-black group-hover:scale-110 transition-transform">#</div>
                      Connect to Lumina Slack Bot
                   </button>
                </div>
              </div>
            )}

            {activeSection === 'DISPLAY' && (
              <div className="space-y-8">
                <div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2">Interface Customization</h3>
                   <p className="text-gray-400 text-sm font-medium">Fine-tune the visual appearance of the Lumina LMS.</p>
                </div>

                <div className="divide-y divide-gray-50">
                  {renderToggle('darkMode', 'Dark Visual Palette', 'Switch to a light-on-dark color scheme to reduce eye strain in low light.')}
                  
                  <div className="py-8">
                    <h4 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-widest">UI Scaling</h4>
                    <div className="flex gap-4">
                      {['Compact', 'Default', 'Comfortable'].map((size) => (
                        <button 
                          key={size}
                          className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                            size === 'Default' 
                              ? 'bg-[#8b5cf6] text-white border-transparent shadow-lg shadow-purple-100' 
                              : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Global Save Indicator */}
            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                 <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 All changes are saved automatically
               </p>
               <button className="bg-gray-100 text-gray-600 px-10 py-3 rounded-2xl font-black text-sm hover:bg-gray-200 transition-colors">Reset Defaults</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
