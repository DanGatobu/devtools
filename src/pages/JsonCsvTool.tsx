import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

type Tab = "json-to-csv" | "csv-to-json";

function escapeCsvValue(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function jsonToCsv(jsonString: string): string {
  const data = JSON.parse(jsonString);
  if (!Array.isArray(data)) {
    throw new Error("Input must be a JSON array of objects.");
  }
  if (data.length === 0) {
    throw new Error("JSON array is empty.");
  }

  const headers = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  );

  const headerRow = headers.map((h) => escapeCsvValue(String(h))).join(",");

  const rows = data.map((item) =>
    headers
      .map((h) => {
        const val = item[h];
        if (val === null || val === undefined) return "";
        return escapeCsvValue(String(val));
      })
      .join(",")
  );

  return [headerRow, ...rows].join("\n");
}

function csvToJson(csvString: string): string {
  const lines = csvString.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row.");
  }

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseRow(lines[0]);
  const objects = lines.slice(1).map((line) => {
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] ?? "";
    });
    return obj;
  });

  return JSON.stringify(objects, null, 2);
}

const sampleJson = `[
  { "name": "Alice Johnson", "age": 30, "city": "New York" },
  { "name": "Bob Smith", "age": 25, "city": "San Francisco" },
  { "name": "Charlie, Jr.", "age": 35, "city": "Chicago" }
]`;

const sampleCsv = `name,age,city
Alice Johnson,30,New York
Bob Smith,25,San Francisco
"Charlie, Jr.",35,Chicago`;

const tabButtonBase =
  "px-4 py-2 rounded-md font-mono text-sm transition-colors";

export default function JsonCsvTool() {
  const [tab, setTab] = useState<Tab>("json-to-csv");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    setOutput("");
    setCopied(false);
    try {
      if (tab === "json-to-csv") {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleDownload = () => {
    const isJson = tab === "csv-to-json";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isJson ? "output.json" : "output.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSampleData = () => {
    setError("");
    setOutput("");
    setCopied(false);
    setInput(tab === "json-to-csv" ? sampleJson : sampleCsv);
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <Layout>
      <SEO title="JSON to CSV Converter" description="Convert between JSON and CSV formats. Download results as files. Handles nested objects and proper CSV escaping." canonical="/json-csv" keywords="json to csv, csv to json, json csv converter, convert json to csv online" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          JSON / CSV Converter
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            className={`${tabButtonBase} ${
              tab === "json-to-csv"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => handleTabChange("json-to-csv")}
          >
            JSON to CSV
          </button>
          <button
            className={`${tabButtonBase} ${
              tab === "csv-to-json"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => handleTabChange("csv-to-json")}
          >
            CSV to JSON
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              {tab === "json-to-csv" ? "JSON Input" : "CSV Input"}
            </label>
            <textarea
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                tab === "json-to-csv"
                  ? 'Paste JSON array here, e.g. [{"key": "value"}, ...]'
                  : "Paste CSV here (first row = headers)"
              }
              spellCheck={false}
            />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              {tab === "json-to-csv" ? "CSV Output" : "JSON Output"}
            </label>
            <textarea
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              value={output}
              readOnly
              placeholder="Output will appear here..."
            />
          </div>
        </div>

        {error && (
          <p className="text-destructive text-sm font-mono mt-2">{error}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            onClick={handleConvert}
          >
            Convert
          </button>
          <button
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            onClick={handleSampleData}
          >
            Sample Data
          </button>
          <button
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            onClick={handleCopy}
            disabled={!output}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            onClick={handleDownload}
            disabled={!output}
          >
            Download
          </button>
        </div>
      </div>
    </Layout>
  );
}
