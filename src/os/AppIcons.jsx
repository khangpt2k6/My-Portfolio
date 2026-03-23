/**
 * macOS-style app icons — real images where available, SVG fallbacks for the rest.
 */

function ImgIcon({ src, alt, size = 52 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-[12px]"
      style={{ width: size, height: size, objectFit: "cover" }}
      draggable={false}
    />
  );
}

/* ── Image-based icons ── */

export function AboutIcon({ size = 52 }) {
  return <ImgIcon src="/about_me.jpg" alt="About Me" size={size} />;
}

export function ProjectsIcon({ size = 52 }) {
  return <ImgIcon src="/MacFolder.webp" alt="Projects" size={size} />;
}

export function MailIcon({ size = 52 }) {
  return <ImgIcon src="/contact.png" alt="Mail" size={size} />;
}

export function EducationIcon({ size = 52 }) {
  return <ImgIcon src="/education.webp" alt="Education" size={size} />;
}

export function TerminalIcon({ size = 52 }) {
  return <ImgIcon src="/terminal.webp" alt="Terminal" size={size} />;
}

export function LabIcon({ size = 52 }) {
  return <ImgIcon src="/activity monitor.webp" alt="Lab" size={size} />;
}

export function SettingsIcon({ size = 52 }) {
  return <ImgIcon src="/System_Preferences_icon.png" alt="Settings" size={size} />;
}

/* ── SVG icons (no image available) ── */

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
      <rect x="10" y="18" width="32" height="22" rx="4" fill="white" fillOpacity="0.9" />
      <path d="M20 18v-3c0-1.66 1.34-3 3-3h6c1.66 0 3 1.34 3 3v3" stroke="white" strokeOpacity="0.5" strokeWidth="2" fill="none" />
      <rect x="10" y="26" width="32" height="3" fill="white" fillOpacity="0.3" />
      <circle cx="26" cy="27.5" r="2.5" fill="url(#exp-bg)" />
    </svg>
  );
}

/* ── Skills — Code Brackets ── */
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
      <path d="M18 17l-8 9 8 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M34 17l8 9-8 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="29" y1="14" x2="23" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
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
      <path d="M35 12v22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 16v22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="17" cy="38" rx="5" ry="4" fill="white" fillOpacity="0.9" />
      <ellipse cx="31" cy="34" rx="5" ry="4" fill="white" fillOpacity="0.9" />
      <path d="M21 16c0 0 4-3 14-4" stroke="white" strokeWidth="3" strokeLinecap="round" />
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
      <rect x="12" y="8" width="24" height="36" rx="3" fill="white" fillOpacity="0.9" />
      <path d="M30 8l6 6h-4c-1.1 0-2-0.9-2-2V8z" fill="white" fillOpacity="0.5" />
      <rect x="16" y="18" width="16" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.4" />
      <rect x="16" y="23" width="12" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.3" />
      <rect x="16" y="28" width="14" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.3" />
      <rect x="16" y="33" width="10" height="2" rx="1" fill="url(#res-bg)" fillOpacity="0.3" />
    </svg>
  );
}
