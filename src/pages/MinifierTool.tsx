import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type Language = "html" | "css" | "javascript";

const minifyHTML = (code: string): string => {
  let result = code;
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  result = result.replace(/\s+/g, " ");
  result = result.replace(/>\s+</g, "><");
  result = result.trim();
  return result;
};

const minifyCSS = (code: string): string => {
  let result = code;
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result.replace(/\s+/g, " ");
  result = result.replace(/\s*([{}:;,])\s*/g, "$1");
  result = result.replace(/;}/g, "}");
  result = result.trim();
  return result;
};

const minifyJS = (code: string): string => {
  let result = code;
  // Remove multi-line comments but preserve license comments /*! ... */
  result = result.replace(/\/\*(?!!)([\s\S]*?)\*\//g, "");
  // Remove single-line comments but not inside strings
  result = result.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1|(\/\/.*$)/gm, (match, quote) => {
    return quote ? match : "";
  });
  // Collapse multiple whitespace/newlines into single spaces
  result = result.replace(/\s+/g, " ");
  // Remove whitespace around safe punctuation only: {}()[]:;,
  // Do NOT remove spaces around =, +, -, *, /, <, >, !, &, |, ? to preserve keyword spacing
  result = result.replace(/\s*([{}()\[\];,:])\s*/g, "$1");
  result = result.trim();
  return result;
};

const beautifyHTML = (code: string): string => {
  let result = code.replace(/>\s*</g, ">\n<");
  const lines = result.split("\n");
  let indent = 0;
  const output: string[] = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("</")) {
      indent = Math.max(0, indent - 1);
    }
    output.push("  ".repeat(indent) + line);
    if (
      line.match(/^<[^/!][^>]*[^/]>$/) &&
      !line.match(/^<(img|br|hr|input|meta|link|area|base|col|embed|source|track|wbr)\b/i)
    ) {
      indent++;
    }
  }
  return output.join("\n");
};

const beautifyCSS = (code: string): string => {
  let result = code.replace(/\/\*[\s\S]*?\*\//g, "").trim();
  result = result.replace(/\s*\{\s*/g, " {\n  ");
  result = result.replace(/\s*;\s*/g, ";\n  ");
  result = result.replace(/\s*\}\s*/g, "\n}\n");
  result = result.replace(/  \n}/g, "\n}");
  result = result.trim();
  return result;
};

const beautifyJS = (code: string): string => {
  let result = code.trim();
  // Normalize whitespace
  result = result.replace(/\s+/g, " ");

  const output: string[] = [];
  let indent = 0;
  let currentLine = "";
  let forDepth = 0; // track parentheses inside for(...) to avoid splitting on ; there

  for (let i = 0; i < result.length; i++) {
    const ch = result[i];

    // Track for-loop parentheses so we don't split on ; inside for(...)
    if (result.slice(i - 3, i + 1).match(/for\s*\(/) || (forDepth > 0 && ch === "(")) {
      if (ch === "(") forDepth++;
    }
    if (forDepth > 0 && ch === ")") {
      forDepth--;
    }

    if (ch === "{") {
      currentLine = currentLine.trimEnd() + " {";
      output.push("  ".repeat(indent) + currentLine.trim());
      indent++;
      currentLine = "";
    } else if (ch === "}") {
      if (currentLine.trim()) {
        output.push("  ".repeat(indent) + currentLine.trim());
        currentLine = "";
      }
      indent = Math.max(0, indent - 1);
      output.push("  ".repeat(indent) + "}");
    } else if (ch === ";" && forDepth === 0) {
      currentLine += ";";
      output.push("  ".repeat(indent) + currentLine.trim());
      currentLine = "";
    } else {
      currentLine += ch;
    }
  }

  if (currentLine.trim()) {
    output.push("  ".repeat(indent) + currentLine.trim());
  }

  return output.join("\n");
};

const MinifierTool = () => {
  const [language, setLanguage] = useState<Language>("html");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const languages: { key: Language; label: string }[] = [
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" },
    { key: "javascript", label: "JavaScript" },
  ];

  const handleMinify = () => {
    try {
      setError("");
      if (!input.trim()) {
        setError("Please enter some code to minify.");
        setOutput("");
        return;
      }
      let result = "";
      switch (language) {
        case "html":
          result = minifyHTML(input);
          break;
        case "css":
          result = minifyCSS(input);
          break;
        case "javascript":
          result = minifyJS(input);
          break;
      }
      setOutput(result);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleBeautify = () => {
    try {
      setError("");
      if (!input.trim()) {
        setError("Please enter some code to beautify.");
        setOutput("");
        return;
      }
      let result = "";
      switch (language) {
        case "html":
          result = beautifyHTML(input);
          break;
        case "css":
          result = beautifyCSS(input);
          break;
        case "javascript":
          result = beautifyJS(input);
          break;
      }
      setOutput(result);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
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

  const originalSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const reduction =
    originalSize > 0 && output
      ? Math.round(((originalSize - outputSize) / originalSize) * 100)
      : 0;

  return (
    <Layout>
      <SEO title="HTML CSS JS Minifier" description="Minify and beautify HTML, CSS, and JavaScript code. Reduce file sizes with our free online minifier." canonical="/minifier" keywords="html minifier, css minifier, javascript minifier, js minifier, code minifier" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Code Minifier / Beautifier
        </h1>

        {/* Language Tabs */}
        <div className="flex gap-2 mb-6">
          {languages.map((lang) => (
            <button
              key={lang.key}
              onClick={() => {
                setLanguage(lang.key);
                setOutput("");
                setError("");
              }}
              className={
                language === lang.key
                  ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                  : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
              }
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleMinify}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Minify
          </button>
          <button
            onClick={handleBeautify}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Beautify
          </button>
        </div>

        {error && (
          <p className="text-destructive text-sm font-mono mt-2">{error}</p>
        )}

        {/* Side-by-side Textareas */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={
                language === "html"
                  ? "<div>  <p>Hello</p>  </div>"
                  : language === "css"
                  ? "body { color: red; margin: 0; }"
                  : "function hello() { return 'world'; }"
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground block">
                Output
              </label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Output will appear here..."
            />
          </div>
        </div>

        {/* Stats Bar */}
        {output && (
          <div className="mt-4 flex gap-6 items-center bg-secondary rounded-lg border border-border p-4">
            <span className="text-sm font-mono text-muted-foreground">
              Original:{" "}
              <span className="text-foreground">{originalSize} bytes</span>
            </span>
            <span className="text-sm font-mono text-muted-foreground">
              Output:{" "}
              <span className="text-foreground">{outputSize} bytes</span>
            </span>
            <span className="text-sm font-mono text-muted-foreground">
              Reduction:{" "}
              <span className="text-primary">{reduction}%</span>
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MinifierTool;
