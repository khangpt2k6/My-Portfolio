"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Education from "./components/Education"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import AOS from "aos"
import "aos/dist/aos.css"
import Chatbot from "./components/Chatbot"

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
      <div className="flex items-center justify-center h-screen bg-emerald-50">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <Router>
    <div className="bg-emerald-50 min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <About />
              <Education />
              <Experience />
              <Projects />
              <Skills />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/chatbot" element={<Education />} />
      </Routes>
      <Chatbot />
    </div>
  </Router>
  )
}

export default App
