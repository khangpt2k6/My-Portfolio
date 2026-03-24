import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Plus,
  X,
  Star,
  Search,
  Globe,
} from "lucide-react";

const favicon = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const BOOKMARKS = [
  { name: "Google", url: "https://www.google.com/webhp?igu=1", domain: "google.com" },
  { name: "Wikipedia", url: "https://en.m.wikipedia.org/wiki/Main_Page", domain: "wikipedia.org" },
  { name: "GitHub", url: "https://github.com/khangphan2204", domain: "github.com" },
  { name: "MDN Docs", url: "https://developer.mozilla.org/en-US/", domain: "developer.mozilla.org" },
  { name: "YouTube", url: "https://www.youtube.com/embed", domain: "youtube.com" },
  { name: "Reddit", url: "https://old.reddit.com", domain: "reddit.com" },
];

const START_PAGE_SHORTCUTS = [
  { name: "Google", url: "https://www.google.com/webhp?igu=1", domain: "google.com", color: "#4285F4" },
  { name: "GitHub", url: "https://github.com/khangphan2204", domain: "github.com", color: "#24292e" },
  { name: "Wikipedia", url: "https://en.m.wikipedia.org/wiki/Main_Page", domain: "wikipedia.org", color: "#f5f5f5" },
  { name: "YouTube", url: "https://www.youtube.com/embed", domain: "youtube.com", color: "#FF0000" },
  { name: "MDN", url: "https://developer.mozilla.org/en-US/", domain: "developer.mozilla.org", color: "#1B1B1B" },
  { name: "Reddit", url: "https://old.reddit.com", domain: "reddit.com", color: "#FF4500" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", domain: "stackoverflow.com", color: "#F48024" },
  { name: "LinkedIn", url: "https://www.linkedin.com", domain: "linkedin.com", color: "#0A66C2" },
];

export default function BrowserApp() {
  const [tabs, setTabs] = useState([
    { id: 1, title: "Start Page", url: "", isStart: true },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [addressInput, setAddressInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const iframeRef = useRef(null);
  const nextTabId = useRef(2);

  const currentTab = tabs.find((t) => t.id === activeTab);

  useEffect(() => {
    if (currentTab) {
      setAddressInput(currentTab.isStart ? "" : currentTab.url);
    }
  }, [activeTab, currentTab?.url]);

  const normalizeUrl = (input) => {
    let url = input.trim();
    if (!url) return "";
    if (url.match(/^[a-zA-Z]+:\/\//)) return url;
    if (url.includes(".") && !url.includes(" ")) return `https://${url}`;
    return `https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`;
  };

  const navigateTo = useCallback(
    (url) => {
      const normalized = normalizeUrl(url);
      if (!normalized) return;

      setIframeError(false);
      setIsLoading(true);

      const domain = (() => {
        try {
          return new URL(normalized).hostname.replace("www.", "");
        } catch {
          return normalized;
        }
      })();

      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab
            ? { ...t, url: normalized, title: domain, isStart: false }
            : t
        )
      );
      setAddressInput(normalized);

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(normalized);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [activeTab, historyIndex]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateTo(addressInput);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const url = history[newIndex];
      setHistoryIndex(newIndex);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab ? { ...t, url, title: t.title } : t
        )
      );
      setAddressInput(url);
      setIframeError(false);
      setIsLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const url = history[newIndex];
      setHistoryIndex(newIndex);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab ? { ...t, url, title: t.title } : t
        )
      );
      setAddressInput(url);
      setIframeError(false);
      setIsLoading(true);
    }
  };

  const refresh = () => {
    if (iframeRef.current && currentTab?.url) {
      setIsLoading(true);
      setIframeError(false);
      iframeRef.current.src = currentTab.url;
    }
  };

  const addTab = () => {
    const id = nextTabId.current++;
    setTabs((prev) => [...prev, { id, title: "Start Page", url: "", isStart: true }]);
    setActiveTab(id);
    setAddressInput("");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    const idx = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      const next = newTabs[Math.min(idx, newTabs.length - 1)];
      setActiveTab(next.id);
    }
  };

  const handleIframeLoad = () => setIsLoading(false);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* ── Tab bar ── */}
      <div
        className="flex items-center gap-0.5 px-2 pt-1.5 pb-0 min-h-[34px] overflow-x-auto"
        style={{
          background: "var(--color-surface2)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[11px] font-medium cursor-pointer max-w-[160px] min-w-[80px] relative transition-colors"
            style={{
              background:
                tab.id === activeTab
                  ? "var(--color-surface)"
                  : "transparent",
              color:
                tab.id === activeTab
                  ? "var(--color-text)"
                  : "var(--color-text-muted)",
              borderBottom:
                tab.id === activeTab
                  ? "1px solid var(--color-surface)"
                  : "none",
              marginBottom: -1,
            }}
          >
            {tab.url && !tab.isStart ? (
              <img
                src={favicon((() => { try { return new URL(tab.url).hostname; } catch { return ""; } })())}
                alt=""
                className="w-3 h-3 rounded-sm flex-shrink-0"
                draggable={false}
              />
            ) : (
              <Globe size={10} className="flex-shrink-0 opacity-50" />
            )}
            <span className="truncate flex-1">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-0.5 rounded hover:bg-[var(--color-text)]/10"
              >
                <X size={10} />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-1 rounded hover:bg-[var(--color-text)]/10 transition-colors flex-shrink-0"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Plus size={12} />
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div
        className="flex items-center gap-1.5 px-2 py-1.5"
        style={{ borderBottom: "1px solid var(--glass-border)" }}
      >
        {/* Nav buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-md transition-colors disabled:opacity-25"
            style={{ color: "var(--color-text)" }}
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-md transition-colors disabled:opacity-25"
            style={{ color: "var(--color-text)" }}
          >
            <ArrowRight size={14} />
          </button>
          <button
            onClick={refresh}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--color-text)]/10"
            style={{ color: "var(--color-text-muted)" }}
          >
            <RotateCw size={12} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Address bar */}
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px]"
            style={{
              background: "var(--color-surface2)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {currentTab?.url && !currentTab.isStart ? (
              <Lock size={10} className="text-green-500 flex-shrink-0" />
            ) : (
              <Search
                size={10}
                className="flex-shrink-0"
                style={{ color: "var(--color-text-muted)" }}
              />
            )}
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Search or enter website URL"
              className="flex-1 bg-transparent outline-none text-[12px]"
              style={{ color: "var(--color-text)" }}
              spellCheck={false}
            />
          </div>
          {/* Loading bar */}
          {isLoading && (
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] rounded-full"
              style={{ background: "var(--color-primary)" }}
              initial={{ width: "0%" }}
              animate={{ width: "80%" }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          )}
        </form>
      </div>

      {/* ── Bookmarks bar ── */}
      <div
        className="flex items-center gap-1 px-3 py-1 overflow-x-auto"
        style={{
          borderBottom: "1px solid var(--glass-border)",
          background: "var(--color-surface)",
        }}
      >
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.name}
            onClick={() => navigateTo(bm.url)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap hover:bg-[var(--color-text)]/8 transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            <img
              src={favicon(bm.domain)}
              alt=""
              className="w-3.5 h-3.5 rounded-sm"
              draggable={false}
            />
            <span>{bm.name}</span>
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 relative overflow-hidden">
        {currentTab?.isStart ? (
          /* Start Page */
          <div
            className="h-full flex flex-col items-center justify-center p-8"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, var(--color-surface2), var(--color-surface))",
            }}
          >
            <div className="mb-8 text-center">
              <img
                src="/browser.png"
                alt="Safari"
                className="w-14 h-14 mx-auto mb-3 rounded-2xl"
                draggable={false}
              />
              <h2
                className="text-xl font-bold mb-1"
                style={{ color: "var(--color-text)" }}
              >
                Safari
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Search or enter a website
              </p>
            </div>

            {/* Search box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigateTo(addressInput);
              }}
              className="w-full max-w-[320px] mb-8"
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{
                  background: "var(--color-surface2)",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Search
                  size={14}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="Search or enter website URL"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--color-text)" }}
                  autoFocus
                />
              </div>
            </form>

            {/* Favorites grid */}
            <div className="grid grid-cols-4 gap-3 max-w-[340px]">
              {START_PAGE_SHORTCUTS.map((site) => (
                <button
                  key={site.name}
                  onClick={() => navigateTo(site.url)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:bg-[var(--color-text)]/8 hover:scale-105"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{ background: site.color }}
                  >
                    <img
                      src={favicon(site.domain)}
                      alt={site.name}
                      className="w-6 h-6"
                      draggable={false}
                    />
                  </div>
                  <span
                    className="text-[9px] font-medium truncate w-full text-center"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {site.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Iframe content */
          <>
            {iframeError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
                style={{ background: "var(--color-surface)" }}
              >
                <Globe
                  size={48}
                  className="mb-4"
                  style={{ color: "var(--color-text-muted)", opacity: 0.3 }}
                />
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  Can't Open This Page
                </p>
                <p
                  className="text-xs mb-4 text-center max-w-[280px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  This website doesn't allow being displayed in embedded frames.
                  Try a different site.
                </p>
                <button
                  onClick={() => {
                    setIframeError(false);
                    setTabs((prev) =>
                      prev.map((t) =>
                        t.id === activeTab
                          ? { ...t, url: "", title: "Start Page", isStart: true }
                          : t
                      )
                    );
                    setAddressInput("");
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: "var(--color-primary)" }}
                >
                  Go to Start Page
                </button>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={currentTab?.url || ""}
              className="w-full h-full border-0"
              style={{ background: "#fff" }}
              onLoad={handleIframeLoad}
              onError={() => {
                setIsLoading(false);
                setIframeError(true);
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
              title="Browser"
            />
          </>
        )}
      </div>
    </div>
  );
}
