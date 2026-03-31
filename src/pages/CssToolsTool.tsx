import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type Tab = "border-radius" | "text-shadow" | "flexbox" | "grid" | "glassmorphism" | "triangle" | "unit-converter";

const tabs: { id: Tab; label: string }[] = [
  { id: "border-radius", label: "Border Radius" },
  { id: "text-shadow", label: "Text Shadow" },
  { id: "flexbox", label: "Flexbox" },
  { id: "grid", label: "Grid" },
  { id: "glassmorphism", label: "Glassmorphism" },
  { id: "triangle", label: "Triangle" },
  { id: "unit-converter", label: "Unit Converter" },
];

const inputClass = "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";
const btnPrimary = "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={btnPrimary}
      onClick={() => {
        copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copied!" : "Copy CSS"}
    </button>
  );
}

function CssOutput({ css }: { css: string }) {
  return (
    <div className="mt-4">
      <label className={labelClass}>Generated CSS</label>
      <pre className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground whitespace-pre-wrap break-all min-h-[60px]">
        {css}
      </pre>
      <div className="mt-2">
        <CopyButton text={css} />
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step = 1, suffix = "" }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix?: string;
}) {
  return (
    <div className="mb-3">
      <label className={labelClass}>{label}: {value}{suffix}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

// --- Border Radius ---
function BorderRadiusTab() {
  const [linked, setLinked] = useState(true);
  const [corners, setCorners] = useState([20, 20, 20, 20]);
  const names = ["Top Left", "Top Right", "Bottom Right", "Bottom Left"];

  const setCorner = (i: number, v: number) => {
    if (linked) {
      setCorners([v, v, v, v]);
    } else {
      const next = [...corners];
      next[i] = v;
      setCorners(next);
    }
  };

  const css = `border-radius: ${corners[0]}px ${corners[1]}px ${corners[2]}px ${corners[3]}px;`;

  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <div
          className="w-[200px] h-[200px] bg-primary/20 border border-border"
          style={{ borderRadius: `${corners[0]}px ${corners[1]}px ${corners[2]}px ${corners[3]}px` }}
        />
      </div>
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} className="accent-primary" />
          <span className="text-sm font-mono text-muted-foreground">Link all corners</span>
        </label>
      </div>
      {names.map((name, i) => (
        <Slider key={name} label={name} value={corners[i]} onChange={(v) => setCorner(i, v)} min={0} max={100} suffix="px" />
      ))}
      <CssOutput css={css} />
    </div>
  );
}

// --- Text Shadow ---
interface ShadowEntry { x: number; y: number; blur: number; color: string; }

function TextShadowTab() {
  const [shadows, setShadows] = useState<ShadowEntry[]>([{ x: 2, y: 2, blur: 4, color: "#000000" }]);

  const update = (i: number, field: keyof ShadowEntry, value: number | string) => {
    const next = shadows.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    setShadows(next);
  };

  const addShadow = () => setShadows([...shadows, { x: 2, y: 2, blur: 4, color: "#000000" }]);
  const removeShadow = (i: number) => {
    if (shadows.length > 1) setShadows(shadows.filter((_, idx) => idx !== i));
  };

  const shadowValue = shadows.map(s => `${s.x}px ${s.y}px ${s.blur}px ${s.color}`).join(", ");
  const css = `text-shadow: ${shadowValue};`;

  return (
    <div>
      <div className="flex items-center justify-center mb-6 min-h-[100px]">
        <span className="text-4xl font-bold text-foreground" style={{ textShadow: shadowValue }}>
          Sample Text
        </span>
      </div>
      {shadows.map((s, i) => (
        <div key={i} className="mb-4 p-3 rounded-md border border-border bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-muted-foreground font-bold">Shadow {i + 1}</span>
            {shadows.length > 1 && (
              <button onClick={() => removeShadow(i)} className="text-xs font-mono text-red-500 hover:underline">Remove</button>
            )}
          </div>
          <Slider label="Offset X" value={s.x} onChange={(v) => update(i, "x", v)} min={-50} max={50} suffix="px" />
          <Slider label="Offset Y" value={s.y} onChange={(v) => update(i, "y", v)} min={-50} max={50} suffix="px" />
          <Slider label="Blur" value={s.blur} onChange={(v) => update(i, "blur", v)} min={0} max={50} suffix="px" />
          <div className="mb-2">
            <label className={labelClass}>Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className="w-10 h-8 rounded cursor-pointer border border-border" />
              <input type="text" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className={inputClass + " max-w-[120px]"} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addShadow} className={btnPrimary + " mb-4"}>+ Add Shadow</button>
      <CssOutput css={css} />
    </div>
  );
}

// --- Flexbox ---
function FlexboxTab() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState("10");

  const parentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction as React.CSSProperties["flexDirection"],
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap as React.CSSProperties["flexWrap"],
    gap: `${gap}px`,
    minHeight: "200px",
  };

  const colors = ["bg-red-500/70", "bg-blue-500/70", "bg-green-500/70", "bg-yellow-500/70", "bg-purple-500/70"];

  const css = `.parent {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}

.child {
  padding: 16px 24px;
}`;

  const selectClass = inputClass;

  return (
    <div>
      <div className="mb-6 p-4 rounded-md border border-border bg-secondary/30" style={parentStyle}>
        {colors.map((c, i) => (
          <div key={i} className={`${c} rounded-md px-6 py-4 font-mono text-sm text-white font-bold flex items-center justify-center`}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>flex-direction</label>
          <select value={direction} onChange={(e) => setDirection(e.target.value)} className={selectClass}>
            <option value="row">row</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column">column</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>justify-content</label>
          <select value={justify} onChange={(e) => setJustify(e.target.value)} className={selectClass}>
            {["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>align-items</label>
          <select value={align} onChange={(e) => setAlign(e.target.value)} className={selectClass}>
            {["stretch", "flex-start", "flex-end", "center", "baseline"].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>flex-wrap</label>
          <select value={wrap} onChange={(e) => setWrap(e.target.value)} className={selectClass}>
            <option value="nowrap">nowrap</option>
            <option value="wrap">wrap</option>
            <option value="wrap-reverse">wrap-reverse</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label className={labelClass}>gap (px)</label>
        <input type="number" value={gap} onChange={(e) => setGap(e.target.value)} className={inputClass + " max-w-[120px]"} min={0} />
      </div>
      <CssOutput css={css} />
    </div>
  );
}

// --- Grid ---
function GridTab() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState("10");
  const [colTemplate, setColTemplate] = useState("1fr");
  const [rowTemplate, setRowTemplate] = useState("1fr");

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${colTemplate})`,
    gridTemplateRows: `repeat(${rows}, ${rowTemplate})`,
    gap: `${gap}px`,
    minHeight: "200px",
  };

  const cellCount = cols * rows;
  const cellColors = ["bg-red-500/60", "bg-blue-500/60", "bg-green-500/60", "bg-yellow-500/60", "bg-purple-500/60", "bg-pink-500/60", "bg-cyan-500/60", "bg-orange-500/60", "bg-teal-500/60", "bg-indigo-500/60", "bg-rose-500/60", "bg-emerald-500/60"];

  const css = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols}, ${colTemplate});
  grid-template-rows: repeat(${rows}, ${rowTemplate});
  gap: ${gap}px;
}`;

  return (
    <div>
      <div className="mb-6 p-4 rounded-md border border-border bg-secondary/30" style={gridStyle}>
        {Array.from({ length: cellCount }, (_, i) => (
          <div key={i} className={`${cellColors[i % cellColors.length]} rounded-md p-4 font-mono text-sm text-white font-bold flex items-center justify-center min-h-[60px]`}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>Columns</label>
          <input type="number" value={cols} onChange={(e) => setCols(Math.max(1, Math.min(12, Number(e.target.value))))} className={inputClass} min={1} max={12} />
        </div>
        <div>
          <label className={labelClass}>Rows</label>
          <input type="number" value={rows} onChange={(e) => setRows(Math.max(1, Math.min(12, Number(e.target.value))))} className={inputClass} min={1} max={12} />
        </div>
        <div>
          <label className={labelClass}>Column Template</label>
          <select value={colTemplate} onChange={(e) => setColTemplate(e.target.value)} className={inputClass}>
            <option value="1fr">1fr</option>
            <option value="auto">auto</option>
            <option value="100px">100px</option>
            <option value="minmax(100px, 1fr)">minmax(100px, 1fr)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Row Template</label>
          <select value={rowTemplate} onChange={(e) => setRowTemplate(e.target.value)} className={inputClass}>
            <option value="1fr">1fr</option>
            <option value="auto">auto</option>
            <option value="100px">100px</option>
            <option value="minmax(50px, 1fr)">minmax(50px, 1fr)</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label className={labelClass}>Gap (px)</label>
        <input type="number" value={gap} onChange={(e) => setGap(e.target.value)} className={inputClass + " max-w-[120px]"} min={0} />
      </div>
      <CssOutput css={css} />
    </div>
  );
}

// --- Glassmorphism ---
function GlassmorphismTab() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.25);
  const [border, setBorder] = useState(true);

  const glassStyle: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: "16px",
    border: border ? "1px solid rgba(255, 255, 255, 0.18)" : "none",
    padding: "32px",
    width: "280px",
    textAlign: "center",
  };

  const css = `.glass {
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: 16px;${border ? "\n  border: 1px solid rgba(255, 255, 255, 0.18);" : ""}
}`;

  return (
    <div>
      <div
        className="mb-6 flex items-center justify-center rounded-md min-h-[260px]"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffd452 100%)" }}
      >
        <div style={glassStyle}>
          <div className="text-white font-mono font-bold text-lg mb-2">Glass Card</div>
          <div className="text-white/80 font-mono text-sm">Glassmorphism effect preview</div>
        </div>
      </div>
      <Slider label="Blur" value={blur} onChange={setBlur} min={0} max={20} suffix="px" />
      <Slider label="Opacity" value={opacity} onChange={setOpacity} min={0} max={1} step={0.05} />
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={border} onChange={(e) => setBorder(e.target.checked)} className="accent-primary" />
          <span className="text-sm font-mono text-muted-foreground">Show border</span>
        </label>
      </div>
      <CssOutput css={css} />
    </div>
  );
}

// --- CSS Triangle ---
function TriangleTab() {
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("up");
  const [size, setSize] = useState(80);
  const [color, setColor] = useState("#3b82f6");

  const getTriangleStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { width: 0, height: 0 };
    const transparent = `${size}px solid transparent`;
    const solid = `${size}px solid ${color}`;

    switch (direction) {
      case "up":
        return { ...base, borderLeft: transparent, borderRight: transparent, borderBottom: solid };
      case "down":
        return { ...base, borderLeft: transparent, borderRight: transparent, borderTop: solid };
      case "left":
        return { ...base, borderTop: transparent, borderBottom: transparent, borderRight: solid };
      case "right":
        return { ...base, borderTop: transparent, borderBottom: transparent, borderLeft: solid };
    }
  };

  const getCss = () => {
    const transparent = `${size}px solid transparent`;
    const solid = `${size}px solid ${color}`;
    let borders = "";
    switch (direction) {
      case "up":
        borders = `  border-left: ${transparent};\n  border-right: ${transparent};\n  border-bottom: ${solid};`;
        break;
      case "down":
        borders = `  border-left: ${transparent};\n  border-right: ${transparent};\n  border-top: ${solid};`;
        break;
      case "left":
        borders = `  border-top: ${transparent};\n  border-bottom: ${transparent};\n  border-right: ${solid};`;
        break;
      case "right":
        borders = `  border-top: ${transparent};\n  border-bottom: ${transparent};\n  border-left: ${solid};`;
        break;
    }
    return `.triangle {\n  width: 0;\n  height: 0;\n${borders}\n}`;
  };

  const directions: ("up" | "down" | "left" | "right")[] = ["up", "down", "left", "right"];

  return (
    <div>
      <div className="flex items-center justify-center mb-6 min-h-[220px]">
        <div style={getTriangleStyle()} />
      </div>
      <div className="mb-3">
        <label className={labelClass}>Direction</label>
        <div className="flex gap-2">
          {directions.map((d) => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
                direction === d
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <Slider label="Size" value={size} onChange={setSize} min={10} max={200} suffix="px" />
      <div className="mb-3">
        <label className={labelClass}>Color</label>
        <div className="flex items-center gap-2">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer border border-border" />
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className={inputClass + " max-w-[120px]"} />
        </div>
      </div>
      <CssOutput css={getCss()} />
    </div>
  );
}

// --- Unit Converter ---
function UnitConverterTab() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState("px");
  const [toUnit, setToUnit] = useState("rem");
  const [baseFontSize, setBaseFontSize] = useState("16");
  const [viewportWidth, setViewportWidth] = useState("1920");

  const units = ["px", "rem", "em", "%", "vw", "vh"];

  const convert = (): { result: string; formula: string } => {
    const v = parseFloat(value);
    const base = parseFloat(baseFontSize) || 16;
    const vw = parseFloat(viewportWidth) || 1920;

    if (isNaN(v)) return { result: "—", formula: "Enter a valid number" };
    if (fromUnit === toUnit) return { result: String(v), formula: `${v}${fromUnit} = ${v}${toUnit}` };

    // Convert to px first
    let px: number;
    switch (fromUnit) {
      case "px": px = v; break;
      case "rem": case "em": px = v * base; break;
      case "%": px = (v / 100) * vw; break;
      case "vw": px = (v / 100) * vw; break;
      case "vh": px = (v / 100) * vw; break; // approximation
      default: px = v;
    }

    // Convert from px to target
    let result: number;
    switch (toUnit) {
      case "px": result = px; break;
      case "rem": case "em": result = px / base; break;
      case "%": result = (px / vw) * 100; break;
      case "vw": result = (px / vw) * 100; break;
      case "vh": result = (px / vw) * 100; break;
      default: result = px;
    }

    const rounded = Math.round(result * 10000) / 10000;

    // Build formula
    let formula = "";
    if (fromUnit === "px" && (toUnit === "rem" || toUnit === "em")) {
      formula = `${v}px / ${base}px (base) = ${rounded}${toUnit}`;
    } else if ((fromUnit === "rem" || fromUnit === "em") && toUnit === "px") {
      formula = `${v}${fromUnit} * ${base}px (base) = ${rounded}px`;
    } else if (fromUnit === "px" && toUnit === "vw") {
      formula = `(${v}px / ${vw}px) * 100 = ${rounded}vw`;
    } else if (fromUnit === "vw" && toUnit === "px") {
      formula = `(${v}vw / 100) * ${vw}px = ${rounded}px`;
    } else {
      formula = `${v}${fromUnit} -> ${px}px -> ${rounded}${toUnit}`;
    }

    return { result: `${rounded}${toUnit}`, formula };
  };

  const { result, formula } = convert();

  return (
    <div>
      <div className="flex items-center justify-center mb-6 min-h-[100px]">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-foreground">{result}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">{formula}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className={labelClass}>Value</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>From</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={inputClass}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>To</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={inputClass}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>Base Font Size (px)</label>
          <input type="number" value={baseFontSize} onChange={(e) => setBaseFontSize(e.target.value)} className={inputClass} min={1} />
          <span className="text-xs font-mono text-muted-foreground">Used for rem/em conversions</span>
        </div>
        <div>
          <label className={labelClass}>Viewport Width (px)</label>
          <input type="number" value={viewportWidth} onChange={(e) => setViewportWidth(e.target.value)} className={inputClass} min={1} />
          <span className="text-xs font-mono text-muted-foreground">Used for vw/% conversions</span>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
const CssToolsTool = () => {
  const [activeTab, setActiveTab] = useState<Tab>("border-radius");

  const renderTab = () => {
    switch (activeTab) {
      case "border-radius": return <BorderRadiusTab />;
      case "text-shadow": return <TextShadowTab />;
      case "flexbox": return <FlexboxTab />;
      case "grid": return <GridTab />;
      case "glassmorphism": return <GlassmorphismTab />;
      case "triangle": return <TriangleTab />;
      case "unit-converter": return <UnitConverterTab />;
    }
  };

  return (
    <Layout>
      <SEO title="CSS Generators" description="Generate CSS for border-radius, text-shadow, flexbox, grid, glassmorphism, triangles, and convert units." canonical="/css-tools" keywords="css border radius generator, flexbox generator, css grid generator, glassmorphism generator" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">CSS Tools</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          {renderTab()}
        </div>
      </div>
    </Layout>
  );
};

export default CssToolsTool;
