import { Layout } from "@/components/Layout";
import { useState } from "react";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const ColorTool = () => {
  const [hex, setHex] = useState("#22c55e");
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <Layout>
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Color Tool</h1>
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-lg border border-border" style={{ backgroundColor: hex }} />
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">HEX</label>
              <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">RGB</label>
              <input readOnly value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground" />
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">HSL</label>
              <input readOnly value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ColorTool;
