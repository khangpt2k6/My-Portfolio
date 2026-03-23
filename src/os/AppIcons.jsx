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
  return <ImgIcon src="/finder.webp" alt="About Me" size={size} />;
}

export function ProjectsIcon({ size = 52 }) {
  return <ImgIcon src="/folder-project.webp" alt="Projects" size={size} />;
}

export function ExperienceIcon({ size = 52 }) {
  return <ImgIcon src="/experience_calendar.webp" alt="Experience" size={size} />;
}

export function SkillsIcon({ size = 52 }) {
  return <ImgIcon src="/skills.webp" alt="Skills" size={size} />;
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
  return <ImgIcon src="/lab.webp" alt="Lab" size={size} />;
}

export function MusicIcon({ size = 52 }) {
  return <ImgIcon src="/music-2025-11-13.webp" alt="Music" size={size} />;
}

export function SettingsIcon({ size = 52 }) {
  return <ImgIcon src="/System_Preferences_icon.png" alt="Settings" size={size} />;
}

/* ── Resume — SVG fallback (no image) ── */
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
