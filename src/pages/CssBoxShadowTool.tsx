import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function createShadow(id: number): Shadow {
  return {
    id,
    offsetX: 5,
    offsetY: 5,
    blur: 15,
    spread: 0,
    color: "#000000",
    opacity: 0.25,
    inset: false,
  };
}

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function shadowToCss(s: Shadow): string {
  const insetStr = s.inset ? "inset " : "";
  return `${insetStr}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`;
}

const inputClass =
  "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";
const buttonClass =
  "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";

const CssBoxShadowTool = () => {
  const [shadows, setShadows] = useState<Shadow[]>([createShadow(1)]);
  const [nextId, setNextId] = useState(2);
  const [copied, setCopied] = useState(false);

  const cssValue = shadows.map(shadowToCss).join(",\n    ");
  const generatedCss = `box-shadow: ${cssValue};`;

  const updateShadow = (id: number, updates: Partial<Shadow>) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const addShadow = () => {
    setShadows((prev) => [...prev, createShadow(nextId)]);
    setNextId((n) => n + 1);
  };

  const removeShadow = (id: number) => {
    setShadows((prev) => prev.filter((s) => s.id !== id));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCss).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const combinedShadowValue = shadows.map(shadowToCss).join(", ");

  return (
    <Layout>
      <SEO title="CSS Box Shadow Generator" description="Design CSS box shadows with live preview. Multiple shadows, inset support, and copy-ready CSS output." canonical="/css-box-shadow" keywords="css box shadow generator, box shadow css, shadow generator, css shadow maker" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          CSS Box Shadow Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="bg-secondary rounded-md border border-border p-8 flex items-center justify-center min-h-[350px]">
            <div
              className="w-[200px] h-[200px] rounded-lg bg-foreground/10 border border-border"
              style={{ boxShadow: combinedShadowValue }}
            />
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {shadows.map((shadow, index) => (
              <div
                key={shadow.id}
                className="bg-secondary rounded-md border border-border p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-primary font-bold">
                    Shadow {index + 1}
                  </span>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(shadow.id)}
                      className="px-3 py-1 rounded-md border border-border font-mono text-sm text-muted-foreground hover:opacity-90 transition-opacity"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Horizontal Offset */}
                <div>
                  <label className={labelClass}>
                    Horizontal Offset: {shadow.offsetX}px
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={shadow.offsetX}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          offsetX: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-primary"
                    />
                    <input
                      type="number"
                      min={-50}
                      max={50}
                      value={shadow.offsetX}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          offsetX: Number(e.target.value),
                        })
                      }
                      className={`${inputClass} !w-20`}
                    />
                  </div>
                </div>

                {/* Vertical Offset */}
                <div>
                  <label className={labelClass}>
                    Vertical Offset: {shadow.offsetY}px
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={shadow.offsetY}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          offsetY: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-primary"
                    />
                    <input
                      type="number"
                      min={-50}
                      max={50}
                      value={shadow.offsetY}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          offsetY: Number(e.target.value),
                        })
                      }
                      className={`${inputClass} !w-20`}
                    />
                  </div>
                </div>

                {/* Blur Radius */}
                <div>
                  <label className={labelClass}>
                    Blur Radius: {shadow.blur}px
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={shadow.blur}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          blur: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-primary"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={shadow.blur}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          blur: Number(e.target.value),
                        })
                      }
                      className={`${inputClass} !w-20`}
                    />
                  </div>
                </div>

                {/* Spread Radius */}
                <div>
                  <label className={labelClass}>
                    Spread Radius: {shadow.spread}px
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={shadow.spread}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          spread: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-primary"
                    />
                    <input
                      type="number"
                      min={-50}
                      max={50}
                      value={shadow.spread}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          spread: Number(e.target.value),
                        })
                      }
                      className={`${inputClass} !w-20`}
                    />
                  </div>
                </div>

                {/* Color & Opacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Shadow Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) =>
                          updateShadow(shadow.id, { color: e.target.value })
                        }
                        className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={shadow.color}
                        onChange={(e) =>
                          updateShadow(shadow.id, { color: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Opacity: {shadow.opacity}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={shadow.opacity}
                      onChange={(e) =>
                        updateShadow(shadow.id, {
                          opacity: Number(e.target.value),
                        })
                      }
                      className="w-full accent-primary mt-2"
                    />
                  </div>
                </div>

                {/* Inset Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`inset-${shadow.id}`}
                    checked={shadow.inset}
                    onChange={(e) =>
                      updateShadow(shadow.id, { inset: e.target.checked })
                    }
                    className="accent-primary w-4 h-4"
                  />
                  <label
                    htmlFor={`inset-${shadow.id}`}
                    className="text-sm font-mono text-muted-foreground cursor-pointer"
                  >
                    Inset
                  </label>
                </div>
              </div>
            ))}

            <button onClick={addShadow} className={buttonClass}>
              Add Shadow
            </button>
          </div>
        </div>

        {/* Generated CSS */}
        <div className="mt-8">
          <label className={labelClass}>Generated CSS</label>
          <div className="relative">
            <textarea
              readOnly
              value={generatedCss}
              rows={Math.min(shadows.length + 2, 8)}
              className={`${inputClass} resize-none`}
            />
            <button
              onClick={copyToClipboard}
              className={`${buttonClass} absolute top-2 right-2`}
            >
              {copied ? "Copied!" : "Copy CSS"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CssBoxShadowTool;
