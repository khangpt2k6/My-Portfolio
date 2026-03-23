import { useState, useRef, useEffect, useCallback } from "react";
import { useWindows } from "../os/WindowContext";
import hero from "../data/hero";
import about from "../data/about";

const COMMANDS = {
  help: () =>
    `Available commands:
  help        Show this help
  about       About me
  skills      My tech stack
  projects    Open projects window
  experience  Open experience window
  contact     Open contact window
  education   Open education window
  lab         Open the lab
  music       Open music player
  social      My social links
  clear       Clear terminal
  whoami      Who am I?
  neofetch    System info
  echo [msg]  Echo a message`,

  about: () =>
    `${about.greeting}
${about.bio}

${about.details.map((d) => `  ${d.label}: ${d.value}`).join("\n")}`,

  skills: () =>
    `Languages:    Python, TypeScript, Rust, Go, JavaScript, Java, C++
Frameworks:   React, Next.js, Node.js, FastAPI, Django, GraphQL, Tailwind
Cloud:        AWS, Docker, Kubernetes, Terraform, Git, GitHub Actions
Data & AI:    PostgreSQL, MongoDB, Redis, PyTorch, TensorFlow, LangChain`,

  social: () =>
    about.socialLinks
      .map((l) => `  ${l.type.padEnd(10)} → ${l.href}`)
      .join("\n"),

  whoami: () => `${hero.firstName} ${hero.lastName} — ${hero.titles[0]}`,

  neofetch: () =>
    `  ╔═══════════════════════╗
  ║   KhangOS v1.0.0     ║
  ╚═══════════════════════╝
  OS:       KhangOS Desktop
  Host:     ${hero.firstName} ${hero.lastName}
  Shell:    ksh 1.0
  Theme:    Glassmorphism
  Terminal: KhangTerm
  CPU:      React 19 @ ∞ GHz
  GPU:      Three.js r175
  Memory:   Framer Motion 12`,
};

const GREETING = `Welcome to KhangOS Terminal v1.0
Type 'help' for available commands.\n`;

export default function TerminalApp() {
  const { openApp } = useWindows();
  const [history, setHistory] = useState([{ type: "output", text: GREETING }]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const exec = useCallback(
    (cmd) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      setCmdHistory((h) => [trimmed, ...h]);
      setHistIdx(-1);

      const parts = trimmed.split(/\s+/);
      const name = parts[0].toLowerCase();
      const args = parts.slice(1).join(" ");

      let output;
      if (name === "clear") {
        setHistory([]);
        return;
      } else if (name === "echo") {
        output = args || "";
      } else if (["projects", "experience", "contact", "education", "lab", "music"].includes(name)) {
        openApp(name);
        output = `Opening ${name}...`;
      } else if (COMMANDS[name]) {
        output = COMMANDS[name](args);
      } else {
        output = `ksh: command not found: ${name}. Type 'help' for commands.`;
      }

      setHistory((h) => [
        ...h,
        { type: "input", text: trimmed },
        { type: "output", text: output },
      ]);
    },
    [openApp]
  );

  const onKey = (e) => {
    if (e.key === "Enter") {
      exec(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const next = Math.min(histIdx + 1, cmdHistory.length - 1);
        setHistIdx(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        setHistIdx(histIdx - 1);
        setInput(cmdHistory[histIdx - 1]);
      } else {
        setHistIdx(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col font-mono text-sm"
      style={{ background: "#1a1a2e", color: "#e0e0e0" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-1">
        {history.map((line, i) => (
          <div key={i}>
            {line.type === "input" ? (
              <div>
                <span className="text-green-400">khang@portfolio</span>
                <span className="text-blue-400">:~$ </span>
                <span>{line.text}</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-gray-300">{line.text}</pre>
            )}
          </div>
        ))}

        {/* Current prompt */}
        <div className="flex items-center">
          <span className="text-green-400">khang@portfolio</span>
          <span className="text-blue-400">:~$ </span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none caret-green-400 text-gray-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
