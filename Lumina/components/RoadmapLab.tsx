
import React, { useState } from 'react';
import { generateLearningPath } from '../services/geminiService';

interface RoadmapStep {
  title: string;
  description: string;
  estimatedTime: string;
}

interface Roadmap {
  pathTitle: string;
  steps: RoadmapStep[];
}

const RoadmapLab: React.FC = () => {
  const [interest, setInterest] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!interest.trim()) return;
    setLoading(true);
    setRoadmap(null);
    try {
      const data = await generateLearningPath(interest, level);
      setRoadmap(data);
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
      alert("Something went wrong generating your path. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h3 className="text-3xl font-black text-gray-900">Foundations to Mastery</h3>
          <p className="text-gray-500 font-medium">Lumina AI architecting your complete journey from absolute basics.</p>
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1 shrink-0">
          {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-6 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                level === l 
                  ? 'bg-white text-[#8b5cf6] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <input 
            type="text" 
            value={interest} 
            onChange={(e) => setInterest(e.target.value)}
            placeholder="What do you want to master from scratch? (e.g., Quantum Physics, Web Dev)..."
            className="w-full bg-gray-50 border border-transparent rounded-2xl px-8 py-4 focus:ring-2 focus:ring-[#8b5cf6] focus:bg-white transition-all outline-none font-medium text-gray-900"
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !interest.trim()}
          className="bg-[#8b5cf6] text-white px-10 py-4 rounded-2xl font-black disabled:opacity-50 hover:bg-[#7c3aed] transition-all shadow-xl shadow-purple-200 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Architecting...
            </>
          ) : 'Generate My Full Path'}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Mapping curriculum from basics to expertise...</p>
        </div>
      ) : roadmap ? (
        <div className="animate-fadeIn">
          <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100 mb-10">
            <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Complete Career Curriculum</h4>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">{roadmap.pathTitle}</h2>
          </div>

          <div className="space-y-12 relative">
            <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gray-100 z-0"></div>
            {roadmap.steps.map((step, idx) => (
              <div key={idx} className="flex gap-8 relative z-10">
                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 shadow-sm transition-all ${
                    idx === 0 ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white' : 'bg-white border-[#8b5cf6] text-[#8b5cf6]'
                  }`}>
                  <span className="font-black text-sm">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h5 className={`text-xl font-black ${idx === 0 ? 'text-[#8b5cf6]' : 'text-gray-800'}`}>
                      {step.title} {idx === 0 && <span className="ml-2 text-[10px] bg-purple-100 text-[#8b5cf6] px-2 py-1 rounded-lg uppercase">Start Here</span>}
                    </h5>
                    <span className="px-4 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest self-start md:self-auto">
                      {step.estimatedTime}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-sm font-medium text-gray-500">This path covers <span className="text-gray-900 font-bold">100% of core competencies</span> from basics to professional level.</p>
             </div>
             <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
               Save to Learning Goals
             </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Learning, Redefined</h3>
          <p className="text-gray-500 max-w-sm">Type any interest to receive a full "Foundations to Mastery" curriculum powered by Gemini Flash.</p>
        </div>
      )}
    </div>
  );
};

export default RoadmapLab;
