import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useRef, useCallback } from "react";

type Tab = "textToMorse" | "morseToText";
type WPM = 5 | 10 | 15 | 20 | 25;

const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", "\"": ".-..-.",
  "@": ".--.-.",
};

const REVERSE_MORSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return "/";
      return MORSE_MAP[ch] ?? "";
    })
    .filter(Boolean)
    .join(" ");
}

function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s+/)
    .map((token) => {
      if (token === "/") return " ";
      return REVERSE_MORSE_MAP[token] ?? "?";
    })
    .join("");
}

function getTimingMs(wpm: WPM) {
  const unit = 1200 / wpm;
  return {
    dot: unit,
    dash: unit * 3,
    intraCharGap: unit,
    interCharGap: unit * 3,
    wordGap: unit * 7,
  };
}

const WPM_OPTIONS: WPM[] = [5, 10, 15, 20, 25];

const REFERENCE_ENTRIES = Object.entries(MORSE_MAP).map(([char, code]) => ({
  char: char === " " ? "SPACE" : char,
  code,
}));

function MorseCodeTool() {
  const [tab, setTab] = useState<Tab>("textToMorse");
  const [input, setInput] = useState("");
  const [wpm, setWpm] = useState<WPM>(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refOpen, setRefOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef(false);

  const output =
    tab === "textToMorse" ? textToMorse(input) : morseToText(input);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const playMorse = useCallback(async () => {
    const morseStr = tab === "textToMorse" ? output : input;
    if (!morseStr) return;

    stopRef.current = false;
    setIsPlaying(true);

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const timing = getTimingMs(wpm);

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const playTone = (durationMs: number) =>
      new Promise<void>((resolve) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 600;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + durationMs / 1000);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
          resolve();
        };
      });

    const tokens = morseStr.split(" ");

    for (let i = 0; i < tokens.length; i++) {
      if (stopRef.current) break;
      const token = tokens[i];

      if (token === "/") {
        await sleep(timing.wordGap);
        continue;
      }

      for (let j = 0; j < token.length; j++) {
        if (stopRef.current) break;
        const sym = token[j];
        if (sym === ".") {
          await playTone(timing.dot);
        } else if (sym === "-") {
          await playTone(timing.dash);
        }
        if (j < token.length - 1) {
          await sleep(timing.intraCharGap);
        }
      }

      if (i < tokens.length - 1 && tokens[i + 1] !== "/") {
        await sleep(timing.interCharGap);
      }
    }

    ctx.close();
    audioCtxRef.current = null;
    setIsPlaying(false);
  }, [tab, output, input, wpm]);

  const stopPlayback = useCallback(() => {
    stopRef.current = true;
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const handleTabSwitch = (newTab: Tab) => {
    setTab(newTab);
    setInput("");
  };

  return (
    <Layout>
      <SEO title="Morse Code Translator" description="Translate text to Morse code and back with audio playback. Adjustable speed and full reference chart." canonical="/morse-code" keywords="morse code translator, text to morse, morse code converter, morse code audio" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Morse Code Translator
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTabSwitch("textToMorse")}
            className={
              tab === "textToMorse"
                ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            }
          >
            Text to Morse
          </button>
          <button
            onClick={() => handleTabSwitch("morseToText")}
            className={
              tab === "morseToText"
                ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            }
          >
            Morse to Text
          </button>
        </div>

        {/* Side by side textareas */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-mono text-sm text-foreground mb-2">
              {tab === "textToMorse" ? "Text" : "Morse Code"}
            </label>
            <textarea
              className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={
                tab === "textToMorse"
                  ? "Type text here..."
                  : "Type morse code (use . and -, separate letters with spaces, words with /)..."
              }
            />
          </div>
          <div>
            <label className="block font-mono text-sm text-foreground mb-2">
              {tab === "textToMorse" ? "Morse Code" : "Text"}
            </label>
            <textarea
              className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              value={output}
              readOnly
              placeholder="Output will appear here..."
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <label className="font-mono text-sm text-foreground">Speed:</label>
            <select
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value) as WPM)}
              className="bg-secondary border border-border rounded-md px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {WPM_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w} WPM
                </option>
              ))}
            </select>
          </div>

          {!isPlaying ? (
            <button
              onClick={playMorse}
              disabled={!output && tab === "textToMorse"}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Play Audio
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Stop
            </button>
          )}

          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Collapsible Morse Reference */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setRefOpen(!refOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-secondary font-mono text-sm text-foreground hover:bg-secondary/80 transition-colors"
          >
            <span>Morse Code Reference</span>
            <span>{refOpen ? "▲" : "▼"}</span>
          </button>
          {refOpen && (
            <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {REFERENCE_ENTRIES.map(({ char, code }) => (
                <div
                  key={char}
                  className="flex items-center gap-2 bg-secondary/50 rounded px-2 py-1"
                >
                  <span className="font-mono text-sm font-bold text-foreground min-w-[1.5rem]">
                    {char}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {code}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default MorseCodeTool;
