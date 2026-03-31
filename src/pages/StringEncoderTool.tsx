import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useEffect, useCallback } from "react";

type TabId =
  | "html"
  | "rot13"
  | "unicode"
  | "hex"
  | "decimal"
  | "octal"
  | "json"
  | "sql"
  | "xml"
  | "csv";

interface Tab {
  id: TabId;
  label: string;
  symmetric?: boolean;
}

const tabs: Tab[] = [
  { id: "html", label: "HTML Entities" },
  { id: "rot13", label: "ROT13", symmetric: true },
  { id: "unicode", label: "Unicode Escape" },
  { id: "hex", label: "Hex Encode" },
  { id: "decimal", label: "Decimal Encode" },
  { id: "octal", label: "Octal Encode" },
  { id: "json", label: "JSON Escape" },
  { id: "sql", label: "SQL Escape" },
  { id: "xml", label: "XML Escape" },
  { id: "csv", label: "CSV Escape" },
];

const htmlEntityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "\u00A0": "&nbsp;",
  "\u00A9": "&copy;",
  "\u00AE": "&reg;",
  "\u2122": "&trade;",
  "\u2013": "&ndash;",
  "\u2014": "&mdash;",
  "\u2018": "&lsquo;",
  "\u2019": "&rsquo;",
  "\u201C": "&ldquo;",
  "\u201D": "&rdquo;",
  "\u2026": "&hellip;",
};

const reverseHtmlEntityMap: Record<string, string> = {};
for (const [char, entity] of Object.entries(htmlEntityMap)) {
  reverseHtmlEntityMap[entity] = char;
}

function encodeHtml(text: string): string {
  return text.replace(/[&<>"'\u00A0\u00A9\u00AE\u2122\u2013\u2014\u2018\u2019\u201C\u201D\u2026]/g, (ch) => htmlEntityMap[ch] || ch);
}

function decodeHtml(text: string): string {
  let result = text;
  for (const [entity, char] of Object.entries(reverseHtmlEntityMap)) {
    result = result.split(entity).join(char);
  }
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  return result;
}

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function encodeUnicode(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const code = ch.codePointAt(0)!;
      if (code > 0xffff) {
        return `\\u{${code.toString(16).toUpperCase()}}`;
      }
      return `\\u${code.toString(16).toUpperCase().padStart(4, "0")}`;
    })
    .join("");
}

function decodeUnicode(text: string): string {
  let result = text.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
  result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return result;
}

function encodeHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
    .join("");
}

function decodeHex(text: string): string {
  const clean = text.replace(/\s+/g, "");
  if (clean.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean)) {
    return "Error: invalid hex string";
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

function encodeDecimal(text: string): string {
  return Array.from(text)
    .map((ch) => ch.codePointAt(0))
    .join(" ");
}

function decodeDecimal(text: string): string {
  try {
    return text
      .trim()
      .split(/\s+/)
      .map((n) => String.fromCodePoint(parseInt(n, 10)))
      .join("");
  } catch {
    return "Error: invalid decimal codes";
  }
}

function encodeOctal(text: string): string {
  return Array.from(text)
    .map((ch) => ch.codePointAt(0)!.toString(8))
    .join(" ");
}

function decodeOctal(text: string): string {
  try {
    return text
      .trim()
      .split(/\s+/)
      .map((n) => String.fromCodePoint(parseInt(n, 8)))
      .join("");
  } catch {
    return "Error: invalid octal codes";
  }
}

function encodeJson(text: string): string {
  try {
    const escaped = JSON.stringify(text);
    return escaped.slice(1, -1);
  } catch {
    return "Error: could not escape";
  }
}

function decodeJson(text: string): string {
  try {
    return JSON.parse(`"${text}"`);
  } catch {
    return "Error: invalid JSON escape sequence";
  }
}

function encodeSql(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/'/g, "''");
}

function decodeSql(text: string): string {
  return text.replace(/''/g, "'").replace(/\\\\/g, "\\");
}

function encodeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function decodeXml(text: string): string {
  return text
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function encodeCsv(text: string): string {
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

function decodeCsv(text: string): string {
  let t = text.trim();
  if (t.startsWith('"') && t.endsWith('"')) {
    t = t.slice(1, -1);
  }
  return t.replace(/""/g, '"');
}

const encoders: Record<TabId, (text: string) => string> = {
  html: encodeHtml,
  rot13: rot13,
  unicode: encodeUnicode,
  hex: encodeHex,
  decimal: encodeDecimal,
  octal: encodeOctal,
  json: encodeJson,
  sql: encodeSql,
  xml: encodeXml,
  csv: encodeCsv,
};

const decoders: Record<TabId, (text: string) => string> = {
  html: decodeHtml,
  rot13: rot13,
  unicode: decodeUnicode,
  hex: decodeHex,
  decimal: decodeDecimal,
  octal: decodeOctal,
  json: decodeJson,
  sql: decodeSql,
  xml: decodeXml,
  csv: decodeCsv,
};

const StringEncoderTool = () => {
  const [activeTab, setActiveTab] = useState<TabId>("html");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const runTransform = useCallback(
    (text: string, tab: TabId, dir: "encode" | "decode") => {
      if (!text) {
        setOutput("");
        return;
      }
      try {
        const fn = dir === "encode" ? encoders[tab] : decoders[tab];
        setOutput(fn(text));
      } catch {
        setOutput("Error processing input");
      }
    },
    []
  );

  useEffect(() => {
    runTransform(input, activeTab, mode);
  }, [input, activeTab, mode, runTransform]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      /* clipboard not available */
    }
  };

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <Layout>
      <SEO title="String Encoder/Decoder" description="Encode and decode HTML entities, ROT13, Unicode, hex, JSON escape, SQL escape, and more." canonical="/string-encoder" keywords="html entity encoder, rot13, json escape, sql escape, unicode escape, string encoder" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          String Encoder / Decoder
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={
                activeTab === tab.id
                  ? "px-3 py-1.5 rounded-md font-mono text-sm bg-primary text-primary-foreground"
                  : "px-3 py-1.5 rounded-md font-mono text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter text..."
            />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Output
            </label>
            <textarea
              value={output}
              readOnly
              className="w-full h-40 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {currentTab.symmetric ? (
            <button
              onClick={() => {
                setMode("encode");
                runTransform(input, activeTab, "encode");
              }}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Apply ROT13
            </button>
          ) : (
            <>
              <button
                onClick={() => setMode("encode")}
                className={
                  mode === "encode"
                    ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                    : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                }
              >
                Encode
              </button>
              <button
                onClick={() => setMode("decode")}
                className={
                  mode === "decode"
                    ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                    : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                }
              >
                Decode
              </button>
            </>
          )}
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default StringEncoderTool;
