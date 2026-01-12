import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ICONS } from '../constants';

interface LoginProps {
  onLogin: (user: User, rememberMe: boolean) => void;
}

type AuthState = 'LOGIN' | 'SIGNUP' | 'SUCCESS';
const BACKEND_URL = "http://127.0.0.1:5000"; // Change if needed

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [authState, setAuthState] = useState<AuthState>('LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [branch, setBranch] = useState('');
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    { id: UserRole.STUDENT, label: 'Student', icon: '🎓' },
    { id: UserRole.INSTRUCTOR, label: 'Instructor', icon: '👨‍🏫' },
  ];

  // ---------------- LOGIN ----------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        const loggedInUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role === "student" ? UserRole.STUDENT : UserRole.INSTRUCTOR,
          branch: data.user.branch,
          className: data.user.className,
          avatar: '',
        };
        onLogin(loggedInUser, false);
      } else {
        setError(data.message || "Invalid login");
      }
    } catch (err) {
      setError("Server not reachable. Start Flask backend.");
    }

    setIsLoading(false);
  };

  // ---------------- SIGNUP ----------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: role === UserRole.STUDENT ? "student" : "instructor",
          branch,
          className
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAuthState('SUCCESS');
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server not reachable. Start Flask backend.");
    }

    setIsLoading(false);
  };

  const handleProceedAfterSignup = () => {
    const loggedInUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 4),
      name,
      email,
      role,
      branch: branch || 'General Studies',
      className: className || 'Year 1',
      avatar: '',
    };
    onLogin(loggedInUser, true);
  };

  // ---------------- RENDER ----------------
  if (authState === 'SUCCESS') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2ff] p-4 relative">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-100 via-indigo-50 to-white" />
        <div className="max-w-md w-full relative z-10 text-center animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl border border-white">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Account Created!</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
              Welcome, <span className="text-[#8b5cf6] font-bold">{name}</span>.<br/>
              Role: {role === UserRole.STUDENT ? "Student" : "Instructor"}
            </p>
            <button
              onClick={handleProceedAfterSignup}
              className="w-full bg-[#8b5cf6] text-white py-5 rounded-[2rem] font-black text-xl hover:bg-[#7c3aed] transition-all shadow-xl shadow-purple-100"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#f0f2ff]">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 blur-sm"
        style={{ backgroundImage: "url('https://img.freepik.com/free-vector/gradient-dynamic-blue-lines-background_23-2148995756.jpg?w=1380')" }} />
      
      <div className="max-w-md w-full relative z-10 animate-fadeIn">
        <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl shadow-purple-900/10 border border-white">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-xl shadow-purple-300 mb-6">
              <ICONS.Course className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Lumina Learn</h1>
            <p className="text-gray-400 font-medium mt-1">
              {authState === 'LOGIN' ? 'Direct Access Portal' : 'Join the Learning Revolution'}
            </p>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button onClick={() => { setAuthState('LOGIN'); setError(null); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${authState === 'LOGIN' ? 'bg-white text-[#8b5cf6]' : 'text-gray-400'}`}>
              Sign In
            </button>
            <button onClick={() => { setAuthState('SIGNUP'); setError(null); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${authState === 'SIGNUP' ? 'bg-white text-[#8b5cf6]' : 'text-gray-400'}`}>
              Join Lumina
            </button>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-4">{error}</div>}

          <form onSubmit={authState === 'LOGIN' ? handleLogin : handleSignup} className="space-y-4">
            {authState === 'SIGNUP' && (
              <>
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-50 rounded-2xl px-6 py-4" />

                <div className="flex space-x-2 mb-2">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${role === r.id ? 'bg-[#8b5cf6] text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>

                <input type="text" placeholder="Branch" value={branch} onChange={e => setBranch(e.target.value)} className="w-full bg-gray-50 rounded-2xl px-6 py-4" />
                <input type="text" placeholder="Class" value={className} onChange={e => setClassName(e.target.value)} className="w-full bg-gray-50 rounded-2xl px-6 py-4" />
              </>
            )}

            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-50 rounded-2xl px-6 py-4" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-50 rounded-2xl px-6 py-4" />

            <button type="submit" disabled={isLoading} className="w-full bg-[#8b5cf6] text-white py-5 mt-6 rounded-[2rem] font-black text-xl">
              {isLoading ? "Please wait..." : authState === 'LOGIN' ? 'Sign In' : 'Join Lumina'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
