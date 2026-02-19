"use client"

import { useEffect, useState, Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import StarfieldBg from "./components/StarfieldBg"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollProgress from "./components/ScrollProgress"
import MiniPlayer from "./components/MiniPlayer"
import ContactChat from "./components/ContactChat"

// ── Lazy-loaded page components (code splitting) ────────────────────────────
const Hero = lazy(() => import("./components/Hero"))
const Experience = lazy(() => import("./components/Experience"))
const Projects = lazy(() => import("./components/Projects"))
const Skills = lazy(() => import("./components/Skills"))
const Education = lazy(() => import("./components/Education"))

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
            <PageWrapper transitionStyle={transitionStyle}><Hero /></PageWrapper>
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
          <Route path="/education" element={
            <PageWrapper transitionStyle={transitionStyle}><Education /></PageWrapper>
          } />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

// ── Custom Cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 })

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(pointer: fine)')
    if (!mq?.matches) return

    const updatePosition = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener("mousemove", updatePosition)
    return () => window.removeEventListener("mousemove", updatePosition)
  }, [cursorX, cursorY])

  const hasFinePointer = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(pointer: fine)').matches

  if (!hasFinePointer) return null

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full border-2 border-[var(--color-primary)] opacity-50"
        style={{ left: springX, top: springY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"
        style={{ left: cursorX, top: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <style>{`@media (pointer: fine) { * { cursor: none !important; } }`}</style>
    </>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <div className="bg-white dark:bg-black text-[var(--color-text)] min-h-screen transition-colors duration-300">
        <StarfieldBg />
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
