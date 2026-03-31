import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const absDiff = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label: string;
  if (seconds < 60) label = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  else if (minutes < 60) label = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  else if (hours < 24) label = `${hours} hour${hours !== 1 ? "s" : ""}`;
  else if (days < 30) label = `${days} day${days !== 1 ? "s" : ""}`;
  else if (months < 12) label = `${months} month${months !== 1 ? "s" : ""}`;
  else label = `${years} year${years !== 1 ? "s" : ""}`;

  return isFuture ? `in ${label}` : `${label} ago`;
}

function normalizeToMs(value: number): number {
  return value > 9999999999 ? value : value * 1000;
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

const inputClass =
  "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const primaryBtn =
  "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";
const secondaryBtn =
  "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} className={secondaryBtn}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-b-0">
      <div>
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
        <p className="font-mono text-sm text-foreground break-all">{value}</p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

function TimestampConverterTool() {
  const [now, setNow] = useState(Date.now());

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Timestamp to Date
  const [tsInput, setTsInput] = useState("");
  const [tsError, setTsError] = useState("");
  const [tsResults, setTsResults] = useState<
    { local: string; utc: string; iso: string; relative: string } | null
  >(null);

  useEffect(() => {
    if (!tsInput.trim()) {
      setTsError("");
      setTsResults(null);
      return;
    }
    const num = Number(tsInput.trim());
    if (isNaN(num) || !isFinite(num)) {
      setTsError("Invalid timestamp. Please enter a numeric Unix timestamp.");
      setTsResults(null);
      return;
    }
    const ms = normalizeToMs(num);
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setTsError("Timestamp out of range.");
      setTsResults(null);
      return;
    }
    setTsError("");
    setTsResults({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: formatRelativeTime(ms),
    });
  }, [tsInput, now]);

  // Date to Timestamp
  const [dateInput, setDateInput] = useState("");
  const [dateError, setDateError] = useState("");
  const [dateResults, setDateResults] = useState<
    { seconds: string; milliseconds: string } | null
  >(null);

  useEffect(() => {
    if (!dateInput) {
      setDateError("");
      setDateResults(null);
      return;
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setDateError("Invalid date.");
      setDateResults(null);
      return;
    }
    setDateError("");
    const ms = date.getTime();
    setDateResults({
      seconds: String(Math.floor(ms / 1000)),
      milliseconds: String(ms),
    });
  }, [dateInput]);

  const nowSeconds = Math.floor(now / 1000);
  const nowMs = now;

  return (
    <Layout>
      <SEO title="Unix Timestamp Converter" description="Convert Unix timestamps to human-readable dates and back. Live current timestamp with auto-detect seconds/milliseconds." canonical="/timestamp-converter" keywords="unix timestamp converter, epoch converter, timestamp to date, date to timestamp" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Unix Timestamp Converter
        </h1>

        {/* Live current timestamp */}
        <div className="bg-primary/10 rounded-lg p-4 text-center mb-8">
          <p className="text-xs text-muted-foreground font-mono mb-1">
            Current Unix Timestamp
          </p>
          <p className="text-2xl font-mono font-bold text-foreground">
            {nowSeconds}
          </p>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            {nowMs} ms
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <CopyButton value={String(nowSeconds)} />
            <button
              className={secondaryBtn}
              onClick={() => copyToClipboard(String(nowMs))}
            >
              Copy ms
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Timestamp to Date */}
          <div className="bg-secondary rounded-lg border border-border p-4">
            <h2 className="text-lg font-mono font-semibold text-foreground mb-4">
              Timestamp to Date
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter Unix timestamp (seconds or milliseconds)"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                className={inputClass}
              />
              <button
                className={primaryBtn}
                onClick={() => setTsInput(String(nowSeconds))}
              >
                Now
              </button>
            </div>
            {tsInput.trim() && !tsError && (
              <p className="text-xs text-muted-foreground font-mono mb-2">
                Detected: {Number(tsInput.trim()) > 9999999999 ? "milliseconds" : "seconds"}
              </p>
            )}
            {tsError && (
              <p className="text-destructive text-sm font-mono mb-2">{tsError}</p>
            )}
            {tsResults && (
              <div className="mt-2">
                <ResultRow label="Local Time" value={tsResults.local} />
                <ResultRow label="UTC Time" value={tsResults.utc} />
                <ResultRow label="ISO 8601" value={tsResults.iso} />
                <ResultRow label="Relative" value={tsResults.relative} />
              </div>
            )}
          </div>

          {/* Date to Timestamp */}
          <div className="bg-secondary rounded-lg border border-border p-4">
            <h2 className="text-lg font-mono font-semibold text-foreground mb-4">
              Date to Timestamp
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className={inputClass}
                step="1"
              />
              <button
                className={primaryBtn}
                onClick={() => setDateInput(toLocalDatetimeString(new Date()))}
              >
                Now
              </button>
            </div>
            {dateError && (
              <p className="text-destructive text-sm font-mono mb-2">{dateError}</p>
            )}
            {dateResults && (
              <div className="mt-2">
                <ResultRow label="Seconds" value={dateResults.seconds} />
                <ResultRow label="Milliseconds" value={dateResults.milliseconds} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TimestampConverterTool;
