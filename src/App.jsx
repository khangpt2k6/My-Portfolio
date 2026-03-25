"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { AnimatePresence } from "framer-motion"
import StarfieldBg from "./components/backgrounds/StarfieldBg"
import AuroraBg from "./components/backgrounds/AuroraBg"
import CustomCursor from "./components/ui/CustomCursor"
import { WindowProvider } from "./os/WindowContext"
import Window from "./os/Window"
import Desktop from "./os/Desktop"
import Dock from "./os/Dock"
import MenuBar from "./os/MenuBar"
import BootScreen from "./os/BootScreen"
import MacBookFrame from "./os/MacBookFrame"
import MobileOS from "./os/MobileOS"
import ModePicker from "./components/ModePicker"
import ModeSwitchButton from "./components/ModeSwitchButton"
import apps from "./data/apps"

// ── App components ──
import AboutApp from "./apps/AboutApp"
import ProjectsApp from "./apps/ProjectsApp"
import ExperienceApp from "./apps/ExperienceApp"
import SkillsApp from "./apps/SkillsApp"
import ContactApp from "./apps/ContactApp"

import TerminalApp from "./apps/TerminalApp"
import LabApp from "./apps/LabApp"
import MusicApp from "./apps/MusicApp"
import SettingsApp from "./apps/SettingsApp"
import ResumeApp from "./apps/ResumeApp"
import BrowserApp from "./apps/BrowserApp"

const WebPortfolio = lazy(() => import("./components/WebPortfolio"))

const appComponents = {
  about: AboutApp,
  projects: ProjectsApp,
  experience: ExperienceApp,
  skills: SkillsApp,
  contact: ContactApp,
  terminal: TerminalApp,
  lab: LabApp,
  music: MusicApp,
  settings: SettingsApp,
  resume: ResumeApp,
  browser: BrowserApp,
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
  const [wp, setWp] = useState(() => localStorage.getItem("wallpaper") || "default")
  useEffect(() => {
    const handler = () => setWp(localStorage.getItem("wallpaper") || "default")
    window.addEventListener("wallpaper-change", handler)
    return () => window.removeEventListener("wallpaper-change", handler)
  }, [])
  return wp
}

// ── Desktop OS (rendered inside MacBook screen) ──
function DesktopScreen() {
  const wallpaperId = useWallpaper()
  const WALLPAPER_MAP = {
    bV6xf3: "/desktop_background/bV6xf3.webp",
    icH5Aj: "/desktop_background/icH5Aj.webp",
    lake: "/desktop_background/lake-side-trees-live-desktop-jwhxpov3u0jdebb0.jpg",
    default: "/desktop_background/default_background.webp",
    aesthetic: "/desktop_background/aesthetic-wallpaper-1.jpg",
    tsHljX: "/desktop_background/tsHljX.webp",
    wTyWLK: "/desktop_background/wTyWLK.webp",
    wp33: "/desktop_background/wp3305840.jpg",
  }
  const wallpaperSrc = WALLPAPER_MAP[wallpaperId] || WALLPAPER_MAP["default"]

  return (
    <div id="macbook-screen" className="relative w-full h-full overflow-hidden bg-white dark:bg-transparent">
      {/* Wallpaper — static image or animated backgrounds */}
      <img
        src={wallpaperSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

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

// ── Desktop OS mode (with boot + frame) ──
function DesktopMode() {
  const [booted, setBooted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isMobile = useIsMobile()

  // Escape key to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    const handler = (e) => { if (e.key === "Escape") setIsFullscreen(false) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isFullscreen])

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
          ) : isFullscreen ? (
            <div className="relative w-full h-screen">
              <DesktopScreen />
              {/* Exit fullscreen button */}
              <motion.button
                onClick={() => setIsFullscreen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed top-1 right-3 z-[9999] p-1.5 rounded-lg cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(0,0,0,0.3)",
                }}
                title="Exit fullscreen (Esc)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </motion.button>
            </div>
          ) : (
            <MacBookFrame onFullscreen={() => setIsFullscreen(true)}>
              <DesktopScreen />
            </MacBookFrame>
          )
        )}
      </div>
    </WindowProvider>
  )
}

// ── Main App ──
function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("portfolio-mode") || null
  })

  const handleSelectMode = (selected) => {
    localStorage.setItem("portfolio-mode", selected)
    setMode(selected)
  }

  const handleSwitch = () => {
    const next = mode === "desktop" ? "web" : "desktop"
    localStorage.setItem("portfolio-mode", next)
    // Clear boot session so desktop re-boots on switch back
    if (next === "web") sessionStorage.removeItem("os-booted")
    setMode(next)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!mode && <ModePicker key="picker" onSelect={handleSelectMode} />}
      </AnimatePresence>

      {mode === "desktop" && <DesktopMode />}

      {mode === "web" && (
        <Suspense fallback={
          <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0a14" }}>
            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <WebPortfolio />
        </Suspense>
      )}

      {mode && <ModeSwitchButton currentMode={mode} onSwitch={handleSwitch} />}
    </>
  )
}

export default App
