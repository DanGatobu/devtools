import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type Tab =
  | "sort"
  | "dedup"
  | "reverse"
  | "whitespace"
  | "lineNumbers"
  | "prefixSuffix"
  | "findReplace"
  | "repeater";

const tabs: { id: Tab; label: string }[] = [
  { id: "sort", label: "Sort Lines" },
  { id: "dedup", label: "Remove Duplicates" },
  { id: "reverse", label: "Reverse" },
  { id: "whitespace", label: "Remove Whitespace" },
  { id: "lineNumbers", label: "Line Numbers" },
  { id: "prefixSuffix", label: "Prefix/Suffix" },
  { id: "findReplace", label: "Find & Replace" },
  { id: "repeater", label: "Text Repeater" },
];

const textareaClass =
  "w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary";
const primaryBtn =
  "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";
const secondaryBtn =
  "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors";

function statsLine(text: string) {
  const lines = text === "" ? 0 : text.split("\n").length;
  const chars = text.length;
  return `${lines} line${lines !== 1 ? "s" : ""}, ${chars} char${chars !== 1 ? "s" : ""}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

/* ── Sort Lines ───────────────────────────────────────────────── */

function SortLines() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  const getLines = () => input.split("\n");

  const apply = (sortFn: (lines: string[]) => string[]) => {
    setOutput(sortFn(getLines()).join("\n"));
  };

  const sortAZ = () =>
    apply((l) =>
      [...l].sort((a, b) =>
        caseInsensitive
          ? a.toLowerCase().localeCompare(b.toLowerCase())
          : a.localeCompare(b)
      )
    );

  const sortZA = () =>
    apply((l) =>
      [...l]
        .sort((a, b) =>
          caseInsensitive
            ? a.toLowerCase().localeCompare(b.toLowerCase())
            : a.localeCompare(b)
        )
        .reverse()
    );

  const sortLenAsc = () =>
    apply((l) => [...l].sort((a, b) => a.length - b.length));

  const sortLenDesc = () =>
    apply((l) => [...l].sort((a, b) => b.length - a.length));

  const shuffle = () =>
    apply((l) => {
      const arr = [...l];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text to sort..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <button className={primaryBtn} onClick={sortAZ}>A → Z</button>
        <button className={primaryBtn} onClick={sortZA}>Z → A</button>
        <button className={secondaryBtn} onClick={sortLenAsc}>Length ↑</button>
        <button className={secondaryBtn} onClick={sortLenDesc}>Length ↓</button>
        <button className={secondaryBtn} onClick={shuffle}>Shuffle</button>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground ml-2">
          <input
            type="checkbox"
            checked={caseInsensitive}
            onChange={(e) => setCaseInsensitive(e.target.checked)}
          />
          Case-insensitive
        </label>
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Remove Duplicates ────────────────────────────────────────── */

function RemoveDuplicates() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [keepLast, setKeepLast] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [removedCount, setRemovedCount] = useState(0);

  const apply = () => {
    const lines = input.split("\n");
    const seen = new Map<string, number>();

    lines.forEach((line, i) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (keepLast) {
        seen.set(key, i);
      } else {
        if (!seen.has(key)) seen.set(key, i);
      }
    });

    const indices = new Set(seen.values());
    const result = lines.filter((_, i) => indices.has(i));
    setOutput(result.join("\n"));
    setRemovedCount(lines.length - result.length);
  };

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text with duplicate lines..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <button className={primaryBtn} onClick={apply}>Remove Duplicates</button>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          <input
            type="checkbox"
            checked={keepLast}
            onChange={(e) => setKeepLast(e.target.checked)}
          />
          Keep last occurrence
        </label>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          Case-sensitive
        </label>
        {removedCount > 0 && (
          <span className="font-mono text-xs text-muted-foreground">
            Removed {removedCount} duplicate{removedCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Reverse ──────────────────────────────────────────────────── */

function ReverseTab() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const reverseText = () => setOutput(input.split("").reverse().join(""));
  const reverseLines = () =>
    setOutput(
      input
        .split("\n")
        .map((l) => l.split("").reverse().join(""))
        .join("\n")
    );
  const reverseWordOrder = () =>
    setOutput(
      input
        .split("\n")
        .map((l) => l.split(/\s+/).reverse().join(" "))
        .join("\n")
    );

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text to reverse..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <button className={primaryBtn} onClick={reverseText}>Reverse Entire Text</button>
        <button className={secondaryBtn} onClick={reverseLines}>Reverse Each Line</button>
        <button className={secondaryBtn} onClick={reverseWordOrder}>Reverse Word Order</button>
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Remove Whitespace ────────────────────────────────────────── */

function RemoveWhitespace() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const trimLines = () =>
    setOutput(input.split("\n").map((l) => l.trim()).join("\n"));

  const collapseSpaces = () =>
    setOutput(input.split("\n").map((l) => l.replace(/[ \t]+/g, " ")).join("\n"));

  const removeBlankLines = () =>
    setOutput(input.split("\n").filter((l) => l.trim() !== "").join("\n"));

  const removeAllWhitespace = () =>
    setOutput(input.replace(/\s/g, ""));

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <button className={primaryBtn} onClick={trimLines}>Trim Lines</button>
        <button className={secondaryBtn} onClick={collapseSpaces}>Collapse Spaces</button>
        <button className={secondaryBtn} onClick={removeBlankLines}>Remove Blank Lines</button>
        <button className={secondaryBtn} onClick={removeAllWhitespace}>Remove All Whitespace</button>
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Line Numbers ─────────────────────────────────────────────── */

function LineNumbers() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [startNum, setStartNum] = useState(1);
  const [separator, setSeparator] = useState(". ");

  const addNumbers = () => {
    const lines = input.split("\n");
    setOutput(
      lines.map((l, i) => `${i + startNum}${separator}${l}`).join("\n")
    );
  };

  const removeNumbers = () => {
    const lines = input.split("\n");
    setOutput(
      lines.map((l) => l.replace(/^\d+[\s.:)\-]+/, "")).join("\n")
    );
  };

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <button className={primaryBtn} onClick={addNumbers}>Add Line Numbers</button>
        <button className={secondaryBtn} onClick={removeNumbers}>Remove Line Numbers</button>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          Start:
          <input
            type="number"
            className="w-20 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={startNum}
            onChange={(e) => setStartNum(parseInt(e.target.value) || 1)}
          />
        </label>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          Separator:
          <input
            type="text"
            className="w-20 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
          />
        </label>
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Prefix / Suffix ──────────────────────────────────────────── */

function PrefixSuffix() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  const apply = () => {
    setOutput(
      input
        .split("\n")
        .map((l) => `${prefix}${l}${suffix}`)
        .join("\n")
    );
  };

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          Prefix:
          <input
            type="text"
            className="w-40 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Prefix..."
          />
        </label>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          Suffix:
          <input
            type="text"
            className="w-40 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="Suffix..."
          />
        </label>
        <button className={primaryBtn} onClick={apply}>Apply</button>
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output preview..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Find & Replace ───────────────────────────────────────────── */

function FindReplace() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [useRegex, setUseRegex] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  const applyReplace = () => {
    if (!find) {
      setOutput(input);
      setMatchCount(0);
      return;
    }
    try {
      const flags = `g${caseSensitive ? "" : "i"}`;
      const pattern = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      const matches = input.match(pattern);
      setMatchCount(matches ? matches.length : 0);
      setOutput(input.replace(pattern, replace));
    } catch {
      setOutput("Invalid regex pattern");
      setMatchCount(0);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          className="w-48 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={find}
          onChange={(e) => setFind(e.target.value)}
          placeholder="Find..."
        />
        <input
          type="text"
          className="w-48 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          placeholder="Replace with..."
        />
        <button className={primaryBtn} onClick={applyReplace}>Replace All</button>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
          />
          Regex
        </label>
        {matchCount > 0 && (
          <span className="font-mono text-xs text-muted-foreground">
            {matchCount} match{matchCount !== 1 ? "es" : ""}
          </span>
        )}
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Text Repeater ────────────────────────────────────────────── */

function TextRepeater() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [count, setCount] = useState(2);
  const [sepType, setSepType] = useState<"newline" | "space" | "comma" | "custom">("newline");
  const [customSep, setCustomSep] = useState("");

  const apply = () => {
    const n = Math.max(1, Math.min(1000, count));
    const sep =
      sepType === "newline"
        ? "\n"
        : sepType === "space"
          ? " "
          : sepType === "comma"
            ? ","
            : customSep;
    setOutput(Array(n).fill(input).join(sep));
  };

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        placeholder="Enter text to repeat..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 items-center">
        <label className="flex items-center gap-2 font-mono text-sm text-foreground">
          Count:
          <input
            type="number"
            min={1}
            max={1000}
            className="w-20 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          />
        </label>
        <select
          className="bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={sepType}
          onChange={(e) => setSepType(e.target.value as typeof sepType)}
        >
          <option value="newline">Newline</option>
          <option value="space">Space</option>
          <option value="comma">Comma</option>
          <option value="custom">Custom</option>
        </select>
        {sepType === "custom" && (
          <input
            type="text"
            className="w-32 bg-secondary rounded border border-border px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={customSep}
            onChange={(e) => setCustomSep(e.target.value)}
            placeholder="Separator..."
          />
        )}
        <button className={primaryBtn} onClick={apply}>Repeat</button>
      </div>
      <textarea className={textareaClass} readOnly value={output} placeholder="Output..." />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{statsLine(output)}</span>
        <button className={secondaryBtn} onClick={() => copyToClipboard(output)}>Copy</button>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */

function TextToolsTool() {
  const [activeTab, setActiveTab] = useState<Tab>("sort");

  return (
    <Layout>
      <SEO title="Text Tools" description="Sort lines, remove duplicates, reverse text, find and replace, add line numbers, and more text utilities." canonical="/text-tools" keywords="sort text, remove duplicate lines, reverse text, find and replace, text manipulation" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Text Tools
        </h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={
                activeTab === tab.id
                  ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                  : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "sort" && <SortLines />}
        {activeTab === "dedup" && <RemoveDuplicates />}
        {activeTab === "reverse" && <ReverseTab />}
        {activeTab === "whitespace" && <RemoveWhitespace />}
        {activeTab === "lineNumbers" && <LineNumbers />}
        {activeTab === "prefixSuffix" && <PrefixSuffix />}
        {activeTab === "findReplace" && <FindReplace />}
        {activeTab === "repeater" && <TextRepeater />}
      </div>
    </Layout>
  );
}

export default TextToolsTool;
