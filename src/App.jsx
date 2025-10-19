"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Footer from "./components/Footer"
import AOS from "aos"
import "aos/dist/aos.css"

// Custom Cursor Component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [enabled, setEnabled] = useState(false)  // Add this line
  const [isDark, setIsDark] = useState(false)    // Add this line

  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY })
    const updateCursorType = (e) => {
      const target = e.target
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "A" ||
        target.tagName === "BUTTON"
      )
    }

    const mq = window.matchMedia && window.matchMedia('(pointer: fine)')
    const updatePointer = () => setEnabled(mq.matches)
    updatePointer()
    mq?.addEventListener?.('change', updatePointer)

    const updateTheme = () => setIsDark(document.documentElement.classList.contains('dark'))
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseover", updateCursorType)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseover", updateCursorType)
      mq?.removeEventListener?.('change', updatePointer)
      observer.disconnect()
    }
  }, [])

  if (!enabled) return null

  const ringColor = isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.7)'
  const glowColor = isPointer ? 'rgba(22, 163, 74, 0.25)' : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0,0,0,0.08)')
  const innerColor = isDark ? '#ffffff' : '#111111'

  return (
    <>
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Outer glow */}
        <div
          className={`absolute rounded-full transition-all duration-200 ${isPointer ? 'w-11 h-11' : 'w-9 h-9'}`}
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        />
        {/* Middle ring */}
        <div
          className={`absolute rounded-full transition-all duration-150 ${isPointer ? 'w-7 h-7' : 'w-6 h-6'}`}
          style={{
            border: `2px solid ${ringColor}`,
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            boxShadow: isPointer ? `0 0 10px rgba(22,163,74,0.35)` : `0 0 6px ${ringColor}`,
            borderRadius: '9999px',
          }}
        />
        {/* Inner dot */}
        <div
          className={`absolute rounded-full transition-all duration-100 ${isPointer ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'}`}
          style={{
            background: innerColor,
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            boxShadow: isPointer ? '0 0 6px rgba(22,163,74,0.8)' : `0 0 4px ${ringColor}`,
          }}
        />
      </div>
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    })

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen transition-colors">
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