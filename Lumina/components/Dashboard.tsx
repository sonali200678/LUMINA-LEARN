
import React, { useState, useEffect } from 'react';
import { MOCK_COURSES } from '../constants';
import { User, UserRole, Course } from '../types';
import { ICONS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import RoadmapLab from './RoadmapLab';
import { getCourseRecommendations } from '../services/geminiService';

interface DashboardProps {
  user: User;
  courses: Course[];
}

// Student Learning Engagement Data - Focused on Mastery Growth
const studentMasteryData = [
  { topic: 'React', mastery: 0, fill: '#8b5cf6' },
  { topic: 'UI/UX', mastery: 0, fill: '#a78bfa' },
  { topic: 'Cloud', mastery: 0, fill: '#c4b5fd' },
  { topic: 'AI/ML', mastery: 0, fill: '#ddd6fe' },
  { topic: 'PM', mastery: 0, fill: '#ede9fe' },
];

// Infrastructure utilization for admins
const systemData = [
  { name: 'Mon', load: 45 },
  { name: 'Tue', load: 52 },
  { name: 'Wed', load: 48 },
  { name: 'Thu', load: 70 },
  { name: 'Fri', load: 65 },
  { name: 'Sat', load: 30 },
  { name: 'Sun', load: 25 },
];

const Dashboard: React.FC<DashboardProps> = ({ user, courses }) => {
  const [showRoadmapLab, setShowRoadmapLab] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  useEffect(() => {
    if (user.role === UserRole.STUDENT) {
      const fetchRecommendations = async () => {
        setLoadingRecs(true);
        try {
          const recs = await getCourseRecommendations(user, courses);
          setRecommendations(recs);
        } catch (error) {
          console.error("Failed to fetch AI recommendations", error);
        } finally {
          setLoadingRecs(false);
        }
      };
      fetchRecommendations();
    }
  }, [user, courses]);

  const getRoleBadge = () => {
    switch(user.role) {
      case UserRole.ADMIN: return 'bg-red-100 text-red-600';
      case UserRole.INSTRUCTOR: return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-purple-100 text-[#8b5cf6]';
    }
  };

  const getStats = () => {
    if (user.role === UserRole.STUDENT) {
      const enrolledCount = courses.filter(c => c.enrolled).length;
      return [
        { label: 'Courses Enrolled', value: enrolledCount.toString().padStart(2, '0'), icon: '📚', color: 'bg-indigo-50 text-indigo-600' },
        { label: 'Mastery Score', value: '0', icon: '💎', color: 'bg-purple-50 text-purple-600' },
        { label: 'Pending Tasks', value: '0', icon: '📝', color: 'bg-amber-50 text-amber-600' },
      ];
    } else if (user.role === UserRole.INSTRUCTOR) {
      return [
        { label: 'Active Cohorts', value: '04', icon: '🎓', color: 'bg-indigo-50 text-indigo-500' },
        { label: 'Pending Grades', value: '00', icon: '🖋️', color: 'bg-rose-50 text-rose-500' },
        { label: 'Content Health', value: '98%', icon: '🌿', color: 'bg-emerald-50 text-emerald-500' },
      ];
    } else {
      return [
        { label: 'Core Nodes', value: 'Active', icon: '🛰️', color: 'bg-emerald-50 text-emerald-500' },
        { label: 'Syllabus Objects', value: '14.2k', icon: '📚', color: 'bg-violet-50 text-violet-500' },
        { label: 'System Uptime', value: '99.9%', icon: '⚡', color: 'bg-cyan-50 text-cyan-500' },
      ];
    }
  };

  const ALL_TUTORS = [
    { name: 'Tutor 1', role: 'Software Architecture', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Tutor 2', role: 'UI/UX & Product Design', color: 'bg-rose-100 text-rose-600' },
    { name: 'Tutor 3', role: 'Cloud Infrastructure', color: 'bg-cyan-100 text-cyan-600' },
    { name: 'Tutor 4', role: 'Data Science & ML', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Tutor 5', role: 'Product Management', color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-purple-200/50">
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${getRoleBadge()}`}>
              {user.role} Portal
            </span>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wider">{dateStr}</p>
          </div>
          <h2 className="text-5xl font-black mb-3 leading-tight">Hi, {user.name.split(' ')[0]}!</h2>
          
          {user.role === UserRole.STUDENT && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-white/60">Branch</span>
                <span className="text-sm font-black">{user.branch}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-white/60">Year</span>
                <span className="text-sm font-black">{user.className}</span>
              </div>
            </div>
          )}

          <p className="text-white/90 text-lg font-medium">
            {user.role === UserRole.STUDENT && "Start your learning journey today. No goals completed yet."}
            {user.role === UserRole.INSTRUCTOR && 'Your students have engaged with the new curriculum labs at a high rate.'}
            {user.role === UserRole.ADMIN && 'Infrastructure nodes are optimized. Automated backups completed successfully.'}
          </p>
          <button className="mt-8 bg-white text-[#8b5cf6] px-10 py-4 rounded-[1.5rem] font-black text-sm hover:bg-purple-50 transition-all shadow-lg shadow-black/5 hover:scale-105">
            {user.role === UserRole.STUDENT ? 'Start Syllabus' : user.role === UserRole.INSTRUCTOR ? 'Review Feedback' : 'System Console'}
          </button>
        </div>
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/20 rounded-full blur-2xl"></div>
        
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-52 h-52 rounded-[2.5rem] border-8 border-white/20 shadow-2xl hidden lg:flex items-center justify-center bg-white/10 backdrop-blur-md rotate-6 hover:rotate-0 transition-transform duration-500">
           <span className="text-7xl font-black text-white">{userInitials}</span>
        </div>
      </div>

      {showRoadmapLab ? (
        <div className="space-y-6">
          <button 
            onClick={() => setShowRoadmapLab(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-black transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            BACK TO OVERVIEW
          </button>
          <RoadmapLab />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {getStats().map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-default">
                  <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-3xl mb-4 font-bold group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-black text-gray-900 leading-none mb-1">{stat.value}</div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {user.role === UserRole.STUDENT ? 'Topic Mastery Velocity' : 'Utilization Metrics'}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium">Tracking {user.role === UserRole.STUDENT ? 'skill acquisition across curriculum' : 'system performance nodes'}</p>
                </div>
                {user.role === UserRole.STUDENT && (
                  <div className="bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Growth Phase</span>
                  </div>
                )}
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {user.role === UserRole.STUDENT ? (
                    <BarChart data={studentMasteryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 'bold'}} domain={[0, 100]} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                      />
                      <Bar dataKey="mastery" radius={[8, 8, 0, 0]} barSize={40}>
                        {studentMasteryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <AreaChart data={systemData}>
                      <defs>
                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {user.role === UserRole.STUDENT && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    Personalized Recommendations
                    <span className="bg-purple-100 text-[#8b5cf6] text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">AI Lab</span>
                  </h3>
                </div>
                
                {loadingRecs ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm animate-pulse">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4"></div>
                        <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-50 rounded-full w-full mb-4"></div>
                        <div className="h-8 bg-gray-100 rounded-xl w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendations.map((rec, i) => (
                      <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                        <div className="w-10 h-10 bg-purple-50 text-[#8b5cf6] rounded-xl flex items-center justify-center mb-4 font-bold">
                          {i + 1}
                        </div>
                        <h4 className="font-black text-gray-900 mb-2 leading-tight group-hover:text-[#8b5cf6] transition-colors">{rec.title}</h4>
                        <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2">{rec.description}</p>
                        <div className="mt-auto pt-4 border-t border-gray-50">
                           <p className="text-[9px] font-black text-[#8b5cf6] uppercase tracking-widest mb-3">AI Reason: {rec.reason}</p>
                           <button className="w-full bg-gray-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#8b5cf6] transition-colors">Start Module</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                    <p className="text-gray-400 font-medium">Enroll in a course to unlock AI suggestions.</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">
                  {user.role === UserRole.STUDENT ? 'In Progress' : 'Recent Registry'}
                </h3>
                <button className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.filter(c => c.enrolled).slice(0, 2).map((course) => (
                  <div key={course.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:border-purple-200 transition-all group">
                    <div className="w-full md:w-24 h-24 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <ICONS.Course className="w-10 h-10 text-[#8b5cf6]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 mb-1 leading-tight">{course.title}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">{course.instructorName}</p>
                      <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden mb-4 border border-gray-100">
                        <div className="bg-[#8b5cf6] h-full transition-all duration-700" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-gray-900">{course.progress}% Mastery</span>
                         <button className="text-[#8b5cf6] text-xs font-black uppercase tracking-widest hover:underline">Resume</button>
                      </div>
                    </div>
                  </div>
                ))}
                {courses.filter(c => c.enrolled).length === 0 && (
                   <div className="col-span-full py-10 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold">You are not enrolled in any courses yet.</p>
                   </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8 h-full">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900">Expert Faculty</h3>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Active</span>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {ALL_TUTORS.map((instructor, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className={`w-12 h-12 rounded-full ${instructor.color} flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-white`}>
                      {instructor.name.split(' ').map(n => n[0]).join('') + (instructor.name.split(' ')[1] || '')}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-black text-gray-900 text-sm group-hover:text-[#8b5cf6] transition-colors leading-none mb-1">{instructor.name}</h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{instructor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              onClick={() => setShowRoadmapLab(true)}
              className="bg-[#8b5cf6] rounded-[2rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95"
            >
               <div className="relative z-10">
                  <h4 className="text-xl font-black mb-2">Architect My Future</h4>
                  <p className="text-sm text-white/80 mb-8 leading-relaxed font-medium">
                    Our AI lab will analyze your performance and build a unique roadmap to master any skill.
                  </p>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                     <ICONS.Analytics className="w-6 h-6" />
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-12 -mt-12 rounded-full"></div>
               <div className="absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-widest opacity-40">Open Lab</div>
            </div>

            <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl">
              <h3 className="text-xl font-black mb-6">Notices</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-amber-400 pl-4">
                  <h5 className="font-black text-sm mb-1 uppercase tracking-widest">Syllabus Update</h5>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium">New modules for Cloud Infrastructure have been added to the master registry.</p>
                </div>
                <div className="border-l-4 border-[#8b5cf6] pl-4">
                  <h5 className="font-black text-sm mb-1 uppercase tracking-widest">Maintenance</h5>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium">System performance nodes will be optimized tonight at 02:00 UTC.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </div>
  );
};

export default Dashboard;
