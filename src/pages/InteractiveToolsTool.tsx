import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useEffect, useRef, useCallback } from "react";

type Tab = "cps" | "typing" | "contrast" | "screen";

const inputClass =
  "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const btnClass =
  "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";
const cardClass = "bg-secondary rounded-lg border border-border p-4";
const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";

// ============================================================
// Click Speed Test
// ============================================================

type CpsState = "idle" | "active" | "done";

function ClickSpeedTest() {
  const [duration, setDuration] = useState(5);
  const [state, setState] = useState<CpsState>("idle");
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bestCps, setBestCps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef(0);

  const durations = [1, 5, 10, 30];

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const handleClick = () => {
    if (state === "done") return;

    if (state === "idle") {
      const end = Date.now() + duration * 1000;
      endRef.current = end;
      setClicks(1);
      setTimeLeft(duration);
      setState("active");

      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (Date.now() >= endRef.current) {
          cleanup();
          setState("done");
        }
      }, 50);
      return;
    }

    setClicks((c) => c + 1);
  };

  const cps = state === "done" ? clicks / duration : 0;
  const rating =
    cps > 14
      ? "Godlike"
      : cps > 10
        ? "Pro"
        : cps > 7
          ? "Fast"
          : cps > 4
            ? "Average"
            : "Slow";

  const reset = () => {
    cleanup();
    if (cps > bestCps) setBestCps(cps);
    setState("idle");
    setClicks(0);
    setTimeLeft(0);
  };

  return (
    <div className="space-y-4">
      {/* Duration selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={labelClass}>Duration:</span>
        {durations.map((d) => (
          <button
            key={d}
            disabled={state !== "idle"}
            onClick={() => setDuration(d)}
            className={`px-3 py-1 rounded-md font-mono text-sm transition-opacity ${
              d === duration
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground border border-border"
            } ${state !== "idle" ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}`}
          >
            {d}s
          </button>
        ))}
      </div>

      {/* Click area */}
      <div
        onClick={handleClick}
        className={`h-48 rounded-lg border-2 flex items-center justify-center cursor-pointer select-none ${
          state === "done"
            ? "bg-primary/10 border-border cursor-default"
            : "bg-primary/10 border-primary/30 active:bg-primary/20"
        }`}
      >
        {state === "idle" && (
          <span className="text-xl font-mono text-foreground">Click to Start</span>
        )}
        {state === "active" && (
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-foreground">{clicks}</div>
            <div className="text-sm font-mono text-muted-foreground mt-1">
              {timeLeft}s remaining
            </div>
          </div>
        )}
        {state === "done" && (
          <div className="text-center space-y-1">
            <div className="text-3xl font-mono font-bold text-foreground">
              {cps.toFixed(2)} CPS
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              {clicks} clicks in {duration}s
            </div>
            <div className="text-lg font-mono font-bold text-primary">{rating}</div>
          </div>
        )}
      </div>

      {/* Results & Try Again */}
      {state === "done" && (
        <div className="flex items-center justify-between">
          <button onClick={reset} className={btnClass}>
            Try Again
          </button>
          {bestCps > 0 && (
            <span className="font-mono text-sm text-muted-foreground">
              Best: {bestCps.toFixed(2)} CPS
            </span>
          )}
        </div>
      )}
      {state === "idle" && bestCps > 0 && (
        <span className="font-mono text-sm text-muted-foreground">
          Best: {bestCps.toFixed(2)} CPS
        </span>
      )}
    </div>
  );
}

// ============================================================
// Typing Speed Test
// ============================================================

const sampleParagraphs = [
  "The quick brown fox jumps over the lazy dog near the riverbank where wildflowers bloom in every color of the rainbow during the warm summer months.",
  "Programming is the art of telling a computer what to do through a sequence of instructions written in a language it can understand and execute efficiently.",
  "In the heart of the ancient forest, tall oaks and maples stretched their branches toward the sky, forming a dense canopy that filtered the golden sunlight.",
  "Technology continues to reshape how we communicate, work, and live our daily lives, connecting people across vast distances with unprecedented speed and clarity.",
  "The scientist carefully measured each sample and recorded the results in her notebook, knowing that precision was essential for the success of the experiment.",
  "Mountains rose majestically above the clouds, their snow-capped peaks glistening in the early morning light as hikers prepared for the long ascent ahead.",
  "Good software design requires careful planning, clear communication between team members, and a willingness to refactor code when better solutions become apparent.",
  "The ocean waves crashed rhythmically against the rocky shore, sending sprays of salty mist into the cool evening air as seagulls circled overhead.",
];

function TypingSpeedTest() {
  const [paragraphIndex, setParagraphIndex] = useState(() =>
    Math.floor(Math.random() * sampleParagraphs.length)
  );
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const target = sampleParagraphs[paragraphIndex];
  const isComplete = typed.length >= target.length;

  useEffect(() => {
    if (isComplete && !endTime && startTime) {
      setEndTime(Date.now());
    }
  }, [isComplete, endTime, startTime]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isComplete) return;
    const value = e.target.value;
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }
    setTyped(value);
  };

  const elapsed = endTime && startTime ? (endTime - startTime) / 1000 : startTime ? (Date.now() - startTime) / 1000 : 0;
  const wordCount = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsed > 0 ? (wordCount / elapsed) * 60 : 0;
  const correctChars = typed.split("").filter((ch, i) => ch === target[i]).length;
  const accuracy = typed.length > 0 ? (correctChars / typed.length) * 100 : 100;

  // Live WPM ticker
  const [liveWpm, setLiveWpm] = useState(0);
  useEffect(() => {
    if (!startTime || endTime) return;
    const iv = setInterval(() => {
      const sec = (Date.now() - startTime) / 1000;
      const words = typed.trim().split(/\s+/).filter(Boolean).length;
      setLiveWpm(sec > 0 ? (words / sec) * 60 : 0);
    }, 200);
    return () => clearInterval(iv);
  }, [startTime, endTime, typed]);

  const newTest = () => {
    let next = Math.floor(Math.random() * sampleParagraphs.length);
    while (next === paragraphIndex && sampleParagraphs.length > 1) {
      next = Math.floor(Math.random() * sampleParagraphs.length);
    }
    setParagraphIndex(next);
    setTyped("");
    setStartTime(null);
    setEndTime(null);
    setLiveWpm(0);
    textareaRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      {/* Target text with highlighting */}
      <div className={`${cardClass} font-mono text-sm leading-relaxed`}>
        {target.split("").map((ch, i) => {
          let color = "text-muted-foreground"; // remaining
          if (i < typed.length) {
            color = typed[i] === ch ? "text-green-500" : "text-red-500";
          }
          return (
            <span key={i} className={color}>
              {ch}
            </span>
          );
        })}
      </div>

      {/* Live WPM */}
      {startTime && !endTime && (
        <div className="font-mono text-sm text-muted-foreground">
          Live WPM: <span className="text-foreground font-bold">{Math.round(liveWpm)}</span>
        </div>
      )}

      {/* Input */}
      <textarea
        ref={textareaRef}
        value={typed}
        onChange={handleChange}
        disabled={isComplete}
        placeholder="Start typing here..."
        rows={4}
        className={inputClass}
      />

      {/* Results */}
      {isComplete && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={cardClass}>
            <div className={labelClass}>WPM</div>
            <div className="text-xl font-mono font-bold text-foreground">{Math.round(wpm)}</div>
          </div>
          <div className={cardClass}>
            <div className={labelClass}>Accuracy</div>
            <div className="text-xl font-mono font-bold text-foreground">{accuracy.toFixed(1)}%</div>
          </div>
          <div className={cardClass}>
            <div className={labelClass}>Time</div>
            <div className="text-xl font-mono font-bold text-foreground">{elapsed.toFixed(1)}s</div>
          </div>
          <div className={cardClass}>
            <div className={labelClass}>Characters</div>
            <div className="text-xl font-mono font-bold text-foreground">{typed.length}</div>
          </div>
        </div>
      )}

      {isComplete && (
        <button onClick={newTest} className={btnClass}>
          New Test
        </button>
      )}
    </div>
  );
}

// ============================================================
// Color Contrast Checker
// ============================================================

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

function linearize(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function PassFail({ pass }: { pass: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded font-mono text-xs font-bold ${
        pass
          ? "bg-green-500/20 text-green-500"
          : "bg-red-500/20 text-red-500"
      }`}
    >
      {pass ? "PASS" : "FAIL"}
    </span>
  );
}

function ColorContrastChecker() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");

  const ratio = contrastRatio(fg, bg);

  const swap = () => {
    setFg(bg);
    setBg(fg);
  };

  return (
    <div className="space-y-4">
      {/* Color pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Foreground Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
            />
            <input
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
            />
            <input
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button onClick={swap} className={btnClass}>
        Swap Colors
      </button>

      {/* Preview */}
      <div className="rounded-lg border border-border p-6 space-y-3" style={{ backgroundColor: bg }}>
        <p style={{ color: fg }} className="font-mono text-base">
          The quick brown fox jumps over the lazy dog.
        </p>
        <p style={{ color: fg }} className="font-mono text-xl font-bold">
          The quick brown fox jumps over the lazy dog. (Large Text)
        </p>
      </div>

      {/* Contrast ratio */}
      <div className={cardClass}>
        <div className={labelClass}>Contrast Ratio</div>
        <div className="text-2xl font-mono font-bold text-foreground">{ratio.toFixed(2)}:1</div>
      </div>

      {/* WCAG results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={cardClass}>
          <div className={labelClass}>AA Normal</div>
          <PassFail pass={ratio >= 4.5} />
        </div>
        <div className={cardClass}>
          <div className={labelClass}>AA Large</div>
          <PassFail pass={ratio >= 3} />
        </div>
        <div className={cardClass}>
          <div className={labelClass}>AAA Normal</div>
          <PassFail pass={ratio >= 7} />
        </div>
        <div className={cardClass}>
          <div className={labelClass}>AAA Large</div>
          <PassFail pass={ratio >= 4.5} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Screen Info
// ============================================================

function useScreenInfo() {
  const getInfo = useCallback(() => ({
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
    orientation:
      screen.orientation?.type ?? (window.innerWidth > window.innerHeight ? "landscape" : "portrait"),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    cookiesEnabled: navigator.cookieEnabled,
  }), []);

  const [info, setInfo] = useState(getInfo);

  useEffect(() => {
    const update = () => setInfo(getInfo());
    window.addEventListener("resize", update);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [getInfo]);

  return info;
}

function ScreenInfo() {
  const info = useScreenInfo();

  const items: { label: string; value: string }[] = [
    { label: "Screen Width", value: `${info.screenWidth}px` },
    { label: "Screen Height", value: `${info.screenHeight}px` },
    { label: "Viewport Width", value: `${info.viewportWidth}px` },
    { label: "Viewport Height", value: `${info.viewportHeight}px` },
    { label: "Device Pixel Ratio", value: `${info.devicePixelRatio}` },
    { label: "Color Depth", value: `${info.colorDepth}-bit` },
    { label: "Orientation", value: info.orientation },
    { label: "Platform", value: info.platform },
    { label: "Language", value: info.language },
    { label: "Online", value: info.online ? "Yes" : "No" },
    { label: "Touch Support", value: info.touchSupport ? "Yes" : "No" },
    { label: "Cookies Enabled", value: info.cookiesEnabled ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className={cardClass}>
            <div className={labelClass}>{item.label}</div>
            <div className="font-mono text-sm text-foreground font-bold">{item.value}</div>
          </div>
        ))}
      </div>
      <div className={cardClass}>
        <div className={labelClass}>User Agent</div>
        <div className="font-mono text-xs text-foreground break-all">{info.userAgent}</div>
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================

const tabs: { id: Tab; label: string }[] = [
  { id: "cps", label: "Click Speed Test" },
  { id: "typing", label: "Typing Speed" },
  { id: "contrast", label: "Contrast Checker" },
  { id: "screen", label: "Screen Info" },
];

function InteractiveToolsTool() {
  const [activeTab, setActiveTab] = useState<Tab>("cps");

  return (
    <Layout>
      <SEO title="Interactive Tools" description="Click speed test, typing speed test, WCAG color contrast checker, and screen info detector." canonical="/interactive-tools" keywords="click speed test, typing test, cps test, color contrast checker, wcag contrast" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Interactive Tools
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "cps" && <ClickSpeedTest />}
        {activeTab === "typing" && <TypingSpeedTest />}
        {activeTab === "contrast" && <ColorContrastChecker />}
        {activeTab === "screen" && <ScreenInfo />}
      </div>
    </Layout>
  );
}

export default InteractiveToolsTool;
