/**
 * macOS-style app icons — each is a detailed SVG inside a rounded square.
 * These replace the simple lucide line icons.
 */

/* ── About Me — Contact Card ── */
export function AboutIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="about-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#7C6CF6" />
          <stop offset="100%" stopColor="#5046E5" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#about-bg)" />
      <rect x="4" y="4" width="44" height="44" rx="8" fill="white" fillOpacity="0.12" />
      {/* Person silhouette */}
      <circle cx="26" cy="20" r="7" fill="white" fillOpacity="0.9" />
      <path d="M14 40c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

/* ── Projects — Blue Folder ── */
export function ProjectsIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="folder-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#5AC8FA" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#folder-bg)" />
      {/* Folder back */}
      <path d="M10 18c0-2 1.5-3.5 3.5-3.5h7l3 3.5H39c1.93 0 3.5 1.57 3.5 3.5v15c0 1.93-1.57 3.5-3.5 3.5H13c-1.93 0-3-1.57-3-3.5V18z" fill="white" fillOpacity="0.3" />
      {/* Folder front */}
      <rect x="9" y="20" width="34" height="20" rx="3" fill="white" fillOpacity="0.9" />
      <rect x="9" y="20" width="34" height="6" rx="3" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

/* ── Experience — Briefcase ── */
export function ExperienceIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="exp-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#FFD60A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#exp-bg)" />
      {/* Briefcase */}
      <rect x="10" y="18" width="32" height="22" rx="4" fill="white" fillOpacity="0.9" />
      <path d="M20 18v-3c0-1.66 1.34-3 3-3h6c1.66 0 3 1.34 3 3v3" stroke="white" strokeOpacity="0.5" strokeWidth="2" fill="none" />
      <rect x="10" y="26" width="32" height="3" fill="white" fillOpacity="0.3" />
      <circle cx="26" cy="27.5" r="2.5" fill="url(#exp-bg)" />
    </svg>
  );
}

/* ── Skills — Code Terminal ── */
export function SkillsIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="skills-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#skills-bg)" />
      {/* Code brackets */}
      <path d="M18 17l-8 9 8 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.9" fill="none" />
      <path d="M34 17l8 9-8 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.9" fill="none" />
      <line x1="29" y1="14" x2="23" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ── Mail — Envelope ── */
export function MailIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="mail-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#mail-bg)" />
      {/* Envelope body */}
      <rect x="8" y="15" width="36" height="24" rx="4" fill="white" fillOpacity="0.9" />
      {/* Envelope flap */}
      <path d="M8 18l18 11 18-11" stroke="url(#mail-bg)" strokeWidth="2.5" fill="none" />
      <path d="M8 15l18 13 18-13" fill="white" fillOpacity="0.3" />
    </svg>
  );
}

/* ── Education — Graduation Cap ── */
export function EducationIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="edu-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#edu-bg)" />
      {/* Cap */}
      <polygon points="26,13 8,23 26,33 44,23" fill="white" fillOpacity="0.9" />
      {/* Tassel line */}
      <line x1="38" y1="23" x2="38" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <circle cx="38" cy="37" r="2" fill="white" opacity="0.8" />
      {/* Body */}
      <path d="M16 26v8c0 3 4.5 6 10 6s10-3 10-6v-8" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.2" />
    </svg>
  );
}

/* ── Terminal ── */
export function TerminalIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="term-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#term-bg)" />
      {/* Screen background */}
      <rect x="6" y="6" width="40" height="40" rx="6" fill="black" fillOpacity="0.5" />
      {/* Prompt */}
      <path d="M14 20l6 6-6 6" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="24" y1="32" x2="36" y2="32" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ── Lab — Flask ── */
export function LabIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="lab-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#lab-bg)" />
      {/* Flask */}
      <path d="M20 10h12v12l8 18c1 2-0.5 4-3 4H15c-2.5 0-4-2-3-4l8-18V10z" fill="white" fillOpacity="0.9" />
      <rect x="18" y="9" width="16" height="3" rx="1.5" fill="white" fillOpacity="0.6" />
      {/* Liquid */}
      <path d="M16 34c2-2 5 1 10 0s8 2 10 0l1.5 4c1 2-0.5 4-3 4H15c-2.5 0-4-2-3-4z" fill="url(#lab-bg)" fillOpacity="0.6" />
      {/* Bubbles */}
      <circle cx="23" cy="36" r="1.5" fill="white" fillOpacity="0.5" />
      <circle cx="29" cy="33" r="1" fill="white" fillOpacity="0.4" />
    </svg>
  );
}

/* ── Music ── */
export function MusicIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="music-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#music-bg)" />
      {/* Music notes */}
      <path d="M35 12v22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 16v22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="17" cy="38" rx="5" ry="4" fill="white" fillOpacity="0.9" />
      <ellipse cx="31" cy="34" rx="5" ry="4" fill="white" fillOpacity="0.9" />
      <path d="M21 16c0 0 4-3 14-4" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Settings — Gear ── */
export function SettingsIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="set-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#set-bg)" />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="23"
          y="8"
          width="6"
          height="10"
          rx="2"
          fill="white"
          fillOpacity="0.85"
          transform={`rotate(${angle} 26 26)`}
        />
      ))}
      {/* Gear body */}
      <circle cx="26" cy="26" r="10" fill="white" fillOpacity="0.85" />
      <circle cx="26" cy="26" r="5" fill="url(#set-bg)" />
    </svg>
  );
}

/* ── Resume — Document ── */
export function ResumeIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="res-bg" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#res-bg)" />
      {/* Paper */}
      <rect x="12" y="8" width="24" height="36" rx="3" fill="white" fillOpacity="0.9" />
      {/* Folded corner */}
      <path d="M30 8l6 6h-4c-1.1 0-2-0.9-2-2V8z" fill="white" fillOpacity="0.5" />
      {/* Text lines */}
      <rect x="16" y="18" width="16" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.4" />
      <rect x="16" y="23" width="12" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.3" />
      <rect x="16" y="28" width="14" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.3" />
      <rect x="16" y="33" width="10" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.3" />
    </svg>
  );
}
