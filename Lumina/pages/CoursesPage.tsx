
import React, { useState, useMemo, useRef } from 'react';
import { ICONS } from '../constants';
import { User, UserRole, Course, Lesson } from '../types';

interface CoursesPageProps {
  user: User;
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ user, courses, onUpdateCourses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedInstructor, setSelectedInstructor] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  // Form State for new courses
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
    instructorName: user.role === UserRole.INSTRUCTOR ? user.name : '',
    image: null as string | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const cats = new Set(courses.map(c => c.category));
    return ['All', ...Array.from(cats)];
  }, [courses]);

  const instructors = useMemo(() => {
    const insts = new Set(courses.map(c => c.instructorName));
    return ['All', ...Array.from(insts)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesInstructor = selectedInstructor === 'All' || course.instructorName === selectedInstructor;
      
      return matchesSearch && matchesCategory && matchesInstructor;
    });
  }, [searchQuery, selectedCategory, selectedInstructor, courses]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewCourse({ ...newCourse, image: url });
    }
  };

  const calculateProgress = (lessons: Lesson[] = []) => {
    if (lessons.length === 0) return 0;
    const completed = lessons.filter(l => l.isCompleted).length;
    return Math.round((completed / lessons.length) * 100);
  };

  const handleEnroll = (courseId: string) => {
    if (user.role !== UserRole.STUDENT) return;
    setEnrollingId(courseId);
    setTimeout(() => {
      const updated = courses.map(c => c.id === courseId ? { ...c, enrolled: true, progress: 0 } : c);
      onUpdateCourses(updated);
      setEnrollingId(null);
    }, 1200);
  };

  const toggleLessonCompletion = (courseId: string, lessonId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedLessons = (course.lessons || []).map(lesson => 
          lesson.id === lessonId ? { ...lesson, isCompleted: !lesson.isCompleted } : lesson
        );
        const newProgress = calculateProgress(updatedLessons);
        const updatedCourse = { ...course, lessons: updatedLessons, progress: newProgress };
        
        if (selectedCourseDetails?.id === courseId) {
          setSelectedCourseDetails(updatedCourse);
        }
        return updatedCourse;
      }
      return course;
    });
    onUpdateCourses(updatedCourses);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const createdCourse: Course = {
        id: Math.random().toString(36).substr(2, 9),
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category || 'General',
        instructorId: user.id,
        instructorName: newCourse.instructorName || user.name,
        progress: 0,
        enrolled: false,
        image: newCourse.image || `https://picsum.photos/seed/${Math.random()}/400/250`,
        lessons: [
          { id: 'l1', title: 'Introduction', duration: '10m', isCompleted: false },
          { id: 'l2', title: 'Deep Dive', duration: '30m', isCompleted: false },
        ]
      };
      onUpdateCourses([createdCourse, ...courses]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setNewCourse({ title: '', description: '', category: '', instructorName: user.role === UserRole.INSTRUCTOR ? user.name : '', image: null });
    }, 1000);
  };

  const isAuthorized = user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN;

  return (
    <div className="space-y-8 animate-fadeIn relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Course Catalog</h2>
          <p className="text-gray-500 font-medium">Explore and manage your educational journey.</p>
        </div>
        {isAuthorized && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#8b5cf6] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#7c3aed] transition-all shadow-xl shadow-purple-200 flex items-center gap-3 group"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Create New Course
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pl-14 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none"
            />
            <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest absolute -top-2 left-4 bg-white px-1">Instructor</label>
               <select 
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="bg-gray-50 border-none rounded-2xl px-6 py-4 pr-10 appearance-none focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none text-gray-700 font-medium"
               >
                 {instructors.map(inst => (
                   <option key={inst} value={inst}>{inst}</option>
                 ))}
               </select>
               <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-200' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isEnrolling = enrollingId === course.id;
            const isEnrolled = course.enrolled;
            const isComplete = course.progress === 100;
            
            return (
              <div key={course.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 group flex flex-col h-full relative">
                {isComplete && (
                   <div className="absolute top-4 right-4 z-20 pointer-events-none">
                      <div className="bg-amber-400 text-white p-2 rounded-xl shadow-lg animate-bounce">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                   </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#8b5cf6] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                      {course.category}
                    </span>
                  </div>
                  {isEnrolled && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100">
                      <div className={`h-full transition-all duration-700 ease-out ${isComplete ? 'bg-green-500' : 'bg-[#8b5cf6]'}`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#8b5cf6] text-[10px] font-bold">
                      {course.instructorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-bold text-gray-500">{course.instructorName}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#8b5cf6] transition-colors">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {isEnrolled ? 'Current Progress' : 'Duration'}
                      </span>
                      <span className={`text-sm font-black ${isEnrolled ? (isComplete ? 'text-green-600' : 'text-[#8b5cf6]') : 'text-gray-900'}`}>
                        {isEnrolled ? `${course.progress}%` : '12 Lessons'}
                      </span>
                    </div>

                    {user.role === UserRole.STUDENT ? (
                      isEnrolled ? (
                        <button 
                          onClick={() => setSelectedCourseDetails(course)}
                          className={`${isComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-[#8b5cf6] hover:bg-[#7c3aed]'} text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg`}
                        >
                          {isComplete ? 'Review Course' : 'Continue Learning'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleEnroll(course.id)}
                          disabled={isEnrolling}
                          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${
                            isEnrolling 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                              : 'bg-purple-50 text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white shadow-purple-100'
                          }`}
                        >
                          {isEnrolling ? (
                            <>
                              <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                              Enrolling...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Enroll Now
                            </>
                          )}
                        </button>
                      )
                    ) : (
                      <button 
                        onClick={() => setSelectedCourseDetails(course)}
                        className="bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-200"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No courses found</h3>
          <p className="text-gray-500 max-w-md">Try adjusting your search or category selection.</p>
        </div>
      )}

      {selectedCourseDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedCourseDetails(null)}
          ></div>
          <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl animate-modalIn flex flex-col">
            <div className="relative h-64 shrink-0">
               <img src={selectedCourseDetails.image} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               <button 
                onClick={() => setSelectedCourseDetails(null)}
                className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all"
               >
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
               <div className="absolute bottom-8 left-10 text-white pr-20">
                 <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest mb-3 inline-block">
                   {selectedCourseDetails.category}
                 </span>
                 <h3 className="text-4xl font-black mb-2">{selectedCourseDetails.title}</h3>
                 <p className="text-white/80 font-medium">with {selectedCourseDetails.instructorName}</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                  <div>
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Course Description</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">{selectedCourseDetails.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Curriculum</h4>
                      <span className={`text-sm font-bold ${selectedCourseDetails.progress === 100 ? 'text-green-600' : 'text-[#8b5cf6]'}`}>
                        {selectedCourseDetails.lessons?.filter(l => l.isCompleted).length} / {selectedCourseDetails.lessons?.length} Completed
                      </span>
                    </div>
                    <div className="space-y-4">
                      {selectedCourseDetails.lessons?.map((lesson, idx) => (
                        <div 
                          key={lesson.id} 
                          className={`flex items-center gap-6 p-6 rounded-3xl border transition-all ${
                            lesson.isCompleted ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-transparent hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black ${
                            lesson.isCompleted ? 'bg-green-500 text-white' : 'bg-white text-gray-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className={`font-bold text-lg ${lesson.isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                              {lesson.title}
                            </h5>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lesson.duration}</span>
                          </div>
                          {user.role === UserRole.STUDENT && (
                            <button 
                              onClick={() => toggleLessonCompletion(selectedCourseDetails.id, lesson.id)}
                              className={`p-3 rounded-xl transition-all ${
                                lesson.isCompleted 
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                                  : 'bg-white text-gray-300 hover:text-[#8b5cf6] hover:bg-purple-50'
                              }`}
                            >
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Your Progress</h4>
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="transparent" />
                        <circle
                          cx="64" cy="64" r="56" stroke={selectedCourseDetails.progress === 100 ? '#10b981' : '#8b5cf6'}
                          strokeWidth="12" fill="transparent"
                          strokeDasharray={351.8}
                          strokeDashoffset={351.8 - (351.8 * selectedCourseDetails.progress) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-900">{selectedCourseDetails.progress}%</span>
                      </div>
                    </div>
                    <p className={`text-center text-sm font-bold ${selectedCourseDetails.progress === 100 ? 'text-green-600' : 'text-gray-500'}`}>
                      {selectedCourseDetails.progress === 100 ? 'Course Completed! 🎊' : 'Keep going, you\'re doing great!'}
                    </p>
                    {selectedCourseDetails.progress === 100 && (
                       <p className="text-[10px] text-center mt-2 text-green-500 font-black uppercase tracking-widest">Certificate Available!</p>
                    )}
                  </div>

                  <div className="bg-[#8b5cf6] text-white rounded-3xl p-8 shadow-xl shadow-purple-200">
                    <h4 className="font-bold text-xl mb-4">Study Group</h4>
                    <p className="text-white/80 text-sm mb-6 leading-relaxed">Join 1,240 other students learning this topic right now.</p>
                    <button className="w-full bg-white text-[#8b5cf6] py-3 rounded-2xl font-bold hover:bg-purple-50 transition-all">
                      Enter Chat Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl p-8 md:p-12 animate-modalIn">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-black text-gray-900">New Course</h3>
                <p className="text-gray-500 font-medium">Design a new learning experience.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-48 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                  newCourse.image ? 'border-transparent' : 'border-gray-200 hover:border-purple-300 bg-gray-50 hover:bg-purple-50'
                }`}
              >
                {newCourse.image ? (
                  <>
                    <img src={newCourse.image} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold bg-[#8b5cf6] px-6 py-2 rounded-xl">Change Banner</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3">
                      <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-sm font-bold text-gray-500">Upload Course Banner</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  required type="text" value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Course Title"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none"
                />
                <input
                  required type="text" value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  placeholder="Category"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none"
                />
              </div>

              <textarea
                required rows={4} value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                placeholder="Description"
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#8b5cf6] transition-all outline-none resize-none"
              />

              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-[#8b5cf6] text-white py-5 rounded-[2rem] font-black text-xl hover:bg-[#7c3aed] transition-all shadow-xl shadow-purple-200 disabled:opacity-70 mt-8"
              >
                {isSubmitting ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : 'Publish Course'}
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

export default CoursesPage;
