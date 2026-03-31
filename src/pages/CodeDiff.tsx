import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useMemo, useCallback } from "react";

// --- Diff types ---

type DiffOp = "equal" | "insert" | "delete";

interface DiffLine {
  op: DiffOp;
  leftLineNo?: number;
  rightLineNo?: number;
  text: string;
}

interface DiffStats {
  added: number;
  deleted: number;
  unchanged: number;
}

// --- LCS-based diff algorithm ---

function buildLcsTable(a: string[], b: string[]): number[][] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

function backtrackDiff(
  dp: number[][],
  a: string[],
  b: string[]
): DiffLine[] {
  const result: DiffLine[] = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.push({ op: "equal", leftLineNo: i, rightLineNo: j, text: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ op: "insert", rightLineNo: j, text: b[j - 1] });
      j--;
    } else {
      result.push({ op: "delete", leftLineNo: i, text: a[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

function computeDiff(
  leftText: string,
  rightText: string,
  ignoreWhitespace: boolean,
  ignoreCase: boolean
): DiffLine[] {
  const normalize = (line: string): string => {
    let s = line;
    if (ignoreWhitespace) s = s.replace(/\s+/g, " ").trim();
    if (ignoreCase) s = s.toLowerCase();
    return s;
  };

  const leftLines = leftText.split("\n");
  const rightLines = rightText.split("\n");

  const normLeft = leftLines.map(normalize);
  const normRight = rightLines.map(normalize);

  const dp = buildLcsTable(normLeft, normRight);
  const rawDiff = backtrackDiff(dp, normLeft, normRight);

  // Map back to original (non-normalized) text
  let li = 0;
  let ri = 0;
  return rawDiff.map((d) => {
    if (d.op === "equal") {
      const line: DiffLine = {
        op: "equal",
        leftLineNo: li + 1,
        rightLineNo: ri + 1,
        text: leftLines[li],
      };
      li++;
      ri++;
      return line;
    }
    if (d.op === "delete") {
      const line: DiffLine = {
        op: "delete",
        leftLineNo: li + 1,
        text: leftLines[li],
      };
      li++;
      return line;
    }
    // insert
    const line: DiffLine = {
      op: "insert",
      rightLineNo: ri + 1,
      text: rightLines[ri],
    };
    ri++;
    return line;
  });
}

// --- Inline (word-level) diff for modified lines ---

interface InlineSegment {
  text: string;
  type: "equal" | "added" | "removed";
}

function inlineWordDiff(oldLine: string, newLine: string): { oldSegments: InlineSegment[]; newSegments: InlineSegment[] } {
  const splitWords = (s: string): string[] => {
    const tokens: string[] = [];
    let current = "";
    for (const ch of s) {
      if (/\s/.test(ch)) {
        if (current) tokens.push(current);
        tokens.push(ch);
        current = "";
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  };

  const aWords = splitWords(oldLine);
  const bWords = splitWords(newLine);

  const dp = buildLcsTable(aWords, bWords);
  const ops: { op: "equal" | "delete" | "insert"; text: string }[] = [];
  let i = aWords.length;
  let j = bWords.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aWords[i - 1] === bWords[j - 1]) {
      ops.push({ op: "equal", text: aWords[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ op: "insert", text: bWords[j - 1] });
      j--;
    } else {
      ops.push({ op: "delete", text: aWords[i - 1] });
      i--;
    }
  }
  ops.reverse();

  const oldSegments: InlineSegment[] = [];
  const newSegments: InlineSegment[] = [];
  for (const op of ops) {
    if (op.op === "equal") {
      oldSegments.push({ text: op.text, type: "equal" });
      newSegments.push({ text: op.text, type: "equal" });
    } else if (op.op === "delete") {
      oldSegments.push({ text: op.text, type: "removed" });
    } else {
      newSegments.push({ text: op.text, type: "added" });
    }
  }
  return { oldSegments, newSegments };
}

// --- React components ---

function InlineText({ segments }: { segments: InlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => (
        <span
          key={i}
          className={
            seg.type === "removed"
              ? "bg-red-500/30 rounded-sm"
              : seg.type === "added"
              ? "bg-green-500/30 rounded-sm"
              : ""
          }
        >
          {seg.text}
        </span>
      ))}
    </>
  );
}

// Detect adjacent delete+insert pairs for inline highlighting
function findModifiedPairs(diff: DiffLine[]): Map<number, number> {
  const pairs = new Map<number, number>();
  let i = 0;
  while (i < diff.length) {
    if (
      diff[i].op === "delete" &&
      i + 1 < diff.length &&
      diff[i + 1].op === "insert"
    ) {
      pairs.set(i, i + 1);
      pairs.set(i + 1, i);
      i += 2;
    } else {
      i++;
    }
  }
  return pairs;
}

function UnifiedView({ diff }: { diff: DiffLine[] }) {
  const pairs = useMemo(() => findModifiedPairs(diff), [diff]);

  return (
    <div className="bg-secondary rounded-lg border border-border overflow-auto">
      <table className="w-full font-mono text-sm border-collapse">
        <tbody>
          {diff.map((line, idx) => {
            const partner = pairs.get(idx);
            const isModified = partner !== undefined;
            let content: React.ReactNode = line.text;

            if (isModified && line.op === "delete") {
              const ins = diff[partner];
              const { oldSegments } = inlineWordDiff(line.text, ins.text);
              content = <InlineText segments={oldSegments} />;
            } else if (isModified && line.op === "insert") {
              const del = diff[partner];
              const { newSegments } = inlineWordDiff(del.text, line.text);
              content = <InlineText segments={newSegments} />;
            }

            const prefix = line.op === "insert" ? "+" : line.op === "delete" ? "-" : " ";
            const bg =
              line.op === "insert"
                ? "bg-green-500/10"
                : line.op === "delete"
                ? "bg-red-500/10"
                : "";

            return (
              <tr key={idx} className={bg}>
                <td className="px-2 py-0.5 text-muted-foreground text-right w-12 select-none border-r border-border">
                  {line.leftLineNo ?? ""}
                </td>
                <td className="px-2 py-0.5 text-muted-foreground text-right w-12 select-none border-r border-border">
                  {line.rightLineNo ?? ""}
                </td>
                <td className="px-1 py-0.5 text-muted-foreground w-6 select-none text-center">
                  {prefix}
                </td>
                <td className="px-3 py-0.5 whitespace-pre">{content}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface SideBySideRow {
  leftLineNo?: number;
  leftText?: React.ReactNode;
  leftOp: DiffOp | "blank";
  rightLineNo?: number;
  rightText?: React.ReactNode;
  rightOp: DiffOp | "blank";
}

function buildSideBySideRows(diff: DiffLine[]): SideBySideRow[] {
  const rows: SideBySideRow[] = [];
  const pairs = findModifiedPairs(diff);

  let i = 0;
  while (i < diff.length) {
    const line = diff[i];
    const partner = pairs.get(i);

    if (line.op === "equal") {
      rows.push({
        leftLineNo: line.leftLineNo,
        leftText: line.text,
        leftOp: "equal",
        rightLineNo: line.rightLineNo,
        rightText: line.text,
        rightOp: "equal",
      });
      i++;
    } else if (line.op === "delete" && partner !== undefined) {
      // Modified pair: show side by side with inline diff
      const ins = diff[partner];
      const { oldSegments, newSegments } = inlineWordDiff(line.text, ins.text);
      rows.push({
        leftLineNo: line.leftLineNo,
        leftText: <InlineText segments={oldSegments} />,
        leftOp: "delete",
        rightLineNo: ins.rightLineNo,
        rightText: <InlineText segments={newSegments} />,
        rightOp: "insert",
      });
      i += 2;
    } else if (line.op === "delete") {
      rows.push({
        leftLineNo: line.leftLineNo,
        leftText: line.text,
        leftOp: "delete",
        rightOp: "blank",
      });
      i++;
    } else {
      // insert without partner
      rows.push({
        leftOp: "blank",
        rightLineNo: line.rightLineNo,
        rightText: line.text,
        rightOp: "insert",
      });
      i++;
    }
  }
  return rows;
}

function SideBySideView({ diff }: { diff: DiffLine[] }) {
  const rows = useMemo(() => buildSideBySideRows(diff), [diff]);

  const cellBg = (op: DiffOp | "blank") =>
    op === "delete"
      ? "bg-red-500/10"
      : op === "insert"
      ? "bg-green-500/10"
      : op === "blank"
      ? "bg-secondary/50"
      : "";

  return (
    <div className="bg-secondary rounded-lg border border-border overflow-auto">
      <table className="w-full font-mono text-sm border-collapse">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td
                className={`px-2 py-0.5 text-muted-foreground text-right w-12 select-none border-r border-border ${cellBg(row.leftOp)}`}
              >
                {row.leftLineNo ?? ""}
              </td>
              <td
                className={`px-3 py-0.5 whitespace-pre w-1/2 border-r border-border ${cellBg(row.leftOp)}`}
              >
                {row.leftText ?? ""}
              </td>
              <td
                className={`px-2 py-0.5 text-muted-foreground text-right w-12 select-none border-r border-border ${cellBg(row.rightOp)}`}
              >
                {row.rightLineNo ?? ""}
              </td>
              <td
                className={`px-3 py-0.5 whitespace-pre w-1/2 ${cellBg(row.rightOp)}`}
              >
                {row.rightText ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsBar({ stats }: { stats: DiffStats }) {
  return (
    <div className="flex gap-4 font-mono text-sm text-muted-foreground">
      <span className="text-green-500">+{stats.added} added</span>
      <span className="text-red-500">-{stats.deleted} deleted</span>
      <span>{stats.unchanged} unchanged</span>
    </div>
  );
}

// --- Main component ---

const CodeDiff = () => {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [viewMode, setViewMode] = useState<"unified" | "side-by-side">("unified");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const stats: DiffStats | null = useMemo(() => {
    if (!diff) return null;
    let added = 0;
    let deleted = 0;
    let unchanged = 0;
    for (const line of diff) {
      if (line.op === "insert") added++;
      else if (line.op === "delete") deleted++;
      else unchanged++;
    }
    return { added, deleted, unchanged };
  }, [diff]);

  const handleCompare = useCallback(() => {
    const result = computeDiff(left, right, ignoreWhitespace, ignoreCase);
    setDiff(result);
  }, [left, right, ignoreWhitespace, ignoreCase]);

  const handleCopyDiff = useCallback(() => {
    if (!diff) return;
    const lines = diff.map((d) => {
      const prefix = d.op === "insert" ? "+" : d.op === "delete" ? "-" : " ";
      return `${prefix} ${d.text}`;
    });
    navigator.clipboard.writeText(lines.join("\n"));
  }, [diff]);

  return (
    <Layout>
      <SEO
        title="Code Diff Tool"
        description="Compare two code snippets side by side. Highlight differences between files with our free online diff checker."
        canonical="/code-diff"
        keywords="code diff, diff checker, compare code, text diff, file comparison"
      />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Code Diff
        </h1>

        {/* Input textareas */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Original
            </label>
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              placeholder="Paste original code here..."
              className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Modified
            </label>
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              placeholder="Paste modified code here..."
              className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={handleCompare}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Compare
          </button>

          {diff && (
            <button
              onClick={handleCopyDiff}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Copy Diff
            </button>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode("unified")}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-colors ${
                viewMode === "unified"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Unified
            </button>
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-colors ${
                viewMode === "side-by-side"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="accent-primary"
            />
            Ignore whitespace
          </label>
          <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="accent-primary"
            />
            Ignore case
          </label>
        </div>

        {/* Stats and diff output */}
        {diff && stats && (
          <div className="space-y-4">
            <StatsBar stats={stats} />
            {viewMode === "unified" ? (
              <UnifiedView diff={diff} />
            ) : (
              <SideBySideView diff={diff} />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CodeDiff;
