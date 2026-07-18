import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Info, AlertTriangle, Github, Award, Heart } from "lucide-react";
import ResumeForm from "./components/ResumeForm";
import RoastLoader from "./components/RoastLoader";
import RoastResults from "./components/RoastResults";
import { RoastResponse, FileData } from "./types";

export default function App() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [roastData, setRoastData] = useState<RoastResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoastSubmit = async (payload: { text: string; file: FileData | null }) => {
    setStatus("loading");
    setErrorMsg(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process the roast. Please try again.");
      }

      const data: RoastResponse = await response.json();
      setRoastData(data);
      setStatus("success");
    } catch (err: any) {
      console.error("Error roasting resume:", err);
      setErrorMsg(err.message || "An unexpected error occurred. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setRoastData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col selection:bg-[#FF4D00] selection:text-white border-[12px] border-[#1A1A1A]" id="app-container">
      {/* Editorial Header */}
      <header className="border-b-4 border-[#1A1A1A] bg-white sticky top-0 z-40" id="app-header">
        <div className="max-w-5xl mx-auto px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleReset} id="logo-block">
            <div className="w-10 h-10 bg-[#FF4D00] border-2 border-[#1A1A1A] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <span className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tighter text-[#1A1A1A]">
              Resume Roaster
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-amber-50 border-2 border-[#1A1A1A] text-[#1A1A1A] px-3.5 py-1.5 rounded-none hidden sm:inline-flex items-center gap-1.5 font-bold shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse" />
              STATUS: BRUTALLY HONEST
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-8 sm:py-12 flex flex-col justify-center" id="main-content">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-10"
            >
              {/* Hero Presentation */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-[#1A1A1A] tracking-tighter leading-none uppercase">
                  Is your resume actually <span className="text-[#FF4D00]">weak</span>?
                </h1>
                <p className="font-sans text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl mx-auto font-medium">
                  Friends are too nice, and articles are too vague. Let a senior recruiter who has read tens of thousands of resumes give you the brutally honest, funny, and specific feedback you need.
                </p>
              </div>

              {/* The Form Wrapper */}
              <ResumeForm onSubmit={handleRoastSubmit} />
            </motion.div>
          )}

          {status === "loading" && (
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <RoastLoader />
            </motion.div>
          )}

          {status === "success" && roastData && (
            <motion.div
              key="results-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <RoastResults data={roastData} onReset={handleReset} />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl mx-auto border-4 border-[#1A1A1A] bg-[#FFFBF0] p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] space-y-6 text-center"
              id="error-block"
            >
              <div className="w-16 h-16 bg-red-100 border-2 border-[#1A1A1A] rounded-none flex items-center justify-center text-red-600 mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-[#1A1A1A]">
                  Oops, Roast Engine Interrupted!
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed max-w-sm mx-auto font-medium">
                  {errorMsg || "The recruiter ran out of coffee or hit a connection snag. Please check your network and try again."}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border-4 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white font-display font-black text-sm text-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-y-0.5 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Back to Form
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Brutalist Footer with Marquee Ticker */}
      <footer className="h-12 bg-[#1A1A1A] text-white flex items-center overflow-hidden whitespace-nowrap border-t-4 border-[#1A1A1A] select-none" id="app-footer">
        <div className="flex gap-8 animate-marquee font-mono text-xs uppercase tracking-widest font-bold">
          <span>Real Feedback for Real People</span>
          <span className="text-[#FF4D00]">●</span>
          <span>Stop wasting paper</span>
          <span className="text-[#FF4D00]">●</span>
          <span>Your font choice is hurting my eyes</span>
          <span className="text-[#FF4D00]">●</span>
          <span>Achievements &gt; Responsibilities</span>
          <span className="text-[#FF4D00]">●</span>
          <span>Real Feedback for Real People</span>
          <span className="text-[#FF4D00]">●</span>
          <span>Stop wasting paper</span>
          <span className="text-[#FF4D00]">●</span>
          <span>No Participation Trophies Here</span>
          <span className="text-[#FF4D00]">●</span>
          <span>Achievements &gt; Responsibilities</span>
        </div>
      </footer>
    </div>
  );
}

