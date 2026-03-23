import { FileText, Download, ExternalLink } from "lucide-react";

export default function ResumeApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 gap-6"
      style={{ background: "var(--color-surface)" }}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--color-primary)" }}>
        <FileText className="w-10 h-10 text-white" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Resume</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          View or download my resume
        </p>
      </div>
      <div className="flex gap-3">
        <a
          href="/CaresLink - AI Recruitment.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium
                     hover:brightness-110 transition"
        >
          <ExternalLink className="w-4 h-4" />
          View PDF
        </a>
        <a
          href="/CaresLink - AI Recruitment.pdf"
          download
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)]
                     text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-primary)]/10 transition"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  );
}
