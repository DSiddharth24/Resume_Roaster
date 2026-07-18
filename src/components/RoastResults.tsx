import React, { useState } from "react";
import {
  Flame,
  ThumbsUp,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  RefreshCw,
  Share2,
} from "lucide-react";
import { RoastResponse } from "../types";

interface RoastResultsProps {
  data: RoastResponse;
  onReset: () => void;
}

export default function RoastResults({ data, onReset }: RoastResultsProps) {
  const [copiedVerdict, setCopiedVerdict] = useState(false);
  const [copiedRewrites, setCopiedRewrites] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyVerdictToClipboard = () => {
    navigator.clipboard.writeText(`"${data.verdict}" - Roasted by Resume Roaster 🔥`);
    setCopiedVerdict(true);
    setTimeout(() => setCopiedVerdict(false), 2000);
  };

  const copyAllRewrites = () => {
    const textToCopy = data.callouts
      .map((c, i) => `${i + 1}. Before: "${c.original}"\n   After:  "${c.rewrite}"`)
      .join("\n\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedRewrites(true);
    setTimeout(() => setCopiedRewrites(false), 2000);
  };

  const copySingleRewrite = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 py-4" id="roast-results">
      {/* 1. Overall Verdict Section */}
      <section className="space-y-4" id="section-verdict">
        <div className="text-center">
          <span className="font-display text-xs font-black uppercase tracking-widest bg-[#FF4D00] text-white border-2 border-[#1A1A1A] px-4 py-1.5 rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            The Official Verdict
          </span>
        </div>

        <div className="border-4 border-[#1A1A1A] bg-[#FFFBF0] p-6 sm:p-10 rounded-none shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] text-center relative overflow-hidden">
          {/* Sarcastic decorative stamp background */}
          <div className="absolute -right-6 -bottom-6 text-[#FF4D00]/5 font-display font-black text-7xl select-none rotate-12 pointer-events-none uppercase">
            REJECTED
          </div>

          <p className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#FF4D00] leading-[1.0] tracking-tighter uppercase mb-2">
            "{data.verdict}"
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={copyVerdictToClipboard}
              id="btn-copy-verdict"
              className="flex items-center gap-2 px-6 py-3 border-4 border-[#1A1A1A] bg-white hover:bg-gray-50 text-xs font-display font-black text-[#1A1A1A] rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider"
            >
              {copiedVerdict ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#107C41]" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#FF4D00]" />
                  Copy & Share Verdict
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. The Six-Second Test Section */}
      <section className="border-4 border-[#1A1A1A] bg-white p-6 sm:p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] space-y-6" id="section-six-second">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-none bg-[#FFFBF0] border-2 border-[#1A1A1A] flex items-center justify-center text-[#FF4D00] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#1A1A1A]">
                The Six-Second Recruiter Glance Test
              </h3>
              <p className="text-xs font-mono text-gray-500 uppercase font-bold">
                How your resume actually registers in a fleeting moment of attention.
              </p>
            </div>
          </div>
        </div>

        {/* Sensory Attention Meter scale */}
        <div className="space-y-4">
          <div className="bg-[#FFFBF0] border-2 border-[#1A1A1A] rounded-none p-5 sm:p-6 text-base font-semibold italic text-[#1A1A1A] leading-relaxed relative shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <div className="font-display font-black uppercase tracking-wider text-xs text-[#FF4D00] mb-3 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse" />
              Recruiter's Stream of Consciousness:
            </div>
            "{data.sixSecondTest}"
          </div>

          {/* Attention Timeline Visual */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[10px] font-mono text-gray-600 font-bold uppercase">
              <span>0s (Opened Document)</span>
              <span>2s (Header Glanced)</span>
              <span>4s (Yawn Threshold)</span>
              <span>6s (Bin / Interview Decision)</span>
            </div>
            <div className="h-3 bg-gray-100 border-2 border-[#1A1A1A] rounded-none overflow-hidden flex">
              <div className="w-1/3 bg-red-500 h-full border-r-2 border-[#1A1A1A]" />
              <div className="w-1/3 bg-[#FF4D00] h-full border-r-2 border-[#1A1A1A]" />
              <div className="w-1/3 bg-amber-500 h-full" />
            </div>
            <p className="text-[11px] font-mono font-bold text-gray-500 text-center italic uppercase">
              Recruiter attention drops exponentially after 4.2 seconds. Keep key accomplishments at the top.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Handful of Specific Callouts (Before / After Contrast) */}
      <section className="space-y-6" id="section-callouts">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-[#1A1A1A]">
              Surgical Resume Roasts ({data.callouts.length})
            </h3>
            <p className="text-sm font-sans font-medium text-gray-600">
              These are the exact sections holding your professional history hostage. Click any rewrite to copy.
            </p>
          </div>
          <button
            onClick={copyAllRewrites}
            id="btn-copy-all"
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-none text-xs font-display font-black uppercase tracking-wider text-gray-700 transition-colors bg-white cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5"
          >
            {copiedRewrites ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                Copied All!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#FF4D00]" />
                Copy All Rewrites
              </>
            )}
          </button>
        </div>

        <div className="space-y-8">
          {data.callouts.map((callout, idx) => (
            <div
              key={idx}
              className="border-4 border-[#1A1A1A] bg-white rounded-none shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] overflow-hidden flex flex-col"
              id={`callout-${idx}`}
            >
              {/* Card Header */}
              <div className="border-b-4 border-[#1A1A1A] bg-[#FFFBF0] px-5 py-3.5 flex justify-between items-center">
                <span className="font-display font-black text-xs uppercase tracking-widest text-[#1A1A1A]">
                  DEFECT #{idx + 1}
                </span>
                <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 border-2 border-red-200 px-2.5 py-0.5 rounded-none">
                  Weak Fluff
                </span>
              </div>

              {/* Contrast grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-4 divide-[#1A1A1A]">
                {/* Before Column */}
                <div className="p-5 space-y-4 bg-red-50/15 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-red-600">
                      <span className="w-2 h-2 rounded-none bg-red-500 border border-[#1A1A1A]" />
                      Original Phrasing:
                    </span>
                    <blockquote className="font-mono text-xs text-gray-700 border-l-4 border-red-500 bg-red-50 p-3 leading-relaxed py-2 select-all break-words">
                      "{callout.original}"
                    </blockquote>
                  </div>

                  {/* Sarcastic description */}
                  <div className="pt-4 border-t-2 border-dashed border-[#1A1A1A]/10 space-y-1">
                    <span className="font-display font-black text-xs uppercase tracking-tight text-[#1A1A1A] block">
                      Why it fails:
                    </span>
                    <p className="text-xs font-sans font-medium text-gray-600 leading-relaxed">
                      {callout.issue}
                    </p>
                  </div>
                </div>

                {/* After Column */}
                <div className="p-5 space-y-4 bg-green-50/15 flex flex-col justify-between relative">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-green-700">
                      <span className="w-2 h-2 rounded-none bg-green-500 border border-[#1A1A1A]" />
                      High-Impact Rewrite:
                    </span>
                    <blockquote className="font-sans text-sm font-bold text-gray-800 leading-relaxed bg-green-50 border-l-4 border-green-500 p-3 relative group">
                      "{callout.rewrite}"
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t-2 border-dashed border-[#1A1A1A]/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">
                      Quantifiable & Active
                    </span>
                    <button
                      onClick={() => copySingleRewrite(callout.rewrite, idx)}
                      id={`btn-copy-rewrite-${idx}`}
                      className="flex items-center gap-1 px-3 py-1.5 border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white bg-white text-[10px] font-display font-black uppercase tracking-wider text-gray-700 transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#FF4D00]" />
                          Copy rewrite
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. One Genuine, Specific Compliment */}
      <section className="border-4 border-[#1A1A1A] bg-[#EEF2FF] p-6 sm:p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] space-y-4" id="section-compliment">
        <div className="flex items-center gap-3 text-blue-700">
          <div className="w-10 h-10 bg-blue-600 border-2 border-[#1A1A1A] flex items-center justify-center text-white text-xl font-bold shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">★</div>
          <h4 className="font-display font-black text-lg sm:text-xl uppercase tracking-tighter">
            The One Good Thing
          </h4>
        </div>
        <p className="font-sans font-bold italic text-[#1A1A1A] text-base leading-relaxed pl-1.5">
          {data.compliment}
        </p>
      </section>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t-4 border-[#1A1A1A] pt-8">
        <p className="text-xs font-mono font-bold uppercase text-gray-500">
          Update these points in your resume document to instantly level up!
        </p>
        <button
          onClick={onReset}
          id="btn-roast-another"
          className="flex items-center justify-center gap-2 px-8 py-4 border-4 border-[#1A1A1A] bg-[#FF4D00] hover:bg-white text-white hover:text-[#1A1A1A] font-display font-black uppercase text-sm rounded-none shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] hover:shadow-none transition-all active:translate-y-1 cursor-pointer tracking-wider"
        >
          <RefreshCw className="w-4 h-4" />
          Roast Another Resume
        </button>
      </div>
    </div>
  );
}
