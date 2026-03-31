import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

// ─── CSS Named Colors ───────────────────────────────────────────────────────

const CSS_NAMED_COLORS: Record<string, [number, number, number]> = {
  aliceblue: [240, 248, 255], antiquewhite: [250, 235, 215], aqua: [0, 255, 255],
  aquamarine: [127, 255, 212], azure: [240, 255, 255], beige: [245, 245, 220],
  bisque: [255, 228, 196], black: [0, 0, 0], blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255], blueviolet: [138, 43, 226], brown: [165, 42, 42],
  burlywood: [222, 184, 135], cadetblue: [95, 158, 160], chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30], coral: [255, 127, 80], cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220], crimson: [220, 20, 60], cyan: [0, 255, 255],
  darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169], darkgreen: [0, 100, 0], darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143], darkslateblue: [72, 61, 139], darkslategray: [47, 79, 79],
  darkturquoise: [0, 206, 209], darkviolet: [148, 0, 211], deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255], dimgray: [105, 105, 105], dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34], floralwhite: [255, 250, 240], forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255], gainsboro: [220, 220, 220], ghostwhite: [248, 248, 255],
  gold: [255, 215, 0], goldenrod: [218, 165, 32], gray: [128, 128, 128],
  green: [0, 128, 0], greenyellow: [173, 255, 47], honeydew: [240, 255, 240],
  hotpink: [255, 105, 180], indianred: [205, 92, 92], indigo: [75, 0, 130],
  ivory: [255, 255, 240], khaki: [240, 230, 140], lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245], lawngreen: [124, 252, 0], lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230], lightcoral: [240, 128, 128], lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210], lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144], lightpink: [255, 182, 193], lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170], lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153], lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224], lime: [0, 255, 0], limegreen: [50, 205, 50],
  linen: [250, 240, 230], magenta: [255, 0, 255], maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170], mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211], mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113], mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154], mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133], midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250], mistyrose: [255, 228, 225], moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173], navy: [0, 0, 128], oldlace: [253, 245, 230],
  olive: [128, 128, 0], olivedrab: [107, 142, 35], orange: [255, 165, 0],
  orangered: [255, 69, 0], orchid: [218, 112, 214], palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152], paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147], papayawhip: [255, 239, 213], peachpuff: [255, 218, 185],
  peru: [205, 133, 63], pink: [255, 192, 203], plum: [221, 160, 221],
  powderblue: [176, 224, 230], purple: [128, 0, 128], rebeccapurple: [102, 51, 153],
  red: [255, 0, 0], rosybrown: [188, 143, 143], royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19], salmon: [250, 128, 114], sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87], seashell: [255, 245, 238], sienna: [160, 82, 45],
  silver: [192, 192, 192], skyblue: [135, 206, 235], slateblue: [106, 90, 205],
  slategray: [112, 128, 144], snow: [255, 250, 250], springgreen: [0, 255, 127],
  steelblue: [70, 130, 180], tan: [210, 180, 140], teal: [0, 128, 128],
  thistle: [216, 191, 216], tomato: [255, 99, 71], turquoise: [64, 224, 208],
  violet: [238, 130, 238], wheat: [245, 222, 179], white: [255, 255, 255],
  whitesmoke: [245, 245, 245], yellow: [255, 255, 0], yellowgreen: [154, 205, 50],
};

// ─── Conversion Utilities ───────────────────────────────────────────────────

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hNorm = h / 360, sNorm = s / 100, lNorm = l / 100;
  if (sNorm === 0) {
    const v = Math.round(lNorm * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tAdj = t;
    if (tAdj < 0) tAdj += 1;
    if (tAdj > 1) tAdj -= 1;
    if (tAdj < 1 / 6) return p + (q - p) * 6 * tAdj;
    if (tAdj < 1 / 2) return q;
    if (tAdj < 2 / 3) return p + (q - p) * (2 / 3 - tAdj) * 6;
    return p;
  };
  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;
  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const hNorm = h / 360, sNorm = s / 100, vNorm = v / 100;
  const i = Math.floor(hNorm * 6);
  const f = hNorm * 6 - i;
  const p = vNorm * (1 - sNorm);
  const q = vNorm * (1 - f * sNorm);
  const t = vNorm * (1 - (1 - f) * sNorm);
  let rn: number, gn: number, bn: number;
  switch (i % 6) {
    case 0: rn = vNorm; gn = t; bn = p; break;
    case 1: rn = q; gn = vNorm; bn = p; break;
    case 2: rn = p; gn = vNorm; bn = t; break;
    case 3: rn = p; gn = q; bn = vNorm; break;
    case 4: rn = t; gn = p; bn = vNorm; break;
    default: rn = vNorm; gn = p; bn = q; break;
  }
  return {
    r: Math.round(rn * 255),
    g: Math.round(gn * 255),
    b: Math.round(bn * 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
  const cN = c / 100, mN = m / 100, yN = y / 100, kN = k / 100;
  return {
    r: Math.round(255 * (1 - cN) * (1 - kN)),
    g: Math.round(255 * (1 - mN) * (1 - kN)),
    b: Math.round(255 * (1 - yN) * (1 - kN)),
  };
}

// ─── Contrast Ratio (WCAG) ─────────────────────────────────────────────────

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastLevel(ratio: number): string {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

// ─── Nearest CSS Color ──────────────────────────────────────────────────────

function findNearestCssColor(r: number, g: number, b: number): string {
  let best = "";
  let bestDist = Infinity;
  for (const [name, [nr, ng, nb]] of Object.entries(CSS_NAMED_COLORS)) {
    const dist = (r - nr) ** 2 + (g - ng) ** 2 + (b - nb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = name;
    }
  }
  return best;
}

// ─── Shades & Tints ─────────────────────────────────────────────────────────

function generateShades(r: number, g: number, b: number, count: number): string[] {
  const result: string[] = [];
  for (let i = 1; i <= count; i++) {
    const factor = 1 - (i / (count + 1));
    result.push(rgbToHex(Math.round(r * factor), Math.round(g * factor), Math.round(b * factor)));
  }
  return result;
}

function generateTints(r: number, g: number, b: number, count: number): string[] {
  const result: string[] = [];
  for (let i = 1; i <= count; i++) {
    const factor = i / (count + 1);
    result.push(rgbToHex(
      Math.round(r + (255 - r) * factor),
      Math.round(g + (255 - g) * factor),
      Math.round(b + (255 - b) * factor),
    ));
  }
  return result;
}

// ─── Copy Helper ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1 rounded text-xs font-mono bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
      title="Copy to clipboard"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── Small Input for Numeric Fields ─────────────────────────────────────────

function NumericInput({
  label,
  value,
  min,
  max,
  onChange,
  error,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  onChange: (val: string) => void;
  error?: boolean;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="text-xs font-mono text-muted-foreground mb-0.5 block">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-secondary rounded-md border px-2 py-1.5 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
          error ? "border-red-500" : "border-border"
        }`}
        placeholder={`${min}-${max}`}
      />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

const ColorTool = () => {
  // Core state: store color as RGBA
  const [rgba, setRgba] = useState<RGBA>({ r: 34, g: 197, b: 94, a: 1 });

  // Input field states (strings for free-form typing)
  const [hexInput, setHexInput] = useState("#22c55e");
  const [rInput, setRInput] = useState("34");
  const [gInput, setGInput] = useState("197");
  const [bInput, setBInput] = useState("94");
  const [hslHInput, setHslHInput] = useState("142");
  const [hslSInput, setHslSInput] = useState("71");
  const [hslLInput, setHslLInput] = useState("45");
  const [hsvHInput, setHsvHInput] = useState("142");
  const [hsvSInput, setHsvSInput] = useState("83");
  const [hsvVInput, setHsvVInput] = useState("77");
  const [cmykCInput, setCmykCInput] = useState("83");
  const [cmykMInput, setCmykMInput] = useState("0");
  const [cmykYInput, setCmykYInput] = useState("52");
  const [cmykKInput, setCmykKInput] = useState("23");
  const [alpha, setAlpha] = useState(1);

  // Error states
  const [hexError, setHexError] = useState(false);
  const [rgbError, setRgbError] = useState(false);
  const [hslError, setHslError] = useState(false);
  const [hsvError, setHsvError] = useState(false);
  const [cmykError, setCmykError] = useState(false);

  // Update all fields from RGBA (except the source that triggered the change)
  const syncAllFrom = useCallback(
    (r: number, g: number, b: number, a: number, source: string) => {
      const newRgba = { r, g, b, a };
      setRgba(newRgba);

      if (source !== "hex") {
        setHexInput(rgbToHex(r, g, b));
        setHexError(false);
      }
      if (source !== "rgb") {
        setRInput(String(r));
        setGInput(String(g));
        setBInput(String(b));
        setRgbError(false);
      }
      if (source !== "hsl") {
        const hsl = rgbToHsl(r, g, b);
        setHslHInput(String(hsl.h));
        setHslSInput(String(hsl.s));
        setHslLInput(String(hsl.l));
        setHslError(false);
      }
      if (source !== "hsv") {
        const hsv = rgbToHsv(r, g, b);
        setHsvHInput(String(hsv.h));
        setHsvSInput(String(hsv.s));
        setHsvVInput(String(hsv.v));
        setHsvError(false);
      }
      if (source !== "cmyk") {
        const cmyk = rgbToCmyk(r, g, b);
        setCmykCInput(String(cmyk.c));
        setCmykMInput(String(cmyk.m));
        setCmykYInput(String(cmyk.y));
        setCmykKInput(String(cmyk.k));
        setCmykError(false);
      }
      if (source !== "alpha") {
        setAlpha(a);
      }
    },
    [],
  );

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (parsed) {
      setHexError(false);
      syncAllFrom(parsed.r, parsed.g, parsed.b, alpha, "hex");
    } else {
      setHexError(true);
    }
  };

  const handleRgbChange = (field: "r" | "g" | "b", val: string) => {
    if (field === "r") setRInput(val);
    if (field === "g") setGInput(val);
    if (field === "b") setBInput(val);

    const rVal = field === "r" ? val : rInput;
    const gVal = field === "g" ? val : gInput;
    const bVal = field === "b" ? val : bInput;

    const r = parseInt(rVal, 10);
    const g = parseInt(gVal, 10);
    const b = parseInt(bVal, 10);

    if ([r, g, b].some((v) => isNaN(v) || v < 0 || v > 255)) {
      setRgbError(true);
      return;
    }
    setRgbError(false);
    syncAllFrom(r, g, b, alpha, "rgb");
  };

  const handleHslChange = (field: "h" | "s" | "l", val: string) => {
    if (field === "h") setHslHInput(val);
    if (field === "s") setHslSInput(val);
    if (field === "l") setHslLInput(val);

    const hVal = field === "h" ? val : hslHInput;
    const sVal = field === "s" ? val : hslSInput;
    const lVal = field === "l" ? val : hslLInput;

    const h = parseInt(hVal, 10);
    const s = parseInt(sVal, 10);
    const l = parseInt(lVal, 10);

    if (isNaN(h) || h < 0 || h > 360 || isNaN(s) || s < 0 || s > 100 || isNaN(l) || l < 0 || l > 100) {
      setHslError(true);
      return;
    }
    setHslError(false);
    const rgb = hslToRgb(h, s, l);
    syncAllFrom(rgb.r, rgb.g, rgb.b, alpha, "hsl");
  };

  const handleHsvChange = (field: "h" | "s" | "v", val: string) => {
    if (field === "h") setHsvHInput(val);
    if (field === "s") setHsvSInput(val);
    if (field === "v") setHsvVInput(val);

    const hVal = field === "h" ? val : hsvHInput;
    const sVal = field === "s" ? val : hsvSInput;
    const vVal = field === "v" ? val : hsvVInput;

    const h = parseInt(hVal, 10);
    const s = parseInt(sVal, 10);
    const v = parseInt(vVal, 10);

    if (isNaN(h) || h < 0 || h > 360 || isNaN(s) || s < 0 || s > 100 || isNaN(v) || v < 0 || v > 100) {
      setHsvError(true);
      return;
    }
    setHsvError(false);
    const rgb = hsvToRgb(h, s, v);
    syncAllFrom(rgb.r, rgb.g, rgb.b, alpha, "hsv");
  };

  const handleCmykChange = (field: "c" | "m" | "y" | "k", val: string) => {
    if (field === "c") setCmykCInput(val);
    if (field === "m") setCmykMInput(val);
    if (field === "y") setCmykYInput(val);
    if (field === "k") setCmykKInput(val);

    const cVal = field === "c" ? val : cmykCInput;
    const mVal = field === "m" ? val : cmykMInput;
    const yVal = field === "y" ? val : cmykYInput;
    const kVal = field === "k" ? val : cmykKInput;

    const c = parseInt(cVal, 10);
    const m = parseInt(mVal, 10);
    const y = parseInt(yVal, 10);
    const k = parseInt(kVal, 10);

    if ([c, m, y, k].some((v) => isNaN(v) || v < 0 || v > 100)) {
      setCmykError(true);
      return;
    }
    setCmykError(false);
    const rgb = cmykToRgb(c, m, y, k);
    syncAllFrom(rgb.r, rgb.g, rgb.b, alpha, "cmyk");
  };

  const handleAlphaChange = (val: number) => {
    setAlpha(val);
    syncAllFrom(rgba.r, rgba.g, rgba.b, val, "alpha");
  };

  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = hexToRgb(e.target.value);
    if (parsed) {
      syncAllFrom(parsed.r, parsed.g, parsed.b, alpha, "picker");
    }
  };

  const handleRandom = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    syncAllFrom(r, g, b, alpha, "random");
  };

  // ── Derived values ──────────────────────────────────────────────────────

  const { r, g, b, a: currentAlpha } = rgba;
  const hexValue = rgbToHex(r, g, b);
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const rgbaString = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
  const hsl = rgbToHsl(r, g, b);
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hslaString = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${currentAlpha})`;
  const hsv = rgbToHsv(r, g, b);
  const hsvString = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  const cmyk = rgbToCmyk(r, g, b);
  const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  const nearestColorName = findNearestCssColor(r, g, b);
  const lum = relativeLuminance(r, g, b);
  const whiteContrast = contrastRatio(lum, 1);
  const blackContrast = contrastRatio(lum, 0);

  const shades = generateShades(r, g, b, 5);
  const tints = generateTints(r, g, b, 5);

  const previewBg = currentAlpha < 1
    ? `rgba(${r}, ${g}, ${b}, ${currentAlpha})`
    : hexValue;

  return (
    <Layout>
      <SEO
        title="Color Converter"
        description="Convert colors between HEX, RGB, and HSL formats instantly. Free online color converter with live preview."
        canonical="/color"
        keywords="hex to rgb, rgb to hex, color converter, hsl converter, color picker online"
      />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Color Tool</h1>

        {/* Preview + Picker + Actions */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
          <div className="relative">
            <div
              className="w-full sm:w-48 h-32 rounded-lg border border-border"
              style={{
                backgroundColor: previewBg,
                backgroundImage:
                  currentAlpha < 1
                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                    : undefined,
                backgroundSize: currentAlpha < 1 ? "16px 16px" : undefined,
                backgroundPosition: currentAlpha < 1 ? "0 0, 0 8px, 8px -8px, -8px 0px" : undefined,
              }}
            >
              {currentAlpha < 1 && (
                <div
                  className="w-full h-full rounded-lg"
                  style={{ backgroundColor: previewBg }}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-mono text-muted-foreground">Picker</label>
              <input
                type="color"
                value={hexValue}
                onChange={handleColorPicker}
                className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent"
              />
            </div>
            <button
              onClick={handleRandom}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Random Color
            </button>
            <div className="text-sm font-mono text-muted-foreground">
              Nearest CSS: <span className="text-foreground font-semibold">{nearestColorName}</span>
            </div>
          </div>
        </div>

        {/* Alpha slider */}
        <div className="bg-secondary rounded-lg border border-border p-4 mb-4">
          <label className="text-sm font-mono text-muted-foreground mb-2 block">
            Opacity / Alpha: <span className="text-foreground">{Math.round(alpha * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alpha}
            onChange={(e) => handleAlphaChange(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Color Format Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* HEX */}
          <div className="bg-secondary rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">HEX</label>
              <CopyButton text={alpha < 1 ? hexValue + Math.round(alpha * 255).toString(16).padStart(2, "0") : hexValue} />
            </div>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              className={`w-full bg-secondary rounded-md border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
                hexError ? "border-red-500" : "border-border"
              }`}
              placeholder="#000000"
            />
            {hexError && (
              <p className="text-xs font-mono text-red-500 mt-1">Invalid HEX (use 3 or 6 digit format)</p>
            )}
          </div>

          {/* RGB / RGBA */}
          <div className="bg-secondary rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                {alpha < 1 ? "RGBA" : "RGB"}
              </label>
              <CopyButton text={alpha < 1 ? rgbaString : rgbString} />
            </div>
            <div className="flex gap-2">
              <NumericInput label="R" value={rInput} min={0} max={255} onChange={(v) => handleRgbChange("r", v)} error={rgbError} />
              <NumericInput label="G" value={gInput} min={0} max={255} onChange={(v) => handleRgbChange("g", v)} error={rgbError} />
              <NumericInput label="B" value={bInput} min={0} max={255} onChange={(v) => handleRgbChange("b", v)} error={rgbError} />
            </div>
            {rgbError && (
              <p className="text-xs font-mono text-red-500 mt-1">Values must be integers 0-255</p>
            )}
            <p className="text-xs font-mono text-muted-foreground mt-2">{alpha < 1 ? rgbaString : rgbString}</p>
          </div>

          {/* HSL / HSLA */}
          <div className="bg-secondary rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                {alpha < 1 ? "HSLA" : "HSL"}
              </label>
              <CopyButton text={alpha < 1 ? hslaString : hslString} />
            </div>
            <div className="flex gap-2">
              <NumericInput label="H" value={hslHInput} min={0} max={360} onChange={(v) => handleHslChange("h", v)} error={hslError} />
              <NumericInput label="S" value={hslSInput} min={0} max={100} onChange={(v) => handleHslChange("s", v)} error={hslError} />
              <NumericInput label="L" value={hslLInput} min={0} max={100} onChange={(v) => handleHslChange("l", v)} error={hslError} />
            </div>
            {hslError && (
              <p className="text-xs font-mono text-red-500 mt-1">H: 0-360, S: 0-100, L: 0-100</p>
            )}
            <p className="text-xs font-mono text-muted-foreground mt-2">{alpha < 1 ? hslaString : hslString}</p>
          </div>

          {/* HSV / HSB */}
          <div className="bg-secondary rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">HSV / HSB</label>
              <CopyButton text={hsvString} />
            </div>
            <div className="flex gap-2">
              <NumericInput label="H" value={hsvHInput} min={0} max={360} onChange={(v) => handleHsvChange("h", v)} error={hsvError} />
              <NumericInput label="S" value={hsvSInput} min={0} max={100} onChange={(v) => handleHsvChange("s", v)} error={hsvError} />
              <NumericInput label="V" value={hsvVInput} min={0} max={100} onChange={(v) => handleHsvChange("v", v)} error={hsvError} />
            </div>
            {hsvError && (
              <p className="text-xs font-mono text-red-500 mt-1">H: 0-360, S: 0-100, V: 0-100</p>
            )}
            <p className="text-xs font-mono text-muted-foreground mt-2">{hsvString}</p>
          </div>

          {/* CMYK */}
          <div className="bg-secondary rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">CMYK</label>
              <CopyButton text={cmykString} />
            </div>
            <div className="flex gap-2">
              <NumericInput label="C" value={cmykCInput} min={0} max={100} onChange={(v) => handleCmykChange("c", v)} error={cmykError} />
              <NumericInput label="M" value={cmykMInput} min={0} max={100} onChange={(v) => handleCmykChange("m", v)} error={cmykError} />
              <NumericInput label="Y" value={cmykYInput} min={0} max={100} onChange={(v) => handleCmykChange("y", v)} error={cmykError} />
              <NumericInput label="K" value={cmykKInput} min={0} max={100} onChange={(v) => handleCmykChange("k", v)} error={cmykError} />
            </div>
            {cmykError && (
              <p className="text-xs font-mono text-red-500 mt-1">All values must be 0-100</p>
            )}
            <p className="text-xs font-mono text-muted-foreground mt-2">{cmykString}</p>
          </div>
        </div>

        {/* Contrast Ratio */}
        <div className="bg-secondary rounded-lg border border-border p-4 mb-6">
          <h2 className="text-sm font-mono font-semibold text-foreground mb-3">Contrast Ratio (WCAG)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-10 rounded border border-border flex items-center justify-center text-xs font-mono font-bold"
                style={{ backgroundColor: "#ffffff", color: hexValue }}
              >
                Aa
              </div>
              <div>
                <p className="text-sm font-mono text-foreground">
                  vs White: <span className="font-bold">{whiteContrast.toFixed(2)}:1</span>
                </p>
                <p className="text-xs font-mono text-muted-foreground">{contrastLevel(whiteContrast)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-10 rounded border border-border flex items-center justify-center text-xs font-mono font-bold"
                style={{ backgroundColor: "#000000", color: hexValue }}
              >
                Aa
              </div>
              <div>
                <p className="text-sm font-mono text-foreground">
                  vs Black: <span className="font-bold">{blackContrast.toFixed(2)}:1</span>
                </p>
                <p className="text-xs font-mono text-muted-foreground">{contrastLevel(blackContrast)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shades & Tints */}
        <div className="bg-secondary rounded-lg border border-border p-4">
          <h2 className="text-sm font-mono font-semibold text-foreground mb-3">Shades & Tints</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1.5">Shades (darker)</p>
              <div className="flex gap-1.5">
                {shades.map((shade, i) => (
                  <button
                    key={`shade-${i}`}
                    className="flex-1 h-10 rounded border border-border cursor-pointer hover:ring-1 hover:ring-primary transition-shadow"
                    style={{ backgroundColor: shade }}
                    title={shade}
                    onClick={() => {
                      const parsed = hexToRgb(shade);
                      if (parsed) syncAllFrom(parsed.r, parsed.g, parsed.b, alpha, "swatch");
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-1.5">
              <div
                className="flex-1 h-10 rounded border-2 border-primary"
                style={{ backgroundColor: hexValue }}
                title={hexValue}
              />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1.5">Tints (lighter)</p>
              <div className="flex gap-1.5">
                {tints.map((tint, i) => (
                  <button
                    key={`tint-${i}`}
                    className="flex-1 h-10 rounded border border-border cursor-pointer hover:ring-1 hover:ring-primary transition-shadow"
                    style={{ backgroundColor: tint }}
                    title={tint}
                    onClick={() => {
                      const parsed = hexToRgb(tint);
                      if (parsed) syncAllFrom(parsed.r, parsed.g, parsed.b, alpha, "swatch");
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ColorTool;
