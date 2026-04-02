import { useState, useRef, useEffect, useCallback } from "react";
import { useWindows } from "../os/WindowContext";
import hero from "../data/hero";
import about from "../data/about";
import education from "../data/education";
import experiences from "../data/experiences";
import projects from "../data/projects";

/* ── colour helpers rendered via <Line> segments ──────────────────────── */
// Output is plain text; we parse ANSI-like colour tags at render time.
// Tags: <g> green, <b> blue, <y> yellow, <c> cyan, <m> magenta, <r> red, <dim>

const PROMPT_USER = "khang@portfolio";
const PROMPT_PATH = ":~$";

/* ── all commands ─────────────────────────────────────────────────────── */
const buildCommands = (openApp) => ({
  help: () =>
    `<y>KhangOS Terminal v2.0</y> — available commands

  <g>Info</g>
    <c>about</c>        About me
    <c>whoami</c>       One-liner identity
    <c>neofetch</c>     System info card
    <c>banner</c>       ASCII name banner

  <g>Portfolio</g>
    <c>skills</c>       Full tech stack
    <c>experience</c>   Work history
    <c>projects</c>     Project list
    <c>education</c>    Education details
    <c>social</c>       Social links

  <g>Navigation</g>
    <c>open</c> <dim>[app]</dim>    Open an app window
    <c>ls</c>          List apps
    <c>pwd</c>         Print working directory

  <g>Utilities</g>
    <c>echo</c> <dim>[msg]</dim>   Print message
    <c>date</c>        Current date & time
    <c>history</c>     Command history
    <c>clear</c>       Clear terminal`,

  about: () =>
    `<g>${about.greeting}</g>
${about.bio}

${about.details.map((d) => `  <y>${d.label.padEnd(8)}</y> ${d.value}`).join("\n")}`,

  whoami: () =>
    `<g>${hero.firstName} ${hero.lastName}</g> — ${hero.titles.join(" · ")}`,

  skills: () =>
    `<y>Languages</y>
  Python · TypeScript · JavaScript · Rust · Go · Java · C++

<y>Frameworks & Libraries</y>
  React · Next.js · Node.js · FastAPI · Django · Spring Boot · GraphQL · Tailwind

<y>Cloud & DevOps</y>
  AWS · Docker · Kubernetes · Terraform · GitHub Actions · Redis · RabbitMQ

<y>AI / Data</y>
  PyTorch · TensorFlow · LangChain · Vector Search · Embeddings · Claude API`,

  experience: () => {
    const lines = experiences.professional.map(
      (e) =>
        `  <g>${e.title}</g> @ <y>${e.company}</y>
  <dim>${e.period} · ${e.location}</dim>
${e.description.map((d) => `    • ${d}`).join("\n")}`
    );
    return lines.join("\n\n");
  },

  projects: () => {
    const lines = projects.map(
      (p) =>
        `  <c>${p.title}</c>
  <dim>${p.technologies}</dim>
  ${p.description[0]}
  <y>GitHub:</y> ${p.github}`
    );
    return lines.join("\n\n");
  },

  education: () =>
    `<g>${education.university}</g>
  ${education.degree}
  <dim>${education.location}</dim>
  <y>GPA:</y>    ${education.gpa}
  <y>Awards:</y>
${education.awards.map((a) => `    • ${a}`).join("\n")}`,

  social: () =>
    about.socialLinks.map((l) => `  <c>${l.type.padEnd(10)}</c> → <y>${l.href}</y>`).join("\n"),

  neofetch: () =>
    `  <g>██╗  ██╗██╗  ██╗ █████╗ ███╗  ██╗ ██████╗</g>
  <g>██║ ██╔╝██║  ██║██╔══██╗████╗ ██║██╔════╝</g>
  <g>█████╔╝ ███████║███████║██╔██╗██║██║  ███╗</g>
  <g>██╔═██╗ ██╔══██║██╔══██║██║╚████║██║   ██║</g>
  <g>██║  ██╗██║  ██║██║  ██║██║  ███║╚██████╔╝</g>
  <g>╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝ ╚═════╝</g>

  <y>${hero.firstName} ${hero.lastName}</y><dim>@</dim><y>KhangOS</y>
  ${"─".repeat(26)}
  <c>OS</c>         KhangOS Desktop v2.0
  <c>Host</c>       ${hero.firstName} ${hero.lastName}
  <c>Shell</c>      ksh 2.0
  <c>School</c>     University of South Florida
  <c>Major</c>      Computer Science (B.S.)
  <c>GPA</c>        ${education.gpa}
  <c>Focus</c>      Full-Stack & AI/ML
  <c>Theme</c>      Glassmorphism Dark
  <c>Terminal</c>   KhangTerm 2.0
  <c>Runtime</c>    React 19 @ ∞ GHz
  <c>GPU</c>        Three.js r175
  <c>Memory</c>     Framer Motion 12`,

  banner: () =>
    `<g>  ██╗  ██╗██╗  ██╗ █████╗ ███╗  ██╗ ██████╗ </g>
<g>  ██║ ██╔╝██║  ██║██╔══██╗████╗ ██║██╔════╝ </g>
<g>  █████╔╝ ███████║███████║██╔██╗██║██║  ███╗ </g>
<g>  ██╔═██╗ ██╔══██║██╔══██║██║╚████║██║   ██║ </g>
<g>  ██║  ██╗██║  ██║██║  ██║██║  ███║╚██████╔╝ </g>
<g>  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝ ╚═════╝ </g>
             <y>Full-Stack Developer & AI Engineer</y>`,

  pwd: () => `<g>/home/khang/portfolio</g>`,

  ls: () =>
    `<c>about</c>        <c>education</c>    <c>experience</c>   <c>projects</c>
<c>skills</c>       <c>contact</c>      <c>lab</c>          <c>music</c>
<c>terminal</c>     <c>settings</c>     <c>browser</c>`,

  date: () => {
    const now = new Date();
    return `<y>${now.toDateString()}</y>  ${now.toLocaleTimeString()}`;
  },

  open: (args, openAppFn) => {
    const name = args.trim().toLowerCase();
    const valid = ["projects", "experience", "contact", "education", "lab", "music", "about", "settings", "browser", "terminal"];
    if (!name) return `<r>Usage:</r> open <dim>[app]</dim>\n  Apps: ${valid.join(", ")}`;
    if (valid.includes(name)) {
      openAppFn(name);
      return `Opening <g>${name}</g>...`;
    }
    return `<r>open:</r> unknown app '${name}'. Try: ${valid.join(", ")}`;
  },
});

const GREETING = `<g>Welcome to KhangOS Terminal v2.0</g>
Type <y>'help'</y> for available commands.
`;

/* ── coloured line renderer ───────────────────────────────────────────── */
const TAG_MAP = {
  g: "#4ade80",
  b: "#60a5fa",
  y: "#facc15",
  c: "#22d3ee",
  m: "#e879f9",
  r: "#f87171",
  dim: "#6b7280",
};

function ColorLine({ text }) {
  const TAG_RE = /<(g|b|y|c|m|r|dim)>([\s\S]*?)<\/\1>/g;
  const parts = [];
  let last = 0;
  let match;
  while ((match = TAG_RE.exec(text)) !== null) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index), color: null });
    parts.push({ text: match[2], color: TAG_MAP[match[1]] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), color: null });

  return (
    <pre className="whitespace-pre-wrap leading-relaxed" style={{ color: "#d1d5db" }}>
      {parts.map((p, i) =>
        p.color ? (
          <span key={i} style={{ color: p.color }}>
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </pre>
  );
}

/* ── main component ───────────────────────────────────────────────────── */
const ALL_CMDS = [
  "help","about","whoami","skills","experience","projects","education",
  "social","neofetch","banner","pwd","ls","date","open","echo","history","clear",
];

export default function TerminalApp() {
  const { openApp } = useWindows();
  const COMMANDS = buildCommands(openApp);

  const [lines, setLines] = useState([{ type: "output", text: GREETING }]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

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
        setLines([]);
        return;
      } else if (name === "echo") {
        output = args || "";
      } else if (name === "history") {
        output = cmdHistory.length
          ? cmdHistory
              .slice(0, 20)
              .map((c, i) => `  <dim>${String(i + 1).padStart(3)}</dim>  ${c}`)
              .join("\n")
          : "<dim>(no history yet)</dim>";
      } else if (name === "open") {
        output = COMMANDS.open(args, openApp);
      } else if (["projects", "experience", "contact", "education", "lab", "music"].includes(name)) {
        openApp(name);
        output = `Opening <g>${name}</g>...`;
      } else if (COMMANDS[name]) {
        output = COMMANDS[name](args);
      } else {
        output = `<r>ksh: command not found:</r> ${name}\nType <y>'help'</y> to see available commands.`;
      }

      setLines((h) => [
        ...h,
        { type: "input", text: trimmed },
        { type: "output", text: output },
      ]);
    },
    [openApp, cmdHistory, COMMANDS]
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
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input) return;
      const matches = ALL_CMDS.filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setLines((h) => [
          ...h,
          { type: "input", text: input },
          { type: "output", text: matches.map((m) => `<c>${m}</c>`).join("  ") },
        ]);
      }
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setLines((h) => [...h, { type: "input", text: input + "^C" }]);
      setInput("");
    }
  };

  return (
    <div
      className="h-full flex flex-col font-mono text-sm"
      style={{ background: "#0d1117", color: "#e0e0e0" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "input" ? (
              <div className="flex gap-1 mt-1">
                <span style={{ color: "#4ade80" }}>{PROMPT_USER}</span>
                <span style={{ color: "#60a5fa" }}>{PROMPT_PATH}</span>
                <span style={{ color: "#f9fafb" }}>{line.text}</span>
              </div>
            ) : (
              <ColorLine text={line.text} />
            )}
          </div>
        ))}

        {/* Live prompt */}
        <div className="flex items-center mt-1">
          <span style={{ color: "#4ade80" }}>{PROMPT_USER}</span>
          <span style={{ color: "#60a5fa" }} className="mr-1">{PROMPT_PATH}</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-gray-100"
            style={{ caretColor: "#4ade80" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
