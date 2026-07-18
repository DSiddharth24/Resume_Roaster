import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, Trash2, Flame } from "lucide-react";
import { FileData } from "../types";

interface ResumeFormProps {
  onSubmit: (data: { text: string; file: FileData | null }) => void;
}

export default function ResumeForm({ onSubmit }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    if (file.type !== "application/pdf" && file.type !== "text/plain") {
      setError("We currently only support PDF and TXT files for direct roasting. Alternatively, copy & paste your resume text in the other tab!");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("File size exceeds 8MB. Please use a smaller file or copy-paste your text.");
      return;
    }

    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Get base64 content
      const base64String = result.split(",")[1];
      setFileBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "paste") {
      if (pastedText.trim().length < 50) {
        setError("Your pasted resume looks a bit too short to be roasted. Please paste at least a couple of job descriptions or bullet points.");
        return;
      }
      onSubmit({ text: pastedText, file: null });
    } else {
      if (!selectedFile || !fileBase64) {
        setError("Please upload a resume file (PDF or TXT) first, or switch to the Paste Text tab.");
        return;
      }
      onSubmit({
        text: "",
        file: {
          name: selectedFile.name,
          mimeType: selectedFile.type,
          base64: fileBase64,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8" id="resume-form">
      {/* Tab Switcher */}
      <div className="flex border-4 border-[#1A1A1A] bg-white p-1 rounded-none shadow-[4px_4px_0px_0px_#1A1A1A]">
        <button
          type="button"
          id="tab-upload"
          onClick={() => {
            setActiveTab("upload");
            setError(null);
          }}
          className={`flex-1 py-3 text-sm font-black font-display uppercase tracking-wider transition-all rounded-none flex items-center justify-center gap-2 ${
            activeTab === "upload"
              ? "bg-[#1A1A1A] text-white shadow-none"
              : "text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-100"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload PDF / TXT
        </button>
        <button
          type="button"
          id="tab-paste"
          onClick={() => {
            setActiveTab("paste");
            setError(null);
          }}
          className={`flex-1 py-3 text-sm font-black font-display uppercase tracking-wider transition-all rounded-none flex items-center justify-center gap-2 ${
            activeTab === "paste"
              ? "bg-[#1A1A1A] text-white shadow-none"
              : "text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-100"
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste Plain Text
        </button>
      </div>

      {/* Tabs Content */}
      <div className="border-4 border-[#1A1A1A] bg-white p-6 rounded-none shadow-[8px_8px_0px_0px_#1A1A1A]">
        {activeTab === "upload" ? (
          <div
            id="drag-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`border-4 border-dashed rounded-none p-8 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[220px] relative ${
              isDragging
                ? "border-[#FF4D00] bg-[#FFFBF0]"
                : "border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-gray-50/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.txt"
              className="hidden"
            />

            {!selectedFile ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-none bg-gray-100 border-2 border-[#1A1A1A] flex items-center justify-center text-gray-700 shadow-[2px_2px_0px_0px_#1A1A1A]">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-black text-lg uppercase tracking-tight text-[#1A1A1A]">
                    Drag & drop your resume here
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Supports PDF or TXT up to 8MB
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-browse-files"
                  className="px-4 py-2 border-2 border-[#1A1A1A] rounded-none font-display font-black uppercase text-xs text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 w-full max-w-md mx-auto">
                <div className="mx-auto w-14 h-14 rounded-none bg-[#EDF7ED] border-2 border-[#1A1A1A] flex items-center justify-center text-[#107C41] shadow-[2px_2px_0px_0px_#1A1A1A]">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <span className="font-display font-black text-base text-[#1A1A1A] truncate max-w-xs uppercase tracking-tight">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    id="btn-remove-file"
                    onClick={removeFile}
                    className="flex items-center gap-1 px-3 py-1.5 border-2 border-red-600 bg-red-50 text-red-600 rounded-none font-display font-bold uppercase text-xs hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove File
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="pasted-resume-textarea" className="font-display font-black text-sm uppercase tracking-wider text-[#1A1A1A]">
              Paste your resume text
            </label>
            <textarea
              id="pasted-resume-textarea"
              placeholder="Paste your entire resume here, including work history, summary, skills, etc..."
              value={pastedText}
              onChange={handleTextChange}
              rows={10}
              className="w-full border-4 border-[#1A1A1A] rounded-none p-4 font-mono text-sm text-[#1A1A1A] focus:bg-[#FFFBF0] outline-none transition-all placeholder:text-gray-400"
            />
            <div className="flex justify-between text-xs font-mono text-gray-500">
              <span>{pastedText.trim().length} characters</span>
              <span>Min. recommended: 200 chars</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2.5 p-4 border-4 border-red-500 bg-red-50 text-red-700 rounded-none shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]" id="form-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
        </div>
      )}

      {/* Warning block - humorous touch */}
      <div className="p-5 bg-[#FFFBF0] border-4 border-dashed border-[#1A1A1A]/40 rounded-none text-xs text-[#1A1A1A] space-y-2 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
        <span className="font-black font-display uppercase tracking-widest text-[#FF4D00] flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 fill-[#FF4D00]" />
          Disclaimer & Warning
        </span>
        <p className="font-sans leading-relaxed font-medium">
          This feedback is generated by an elite, no-nonsense virtual recruiter. It is blunt, direct, and witty.
          Its purpose is to make you rewrite passive phrasing, quantify achievements, and stop using words like "synergy".
          It is highly useful, but don't take it personally. Your worth is not defined by a recruiter's 6-second attention span.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="btn-roast-resume"
        className="w-full py-4.5 bg-[#FF4D00] text-white hover:bg-[#D43D21] active:translate-y-1 font-display font-black uppercase text-xl rounded-none transition-all border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A] flex items-center justify-center gap-2 group cursor-pointer tracking-wider"
      >
        <Flame className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
        Roast My Resume
      </button>
    </form>
  );
}
