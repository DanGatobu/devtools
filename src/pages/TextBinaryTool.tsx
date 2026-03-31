import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type Separator = "space" | "none" | "dash" | "comma";

const separatorMap: Record<Separator, string> = {
  space: " ",
  none: "",
  dash: "-",
  comma: ",",
};

const textToBinary = (text: string, sep: Separator): string => {
  return Array.from(text)
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(separatorMap[sep]);
};

const binaryToText = (binary: string, sep: Separator): string => {
  const cleaned = binary.trim();
  if (!cleaned) return "";

  let chunks: string[];
  if (sep === "none") {
    if (cleaned.length % 8 !== 0) throw new Error("Binary length must be a multiple of 8 when no separator is used");
    chunks = cleaned.match(/.{8}/g) || [];
  } else {
    chunks = cleaned.split(separatorMap[sep]);
  }

  for (const chunk of chunks) {
    if (!/^[01]{1,8}$/.test(chunk)) {
      throw new Error(`Invalid binary value: "${chunk}"`);
    }
  }

  return chunks.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
};

const textToDecimal = (text: string): string => {
  return Array.from(text)
    .map((ch) => ch.charCodeAt(0))
    .join(" ");
};

const textToHex = (text: string): string => {
  return Array.from(text)
    .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
};

const textToOctal = (text: string): string => {
  return Array.from(text)
    .map((ch) => ch.charCodeAt(0).toString(8).padStart(3, "0"))
    .join(" ");
};

const TextBinaryTool = () => {
  const [text, setText] = useState("");
  const [binary, setBinary] = useState("");
  const [separator, setSeparator] = useState<Separator>("space");
  const [error, setError] = useState("");
  const [swapped, setSwapped] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleTextChange = (value: string) => {
    setText(value);
    setError("");
    setBinary(value ? textToBinary(value, separator) : "");
  };

  const handleBinaryChange = (value: string) => {
    setBinary(value);
    setError("");
    try {
      setText(value ? binaryToText(value, separator) : "");
    } catch (e) {
      setText("");
      setError(e instanceof Error ? e.message : "Invalid binary input");
    }
  };

  const handleSeparatorChange = (sep: Separator) => {
    setSeparator(sep);
    setError("");
    if (text) {
      setBinary(textToBinary(text, sep));
    }
  };

  const handleClear = () => {
    setText("");
    setBinary("");
    setError("");
  };

  const handleSwap = () => {
    setSwapped((prev) => !prev);
  };

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const decimal = textToDecimal(text);
  const hex = textToHex(text);
  const octal = textToOctal(text);

  const separatorOptions: { key: Separator; label: string }[] = [
    { key: "space", label: "Space" },
    { key: "none", label: "None" },
    { key: "dash", label: "Dash" },
    { key: "comma", label: "Comma" },
  ];

  const textArea = (
    <div>
      <label className="text-sm font-mono text-muted-foreground mb-2 block">Text</label>
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Enter text..."
      />
    </div>
  );

  const binaryArea = (
    <div>
      <label className="text-sm font-mono text-muted-foreground mb-2 block">Binary</label>
      <textarea
        value={binary}
        onChange={(e) => handleBinaryChange(e.target.value)}
        className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Enter binary..."
      />
    </div>
  );

  return (
    <Layout>
      <SEO title="Text to Binary Converter" description="Convert text to binary, decimal, hexadecimal, and octal. Real-time bidirectional conversion." canonical="/text-binary" keywords="text to binary, binary to text, binary converter, text to hex, ascii to binary" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Text / Binary Converter</h1>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm font-mono text-muted-foreground">Separator:</span>
          {separatorOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSeparatorChange(opt.key)}
              className={
                separator === opt.key
                  ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                  : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
              }
            >
              {opt.label}
            </button>
          ))}
          <div className="ml-auto flex gap-3">
            <button
              onClick={handleSwap}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Swap
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {swapped ? binaryArea : textArea}
          {swapped ? textArea : binaryArea}
        </div>

        {error && (
          <p className="mt-3 text-sm font-mono text-red-500">{error}</p>
        )}

        {text && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {[
              { label: "Decimal", value: decimal },
              { label: "Hexadecimal", value: hex },
              { label: "Octal", value: octal },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-mono text-muted-foreground">{label}</label>
                  <button
                    onClick={() => handleCopy(value, label)}
                    className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {copied === label ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  value={value}
                  readOnly
                  className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TextBinaryTool;
