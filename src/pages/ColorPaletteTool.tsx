import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useCallback } from "react";

type PaletteType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split-complementary"
  | "monochromatic"
  | "shades-tints";

const paletteTypes: { label: string; value: PaletteType }[] = [
  { label: "Complementary", value: "complementary" },
  { label: "Analogous", value: "analogous" },
  { label: "Triadic", value: "triadic" },
  { label: "Split-Complementary", value: "split-complementary" },
  { label: "Monochromatic", value: "monochromatic" },
  { label: "Shades & Tints", value: "shades-tints" },
];

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 50];
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generatePalette(hex: string, type: PaletteType): string[] {
  const [h, s, l] = hexToHsl(hex);
  switch (type) {
    case "complementary":
      return [
        hslToHex(h, s, l),
        hslToHex(h + 60, s, l),
        hslToHex(h + 180, s, l),
        hslToHex(h + 240, s, l),
        hslToHex(h + 300, s, l),
      ];
    case "analogous":
      return [
        hslToHex(h - 30, s, l),
        hslToHex(h - 15, s, l),
        hslToHex(h, s, l),
        hslToHex(h + 15, s, l),
        hslToHex(h + 30, s, l),
      ];
    case "triadic":
      return [
        hslToHex(h, s, l),
        hslToHex(h + 120, s, l),
        hslToHex(h + 240, s, l),
        hslToHex(h + 60, s, l),
        hslToHex(h + 180, s, l),
      ];
    case "split-complementary":
      return [
        hslToHex(h, s, l),
        hslToHex(h + 150, s, l),
        hslToHex(h + 210, s, l),
        hslToHex(h + 120, s, l),
        hslToHex(h + 240, s, l),
      ];
    case "monochromatic":
      return [
        hslToHex(h, Math.max(s - 30, 10), l),
        hslToHex(h, Math.max(s - 15, 10), l - 10),
        hslToHex(h, s, l),
        hslToHex(h, Math.min(s + 15, 100), l + 10),
        hslToHex(h, Math.min(s + 30, 100), l + 20),
      ];
    case "shades-tints":
      return [
        hslToHex(h, s, 20),
        hslToHex(h, s, 35),
        hslToHex(h, s, 50),
        hslToHex(h, s, 65),
        hslToHex(h, s, 80),
      ];
    default:
      return [hex, hex, hex, hex, hex];
  }
}

function randomHex(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function getContrastColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "#000000";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

type ExportFormat = "css" | "tailwind" | "list";

const ColorPaletteTool = () => {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [hexInput, setHexInput] = useState("#3b82f6");
  const [paletteType, setPaletteType] = useState<PaletteType>("analogous");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [exportCopied, setExportCopied] = useState(false);

  const palette = generatePalette(baseColor, paletteType);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      setBaseColor(value);
    }
  };

  const handleColorPicker = (value: string) => {
    setBaseColor(value);
    setHexInput(value);
  };

  const handleRandomize = () => {
    const color = randomHex();
    setBaseColor(color);
    setHexInput(color);
  };

  const copyToClipboard = useCallback(
    (text: string, index: number) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    },
    []
  );

  const getExportText = (format: ExportFormat): string => {
    switch (format) {
      case "css":
        return palette
          .map((c, i) => `  --color-palette-${i + 1}: ${c};`)
          .join("\n");
      case "tailwind":
        return `colors: {\n  palette: {\n${palette.map((c, i) => `    ${(i + 1) * 100}: '${c}',`).join("\n")}\n  }\n}`;
      case "list":
        return palette.join(", ");
      default:
        return "";
    }
  };

  const handleExport = (format: ExportFormat) => {
    navigator.clipboard.writeText(getExportText(format));
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 1500);
  };

  return (
    <Layout>
      <SEO title="Color Palette Generator" description="Generate harmonious color palettes. Complementary, analogous, triadic, and monochromatic schemes." canonical="/color-palette" keywords="color palette generator, color scheme generator, complementary colors, color harmony" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Color Palette Generator
        </h1>

        {/* Base Color Picker */}
        <div className="mb-6 p-4 bg-secondary rounded-md border border-border">
          <label className="text-sm font-mono text-muted-foreground mb-1 block">
            Base Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => handleColorPicker(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-border bg-transparent"
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#3b82f6"
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              maxLength={7}
            />
            <button
              onClick={handleRandomize}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Randomize
            </button>
          </div>
        </div>

        {/* Palette Type Selector */}
        <div className="mb-6">
          <label className="text-sm font-mono text-muted-foreground mb-1 block">
            Palette Type
          </label>
          <div className="flex flex-wrap gap-2">
            {paletteTypes.map((pt) => (
              <button
                key={pt.value}
                onClick={() => setPaletteType(pt.value)}
                className={
                  paletteType === pt.value
                    ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                    : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                }
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Palette */}
        <div className="mb-6">
          <label className="text-sm font-mono text-muted-foreground mb-1 block">
            Generated Palette
          </label>
          <div className="flex gap-3">
            {palette.map((color, index) => (
              <button
                key={index}
                onClick={() => copyToClipboard(color, index)}
                className="flex-1 group relative cursor-pointer rounded-md overflow-hidden border border-border transition-transform hover:scale-105"
                title={`Click to copy ${color}`}
              >
                <div
                  className="h-32 sm:h-40 w-full"
                  style={{ backgroundColor: color }}
                >
                  {copiedIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: "#ffffff" }}
                      >
                        Copied!
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-secondary px-2 py-2 text-center">
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: getContrastColor("#f0f0f0") }}
                  >
                    <span className="text-foreground">{color}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Section */}
        <div className="p-4 bg-secondary rounded-md border border-border">
          <label className="text-sm font-mono text-muted-foreground mb-1 block">
            Export Palette
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExport("css")}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors border border-border"
            >
              Copy as CSS Variables
            </button>
            <button
              onClick={() => handleExport("tailwind")}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors border border-border"
            >
              Copy as Tailwind Config
            </button>
            <button
              onClick={() => handleExport("list")}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors border border-border"
            >
              Copy as List
            </button>
            {exportCopied && (
              <span className="px-3 py-2 font-mono text-sm text-primary">
                Copied to clipboard!
              </span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ColorPaletteTool;
