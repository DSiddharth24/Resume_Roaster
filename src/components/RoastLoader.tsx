import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Flame, Eye, Search, AlertCircle, RefreshCw } from "lucide-react";

const STAGES = [
  {
    title: "Ingesting Document Structure",
    comment: "Parsing boundaries... formatting looks a bit templatey.",
    duration: 2200,
  },
  {
    title: "Analyzing Buzzword Concentration",
    comment: "Warning: High concentrations of 'synergy' and 'passionate' detected.",
    duration: 2500,
  },
  {
    title: "Simulating Recruiter Attention Span",
    comment: "Glancing over... Aaaaand they've already checked their phone.",
    duration: 2500,
  },
  {
    title: "Evaluating Action Verbs",
    comment: "Found 'managed'. Found 'led'. Let's see if there are actual achievements.",
    duration: 2300,
  },
  {
    title: "Calculating Total Fluff Index",
    comment: "Fluff volume exceeds safe industry limits. Calibrating sarcasm levels.",
    duration: 2400,
  },
  {
    title: "Formulating Brutal But Helpful Truths",
    comment: "Sharpening the virtual red pen. Prepare yourself.",
    duration: 2000,
  },
];

const TICKER_MESSAGES = [
  "Oh god, is that Comic Sans or just Arial?",
  "Calculating milliseconds until recruiter yawns...",
  "Searching for actual quantitative results... 0 found.",
  "Replacing 'responsible for' with 'passive observer of' internally...",
  "Brewing fresh, organic sarcasm...",
  "Analyzing if 'motivated self-starter' means 'works without supervision' or 'unemployed'...",
  "Checking for bullet points that read like copies of the job description...",
  "Measuring empty spaces that could hold valuable percentages...",
  "Evaluating font choice... looks like 2012 Microsoft Word defaults.",
  "Cross-referencing buzzwords with standard dictionary of fluff...",
];

export default function RoastLoader() {
  const [currentStage, setCurrentStage] = useState(0);
  const [tickerMsg, setTickerMsg] = useState(TICKER_MESSAGES[0]);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    // Stage controller
    let timeoutId: NodeJS.Timeout;
    const runStages = (index: number) => {
      if (index >= STAGES.length) return;
      
      timeoutId = setTimeout(() => {
        setCompletedStages((prev) => [...prev, index]);
        const nextIndex = index + 1;
        if (nextIndex < STAGES.length) {
          setCurrentStage(nextIndex);
          runStages(nextIndex);
        }
      }, STAGES[index].duration);
    };

    runStages(0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    // Ticker message cycler
    const interval = setInterval(() => {
      const randomMsg = TICKER_MESSAGES[Math.floor(Math.random() * TICKER_MESSAGES.length)];
      setTickerMsg(randomMsg);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 py-8" id="roast-loader">
      {/* Animated Header */}
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 rounded-none bg-[#FFFBF0] border-4 border-[#1A1A1A] flex items-center justify-center text-[#FF4D00] mx-auto shadow-[4px_4px_0px_0px_#1A1A1A]"
          >
            <Flame className="w-8 h-8 fill-[#FF4D00]" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4D00] border-2 border-[#1A1A1A]"
          />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-black text-3xl uppercase tracking-tighter text-[#1A1A1A]">
            Roasting Underway...
          </h2>
          <p className="text-sm font-sans font-medium text-gray-600">
            Our virtual recruiter is currently tearing apart your experience line-by-line.
          </p>
        </div>
      </div>

      {/* Visual scanning container */}
      <div className="border-4 border-[#1A1A1A] bg-white p-6 rounded-none shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden relative">
        {/* Mock paper document */}
        <div className="border-2 border-[#1A1A1A] p-4 rounded-none bg-[#FAF9F6] relative space-y-3">
          {/* Scanning Line */}
          <motion.div
            animate={{
              top: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 right-0 h-2 bg-[#FF4D00]/30 border-y-2 border-[#FF4D00] z-10 pointer-events-none"
          />

          <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
            <div className="h-4 bg-gray-300 rounded-none w-1/3 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded-none w-1/4 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-none w-full animate-pulse" />
            <div className="h-3 bg-gray-200 rounded-none w-5/6 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded-none w-4/5 animate-pulse" />
          </div>
          <div className="pt-2 space-y-2">
            <div className="h-4 bg-gray-300 rounded-none w-1/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded-none w-full animate-pulse" />
            <div className="h-3 bg-[#FFFBF0] rounded-none w-full border-2 border-dashed border-[#FF4D00]/30" />
            <div className="h-3 bg-gray-200 rounded-none w-2/3 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Progress checklist */}
      <div className="border-4 border-[#1A1A1A] bg-white p-6 rounded-none shadow-[8px_8px_0px_0px_#1A1A1A] space-y-4">
        <h3 className="font-display font-black text-sm uppercase tracking-widest text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-2">
          Assessment Checklist
        </h3>

        <div className="space-y-4">
          {STAGES.map((stage, idx) => {
            const isCompleted = completedStages.includes(idx);
            const isActive = currentStage === idx;

            return (
              <div
                key={idx}
                className={`flex gap-3 items-start transition-opacity duration-300 ${
                  isCompleted || isActive ? "opacity-100" : "opacity-45"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-none bg-[#EDF7ED] border-2 border-[#1A1A1A] flex items-center justify-center text-[#107C41]">
                      <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-none border-2 border-[#FF4D00] flex items-center justify-center text-[#FF4D00]">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-none border-2 border-gray-300 flex items-center justify-center text-gray-300" />
                  )}
                </div>

                <div className="flex-1">
                  <p className={`font-display text-base font-bold uppercase tracking-tight ${isActive ? "text-[#FF4D00]" : "text-[#1A1A1A]"}`}>
                    {stage.title}
                  </p>
                  {isActive && (
                    <p className="text-xs text-gray-600 font-mono mt-0.5 animate-pulse">
                      {stage.comment}
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-xs text-gray-400 font-mono mt-0.5 italic">
                      Completed successfully
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruiter thoughts live ticker */}
      <div className="bg-[#1A1A1A] text-[#FAF9F6] p-4 rounded-none shadow-[4px_4px_0px_0px_#FF4D00] font-mono text-xs flex gap-2.5 items-center border-2 border-[#1A1A1A]">
        <span className="text-[#FF4D00] animate-pulse shrink-0 font-bold">● Recruiter Thoughts:</span>
        <span className="truncate">{tickerMsg}</span>
      </div>
    </div>
  );
}
