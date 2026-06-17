import { Show, SignInButton, useUser } from '@clerk/react';
import ChatResume from './ChatResume';
import UploadForm from './UploadResume';
import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [verify, setVerify] = useState(false);
  const PORT = import.meta.env.VITE_BACKEND_PORT;

  useEffect(() => {
    if (isSignedIn) getVerify();
  }, [user]);

  const getVerify = async () => {
    try {
      const res = await axios.get(`${PORT}/api/user/verify/${user?.id}`);
      if (res.data.message === 'user id is not found.') {
        setVerify(false);
        return;
      }
      setVerify(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
        <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Sign in to continue</h2>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Create an account or sign in to access your resume assistant
        </p>
        <Show when="signed-out" >
          <SignInButton  />
        </Show>
        {/* <button className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          Sign in
        </button> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-950 px-4 py-12">

      {/* Status badge */}
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-400 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Resume AI Assistant
      </span>

      {/* Greeting */}
      <h1 className="text-3xl font-semibold text-white tracking-tight mb-1">
        Welcome back, {user?.firstName} 👋
      </h1>
      <p className="text-slate-400 text-sm mb-10">
        {verify
          ? 'Pick up where you left off with your resume'
          : 'Upload your resume to get AI-powered feedback'}
      </p>

      {/* Main content */}
      <div className="w-full max-w-lg">
        {user?.id && verify ? (
          <ChatResume />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {/* Card header */}
            <div className="flex items-start gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-violet-950 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-0.5">Upload your resume</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get instant ATS scoring, feedback, and AI-powered rewrites
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-800 mb-5" />

            <UploadForm />
          </div>
        )}
      </div>

      {/* Feature pills — only shown before upload */}
      {!verify && (
        <div className="grid grid-cols-2 gap-2.5 mt-6 w-full max-w-lg">
          {[
            { icon: '✦', label: 'ATS scoring', desc: 'Ranked against job descriptions' },
            { icon: '✦', label: 'Chat & refine', desc: 'Improve any section in real time' },
            { icon: '✦', label: 'Smart rewrites', desc: 'Impact-driven bullet points' },
            { icon: '✦', label: 'Export ready', desc: 'Download as DOCX or PDF' },
          ].map((f) => (
            <div key={f.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <p className="text-violet-400 text-xs mb-1">{f.icon}</p>
              <p className="text-xs font-medium text-white mb-0.5">{f.label}</p>
              <p className="text-xs text-slate-500 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;