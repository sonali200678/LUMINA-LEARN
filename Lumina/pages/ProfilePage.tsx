
import React, { useState, useMemo } from 'react';
import { User, UserRole, AssessmentResult } from '../types';
import { ICONS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

// Mocked historical data for performance
const MOCK_PERFORMANCE: AssessmentResult[] = [
  { id: 'r1', assessmentId: 'a1', studentId: 'current', courseName: 'Advanced React Architecture', assessmentTitle: 'Midterm Patterns Quiz', score: 45, totalMarks: 50, date: 'Oct 15', status: 'EXCELLENT' },
  { id: 'r2', assessmentId: 'a2', studentId: 'current', courseName: 'UI/UX Design Systems', assessmentTitle: 'Atomic Design Lab', score: 82, totalMarks: 100, date: 'Oct 22', status: 'GOOD' },
  { id: 'r3', assessmentId: 'a3', studentId: 'current', courseName: 'Cloud Native Development', assessmentTitle: 'Docker Basics Quiz', score: 28, totalMarks: 40, date: 'Nov 05', status: 'PASS' },
  { id: 'r4', assessmentId: 'a4', studentId: 'current', courseName: 'Advanced React Architecture', assessmentTitle: 'Hooks & Performance MCQ', score: 95, totalMarks: 100, date: 'Nov 12', status: 'EXCELLENT' },
  { id: 'r5', assessmentId: 'a5', studentId: 'current', courseName: 'Machine Learning Essentials', assessmentTitle: 'Linear Regression Project', score: 70, totalMarks: 100, date: 'Nov 18', status: 'GOOD' },
];

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    branch: user.branch || '',
    className: user.className || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'INFO' | 'PERFORMANCE'>('INFO');

  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const isStudent = user.role === UserRole.STUDENT;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdateUser({
        ...user,
        name: formData.name,
        email: formData.email,
        branch: isStudent ? formData.branch : undefined,
        className: isStudent ? formData.className : undefined,
      });
      setIsSaving(false);
      setIsEditing(false);
    }, 800);
  };

  const chartData = useMemo(() => {
    return MOCK_PERFORMANCE.map(r => ({
      name: r.date,
      score: Math.round((r.score / r.totalMarks) * 100),
      title: r.assessmentTitle
    }));
  }, []);

  const performanceStats = useMemo(() => {
    const total = MOCK_PERFORMANCE.reduce((acc, curr) => acc + (curr.score / curr.totalMarks), 0);
    const avg = Math.round((total / MOCK_PERFORMANCE.length) * 100);
    return {
      averageScore: avg,
      rank: "#24 / 120",
      totalAssessments: MOCK_PERFORMANCE.length,
      percentile: "Top 12%"
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Header Cover */}
        <div className="h-48 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] relative">
          <div className="absolute -bottom-16 left-12">
            <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-xl">
              <div className="w-full h-full rounded-[1.5rem] bg-purple-50 flex items-center justify-center text-[#8b5cf6] text-4xl font-black">
                {userInitials}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 font-medium">
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Portal 
                {isStudent && user.branch ? ` • ${user.branch}` : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-1 rounded-2xl flex gap-1">
                <button 
                  onClick={() => setActiveSubTab('INFO')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'INFO' ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Overview
                </button>
                {isStudent && (
                  <button 
                    onClick={() => setActiveSubTab('PERFORMANCE')}
                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === 'PERFORMANCE' ? 'bg-white text-[#8b5cf6] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Performance
                  </button>
                )}
              </div>
              
              {!isEditing && activeSubTab === 'INFO' && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-[#8b5cf6] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#7c3aed] transition-all shadow-lg shadow-purple-100 flex items-center gap-2 ml-4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {activeSubTab === 'INFO' ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-800"
                />
              </div>

              {isStudent && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Academic Branch</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Class / Batch</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.className}
                      onChange={(e) => setFormData({...formData, className: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed font-medium text-gray-800"
                    />
                  </div>
                </>
              )}

              {isEditing && (
                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        branch: user.branch || '',
                        className: user.className || '',
                      });
                    }}
                    className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#8b5cf6] text-white px-10 py-3 rounded-2xl font-bold hover:bg-[#7c3aed] transition-all shadow-xl shadow-purple-200 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : 'Save Changes'}
                  </button>
                </div>
              )}

              {!isEditing && (
                <div className="md:col-span-2 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 shadow-sm">
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2">Account Role</p>
                    <p className="text-2xl font-black text-blue-900">{user.role}</p>
                    <p className="text-blue-600/60 text-xs mt-2 font-medium">Verified Lumina Access</p>
                  </div>
                  <div className="p-8 bg-purple-50 rounded-[2rem] border border-purple-100 shadow-sm">
                    <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Points</p>
                    <p className="text-2xl font-black text-purple-900">1,250 XP</p>
                    <p className="text-purple-600/60 text-xs mt-2 font-medium">Top 15% of your class</p>
                  </div>
                  <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 shadow-sm">
                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">Certificates</p>
                    <p className="text-2xl font-black text-amber-900">12 Verified</p>
                    <p className="text-amber-600/60 text-xs mt-2 font-medium">3 Pending processing</p>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-10 animate-fadeIn">
              {/* Key Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Avg. Proficiency', value: `${performanceStats.averageScore}%`, icon: '📊', color: 'bg-indigo-50 text-indigo-600' },
                  { label: 'Class Rank', value: performanceStats.rank, icon: '🏆', color: 'bg-amber-50 text-amber-600' },
                  { label: 'Assessments', value: performanceStats.totalAssessments, icon: '📝', color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Percentile', value: performanceStats.percentile, icon: '🔥', color: 'bg-rose-50 text-rose-600' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-lg mb-3`}>
                      {stat.icon}
                    </div>
                    <span className="text-2xl font-black text-gray-900">{stat.value}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Main Performance Chart Container */}
              <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">Score History</h3>
                      <p className="text-gray-500 text-sm font-medium">Tracking your performance across all session assessments</p>
                   </div>
                   <div className="flex gap-2">
                     <span className="px-4 py-2 bg-white rounded-xl shadow-sm text-[10px] font-black text-[#8b5cf6] border border-purple-100 uppercase tracking-widest">Global Avg: 74%</span>
                   </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 'bold'}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 'bold'}} 
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8b5cf6" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Learning Velocity Card */}
              <div className="bg-[#8b5cf6] rounded-[2.5rem] p-10 text-white shadow-xl shadow-purple-200 flex flex-col md:flex-row items-center gap-10">
                 <div className="flex-1">
                    <h4 className="text-sm font-black text-white/60 uppercase tracking-widest mb-6">Learning Momentum</h4>
                    <p className="text-4xl font-black mb-4">Elite Progress detected</p>
                    <p className="text-white/80 leading-relaxed font-medium">Your current learning trajectory suggests you'll complete your curriculum 3 weeks ahead of schedule. Your accuracy rate in "Advanced React Architecture" is in the top 5% of all Lumina students.</p>
                 </div>
                 <div className="w-full md:w-auto flex gap-3">
                    <div className="px-6 py-4 bg-white/20 rounded-2xl backdrop-blur-md text-center">
                      <span className="text-[10px] font-bold block opacity-60 uppercase tracking-widest">Consistency</span>
                      <span className="text-2xl font-black">Level 9</span>
                    </div>
                    <div className="px-6 py-4 bg-white/20 rounded-2xl backdrop-blur-md text-center">
                      <span className="text-[10px] font-bold block opacity-60 uppercase tracking-widest">Daily Streak</span>
                      <span className="text-2xl font-black">12 Days</span>
                    </div>
                 </div>
              </div>

              {/* Detailed Performance Log Table */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <h3 className="text-2xl font-black text-gray-900">Historical Assessment Log</h3>
                  <div className="flex gap-4">
                    <button className="text-xs font-black text-[#8b5cf6] uppercase tracking-widest hover:underline">Download full PDF</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assessment Name</th>
                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Completion</th>
                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Score Ratio</th>
                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_PERFORMANCE.sort((a,b) => b.date.localeCompare(a.date)).map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-10 py-6">
                            <div>
                              <p className="font-black text-gray-800 leading-tight group-hover:text-[#8b5cf6] transition-colors">{res.assessmentTitle}</p>
                              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{res.courseName}</p>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <span className="text-sm font-bold text-gray-500">{res.date}</span>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <span className="text-lg font-black text-gray-800">{res.score}</span>
                            <span className="text-gray-400 text-xs ml-1 font-bold">/ {res.totalMarks}</span>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                               res.status === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-600' :
                               res.status === 'GOOD' ? 'bg-blue-50 text-blue-600' :
                               res.status === 'PASS' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                             }`}>
                               {res.status}
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
