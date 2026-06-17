import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import axios from "axios";
import { useUser } from "@clerk/react";

type UploadState = "idle" | "uploading" | "success" | "error";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const PORT = import.meta.env.VITE_BACKEND_PORT;
  const { user } = useUser();

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrorMsg("Only PDF files are accepted.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg("File must be under 10 MB.");
      return;
    }
    setErrorMsg("");
    setFile(f);
    setUploadState("idle");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const clearFile = () => {
    setFile(null);
    setUploadState("idle");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!file || !user?.id) return;
    setUploadState("uploading");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("client_id", user.id);

    try {
      await axios.post(`${PORT}/api/user/resume`, formData);
      setUploadState("success");
    } catch (err) {
      console.error(err);
      setUploadState("error");
      setErrorMsg("Upload failed. Please try again.");
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-[1.5px] border-dashed rounded-xl p-10 flex flex-col items-center gap-2 cursor-pointer transition-colors
            ${isDragging
              ? "border-violet-500 bg-violet-50"
              : "border-slate-700 hover:border-violet-500 hover:bg-slate-800/40"
            }`}
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.844 9.095" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-200">
            {isDragging ? "Drop it here" : "Drag & drop your resume"}
          </p>
          <p className="text-xs text-slate-500">or click to browse</p>
          <div className="flex gap-1.5 mt-1">
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-400">PDF</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-400">Max 10 MB</span>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />

      {/* File preview row */}
      {file && uploadState !== "success" && (
        <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-violet-950 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
          </div>
          <button
            onClick={clearFile}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/50 transition-colors"
            aria-label="Remove file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-950/50 border border-red-900 rounded-xl">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
          <p className="text-xs text-red-400">{errorMsg}</p>
        </div>
      )}

      {/* Success */}
      {uploadState === "success" && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-950/50 border border-emerald-900 rounded-xl">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-emerald-400">Resume uploaded — analysing now…</p>
        </div>
      )}

      {/* Submit */}
      {uploadState !== "success" && (
        <button
          onClick={handleSubmit}
          disabled={!file || uploadState === "uploading"}
          className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors
            disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed
            enabled:bg-violet-600 enabled:hover:bg-violet-500 enabled:text-white"
        >
          {uploadState === "uploading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Analyse my resume
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default UploadForm;