import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

type Tab =
  | "number"
  | "string"
  | "color"
  | "name"
  | "date"
  | "dice"
  | "coin"
  | "shuffler"
  | "lottery";

const TABS: { id: Tab; label: string }[] = [
  { id: "number", label: "Number" },
  { id: "string", label: "String" },
  { id: "color", label: "Color" },
  { id: "name", label: "Name" },
  { id: "date", label: "Date" },
  { id: "dice", label: "Dice" },
  { id: "coin", label: "Coin Flip" },
  { id: "shuffler", label: "List Shuffler" },
  { id: "lottery", label: "Lottery" },
];

const FIRST_NAMES = [
  "James","Mary","Robert","Patricia","John","Jennifer","Michael","Linda","David","Elizabeth",
  "William","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen",
  "Christopher","Lisa","Daniel","Betty","Matthew","Margaret","Anthony","Sandra","Mark","Ashley",
  "Donald","Kimberly","Steven","Emily","Paul","Donna","Andrew","Michelle","Joshua","Carol",
  "Kenneth","Amanda","Kevin","Dorothy","Brian","Melissa","George","Deborah","Timothy","Stephanie",
];

const LAST_NAMES = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
  "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
  "Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson",
  "Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
  "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts",
];

function cryptoRandomInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function cryptoRandomFloat(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / 0xffffffff;
}

function cryptoRandomIntRange(min: number, max: number): number {
  return min + cryptoRandomInt(max - min + 1);
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const inputClass =
  "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const primaryBtnClass =
  "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";
const inactiveBtnClass =
  "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors";
const cardClass = "bg-secondary rounded-lg border border-border p-4";

// ─── Number Tab ───────────────────────────────────────────────
function NumberTab() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [quantity, setQuantity] = useState("10");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sorted, setSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");

  const generate = () => {
    setError("");
    const lo = parseInt(min, 10);
    const hi = parseInt(max, 10);
    const qty = Math.min(100, Math.max(1, parseInt(quantity, 10) || 1));
    if (isNaN(lo) || isNaN(hi) || lo > hi) {
      setError("Min must be less than or equal to max.");
      return;
    }
    if (!allowDuplicates && qty > hi - lo + 1) {
      setError("Quantity exceeds possible unique values in range.");
      return;
    }
    let nums: number[] = [];
    if (allowDuplicates) {
      for (let i = 0; i < qty; i++) nums.push(cryptoRandomIntRange(lo, hi));
    } else {
      const pool = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
      const shuffled = shuffleArray(pool);
      nums = shuffled.slice(0, qty);
    }
    if (sorted) nums.sort((a, b) => a - b);
    setResults(nums);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join(", "));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Min</label>
          <input type="number" value={min} onChange={(e) => setMin(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Max</label>
          <input type="number" value={max} onChange={(e) => setMax(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block font-mono text-sm text-foreground mb-1">Quantity (1-100)</label>
        <input type="number" min={1} max={100} value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 font-mono text-sm text-foreground cursor-pointer">
          <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} className="accent-primary" />
          Allow duplicates
        </label>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground cursor-pointer">
          <input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} className="accent-primary" />
          Sort results
        </label>
      </div>
      {error && <p className="text-red-500 font-mono text-sm">{error}</p>}
      <div className="flex gap-2">
        <button onClick={generate} className={primaryBtnClass}>Generate</button>
        {results.length > 0 && (
          <button onClick={copyAll} className={inactiveBtnClass}>Copy All</button>
        )}
      </div>
      {results.length > 0 && (
        <div className={cardClass}>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {results.map((n, i) => (
              <span key={i} className="bg-background rounded px-2 py-1 text-center font-mono text-sm text-foreground border border-border">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── String Tab ───────────────────────────────────────────────
function StringTab() {
  const [length, setLength] = useState("16");
  const [quantity, setQuantity] = useState("5");
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [custom, setCustom] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const generate = () => {
    setError("");
    let charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (digits) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()-_=+[]{}|;:,.<>?/~`";
    if (custom) charset += custom;
    if (!charset) {
      setError("Select at least one character set.");
      return;
    }
    const len = Math.max(1, parseInt(length, 10) || 1);
    const qty = Math.min(100, Math.max(1, parseInt(quantity, 10) || 1));
    const strs: string[] = [];
    for (let q = 0; q < qty; q++) {
      let s = "";
      for (let i = 0; i < len; i++) s += charset[cryptoRandomInt(charset.length)];
      strs.push(s);
    }
    setResults(strs);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Length</label>
          <input type="number" min={1} value={length} onChange={(e) => setLength(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Quantity</label>
          <input type="number" min={1} max={100} value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Uppercase", checked: uppercase, set: setUppercase },
          { label: "Lowercase", checked: lowercase, set: setLowercase },
          { label: "Digits", checked: digits, set: setDigits },
          { label: "Symbols", checked: symbols, set: setSymbols },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 font-mono text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="accent-primary" />
            {opt.label}
          </label>
        ))}
      </div>
      <div>
        <label className="block font-mono text-sm text-foreground mb-1">Custom characters</label>
        <input type="text" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. @#$" className={inputClass} />
      </div>
      {error && <p className="text-red-500 font-mono text-sm">{error}</p>}
      <button onClick={generate} className={primaryBtnClass}>Generate</button>
      {results.length > 0 && (
        <div className={cardClass}>
          <div className="space-y-2">
            {results.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-2 bg-background rounded px-3 py-2 border border-border">
                <span className="font-mono text-sm text-foreground break-all">{s}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(s)}
                  className="shrink-0 font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color Tab ────────────────────────────────────────────────
function ColorTab() {
  const [quantity, setQuantity] = useState("12");
  const [colors, setColors] = useState<{ hex: string; r: number; g: number; b: number }[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    const qty = Math.min(100, Math.max(1, parseInt(quantity, 10) || 1));
    const arr = new Uint8Array(qty * 3);
    crypto.getRandomValues(arr);
    const cols = [];
    for (let i = 0; i < qty; i++) {
      const r = arr[i * 3];
      const g = arr[i * 3 + 1];
      const b = arr[i * 3 + 2];
      const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      cols.push({ hex, r, g, b });
    }
    setColors(cols);
    setCopied(null);
  };

  const copyColor = (index: number, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-mono text-sm text-foreground mb-1">Quantity</label>
        <input type="number" min={1} max={100} value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
      </div>
      <button onClick={generate} className={primaryBtnClass}>Generate</button>
      {colors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {colors.map((c, i) => (
            <div
              key={i}
              onClick={() => copyColor(i, c.hex)}
              className={`${cardClass} cursor-pointer hover:opacity-80 transition-opacity`}
            >
              <div className="w-full h-16 rounded-md mb-2 border border-border" style={{ backgroundColor: c.hex }} />
              <p className="font-mono text-sm text-foreground">{c.hex}</p>
              <p className="font-mono text-xs text-muted-foreground">rgb({c.r}, {c.g}, {c.b})</p>
              {copied === i && <p className="font-mono text-xs text-primary mt-1">Copied!</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Name Tab ─────────────────────────────────────────────────
function NameTab() {
  const [quantity, setQuantity] = useState("10");
  const [names, setNames] = useState<string[]>([]);

  const generate = () => {
    const qty = Math.min(100, Math.max(1, parseInt(quantity, 10) || 1));
    const result: string[] = [];
    for (let i = 0; i < qty; i++) {
      const first = FIRST_NAMES[cryptoRandomInt(FIRST_NAMES.length)];
      const last = LAST_NAMES[cryptoRandomInt(LAST_NAMES.length)];
      result.push(`${first} ${last}`);
    }
    setNames(result);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-mono text-sm text-foreground mb-1">Quantity</label>
        <input type="number" min={1} max={100} value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
      </div>
      <button onClick={generate} className={primaryBtnClass}>Generate</button>
      {names.length > 0 && (
        <div className={cardClass}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {names.map((name, i) => (
              <span key={i} className="bg-background rounded px-3 py-2 font-mono text-sm text-foreground border border-border">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Date Tab ─────────────────────────────────────────────────
function DateTab() {
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [quantity, setQuantity] = useState("10");
  const [dates, setDates] = useState<string[]>([]);
  const [error, setError] = useState("");

  const generate = () => {
    setError("");
    const start = new Date(startDate + "T00:00:00").getTime();
    const end = new Date(endDate + "T00:00:00").getTime();
    if (isNaN(start) || isNaN(end) || start > end) {
      setError("Start date must be before end date.");
      return;
    }
    const qty = Math.min(100, Math.max(1, parseInt(quantity, 10) || 1));
    const result: string[] = [];
    const range = end - start;
    for (let i = 0; i < qty; i++) {
      const ts = start + Math.floor(cryptoRandomFloat() * range);
      const d = new Date(ts);
      result.push(d.toISOString().split("T")[0]);
    }
    result.sort();
    setDates(result);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block font-mono text-sm text-foreground mb-1">Quantity</label>
        <input type="number" min={1} max={100} value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} />
      </div>
      {error && <p className="text-red-500 font-mono text-sm">{error}</p>}
      <button onClick={generate} className={primaryBtnClass}>Generate</button>
      {dates.length > 0 && (
        <div className={cardClass}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {dates.map((d, i) => (
              <span key={i} className="bg-background rounded px-3 py-2 font-mono text-sm text-foreground border border-border text-center">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dice Tab ─────────────────────────────────────────────────
type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";
const DICE_OPTIONS: { type: DiceType; max: number }[] = [
  { type: "d4", max: 4 },
  { type: "d6", max: 6 },
  { type: "d8", max: 8 },
  { type: "d10", max: 10 },
  { type: "d12", max: 12 },
  { type: "d20", max: 20 },
  { type: "d100", max: 100 },
];

interface DiceRoll {
  diceType: DiceType;
  count: number;
  results: number[];
  total: number;
}

function DiceTab() {
  const [diceType, setDiceType] = useState<DiceType>("d6");
  const [count, setCount] = useState("2");
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [history, setHistory] = useState<DiceRoll[]>([]);

  const roll = () => {
    const dice = DICE_OPTIONS.find((d) => d.type === diceType)!;
    const n = Math.min(20, Math.max(1, parseInt(count, 10) || 1));
    const results: number[] = [];
    for (let i = 0; i < n; i++) results.push(cryptoRandomIntRange(1, dice.max));
    const total = results.reduce((a, b) => a + b, 0);
    const rollData: DiceRoll = { diceType, count: n, results, total };
    setLastRoll(rollData);
    setHistory((prev) => [rollData, ...prev].slice(0, 20));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Dice Type</label>
          <select
            value={diceType}
            onChange={(e) => setDiceType(e.target.value as DiceType)}
            className={inputClass}
          >
            {DICE_OPTIONS.map((d) => (
              <option key={d.type} value={d.type}>{d.type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Number of Dice (1-20)</label>
          <input type="number" min={1} max={20} value={count} onChange={(e) => setCount(e.target.value)} className={inputClass} />
        </div>
      </div>
      <button onClick={roll} className={primaryBtnClass}>Roll</button>
      {lastRoll && (
        <div className={cardClass}>
          <p className="font-mono text-sm text-muted-foreground mb-2">
            Rolling {lastRoll.count}{lastRoll.diceType}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {lastRoll.results.map((r, i) => (
              <span key={i} className="bg-background rounded-md px-3 py-2 font-mono text-lg font-bold text-foreground border border-border min-w-[3rem] text-center">
                {r}
              </span>
            ))}
          </div>
          <p className="font-mono text-sm font-bold text-foreground">Total: {lastRoll.total}</p>
        </div>
      )}
      {history.length > 1 && (
        <div>
          <h3 className="font-mono text-sm font-bold text-foreground mb-2">Roll History</h3>
          <div className="space-y-1">
            {history.slice(1).map((h, i) => (
              <div key={i} className="font-mono text-xs text-muted-foreground">
                {h.count}{h.diceType}: [{h.results.join(", ")}] = {h.total}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Coin Flip Tab ────────────────────────────────────────────
function CoinFlipTab() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [streak, setStreak] = useState({ type: "" as "heads" | "tails" | "", count: 0 });
  const [bestStreak, setBestStreak] = useState({ type: "" as "heads" | "tails" | "", count: 0 });

  const flip = () => {
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const side: "heads" | "tails" = cryptoRandomInt(2) === 0 ? "heads" : "tails";
      setResult(side);
      setFlipping(false);
      setFlipCount((c) => c + 1);
      if (side === "heads") setHeadsCount((c) => c + 1);
      else setTailsCount((c) => c + 1);
      setStreak((prev) => {
        const newStreak =
          prev.type === side
            ? { type: side, count: prev.count + 1 }
            : { type: side, count: 1 };
        setBestStreak((best) =>
          newStreak.count > best.count ? newStreak : best
        );
        return newStreak;
      });
    }, 400);
  };

  const reset = () => {
    setResult(null);
    setFlipCount(0);
    setHeadsCount(0);
    setTailsCount(0);
    setStreak({ type: "", count: 0 });
    setBestStreak({ type: "", count: 0 });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={flip} disabled={flipping} className={primaryBtnClass}>
          {flipping ? "Flipping..." : "Flip Coin"}
        </button>
        <button onClick={reset} className={inactiveBtnClass}>Reset</button>
      </div>
      <div className={cardClass}>
        <div className="flex items-center justify-center h-32">
          {flipping ? (
            <span className="font-mono text-4xl text-muted-foreground animate-pulse">...</span>
          ) : result ? (
            <span className="font-mono text-4xl font-bold text-foreground uppercase">{result}</span>
          ) : (
            <span className="font-mono text-lg text-muted-foreground">Click flip to start</span>
          )}
        </div>
      </div>
      {flipCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={cardClass}>
            <p className="font-mono text-xs text-muted-foreground">Total Flips</p>
            <p className="font-mono text-xl font-bold text-foreground">{flipCount}</p>
          </div>
          <div className={cardClass}>
            <p className="font-mono text-xs text-muted-foreground">Heads</p>
            <p className="font-mono text-xl font-bold text-foreground">
              {headsCount} <span className="text-sm font-normal text-muted-foreground">({flipCount > 0 ? ((headsCount / flipCount) * 100).toFixed(1) : 0}%)</span>
            </p>
          </div>
          <div className={cardClass}>
            <p className="font-mono text-xs text-muted-foreground">Tails</p>
            <p className="font-mono text-xl font-bold text-foreground">
              {tailsCount} <span className="text-sm font-normal text-muted-foreground">({flipCount > 0 ? ((tailsCount / flipCount) * 100).toFixed(1) : 0}%)</span>
            </p>
          </div>
          <div className={cardClass}>
            <p className="font-mono text-xs text-muted-foreground">Best Streak</p>
            <p className="font-mono text-xl font-bold text-foreground">
              {bestStreak.count > 0 ? `${bestStreak.count} ${bestStreak.type}` : "-"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── List Shuffler Tab ────────────────────────────────────────
function ListShufflerTab() {
  const [input, setInput] = useState("");
  const [pickN, setPickN] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const shuffle = () => {
    const items = input
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return;
    let shuffled = shuffleArray(items);
    const n = parseInt(pickN, 10);
    if (!isNaN(n) && n > 0 && n < shuffled.length) {
      shuffled = shuffled.slice(0, n);
    }
    setResults(shuffled);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-mono text-sm text-foreground mb-1">Items (one per line)</label>
        <textarea
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Item 1\nItem 2\nItem 3\n..."}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block font-mono text-sm text-foreground mb-1">Pick N random items (leave empty for all)</label>
        <input type="number" min={1} value={pickN} onChange={(e) => setPickN(e.target.value)} placeholder="All" className={inputClass} />
      </div>
      <button onClick={shuffle} className={primaryBtnClass}>Shuffle</button>
      {results.length > 0 && (
        <div className={cardClass}>
          <ol className="list-decimal list-inside space-y-1">
            {results.map((item, i) => (
              <li key={i} className="font-mono text-sm text-foreground">{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ─── Lottery Tab ──────────────────────────────────────────────
function LotteryTab() {
  const [maxNum, setMaxNum] = useState("49");
  const [pickCount, setPickCount] = useState("6");
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");

  const generate = () => {
    setError("");
    const max = parseInt(maxNum, 10);
    const pick = parseInt(pickCount, 10);
    if (isNaN(max) || max < 1) {
      setError("Max number must be at least 1.");
      return;
    }
    if (isNaN(pick) || pick < 1) {
      setError("Pick count must be at least 1.");
      return;
    }
    if (pick > max) {
      setError("Pick count cannot exceed max number.");
      return;
    }
    const pool = Array.from({ length: max }, (_, i) => i + 1);
    const shuffled = shuffleArray(pool);
    const picked = shuffled.slice(0, pick).sort((a, b) => a - b);
    setResults(picked);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Max Number (1-X)</label>
          <input type="number" min={1} value={maxNum} onChange={(e) => setMaxNum(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block font-mono text-sm text-foreground mb-1">Pick Count</label>
          <input type="number" min={1} value={pickCount} onChange={(e) => setPickCount(e.target.value)} className={inputClass} />
        </div>
      </div>
      {error && <p className="text-red-500 font-mono text-sm">{error}</p>}
      <button onClick={generate} className={primaryBtnClass}>Draw Numbers</button>
      {results.length > 0 && (
        <div className={cardClass}>
          <div className="flex flex-wrap gap-3 justify-center">
            {results.map((n, i) => (
              <span
                key={i}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-lg font-bold"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
function RandomGeneratorTool() {
  const [activeTab, setActiveTab] = useState<Tab>("number");

  const renderTab = () => {
    switch (activeTab) {
      case "number":
        return <NumberTab />;
      case "string":
        return <StringTab />;
      case "color":
        return <ColorTab />;
      case "name":
        return <NameTab />;
      case "date":
        return <DateTab />;
      case "dice":
        return <DiceTab />;
      case "coin":
        return <CoinFlipTab />;
      case "shuffler":
        return <ListShufflerTab />;
      case "lottery":
        return <LotteryTab />;
    }
  };

  return (
    <Layout>
      <SEO title="Random Generators" description="Generate random numbers, strings, names, colors, dice rolls, coin flips, and more. Cryptographically secure." canonical="/random-generators" keywords="random number generator, random name generator, dice roller, coin flip, random string" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Random Generator
        </h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id ? primaryBtnClass : inactiveBtnClass
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderTab()}
      </div>
    </Layout>
  );
}

export default RandomGeneratorTool;
