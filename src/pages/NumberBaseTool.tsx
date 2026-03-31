import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const BASES = [
  { name: "Decimal", base: 10, regex: /^[0-9]+$/ },
  { name: "Binary", base: 2, regex: /^[01]+$/ },
  { name: "Octal", base: 8, regex: /^[0-7]+$/ },
  { name: "Hexadecimal", base: 16, regex: /^[0-9a-fA-F]+$/i },
];

function toBigInt(value: string, base: number): bigint {
  if (!value) return 0n;
  const digits = value.toLowerCase();
  let result = 0n;
  for (const ch of digits) {
    const d = parseInt(ch, 36);
    result = result * BigInt(base) + BigInt(d);
  }
  return result;
}

function fromBigInt(value: bigint, base: number): string {
  if (value === 0n) return "0";
  const chars = "0123456789abcdef";
  const b = BigInt(base);
  let result = "";
  let v = value;
  while (v > 0n) {
    result = chars[Number(v % b)] + result;
    v = v / b;
  }
  return result;
}

function fromBigIntArbitrary(value: bigint, base: number): string {
  if (value === 0n) return "0";
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const b = BigInt(base);
  let result = "";
  let v = value;
  while (v > 0n) {
    result = chars[Number(v % b)] + result;
    v = v / b;
  }
  return result;
}

type BitWidth = 8 | 16 | 32;

const NumberBaseTool = () => {
  const [values, setValues] = useState<Record<string, string>>({
    Decimal: "",
    Binary: "",
    Octal: "",
    Hexadecimal: "",
  });
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState("");
  const [copied, setCopied] = useState("");

  const [swapFrom, setSwapFrom] = useState(10);
  const [swapTo, setSwapTo] = useState(16);
  const [swapInput, setSwapInput] = useState("");
  const [swapOutput, setSwapOutput] = useState("");
  const [swapError, setSwapError] = useState("");

  const [currentNumber, setCurrentNumber] = useState<bigint | null>(null);
  const [bitWidth, setBitWidth] = useState<BitWidth>(8);

  const handleChange = (name: string, raw: string) => {
    setActiveField(name);

    if (raw === "") {
      setValues({ Decimal: "", Binary: "", Octal: "", Hexadecimal: "" });
      setError("");
      setCurrentNumber(null);
      return;
    }

    const entry = BASES.find((b) => b.name === name)!;
    if (!entry.regex.test(raw)) {
      setValues((prev) => ({ ...prev, [name]: raw }));
      setError(`Invalid ${name.toLowerCase()} input`);
      return;
    }

    setError("");
    const num = toBigInt(raw, entry.base);
    setCurrentNumber(num);

    const next: Record<string, string> = {};
    for (const b of BASES) {
      if (b.name === name) {
        next[b.name] = raw;
      } else {
        next[b.name] = fromBigInt(num, b.base);
      }
    }
    setValues(next);
  };

  const clearAll = () => {
    setValues({ Decimal: "", Binary: "", Octal: "", Hexadecimal: "" });
    setError("");
    setActiveField("");
    setCurrentNumber(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const handleSwapInput = (raw: string) => {
    setSwapInput(raw);
    if (raw === "") {
      setSwapOutput("");
      setSwapError("");
      return;
    }
    const validChars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, swapFrom);
    const regex = new RegExp(`^[${validChars}]+$`, "i");
    if (!regex.test(raw)) {
      setSwapError(`Invalid input for base ${swapFrom}`);
      setSwapOutput("");
      return;
    }
    setSwapError("");
    const num = toBigInt(raw.toLowerCase(), swapFrom);
    setSwapOutput(fromBigIntArbitrary(num, swapTo));
  };

  // Re-convert when bases change
  const updateSwapFrom = (base: number) => {
    setSwapFrom(base);
    setSwapInput("");
    setSwapOutput("");
    setSwapError("");
  };

  const updateSwapTo = (base: number) => {
    setSwapTo(base);
    if (swapInput && !swapError) {
      const num = toBigInt(swapInput.toLowerCase(), swapFrom);
      setSwapOutput(fromBigIntArbitrary(num, base));
    }
  };

  // Bit visualizer
  const fitsInBits = (num: bigint, bits: number) => num >= 0n && num < 1n << BigInt(bits);

  const getBits = (num: bigint, width: number): number[] => {
    const bits: number[] = [];
    for (let i = width - 1; i >= 0; i--) {
      bits.push(Number((num >> BigInt(i)) & 1n));
    }
    return bits;
  };

  const showVisualizer = currentNumber !== null && currentNumber >= 0n;
  const availableWidths: BitWidth[] = [8, 16, 32];

  return (
    <Layout>
      <SEO title="Number Base Converter" description="Convert between decimal, binary, hexadecimal, and octal number systems. Supports BigInt for large numbers." canonical="/number-base" keywords="binary converter, hex converter, decimal to binary, binary to decimal, number base converter" />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Number Base Converter
        </h1>

        {/* Main conversion fields */}
        <div className="space-y-4">
          {BASES.map(({ name }) => (
            <div key={name}>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                {name}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={values[name]}
                  onChange={(e) => handleChange(name, e.target.value)}
                  placeholder={`Enter ${name.toLowerCase()} value`}
                  className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => copyToClipboard(values[name], name)}
                  className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm border border-border hover:bg-secondary/80 transition-colors whitespace-nowrap"
                >
                  {copied === name ? "Copied!" : "Copy"}
                </button>
              </div>
              {error && activeField === name && (
                <p className="text-destructive text-sm font-mono mt-2">{error}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Clear All
          </button>
        </div>

        {/* Bit Visualizer */}
        {showVisualizer && (
          <div className="bg-secondary rounded-lg border border-border p-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono font-bold text-foreground">
                Bit Representation
              </h2>
              <div className="flex gap-2">
                {availableWidths.map((w) => (
                  <button
                    key={w}
                    onClick={() => setBitWidth(w)}
                    className={`px-2 py-1 rounded text-xs font-mono border transition-colors ${
                      bitWidth === w
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80"
                    }`}
                  >
                    {w}-bit
                  </button>
                ))}
              </div>
            </div>
            {fitsInBits(currentNumber!, bitWidth) ? (
              <div className="flex flex-wrap gap-px">
                {getBits(currentNumber!, bitWidth).map((bit, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 flex items-center justify-center text-xs font-mono border rounded-sm ${
                        bit === 1
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      {bit}
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground mt-0.5">
                      {bitWidth - 1 - i}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm font-mono">
                Number exceeds {bitWidth}-bit range. Select a larger width or the number
                exceeds 32 bits.
              </p>
            )}
          </div>
        )}

        {/* Custom Base Swap Section */}
        <div className="bg-secondary rounded-lg border border-border p-4 mt-6">
          <h2 className="text-sm font-mono font-bold text-foreground mb-3">
            Custom Base Conversion
          </h2>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                From (base)
              </label>
              <select
                value={swapFrom}
                onChange={(e) => updateSwapFrom(Number(e.target.value))}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
                  <option key={b} value={b}>
                    Base {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                To (base)
              </label>
              <select
                value={swapTo}
                onChange={(e) => updateSwapTo(Number(e.target.value))}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
                  <option key={b} value={b}>
                    Base {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                Input
              </label>
              <input
                type="text"
                value={swapInput}
                onChange={(e) => handleSwapInput(e.target.value)}
                placeholder={`Enter base ${swapFrom} value`}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {swapError && (
                <p className="text-destructive text-sm font-mono mt-2">{swapError}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                Output
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={swapOutput}
                  readOnly
                  className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(swapOutput, "swap")}
                  className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm border border-border hover:bg-secondary/80 transition-colors whitespace-nowrap"
                >
                  {copied === "swap" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NumberBaseTool;
