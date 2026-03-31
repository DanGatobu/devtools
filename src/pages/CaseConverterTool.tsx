import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_./]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function toUpperCase(text: string): string {
  return text.toUpperCase();
}

function toLowerCase(text: string): string {
  return text.toLowerCase();
}

function toTitleCase(text: string): string {
  return text
    .split(/(\s+)/)
    .map((segment) =>
      /^\s+$/.test(segment)
        ? segment
        : segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
    )
    .join("");
}

function toSentenceCase(text: string): string {
  return text
    .split(/([.!?]\s*)/)
    .map((segment, i) => {
      if (i % 2 === 1) return segment;
      const trimmed = segment.replace(/^\s+/, "");
      const leading = segment.slice(0, segment.length - trimmed.length);
      if (!trimmed) return segment;
      return leading + trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    })
    .join("");
}

function toCamelCase(text: string): string {
  const words = splitWords(text);
  if (words.length === 0) return "";
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join("");
}

function toPascalCase(text: string): string {
  return splitWords(text)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

function toSnakeCase(text: string): string {
  return splitWords(text).map((w) => w.toLowerCase()).join("_");
}

function toKebabCase(text: string): string {
  return splitWords(text).map((w) => w.toLowerCase()).join("-");
}

function toConstantCase(text: string): string {
  return splitWords(text).map((w) => w.toUpperCase()).join("_");
}

function toDotCase(text: string): string {
  return splitWords(text).map((w) => w.toLowerCase()).join(".");
}

function toPathCase(text: string): string {
  return splitWords(text).map((w) => w.toLowerCase()).join("/");
}

function toHeaderCase(text: string): string {
  return splitWords(text)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("-");
}

type Converter = {
  label: string;
  fn: (text: string) => string;
};

const converters: Converter[] = [
  { label: "UPPERCASE", fn: toUpperCase },
  { label: "lowercase", fn: toLowerCase },
  { label: "Title Case", fn: toTitleCase },
  { label: "Sentence case", fn: toSentenceCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "PascalCase", fn: toPascalCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
  { label: "CONSTANT_CASE", fn: toConstantCase },
  { label: "dot.case", fn: toDotCase },
  { label: "path/case", fn: toPathCase },
  { label: "Header-Case", fn: toHeaderCase },
];

const CaseConverterTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = (fn: (text: string) => string) => {
    setOutput(fn(input));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
  };

  return (
    <Layout>
      <SEO title="Case Converter" description="Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more." canonical="/case-converter" keywords="case converter, text case changer, uppercase converter, lowercase converter, camelcase converter" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Case Converter</h1>

        <label className="text-sm font-mono text-muted-foreground mb-2 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter text to convert..."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
          {converters.map((c) => (
            <button
              key={c.label}
              onClick={() => handleConvert(c.fn)}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className="text-sm font-mono text-muted-foreground mb-2 block">Output</label>
        <textarea
          value={output}
          readOnly
          className="w-full h-40 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Converted text will appear here..."
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleSwap}
            disabled={!output}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Swap
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CaseConverterTool;
