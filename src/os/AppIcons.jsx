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
  return <ImgIcon src="/contact_real.webp" alt="Mail" size={size} />;
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

export function ResumeIcon({ size = 52 }) {
  return <ImgIcon src="/notes-2025-11-13.webp" alt="Resume" size={size} />;
}
