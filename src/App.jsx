"use client"

import { useState, useEffect } from "react"
import StarfieldBg from "./components/backgrounds/StarfieldBg"
import AuroraBg from "./components/backgrounds/AuroraBg"
import CustomCursor from "./components/ui/CustomCursor"
import { WindowProvider, useWindows } from "./os/WindowContext"
import Window from "./os/Window"
import Desktop from "./os/Desktop"
import Dock from "./os/Dock"
import MenuBar from "./os/MenuBar"
import BootScreen from "./os/BootScreen"
import MacBookFrame from "./os/MacBookFrame"
import MobileOS from "./os/MobileOS"
import apps from "./data/apps"

// ── App components ──
import AboutApp from "./apps/AboutApp"
import ProjectsApp from "./apps/ProjectsApp"
import ExperienceApp from "./apps/ExperienceApp"
import SkillsApp from "./apps/SkillsApp"
import ContactApp from "./apps/ContactApp"
import EducationApp from "./apps/EducationApp"
import TerminalApp from "./apps/TerminalApp"
import LabApp from "./apps/LabApp"
import MusicApp from "./apps/MusicApp"
import SettingsApp from "./apps/SettingsApp"
import ResumeApp from "./apps/ResumeApp"

const appComponents = {
  about: AboutApp,
  projects: ProjectsApp,
  experience: ExperienceApp,
  skills: SkillsApp,
  contact: ContactApp,
  education: EducationApp,
  terminal: TerminalApp,
  lab: LabApp,
  music: MusicApp,
  settings: SettingsApp,
  resume: ResumeApp,
}

// ── Responsive hook ──
function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setMobile(e.matches)
    mq.addEventListener("change", handler)
    setMobile(mq.matches)
    return () => mq.removeEventListener("change", handler)
  }, [breakpoint])
  return mobile
}

// ── Wallpaper hook ──
function useWallpaper() {
  const [wp, setWp] = useState(() => localStorage.getItem("wallpaper") || "dynamic")
  useEffect(() => {
    const handler = () => setWp(localStorage.getItem("wallpaper") || "dynamic")
    window.addEventListener("wallpaper-change", handler)
    return () => window.removeEventListener("wallpaper-change", handler)
  }, [])
  return wp
}

// ── Desktop OS (rendered inside MacBook screen) ──
function DesktopScreen() {
  const wallpaperId = useWallpaper()
  const wallpaperSrc = wallpaperId !== "dynamic"
    ? (() => {
        const map = {
          bV6xf3: "/desktop_background/bV6xf3.webp",
          sea: "/desktop_background/colourful-textured-background-desktop-sea-600nw-2432936989.webp",
          icH5Aj: "/desktop_background/icH5Aj.webp",
          lake: "/desktop_background/lake-side-trees-live-desktop-jwhxpov3u0jdebb0.jpg",
          nature: "/desktop_background/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-free-photo.jpg",
          landscape: "/desktop_background/stunning-high-resolution-nature-and-landscape-backgrounds-breathtaking-scenery-in-hd-free-photo.jpg",
        }
        return map[wallpaperId] || null
      })()
    : null

  return (
    <div id="macbook-screen" className="relative w-full h-full overflow-hidden bg-white dark:bg-transparent">
      {/* Wallpaper — static image or animated backgrounds */}
      {wallpaperSrc ? (
        <img
          src={wallpaperSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <>
          <StarfieldBg />
          <AuroraBg />
        </>
      )}

      <MenuBar />
      <Desktop />
      {/* Render all windows */}
      {apps.map((app) => {
        const Component = appComponents[app.id]
        if (!Component) return null
        return (
          <Window key={app.id} id={app.id} title={app.title}>
            <Component />
          </Window>
        )
      })}
      <Dock />
    </div>
  )
}

// ── Main App ──
function App() {
  const [booted, setBooted] = useState(false)
  const isMobile = useIsMobile()

  return (
    <WindowProvider>
      <div className="text-[var(--color-text)] min-h-screen overflow-hidden"
        style={{ background: "#0a0a14" }}>

        {/* Custom cursor (desktop only) */}
        {!isMobile && <CustomCursor />}

        {/* Boot sequence */}
        {!booted && <BootScreen onComplete={() => setBooted(true)} />}

        {/* OS interface */}
        {booted && (
          isMobile ? (
            <div className="relative w-full h-screen bg-white dark:bg-transparent">
              <StarfieldBg />
              <AuroraBg />
              <MobileOS />
            </div>
          ) : (
            <MacBookFrame>
              <DesktopScreen />
            </MacBookFrame>
          )
        )}
      </div>
    </WindowProvider>
  )
}

export default App
