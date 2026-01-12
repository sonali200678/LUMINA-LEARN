
import React, { useMemo } from 'react';
import { User, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

interface AnalyticsPageProps {
  user: User;
}

const ACADEMIC_PROGRESS = [
  { day: 'Mon', proficiency: 65, classAvg: 70 },
  { day: 'Tue', proficiency: 68, classAvg: 71 },
  { day: 'Wed', proficiency: 75, classAvg: 72 },
  { day: 'Thu', proficiency: 82, classAvg: 74 },
  { day: 'Fri', proficiency: 80, classAvg: 75 },
  { day: 'Sat', proficiency: 88, classAvg: 76 },
  { day: 'Sun', proficiency: 92, classAvg: 77 },
];

const ENGAGEMENT_VELOCITY = [
  { name: 'Video Lessons', value: 45 },
  { name: 'Quizzes', value: 30 },
  { name: 'Documentation', value: 15 },
  { name: 'Peer Review', value: 10 },
];

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ user }) => {
  if (user.role === UserRole.STUDENT) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn py-8 px-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900">Your Learning Velocity</h2>
          <p className="text-gray-500 font-medium">AI-powered analysis of your academic trajectory.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Avg. Grade', value: '88%', icon: '📈', color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Engagement Score', value: '94/100', icon: '⚡', color: 'bg-amber-50 text-amber-600' },
            { label: 'Curriculum Coverage', value: '42%', icon: '📖', color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Peer Ranking', value: 'Top 12%', icon: '🥇', color: 'bg-rose-50 text-rose-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-xl mb-4`}>{stat.icon}</div>
              <span className="text-3xl font-black text-gray-900 leading-none">{stat.value}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <h3 className="text-2xl font-black text-gray-900 mb-8">Proficiency vs Class Average</h3>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={ACADEMIC_PROGRESS}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} />
                   <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                   <Line type="monotone" dataKey="proficiency" stroke="#8b5cf6" strokeWidth={4} dot={{r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}} />
                   <Line type="monotone" dataKey="classAvg" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
           <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col">
             <h3 className="text-2xl font-black text-gray-900 mb-8">Interaction Mix</h3>
             <div className="flex-1 min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={ENGAGEMENT_VELOCITY} innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                     {ENGAGEMENT_VELOCITY.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Instructor/Admin View
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn py-8 px-4 pb-20">
      <div>
        <h2 className="text-4xl font-black text-gray-900">Faculty Insights</h2>
        <p className="text-gray-500 font-medium">Monitoring curriculum engagement and cohort health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Cohort Score', value: '74.2%', icon: '📊', color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Content Engagement', value: '91%', icon: '🔥', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Syllabus Coverage', value: '38%', icon: '📍', color: 'bg-rose-50 text-rose-600' },
          { label: 'Peer Collaboration', value: 'High', icon: '💬', color: 'bg-blue-50 text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-xl mb-4`}>{stat.icon}</div>
            <span className="text-3xl font-black text-gray-900">{stat.value}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
           <h3 className="text-2xl font-black text-gray-900 mb-8">Cohort Learning Velocity</h3>
           <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACADEMIC_PROGRESS}>
                  <defs>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 'bold'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="proficiency" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorProf)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-[#1f2937] rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col">
           <h3 className="text-2xl font-black mb-6">Syllabus Health</h3>
           <div className="space-y-6">
              {[
                { label: 'React Architecture', value: 85 },
                { label: 'Cloud Native Lab', value: 42 },
                { label: 'UX Systems', value: 92 },
              ].map((v, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                    <span>{v.label}</span>
                    <span>{v.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400" style={{ width: `${v.value}%` }}></div>
                  </div>
                </div>
              ))}
           </div>
           <div className="mt-auto pt-10 border-t border-gray-800">
              <p className="text-sm font-medium text-gray-400 italic">"The Cloud Native Lab module is currently the bottleneck for this cohort. 60% of students are stuck on Step 4 (Docker Basics)."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
