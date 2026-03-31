import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  color: string;
  position: number;
}

const CssGradientTool = () => {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const updateStop = (index: number, field: keyof ColorStop, value: string | number) => {
    setColorStops((prev) =>
      prev.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop))
    );
  };

  const addStop = () => {
    const lastPos = colorStops[colorStops.length - 1]?.position ?? 100;
    const newPos = Math.min(lastPos + 10, 100);
    setColorStops((prev) => [...prev, { color: "#ffffff", position: newPos }]);
  };

  const removeStop = (index: number) => {
    if (colorStops.length <= 2) return;
    setColorStops((prev) => prev.filter((_, i) => i !== index));
  };

  const stopsString = colorStops
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");

  const generateCss = (): string => {
    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stopsString})`;
      case "radial":
        return `radial-gradient(circle, ${stopsString})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stopsString})`;
    }
  };

  const cssValue = generateCss();
  const cssOutput = `background: ${cssValue};`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const gradientTypes: GradientType[] = ["linear", "radial", "conic"];

  return (
    <Layout>
      <SEO title="CSS Gradient Generator" description="Create beautiful CSS gradients visually. Supports linear, radial, and conic gradients with multiple color stops." canonical="/css-gradient" keywords="css gradient generator, linear gradient, radial gradient, css gradient maker" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          CSS Gradient Generator
        </h1>

        {/* Preview */}
        <div
          className="h-64 rounded-lg border border-border mb-6"
          style={{ background: cssValue }}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-5">
            {/* Gradient Type */}
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                Gradient Type
              </label>
              <div className="flex gap-2">
                {gradientTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={
                      gradientType === type
                        ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                        : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle (for linear and conic) */}
            {(gradientType === "linear" || gradientType === "conic") && (
              <div>
                <label className="text-sm font-mono text-muted-foreground mb-1 block">
                  Angle ({angle}deg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-20 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Color Stops */}
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                Color Stops
              </label>
              <div className="space-y-2">
                {colorStops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(index, "color", e.target.value)}
                      className="w-10 h-10 rounded border border-border cursor-pointer bg-secondary"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(index, "color", e.target.value)}
                      className="w-24 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) => updateStop(index, "position", Number(e.target.value))}
                      className="w-20 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-sm font-mono text-muted-foreground">%</span>
                    <button
                      onClick={() => removeStop(index)}
                      disabled={colorStops.length <= 2}
                      className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addStop}
                className="mt-3 px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
              >
                + Add Color Stop
              </button>
            </div>
          </div>

          {/* CSS Output */}
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-1 block">
              Generated CSS
            </label>
            <textarea
              readOnly
              value={cssOutput}
              className="w-full h-32 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground resize-none focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="mt-3 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              {copied ? "Copied!" : "Copy CSS"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CssGradientTool;
