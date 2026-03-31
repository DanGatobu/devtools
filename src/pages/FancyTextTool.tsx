import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

// Unicode offset-based mapping helper
function mapByOffset(
  text: string,
  lcStart: number,
  ucStart: number
): string {
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(lcStart + (code - 97));
      }
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(ucStart + (code - 65));
      }
      return ch;
    })
    .join("");
}

// Mathematical Bold: 𝗮 = U+1D5EE, 𝗔 = U+1D5D4
function toBold(text: string): string {
  return mapByOffset(text, 0x1d5ee, 0x1d5d4);
}

// Mathematical Italic: 𝘢 = U+1D622, 𝘈 = U+1D608
function toItalic(text: string): string {
  return mapByOffset(text, 0x1d622, 0x1d608);
}

// Mathematical Bold Italic: 𝙖 = U+1D656, 𝘼 = U+1D63C
function toBoldItalic(text: string): string {
  return mapByOffset(text, 0x1d656, 0x1d63c);
}

// Monospace: 𝚊 = U+1D68A, 𝙰 = U+1D670
function toMonospace(text: string): string {
  return mapByOffset(text, 0x1d68a, 0x1d670);
}

// Mathematical Script Bold: 𝓪 = U+1D4EA, 𝓐 = U+1D4D0
function toScript(text: string): string {
  return mapByOffset(text, 0x1d4ea, 0x1d4d0);
}

// Mathematical Fraktur: 𝔞 = U+1D51E, 𝔄 = U+1D504
function toFraktur(text: string): string {
  return mapByOffset(text, 0x1d51e, 0x1d504);
}

// Double-Struck: 𝕒 = U+1D552, 𝔸 = U+1D538
function toDoubleStruck(text: string): string {
  return mapByOffset(text, 0x1d552, 0x1d538);
}

// Small Caps
const smallCapsMap: Record<string, string> = {
  a: "\u1D00", b: "\u0299", c: "\u1D04", d: "\u1D05", e: "\u1D07",
  f: "\u0493", g: "\u0262", h: "\u029C", i: "\u026A", j: "\u1D0A",
  k: "\u1D0B", l: "\u029F", m: "\u1D0D", n: "\u0274", o: "\u1D0F",
  p: "\u1D18", q: "\u01EB", r: "\u0280", s: "\u0455", t: "\u1D1B",
  u: "\u1D1C", v: "\u1D20", w: "\u1D21", x: "\u0078", y: "\u028F",
  z: "\u1D22",
};

function toSmallCaps(text: string): string {
  return [...text]
    .map((ch) => smallCapsMap[ch] ?? ch)
    .join("");
}

// Upside Down
const upsideDownMap: Record<string, string> = {
  a: "\u0250", b: "q", c: "\u0254", d: "p", e: "\u01DD",
  f: "\u025F", g: "\u0183", h: "\u0265", i: "\u1D09", j: "\u027E",
  k: "\u029E", l: "l", m: "\u026F", n: "u", o: "o",
  p: "d", q: "b", r: "\u0279", s: "s", t: "\u0287",
  u: "n", v: "\u028C", w: "\u028D", x: "x", y: "\u028E",
  z: "z",
  A: "\u2200", B: "\u1012", C: "\u0186", D: "\u15E1", E: "\u018E",
  F: "\u2132", G: "\u2141", H: "H", I: "I", J: "\u017F",
  K: "\u22CA", L: "\u2142", M: "W", N: "N", O: "O",
  P: "\u0500", Q: "\u038C", R: "\u1D1A", S: "S", T: "\u22A5",
  U: "\u2229", V: "\u039B", W: "M", X: "X", Y: "\u2144",
  Z: "Z",
  "1": "\u0196", "2": "\u1105", "3": "\u0190", "4": "\u3123",
  "5": "\u03DB", "6": "9", "7": "\u3125", "8": "8", "9": "6", "0": "0",
  ".": "\u02D9", ",": "\u02BB", "'": ",", "\"": "\u201E",
  "!": "\u00A1", "?": "\u00BF", "(": ")", ")": "(", "[": "]", "]": "[",
  "{": "}", "}": "{", "<": ">", ">": "<", "&": "\u214B",
  "_": "\u203E",
};

function toUpsideDown(text: string): string {
  return [...text]
    .map((ch) => upsideDownMap[ch] ?? ch)
    .reverse()
    .join("");
}

// Strikethrough — combining long stroke overlay U+0336
function toStrikethrough(text: string): string {
  return [...text].map((ch) => ch + "\u0336").join("");
}

// Underline — combining low line U+0332
function toUnderline(text: string): string {
  return [...text].map((ch) => ch + "\u0332").join("");
}

// Zalgo/Glitch
const zalgoAbove = [
  0x030d, 0x030e, 0x0304, 0x0305, 0x033f, 0x0311, 0x0306, 0x0310,
  0x0352, 0x0357, 0x0351, 0x0307, 0x0308, 0x030a, 0x0342, 0x0343,
  0x0344, 0x034a, 0x034b, 0x034c, 0x0303, 0x0302, 0x030c, 0x0350,
  0x0300, 0x0301, 0x030b, 0x030f, 0x0312, 0x0313, 0x0314, 0x033d,
  0x0309, 0x0363, 0x0364, 0x0365, 0x0366, 0x0367, 0x0368, 0x0369,
];

const zalgoBelow = [
  0x0316, 0x0317, 0x0318, 0x0319, 0x031c, 0x031d, 0x031e, 0x031f,
  0x0320, 0x0324, 0x0325, 0x0326, 0x0329, 0x032a, 0x032b, 0x032c,
  0x032d, 0x032e, 0x032f, 0x0330, 0x0331, 0x0332, 0x0333, 0x0339,
  0x033a, 0x033b, 0x033c, 0x0345, 0x0347, 0x0348, 0x0349,
];

function toZalgo(text: string): string {
  return [...text]
    .map((ch) => {
      if (ch === " ") return ch;
      let result = ch;
      const numAbove = 2 + Math.floor(Math.random() * 3);
      const numBelow = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numAbove; i++) {
        result += String.fromCodePoint(
          zalgoAbove[Math.floor(Math.random() * zalgoAbove.length)]
        );
      }
      for (let i = 0; i < numBelow; i++) {
        result += String.fromCodePoint(
          zalgoBelow[Math.floor(Math.random() * zalgoBelow.length)]
        );
      }
      return result;
    })
    .join("");
}

// Superscript
const superscriptMap: Record<string, string> = {
  a: "\u1D43", b: "\u1D47", c: "\u1D9C", d: "\u1D48", e: "\u1D49",
  f: "\u1DA0", g: "\u1D4D", h: "\u02B0", i: "\u2071", j: "\u02B2",
  k: "\u1D4F", l: "\u02E1", m: "\u1D50", n: "\u207F", o: "\u1D52",
  p: "\u1D56", q: "q", r: "\u02B3", s: "\u02E2", t: "\u1D57",
  u: "\u1D58", v: "\u1D5B", w: "\u02B7", x: "\u02E3", y: "\u02B8",
  z: "\u1DBB",
  A: "\u1D2C", B: "\u1D2E", C: "C", D: "\u1D30", E: "\u1D31",
  F: "F", G: "\u1D33", H: "\u1D34", I: "\u1D35", J: "\u1D36",
  K: "\u1D37", L: "\u1D38", M: "\u1D39", N: "\u1D3A", O: "\u1D3C",
  P: "\u1D3E", Q: "Q", R: "\u1D3F", S: "S", T: "\u1D40",
  U: "\u1D41", V: "\u2C7D", W: "\u1D42", X: "X", Y: "Y", Z: "Z",
  "0": "\u2070", "1": "\u00B9", "2": "\u00B2", "3": "\u00B3",
  "4": "\u2074", "5": "\u2075", "6": "\u2076", "7": "\u2077",
  "8": "\u2078", "9": "\u2079",
  "+": "\u207A", "-": "\u207B", "=": "\u207C", "(": "\u207D",
  ")": "\u207E",
};

function toSuperscript(text: string): string {
  return [...text]
    .map((ch) => superscriptMap[ch] ?? ch)
    .join("");
}

// Subscript
const subscriptMap: Record<string, string> = {
  a: "\u2090", e: "\u2091", h: "\u2095", i: "\u1D62", j: "\u2C7C",
  k: "\u2096", l: "\u2097", m: "\u2098", n: "\u2099", o: "\u2092",
  p: "\u209A", r: "\u1D63", s: "\u209B", t: "\u209C", u: "\u1D64",
  v: "\u1D65", x: "\u2093",
  "0": "\u2080", "1": "\u2081", "2": "\u2082", "3": "\u2083",
  "4": "\u2084", "5": "\u2085", "6": "\u2086", "7": "\u2087",
  "8": "\u2088", "9": "\u2089",
  "+": "\u208A", "-": "\u208B", "=": "\u208C", "(": "\u208D",
  ")": "\u208E",
};

function toSubscript(text: string): string {
  return [...text]
    .map((ch) => subscriptMap[ch] ?? ch)
    .join("");
}

// Circled: Ⓐ = U+24B6, ⓐ = U+24D0, ⓪ = U+24EA, ①=U+2460
function toCircled(text: string): string {
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x24b6 + (code - 65));
      }
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x24d0 + (code - 97));
      }
      if (code === 48) return String.fromCodePoint(0x24ea); // 0
      if (code >= 49 && code <= 57) {
        return String.fromCodePoint(0x2460 + (code - 49)); // 1-9
      }
      return ch;
    })
    .join("");
}

// Squared: 🄰 = U+1F130 for A
function toSquared(text: string): string {
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(0x1f130 + (code - 65));
      }
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(0x1f130 + (code - 97));
      }
      return ch;
    })
    .join("");
}

interface Transformation {
  name: string;
  fn: (text: string) => string;
}

const transformations: Transformation[] = [
  { name: "Bold", fn: toBold },
  { name: "Italic", fn: toItalic },
  { name: "Bold Italic", fn: toBoldItalic },
  { name: "Monospace", fn: toMonospace },
  { name: "Script / Cursive", fn: toScript },
  { name: "Gothic / Fraktur", fn: toFraktur },
  { name: "Double-Struck", fn: toDoubleStruck },
  { name: "Small Caps", fn: toSmallCaps },
  { name: "Upside Down", fn: toUpsideDown },
  { name: "Strikethrough", fn: toStrikethrough },
  { name: "Underline", fn: toUnderline },
  { name: "Zalgo / Glitch", fn: toZalgo },
  { name: "Superscript", fn: toSuperscript },
  { name: "Subscript", fn: toSubscript },
  { name: "Circled", fn: toCircled },
  { name: "Squared", fn: toSquared },
];

function FancyTextTool() {
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // fallback: ignore
    }
  };

  return (
    <Layout>
      <SEO title="Fancy Text Generator" description="Generate bold, italic, gothic, script, upside down, and 16 more Unicode text styles. Copy and paste anywhere." canonical="/fancy-text" keywords="fancy text generator, unicode text, bold text generator, italic text, cursive text generator" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Fancy Text Generator
        </h1>

        <textarea
          className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Type or paste your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {input && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {transformations.map((t, i) => {
              const result = t.fn(input);
              return (
                <div
                  key={t.name}
                  className="bg-secondary rounded-lg border border-border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wide">
                      {t.name}
                    </span>
                    <button
                      onClick={() => handleCopy(result, i)}
                      className="text-xs font-mono px-2 py-1 rounded border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-foreground break-all whitespace-pre-wrap">
                    {result}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FancyTextTool;
