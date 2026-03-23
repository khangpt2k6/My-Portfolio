import { ExternalLink } from "lucide-react";

const DRIVE_ID = "1OTQedvOWjBUn2t_mlApj_ounZDDd2Uf9";
const VIEW_URL = `https://drive.google.com/file/d/${DRIVE_ID}/view`;
const EMBED_URL = `https://drive.google.com/file/d/${DRIVE_ID}/preview`;

export default function ResumeApp() {
  return (
    <div className="h-full flex flex-col" style={{ background: "var(--window-bg)" }}>
      {/* Embedded PDF viewer */}
      <div className="flex-1">
        <iframe
          src={EMBED_URL}
          className="w-full h-full border-0"
          allow="autoplay"
          title="Resume"
        />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-center gap-3 px-4 py-2 border-t border-[var(--color-border)]">
        <a
          href={VIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium
                     hover:brightness-110 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in Google Drive
        </a>
      </div>
    </div>
  );
}
