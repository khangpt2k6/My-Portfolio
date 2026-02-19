"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import StarfieldBg from "./components/StarfieldBg"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Education from "./components/Education"
import Footer from "./components/Footer"

// ── Page transition wrapper ──────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: "easeIn" } },
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
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

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageWrapper><Hero /></PageWrapper>
        } />
        <Route path="/experience" element={
          <PageWrapper><Experience /></PageWrapper>
        } />
        <Route path="/projects" element={
          <PageWrapper><Projects /></PageWrapper>
        } />
        <Route path="/skills" element={
          <PageWrapper><Skills /></PageWrapper>
        } />
        <Route path="/education" element={
          <PageWrapper><Education /></PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
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
        <CustomCursor />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  )
}

export default App
