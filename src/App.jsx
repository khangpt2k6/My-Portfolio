"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Education from "./components/Education"
import Footer from "./components/Footer"

// Custom Cursor Component — framer-motion springs for smooth physics
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

  // Only show on devices with fine pointer
  const hasFinePointer = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(pointer: fine)').matches

  if (!hasFinePointer) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full border-2 border-[var(--color-primary)] opacity-50"
        style={{
          left: springX,
          top: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"
        style={{
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen transition-colors duration-300">
        <CustomCursor />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Experience />
                <Projects />
                <Skills />
                <Education />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
