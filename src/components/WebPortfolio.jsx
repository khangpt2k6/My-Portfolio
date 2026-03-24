import { BrowserRouter, Routes, Route } from "react-router-dom";
import StarfieldBg from "./backgrounds/StarfieldBg";
import AuroraBg from "./backgrounds/AuroraBg";
import CustomCursor from "./ui/CustomCursor";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Hero from "../pages/Hero";
import About from "../pages/About";
import Experience from "../pages/Experience";
import Projects from "../pages/Projects";
import Skills from "../pages/Skills";
import Contact from "../pages/Contact";
import Lab from "../pages/Lab";

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}

export default function WebPortfolio() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[var(--color-bg)]">
        <StarfieldBg />
        <AuroraBg />
        <CustomCursor />
        <Navbar />
        <div className="relative z-10">
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lab" element={<Lab />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
