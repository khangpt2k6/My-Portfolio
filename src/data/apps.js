/**
 * App Registry — single source of truth for all desktop apps
 * Sizes are clamped dynamically by WindowContext to fit the MacBook screen
 */
import {
  AboutIcon, ProjectsIcon, ExperienceIcon, SkillsIcon, MailIcon,
  TerminalIcon, LabIcon, SettingsIcon, MusicIcon, ResumeIcon, EducationIcon,
} from "../os/AppIcons";

const apps = [
  {
    id: "about",
    title: "About Me",
    IconComponent: AboutIcon,
    defaultSize: { w: 520, h: 360 },
    dockOrder: 1,
    desktopRow: 0,
    desktopCol: 0,
  },
  {
    id: "projects",
    title: "Projects",
    IconComponent: ProjectsIcon,
    defaultSize: { w: 600, h: 420 },
    dockOrder: 2,
    desktopRow: 1,
    desktopCol: 0,
  },
  {
    id: "experience",
    title: "Experience",
    IconComponent: ExperienceIcon,
    defaultSize: { w: 560, h: 400 },
    dockOrder: 3,
    desktopRow: 2,
    desktopCol: 0,
  },
  {
    id: "skills",
    title: "Skills",
    IconComponent: SkillsIcon,
    defaultSize: { w: 580, h: 360 },
    dockOrder: 4,
    desktopRow: 3,
    desktopCol: 0,
  },
  {
    id: "contact",
    title: "Mail",
    IconComponent: MailIcon,
    defaultSize: { w: 460, h: 360 },
    dockOrder: 5,
    desktopRow: 4,
    desktopCol: 0,
  },
  {
    id: "education",
    title: "Education",
    IconComponent: EducationIcon,
    defaultSize: { w: 500, h: 360 },
    dockOrder: 6,
    desktopRow: 0,
    desktopCol: 1,
  },
  {
    id: "terminal",
    title: "Terminal",
    IconComponent: TerminalIcon,
    defaultSize: { w: 480, h: 320 },
    dockOrder: 7,
    desktopRow: 1,
    desktopCol: 1,
  },
  {
    id: "lab",
    title: "Lab",
    IconComponent: LabIcon,
    defaultSize: { w: 640, h: 440 },
    dockOrder: 8,
    desktopRow: 2,
    desktopCol: 1,
  },
  {
    id: "music",
    title: "Music",
    IconComponent: MusicIcon,
    defaultSize: { w: 300, h: 400 },
    dockOrder: 9,
    desktopRow: 3,
    desktopCol: 1,
  },
  {
    id: "settings",
    title: "Settings",
    IconComponent: SettingsIcon,
    defaultSize: { w: 400, h: 340 },
    dockOrder: 10,
    desktopRow: 4,
    desktopCol: 1,
  },
  {
    id: "resume",
    title: "Resume",
    IconComponent: ResumeIcon,
    defaultSize: { w: 420, h: 440 },
    dockOrder: 11,
    desktopRow: 5,
    desktopCol: 0,
  },
];

export default apps;
