"use client"

import { useEffect, useState, Suspense, lazy } from "react"

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import StarfieldBg from "./components/backgrounds/StarfieldBg"
import AuroraBg from "./components/backgrounds/AuroraBg"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import ScrollProgress from "./components/ui/ScrollProgress"
import CustomCursor from "./components/ui/CustomCursor"
import MiniPlayer from "./components/ui/MiniPlayer"
import ContactChat from "./components/ui/ContactChat"

// ── Lazy-loaded page components (code splitting) ────────────────────────────
const Hero = lazy(() => import("./pages/Hero"))
const About = lazy(() => import("./pages/About"))
const Experience = lazy(() => import("./pages/Experience"))
const Projects = lazy(() => import("./pages/Projects"))
const Skills = lazy(() => import("./pages/Skills"))
const Lab = lazy(() => import("./pages/Lab"))

// ── Page loading fallback ───────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)] border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

// ── Transition presets ──────────────────────────────────────────────────────
const transitionPresets = {
  Fade: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.3, ease: "easeIn" } },
  },
  Slide: {
    initial: { opacity: 0, x: 80, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -60, filter: "blur(4px)", transition: { duration: 0.3, ease: "easeIn" } },
  },
  Zoom: {
    initial: { opacity: 0, scale: 0.92, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 1.05, filter: "blur(6px)", transition: { duration: 0.3, ease: "easeIn" } },
  },
}

// ── Page transition wrapper ──────────────────────────────────────────────────
function PageWrapper({ children, transitionStyle }) {
  const variants = transitionPresets[transitionStyle] || transitionPresets.Fade
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

// ── Animated routes ──────────────────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation()
  const [transitionStyle, setTransitionStyle] = useState("Fade")

  // Read transition preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("page-transition")
    if (saved && transitionPresets[saved]) {
      setTransitionStyle(saved)
    }

    // Listen for changes (from SettingsPanel)
    const handleStorage = () => {
      const val = localStorage.getItem("page-transition")
      if (val && transitionPresets[val]) setTransitionStyle(val)
    }
    window.addEventListener("storage", handleStorage)

    // Also poll for same-tab changes
    const interval = setInterval(() => {
      const val = localStorage.getItem("page-transition")
      if (val && val !== transitionStyle && transitionPresets[val]) {
        setTransitionStyle(val)
      }
    }, 500)

    return () => {
      window.removeEventListener("storage", handleStorage)
      clearInterval(interval)
    }
  }, [transitionStyle])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper transitionStyle={transitionStyle}><Hero /><About /></PageWrapper>
          } />
          <Route path="/experience" element={
            <PageWrapper transitionStyle={transitionStyle}><Experience /></PageWrapper>
          } />
          <Route path="/projects" element={
            <PageWrapper transitionStyle={transitionStyle}><Projects /></PageWrapper>
          } />
          <Route path="/skills" element={
            <PageWrapper transitionStyle={transitionStyle}><Skills /></PageWrapper>
          } />
          <Route path="/lab" element={
            <PageWrapper transitionStyle={transitionStyle}><Lab /></PageWrapper>
          } />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-black text-[var(--color-text)] min-h-screen transition-colors duration-300">
        <StarfieldBg />
        <AuroraBg />
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <MiniPlayer />
        <ContactChat />
      </div>
    </Router>
  )
}

export default App
