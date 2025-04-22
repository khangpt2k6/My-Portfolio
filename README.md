<div class="tech-stack-container">
  <h1 class="explosive-title">TECH STACK</h1>
  <div class="tech-stack">
    <span class="tech-word react-word">React</span>
    <span class="separator">+</span>
    <span class="tech-word vite-word">Vite</span>
    <span class="separator">+</span>
    <span class="tech-word tailwind-word">TailwindCSS</span>
    <span class="separator">+</span>
    <span class="tech-word gemini-word">Gemini API</span>
  </div>
</div>

<style>
  @keyframes explode {
    0% { transform: scale(0.1); opacity: 0; }
    50% { transform: scale(1.5); opacity: 1; }
    100% { transform: scale(1); }
  }
  
  @keyframes colorPulse {
    0% { text-shadow: 0 0 5px currentColor; }
    50% { text-shadow: 0 0 20px currentColor; }
    100% { text-shadow: 0 0 5px currentColor; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .tech-stack-container {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-radius: 1rem;
  }
  
  .explosive-title {
    font-size: 3rem;
    background: linear-gradient(90deg, #ff8a00, #e52e71);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: explode 1s ease-out, colorPulse 2s infinite;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .tech-stack {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 2rem;
    font-weight: bold;
  }
  
  .tech-word {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    animation: float 3s ease-in-out infinite;
  }
  
  .react-word {
    color: #61dafb;
    animation-delay: 0.1s;
  }
  
  .vite-word {
    color: #ffd028;
    animation-delay: 0.3s;
  }
  
  .tailwind-word {
    color: #38bdf8;
    animation-delay: 0.5s;
  }
  
  .gemini-word {
    color: #ff6b00;
    animation-delay: 0.7s;
  }
  
  .separator {
    color: #94a3b8;
    animation: colorPulse 3s infinite;
  }
  
  /* Hover effects */
  .tech-word:hover {
    transform: scale(1.1);
    transition: all 0.3s ease;
  }
  
  .react-word:hover {
    background: rgba(97, 218, 251, 0.1);
  }
  
  .vite-word:hover {
    background: rgba(255, 208, 40, 0.1);
  }
  
  .tailwind-word:hover {
    background: rgba(56, 189, 248, 0.1);
  }
  
  .gemini-word:hover {
    background: rgba(255, 107, 0, 0.1);
  }
</style>
