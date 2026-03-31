import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useCallback } from "react";

type Language = "json" | "xml" | "html" | "css" | "sql" | "javascript";

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "xml", label: "XML" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "sql", label: "SQL" },
  { id: "javascript", label: "JavaScript" },
];

type IndentOption = "2" | "4" | "8" | "tab";

function getIndentStr(option: IndentOption): string {
  if (option === "tab") return "\t";
  return " ".repeat(Number(option));
}

// --- JSON ---
function formatJSON(input: string, indent: IndentOption): string {
  const parsed = JSON.parse(input);
  const indentValue = indent === "tab" ? "\t" : Number(indent);
  return JSON.stringify(parsed, null, indentValue);
}

function minifyJSON(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

// --- XML ---
function formatXML(input: string, indent: IndentOption): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + errorNode.textContent);
  }
  const ind = getIndentStr(indent);

  function serializeNode(node: Node, depth: number): string {
    const prefix = ind.repeat(depth);
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || "").trim();
      return text ? prefix + text + "\n" : "";
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      return prefix + "<!--" + node.textContent + "-->\n";
    }
    if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const pi = node as ProcessingInstruction;
      return prefix + "<?" + pi.target + " " + pi.data + "?>\n";
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      let result = prefix + "<" + el.tagName;
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        result += ` ${attr.name}="${attr.value}"`;
      }
      if (!el.childNodes.length) {
        return result + " />\n";
      }
      result += ">";
      // If only a single text child, keep inline
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        const text = (el.childNodes[0].textContent || "").trim();
        return result + text + "</" + el.tagName + ">\n";
      }
      result += "\n";
      for (let i = 0; i < el.childNodes.length; i++) {
        result += serializeNode(el.childNodes[i], depth + 1);
      }
      result += prefix + "</" + el.tagName + ">\n";
      return result;
    }
    if (node.nodeType === Node.DOCUMENT_NODE) {
      let result = "";
      for (let i = 0; i < node.childNodes.length; i++) {
        result += serializeNode(node.childNodes[i], depth);
      }
      return result;
    }
    return "";
  }

  return serializeNode(doc, 0).trim();
}

function minifyXML(input: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + errorNode.textContent);
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc).replace(/>\s+</g, "><").trim();
}

// --- HTML ---
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);
const PRESERVE_CONTENT_ELEMENTS = new Set(["pre", "code", "script", "style"]);

function formatHTML(input: string, indent: IndentOption): string {
  const ind = getIndentStr(indent);
  // Split on tags while keeping them
  const tokens = input.replace(/>\s*</g, ">\n<").split("\n");
  const lines: string[] = [];
  let depth = 0;
  let preserving = false;
  let preserveTag = "";

  for (const rawToken of tokens) {
    const token = rawToken.trim();
    if (!token) continue;

    // Check if we're inside a preserve-content element
    if (preserving) {
      lines.push(ind.repeat(depth) + token);
      const closingMatch = token.match(new RegExp(`^</${preserveTag}`, "i"));
      if (closingMatch) {
        preserving = false;
        preserveTag = "";
        depth--;
      }
      continue;
    }

    // Closing tag
    const closingTagMatch = token.match(/^<\/(\w+)/);
    if (closingTagMatch) {
      depth = Math.max(0, depth - 1);
      lines.push(ind.repeat(depth) + token);
      continue;
    }

    // Opening tag
    const openingTagMatch = token.match(/^<(\w+)/);
    if (openingTagMatch) {
      const tagName = openingTagMatch[1].toLowerCase();
      lines.push(ind.repeat(depth) + token);

      if (PRESERVE_CONTENT_ELEMENTS.has(tagName) && !token.match(new RegExp(`</${tagName}`, "i"))) {
        preserving = true;
        preserveTag = tagName;
        depth++;
        continue;
      }

      // Self-closing or void element: no depth change
      if (token.endsWith("/>") || VOID_ELEMENTS.has(tagName)) {
        continue;
      }
      // Inline open+close on same token (e.g. <span>text</span>)
      if (token.match(new RegExp(`</${tagName}>\\s*$`, "i"))) {
        continue;
      }
      depth++;
      continue;
    }

    // Plain text or other content
    lines.push(ind.repeat(depth) + token);
  }

  return lines.join("\n");
}

function minifyHTML(input: string): string {
  return input
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

// --- CSS ---
function formatCSS(input: string, indent: IndentOption): string {
  const ind = getIndentStr(indent);
  let result = "";
  let depth = 0;

  // Normalize whitespace but preserve strings
  const normalized = input.replace(/\s+/g, " ").trim();
  let i = 0;

  while (i < normalized.length) {
    const ch = normalized[i];

    if (ch === "{") {
      result = result.trimEnd() + " {\n";
      depth++;
      i++;
      // Skip whitespace after brace
      while (i < normalized.length && normalized[i] === " ") i++;
      continue;
    }

    if (ch === "}") {
      depth = Math.max(0, depth - 1);
      result = result.trimEnd() + "\n" + ind.repeat(depth) + "}\n";
      i++;
      // Skip whitespace after brace
      while (i < normalized.length && normalized[i] === " ") i++;
      // Add blank line between top-level rules
      if (depth === 0 && i < normalized.length && normalized[i] !== "}") {
        result += "\n";
      }
      continue;
    }

    if (ch === ";") {
      result += ";\n";
      i++;
      // Skip whitespace after semicolon
      while (i < normalized.length && normalized[i] === " ") i++;
      // If next char is not }, add indent
      if (i < normalized.length && normalized[i] !== "}") {
        result += ind.repeat(depth);
      }
      continue;
    }

    // Start of a new line content
    if (result.endsWith("\n") || result === "") {
      result += ind.repeat(depth);
    }

    result += ch;
    i++;
  }

  return result.trim();
}

function minifyCSS(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

// --- SQL ---
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "ON", "AND", "OR",
  "ORDER BY", "GROUP BY", "HAVING", "INSERT", "UPDATE", "DELETE",
  "CREATE", "ALTER", "DROP", "SET", "VALUES", "INTO",
  "INNER", "LEFT", "RIGHT", "OUTER", "UNION",
  "LIMIT", "OFFSET", "AS", "BETWEEN", "IN", "NOT", "NULL",
  "IS", "LIKE", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END",
];

const SQL_MAJOR_CLAUSES = new Set([
  "SELECT", "FROM", "WHERE", "JOIN", "INNER JOIN", "LEFT JOIN",
  "RIGHT JOIN", "OUTER JOIN", "ORDER BY", "GROUP BY", "HAVING",
  "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP",
  "SET", "VALUES", "UNION", "LIMIT", "OFFSET", "ON",
]);

function formatSQL(input: string, indent: IndentOption): string {
  const ind = getIndentStr(indent);

  // Uppercase keywords
  let sql = input;
  // Sort keywords by length descending so longer matches take priority
  const sortedKeywords = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sortedKeywords) {
    const regex = new RegExp("\\b" + kw.replace(/ /g, "\\s+") + "\\b", "gi");
    sql = sql.replace(regex, kw);
  }

  // Normalize whitespace
  sql = sql.replace(/\s+/g, " ").trim();

  // Insert newlines before major clauses
  const sortedClauses = [...SQL_MAJOR_CLAUSES].sort((a, b) => b.length - a.length);
  for (const clause of sortedClauses) {
    const regex = new RegExp("\\b(" + clause.replace(/ /g, " ") + ")\\b", "g");
    sql = sql.replace(regex, "\n$1");
  }

  // Handle subqueries: indent content inside parentheses
  const lines = sql.split("\n").filter((l) => l.trim());
  const result: string[] = [];
  let depth = 0;

  for (const line of lines) {
    let trimmed = line.trim();
    // Count parens to track subquery depth
    const openParens = (trimmed.match(/\(/g) || []).length;
    const closeParens = (trimmed.match(/\)/g) || []).length;

    // Decrease depth for closing parens at start
    if (trimmed.startsWith(")")) {
      depth = Math.max(0, depth - 1);
    }

    result.push(ind.repeat(depth) + trimmed);
    depth += openParens - closeParens;
    depth = Math.max(0, depth);
  }

  return result.join("\n").trim();
}

function minifySQL(input: string): string {
  // Uppercase keywords, collapse whitespace
  let sql = input;
  const sortedKeywords = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sortedKeywords) {
    const regex = new RegExp("\\b" + kw.replace(/ /g, "\\s+") + "\\b", "gi");
    sql = sql.replace(regex, kw);
  }
  return sql.replace(/\s+/g, " ").trim();
}

// --- JavaScript ---
function formatJavaScript(input: string, indent: IndentOption): string {
  const ind = getIndentStr(indent);
  let depth = 0;
  const lines: string[] = [];
  let current = "";

  // Normalize input: collapse to single line then split on meaningful boundaries
  const normalized = input.replace(/\s+/g, " ").trim();

  let i = 0;
  let inString: string | null = null;
  let escaped = false;

  while (i < normalized.length) {
    const ch = normalized[i];

    // Handle string literals
    if (inString) {
      current += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      current += ch;
      i++;
      continue;
    }

    // Handle single-line comments
    if (ch === "/" && normalized[i + 1] === "/") {
      // Read until something that looks like end of comment
      let comment = "//";
      i += 2;
      while (i < normalized.length && normalized[i] !== "\n") {
        comment += normalized[i];
        i++;
      }
      current += comment;
      continue;
    }

    if (ch === "{") {
      current += " {";
      lines.push(ind.repeat(depth) + current.trim());
      current = "";
      depth++;
      i++;
      while (i < normalized.length && normalized[i] === " ") i++;
      continue;
    }

    if (ch === "}") {
      if (current.trim()) {
        lines.push(ind.repeat(depth) + current.trim());
        current = "";
      }
      depth = Math.max(0, depth - 1);
      lines.push(ind.repeat(depth) + "}");
      i++;
      // Check if next is else, catch, etc.
      while (i < normalized.length && normalized[i] === " ") i++;
      continue;
    }

    if (ch === ";") {
      current += ";";
      lines.push(ind.repeat(depth) + current.trim());
      current = "";
      i++;
      while (i < normalized.length && normalized[i] === " ") i++;
      continue;
    }

    current += ch;
    i++;
  }

  if (current.trim()) {
    lines.push(ind.repeat(depth) + current.trim());
  }

  // Remove extra blank lines
  return lines
    .filter((line, idx, arr) => {
      if (line.trim() === "" && idx > 0 && arr[idx - 1].trim() === "") return false;
      return true;
    })
    .join("\n");
}

function minifyJavaScript(input: string): string {
  // Very basic: collapse whitespace, preserve strings
  let result = "";
  let inString: string | null = null;
  let escaped = false;
  const src = input.replace(/\/\/[^\n]*\n/g, "\n").replace(/\/\*[\s\S]*?\*\//g, " ");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      result += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      result += ch;
      continue;
    }
    if (/\s/.test(ch)) {
      // Collapse whitespace to single space only if needed
      if (result.length > 0 && /\w/.test(result[result.length - 1]) && i + 1 < src.length && /\w/.test(src[i + 1])) {
        result += " ";
      }
      continue;
    }
    result += ch;
  }
  return result.trim();
}

// --- Dispatcher ---
function formatCode(input: string, lang: Language, indent: IndentOption): string {
  switch (lang) {
    case "json": return formatJSON(input, indent);
    case "xml": return formatXML(input, indent);
    case "html": return formatHTML(input, indent);
    case "css": return formatCSS(input, indent);
    case "sql": return formatSQL(input, indent);
    case "javascript": return formatJavaScript(input, indent);
  }
}

function minifyCode(input: string, lang: Language): string {
  switch (lang) {
    case "json": return minifyJSON(input);
    case "xml": return minifyXML(input);
    case "html": return minifyHTML(input);
    case "css": return minifyCSS(input);
    case "sql": return minifySQL(input);
    case "javascript": return minifyJavaScript(input);
  }
}

function byteSize(s: string): number {
  return new Blob([s]).size;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  return (bytes / 1024).toFixed(1) + " KB";
}

const CodeFormatterPage = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<Language>("json");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const result = formatCode(input, language, indent);
      setOutput(result);
      setError(null);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Failed to format. Check your input.");
    }
  }, [input, language, indent]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const result = minifyCode(input, language);
      setOutput(result);
      setError(null);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Failed to minify. Check your input.");
    }
  }, [input, language]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const inputSize = byteSize(input);
  const outputSize = byteSize(output);

  return (
    <Layout>
      <SEO
        title="Code Formatter"
        description="Format and beautify code in JavaScript, Python, HTML, CSS, SQL, and more. Free online code beautifier."
        canonical="/code-formatter"
        keywords="code formatter, code beautifier, javascript formatter, python formatter, html formatter"
      />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Code Formatter
        </h1>

        {/* Language tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setError(null);
              }}
              className={
                language === lang.id
                  ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                  : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
              }
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={handleFormat}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Minify
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy Output"}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="font-mono text-sm text-muted-foreground">Indent:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value as IndentOption)}
              className="bg-secondary border border-border rounded-md px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-400 bg-red-950/30 text-red-400 font-mono text-sm">
            {error}
          </div>
        )}

        {/* Side-by-side textareas */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Paste your code here..."
              spellCheck={false}
            />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Output</label>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Formatted output will appear here..."
            />
          </div>
        </div>

        {/* Stats */}
        {(input || output) && (
          <div className="flex gap-6 mt-3">
            <span className="font-mono text-xs text-muted-foreground">
              Input: {formatSize(inputSize)}
            </span>
            {output && (
              <span className="font-mono text-xs text-muted-foreground">
                Output: {formatSize(outputSize)}
              </span>
            )}
            {input && output && (
              <span className="font-mono text-xs text-muted-foreground">
                {outputSize > inputSize ? "+" : ""}
                {((outputSize - inputSize) / Math.max(inputSize, 1) * 100).toFixed(0)}% size change
              </span>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CodeFormatterPage;
