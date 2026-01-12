
import React, { useState } from 'react';
import { User, Course } from '../types';
// Add missing import for ICONS
import { ICONS } from '../constants';

interface CertificatesPageProps {
  user: User;
  courses: Course[];
  onNavigate: () => void;
}

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  grade: string;
  verificationCode: string;
}

const CertificatesPage: React.FC<CertificatesPageProps> = ({ user, courses, onNavigate }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // STRICT RULE: Only issue certificates for courses that are exactly 100% complete
  const completedCourses = courses.filter(c => c.progress === 100);
  
  const certificates: Certificate[] = completedCourses.map(course => ({
    id: `CERT-${course.id}-${course.title.substring(0, 3).toUpperCase()}`,
    courseTitle: course.title,
    issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    grade: 'PASS', // Could be dynamic based on assessment scores
    verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
  }));

  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Your Credentials</h2>
          <p className="text-gray-500 font-medium">Verified professional certifications earned through 100% course completion.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
           <div className="px-6 py-2 bg-amber-50 rounded-xl text-center">
             <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Total Earned</p>
             <p className="text-xl font-black text-amber-700">{certificates.length}</p>
           </div>
           <div className="px-6 py-2 bg-purple-50 rounded-xl text-center">
             <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Status</p>
             <p className="text-sm font-black text-purple-700">{certificates.length > 0 ? 'Certified' : 'Learning'}</p>
           </div>
        </div>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
              <div className="w-full aspect-video bg-gray-50 rounded-3xl mb-6 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-amber-200 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent"></div>
                <div className="relative z-10 text-center px-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Professional Certificate</h4>
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{cert.courseTitle}</p>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{cert.courseTitle}</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issued On</span>
                    <span className="text-xs font-bold text-gray-600">{cert.issueDate}</span>
                  </div>
                  <div className="w-px h-6 bg-gray-100"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verify ID</span>
                    <span className="text-xs font-mono font-bold text-[#8b5cf6]">{cert.verificationCode}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCert(cert)}
                className="w-full py-4 bg-gray-50 hover:bg-[#8b5cf6] hover:text-white text-[#8b5cf6] rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
              >
                View Certificate
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 flex flex-col items-center">
           <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
             <svg className="w-12 h-12 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
           </div>
           <h3 className="text-2xl font-black text-gray-900 mb-2">No certificates yet</h3>
           <p className="text-gray-500 max-w-sm mb-10 font-medium">Certificates are issued automatically once you complete 100% of a course's curriculum.</p>
           <button 
             onClick={onNavigate}
             className="px-10 py-4 bg-[#8b5cf6] text-white rounded-2xl font-black shadow-xl shadow-purple-200 hover:scale-105 transition-all"
           >
             Finish an Active Course
           </button>
        </div>
      )}

      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl animate-fadeIn"
            onClick={() => setSelectedCert(null)}
          ></div>
          <div className="bg-white rounded-[2rem] w-full max-w-4xl relative z-10 shadow-2xl p-2 animate-modalIn overflow-hidden">
            <div className="border-8 border-double border-amber-100 rounded-[1.5rem] p-12 relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 -ml-20 -mb-20"></div>
               
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-lg">
                      <ICONS.Course className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-left">
                      <h1 className="text-2xl font-black text-gray-900 tracking-tighter">LUMINA LEARN</h1>
                      <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.3em]">Verified Achievement</p>
                    </div>
                  </div>

                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.5em] mb-12">Certificate of Completion</h2>
                  
                  <p className="text-gray-500 font-medium mb-2 italic">This is to certify that</p>
                  <h3 className="text-5xl font-black text-gray-900 mb-8 font-serif">{user.name}</h3>
                  
                  <p className="text-gray-500 font-medium max-w-lg mb-8">
                    has successfully completed all requirements for the professional course in 
                  </p>
                  <h4 className="text-3xl font-bold text-[#8b5cf6] mb-16">{selectedCert.courseTitle}</h4>

                  <div className="w-full flex justify-between items-end px-12">
                     <div className="text-center">
                        <div className="w-40 h-px bg-gray-300 mb-4"></div>
                        <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Faculty Board</p>
                        <p className="text-[10px] text-gray-400 font-bold">Authorized Signature</p>
                     </div>

                     <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-amber-200 flex items-center justify-center relative">
                           <div className="absolute inset-2 border-2 border-amber-100 rounded-full animate-pulse"></div>
                           <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                           </svg>
                        </div>
                     </div>

                     <div className="text-center">
                        <div className="w-40 h-px bg-gray-300 mb-4"></div>
                        <p className="text-xs font-black text-gray-800 uppercase tracking-widest">{selectedCert.issueDate}</p>
                        <p className="text-[10px] text-gray-400 font-bold">Issue Date</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="p-8 flex justify-between items-center bg-gray-50 rounded-b-[1.5rem]">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification ID</span>
                  <span className="text-xs font-mono font-bold text-gray-600">{selectedCert.verificationCode}</span>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setSelectedCert(null)} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Close</button>
                  <button className="px-8 py-3 bg-[#8b5cf6] text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-[#7c3aed] transition-all">Download PDF</button>
               </div>
            </div>
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

export default CertificatesPage;
