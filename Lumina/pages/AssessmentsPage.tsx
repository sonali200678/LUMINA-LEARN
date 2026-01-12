
import React, { useState, useEffect, useRef } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { User, UserRole, Assessment, Course } from '../types';
import { MOCK_COURSES } from '../constants';

const SUGGESTED_TOPICS = [
  "React Hooks & Patterns",
  "Node.js Performance",
  "Tailwind CSS Layouts",
  "AWS Lambda Essentials",
  "Python Data Analysis",
  "TypeScript Masterclass"
];

interface AssessmentsPageProps {
  user: User;
}

const AssessmentsPage: React.FC<AssessmentsPageProps> = ({ user }) => {
  const [view, setView] = useState<'QUIZ' | 'MANAGE'>('QUIZ');
  
  // AI Quiz Lab State
  const [topic, setTopic] = useState('');
  const [assessmentType, setAssessmentType] = useState<'MCQ' | 'CODING' | 'THEORY'>('MCQ');
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const quizTopRef = useRef<HTMLDivElement>(null);

  // Management State
  const [assessments, setAssessments] = useState<Assessment[]>([
    { id: 'a1', courseId: '1', title: 'Midterm Architecture Quiz', type: 'MCQ', dueDate: '2023-11-20', totalMarks: 50 },
    { id: 'a2', courseId: '2', title: 'Design System Documentation', type: 'PROJECT', dueDate: '2023-11-25', totalMarks: 100 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState<Partial<Assessment>>({
    type: 'MCQ',
    totalMarks: 100
  });

  const isStaff = user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN;

  // Timer Effect
  useEffect(() => {
    let timer: number;
    if (quiz.length > 0 && !submitted && timeLeft !== null && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== null && prev <= 1) {
            clearInterval(timer);
            setSubmitted(true);
            quizTopRef.current?.scrollIntoView({ behavior: 'smooth' });
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quiz.length, submitted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchQuiz = async (selectedTopic?: string) => {
    const activeTopic = selectedTopic || topic;
    if (!activeTopic.trim()) {
      alert("Please enter or select a topic first.");
      return;
    }
    
    setLoading(true);
    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(null);
    try {
      const data = await generateQuizQuestions(activeTopic, assessmentType);
      setQuiz(data);
      // Give 1 minute per question
      setTimeLeft(data.length * 60);
      if (selectedTopic) setTopic(selectedTopic);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    }
    setLoading(false);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessment.title || !newAssessment.courseId || !newAssessment.dueDate) return;

    const created: Assessment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newAssessment.title!,
      courseId: newAssessment.courseId!,
      type: newAssessment.type! as any,
      dueDate: newAssessment.dueDate!,
      totalMarks: newAssessment.totalMarks!
    };

    setAssessments([created, ...assessments]);
    setIsModalOpen(false);
    setNewAssessment({ type: 'MCQ', totalMarks: 100 });
  };

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIdx]: oIdx });
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    return score;
  };

  const progress = (Object.keys(answers).length / (quiz.length || 1)) * 100;

  const getCourseName = (id: string) => MOCK_COURSES.find(c => c.id === id)?.title || 'Unknown Course';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fadeIn relative" ref={quizTopRef}>
      
      {/* View Toggle (Instructor/Admin only) */}
      {isStaff && (
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
            <button 
              onClick={() => setView('QUIZ')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${view === 'QUIZ' ? 'bg-[#8b5cf6] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Practice Quiz Lab
            </button>
            <button 
              onClick={() => setView('MANAGE')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${view === 'MANAGE' ? 'bg-[#8b5cf6] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Assessment Manager
            </button>
          </div>
        </div>
      )}

      {view === 'QUIZ' ? (
        <>
          {/* AI Quiz Lab Content */}
          {!loading && quiz.length > 0 && !submitted && (
            <div className="sticky top-0 z-30 mb-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-[#8b5cf6] h-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#8b5cf6] whitespace-nowrap">
                    {Object.keys(answers).length} / {quiz.length} Answered
                  </span>
                </div>

                {timeLeft !== null && (
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border transition-all ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-purple-50 border-purple-100 text-[#8b5cf6]'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-black font-mono">{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">Quiz Lab</h2>
                <p className="text-gray-500 font-medium">Choose any topic and test your mastery with AI.</p>
              </div>
              <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1 shrink-0">
                {(['MCQ', 'CODING', 'THEORY'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setAssessmentType(t)}
                    className={`px-6 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                      assessmentType === t 
                        ? 'bg-white text-[#8b5cf6] shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-6 mb-12">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <input 
                    type="text" 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Type your own topic (e.g. Distributed Systems)..."
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-8 py-4 focus:ring-2 focus:ring-[#8b5cf6] focus:bg-white transition-all outline-none font-medium text-gray-900"
                  />
                  {topic && (
                    <button 
                      onClick={() => setTopic('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => fetchQuiz()}
                  disabled={loading || !topic.trim()}
                  className="bg-[#8b5cf6] text-white px-10 py-4 rounded-2xl font-bold disabled:opacity-50 hover:bg-[#7c3aed] transition-all shadow-xl shadow-purple-200 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : 'Generate Questions'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Quick Picks:</span>
                {SUGGESTED_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => fetchQuiz(t)}
                    className="px-4 py-1.5 rounded-full bg-purple-50 text-[#8b5cf6] text-xs font-bold hover:bg-[#8b5cf6] hover:text-white transition-all border border-purple-100"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-800">Synthesizing {topic}...</p>
                  <p className="text-gray-400 mt-1">Generating 10 comprehensive {assessmentType} challenges</p>
                </div>
              </div>
            ) : quiz.length > 0 ? (
              <div className="space-y-16">
                {quiz.map((q, qIdx) => (
                  <div key={qIdx} className="scroll-mt-32 animate-fadeIn" style={{ animationDelay: `${qIdx * 0.05}s` }}>
                    <div className="flex items-start gap-4 mb-6">
                      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-[#8b5cf6] font-black text-sm shrink-0">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-2xl font-bold text-gray-900 leading-snug pt-1">
                        {q.question}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-14">
                      {q.options.map((opt: string, oIdx: number) => {
                        const isSelected = answers[qIdx] === oIdx;
                        const isCorrect = q.correctAnswer === oIdx;
                        let bgClass = "bg-gray-50 hover:bg-gray-100 hover:scale-[1.01]";
                        let borderClass = "border-2 border-transparent";
                        let textClass = "text-gray-700";

                        if (isSelected) {
                          bgClass = "bg-purple-50";
                          borderClass = "border-2 border-[#8b5cf6]";
                          textClass = "text-[#8b5cf6]";
                        }

                        if (submitted) {
                           if (isCorrect) {
                             bgClass = "bg-green-50";
                             borderClass = "border-2 border-green-500";
                             textClass = "text-green-800";
                           } else if (isSelected && !isCorrect) {
                             bgClass = "bg-red-50";
                             borderClass = "border-2 border-red-500";
                             textClass = "text-red-800";
                           } else {
                             bgClass = "bg-gray-50 opacity-50";
                           }
                        }

                        return (
                          <button 
                            key={oIdx}
                            disabled={submitted}
                            onClick={() => handleSelect(qIdx, oIdx)}
                            className={`text-left p-6 rounded-[1.5rem] transition-all duration-300 font-bold ${bgClass} ${borderClass} ${textClass} flex items-center justify-between group`}
                          >
                            <span className="flex-1">{opt}</span>
                            {submitted && isCorrect && (
                              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="mt-6 ml-0 md:ml-14 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 animate-fadeIn">
                        <p className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Explanation:
                        </p>
                        <p className="text-blue-900 leading-relaxed font-medium">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}

                {!submitted && (
                  <div className="pt-12 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        setSubmitted(true);
                        quizTopRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      disabled={Object.keys(answers).length < quiz.length}
                      className="w-full bg-[#8b5cf6] text-white py-6 rounded-[2rem] font-black text-xl hover:bg-[#7c3aed] transition-all shadow-2xl shadow-purple-200 disabled:opacity-50 disabled:shadow-none"
                    >
                      {Object.keys(answers).length < quiz.length 
                        ? `Finish ${quiz.length - Object.keys(answers).length} more to Submit` 
                        : 'Submit My Answers'}
                    </button>
                  </div>
                )}

                {submitted && (
                  <div className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] p-12 rounded-[3rem] text-center text-white shadow-2xl shadow-purple-300 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl font-black">{calculateScore()}/{quiz.length}</span>
                      </div>
                      <h3 className="text-4xl font-black mb-4">
                        {timeLeft === 0 && calculateScore() < quiz.length ? 'Time Up! ⏰' : (calculateScore() === quiz.length ? 'Mastery Unlocked! 🏆' : calculateScore() >= 7 ? 'Great Performance! 🌟' : 'Keep Learning! 💪')}
                      </h3>
                      <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        {timeLeft === 0 && 'The timer ran out, but your efforts still count! '}
                        You've explored the depths of <b>{topic}</b>. Your score of {calculateScore()} shows a {(calculateScore()/quiz.length * 100).toFixed(0)}% proficiency.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={() => setQuiz([])}
                          className="bg-white text-[#8b5cf6] px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform"
                        >
                          Try Another Topic
                        </button>
                        <button className="bg-white/20 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-black border border-white/30 hover:bg-white/30 transition-all">
                          Save Results
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to test your knowledge?</h3>
                <p className="text-gray-500 max-w-sm">Enter a specific topic above or pick one from our suggestions to start your personalized 10-question assessment. (Time limit: 1 min/question)</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Assessment Management Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-4xl font-black text-gray-900">Manage Assessments</h2>
              <p className="text-gray-500 font-medium">Create and track formal evaluations for your courses.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#8b5cf6] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-200 hover:scale-105 transition-all flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              New Assessment
            </button>
          </div>

          {/* Assessments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments.map((a) => (
              <div key={a.id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block mb-3 ${
                      a.type === 'MCQ' ? 'bg-blue-50 text-blue-600' : 
                      a.type === 'PROJECT' ? 'bg-purple-50 text-purple-600' : 
                      a.type === 'CODING' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {a.type} Assessment
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-[#8b5cf6] transition-colors">{a.title}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Marks</span>
                    <span className="text-xl font-black text-[#8b5cf6]">{a.totalMarks}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Course</span>
                    <span className="text-sm font-bold text-gray-700">{getCourseName(a.courseId)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</span>
                    <span className="text-sm font-bold text-red-500">{a.dueDate}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">Edit</button>
                  <button className="flex-1 bg-[#8b5cf6]/5 text-[#8b5cf6] py-3 rounded-xl font-bold hover:bg-[#8b5cf6] hover:text-white transition-all">Submissions</button>
                </div>
              </div>
            ))}
          </div>

          {assessments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No active assessments</h3>
              <p className="text-gray-500 max-w-sm mb-8">Start by creating your first formal evaluation for one of your courses.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#8b5cf6] text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
              >
                Create Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl p-10 animate-modalIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black text-gray-900">New Assessment</h3>
                <p className="text-gray-500 font-medium">Define parameters for student evaluation.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Assessment Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Systems Architecture Final"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] outline-none text-gray-900"
                  value={newAssessment.title || ''}
                  onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
                  <select
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] outline-none text-gray-900"
                    value={newAssessment.type}
                    onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value as any})}
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="PROJECT">Project</option>
                    <option value="CODING">Coding</option>
                    <option value="ESSAY">Essay</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Course</label>
                  <select
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] outline-none text-gray-900"
                    value={newAssessment.courseId || ''}
                    onChange={(e) => setNewAssessment({...newAssessment, courseId: e.target.value})}
                  >
                    <option value="">Select Course</option>
                    {MOCK_COURSES.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Due Date</label>
                  <input
                    required
                    type="date"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] outline-none text-gray-900"
                    value={newAssessment.dueDate || ''}
                    onChange={(e) => setNewAssessment({...newAssessment, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Total Marks</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] outline-none text-gray-900"
                    value={newAssessment.totalMarks}
                    onChange={(e) => setNewAssessment({...newAssessment, totalMarks: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8b5cf6] text-white py-5 rounded-[2rem] font-black text-xl hover:bg-[#7c3aed] transition-all shadow-xl shadow-purple-100 mt-8"
              >
                Publish Assessment
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalIn {
          animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AssessmentsPage;
