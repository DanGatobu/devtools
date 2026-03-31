import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useRef, useEffect } from "react";

type ChartTab = "bar" | "pie" | "line" | "doughnut";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

const TABS: { label: string; value: ChartTab }[] = [
  { label: "Bar Chart", value: "bar" },
  { label: "Pie Chart", value: "pie" },
  { label: "Line Chart", value: "line" },
  { label: "Doughnut Chart", value: "doughnut" },
];

interface DataRow {
  label: string;
  value: string;
}

interface LineSeries {
  name: string;
  points: { x: string; y: string }[];
}

const defaultBarData: DataRow[] = [
  { label: "Jan", value: "40" },
  { label: "Feb", value: "65" },
  { label: "Mar", value: "50" },
  { label: "Apr", value: "80" },
  { label: "May", value: "55" },
];

const defaultLineSeries: LineSeries[] = [
  {
    name: "Series 1",
    points: [
      { x: "0", y: "10" },
      { x: "1", y: "40" },
      { x: "2", y: "25" },
      { x: "3", y: "60" },
      { x: "4", y: "35" },
    ],
  },
];

function ChartMakerTool() {
  const [tab, setTab] = useState<ChartTab>("bar");
  const [title, setTitle] = useState("My Chart");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Bar / Pie / Doughnut shared data
  const [tableData, setTableData] = useState<DataRow[]>([...defaultBarData]);

  // Line chart data
  const [lineSeries, setLineSeries] = useState<LineSeries[]>(
    JSON.parse(JSON.stringify(defaultLineSeries))
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Data table helpers ---
  const updateRow = (i: number, field: "label" | "value", val: string) => {
    setTableData((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  };

  const addRow = () =>
    setTableData((prev) => [...prev, { label: "", value: "0" }]);

  const removeRow = (i: number) =>
    setTableData((prev) => prev.filter((_, idx) => idx !== i));

  // --- Line series helpers ---
  const updatePoint = (
    si: number,
    pi: number,
    field: "x" | "y",
    val: string
  ) => {
    setLineSeries((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as LineSeries[];
      next[si].points[pi][field] = val;
      return next;
    });
  };

  const updateSeriesName = (si: number, name: string) => {
    setLineSeries((prev) => {
      const next = [...prev];
      next[si] = { ...next[si], name };
      return next;
    });
  };

  const addPoint = (si: number) => {
    setLineSeries((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as LineSeries[];
      next[si].points.push({ x: "", y: "0" });
      return next;
    });
  };

  const removePoint = (si: number, pi: number) => {
    setLineSeries((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as LineSeries[];
      next[si].points = next[si].points.filter((_, idx) => idx !== pi);
      return next;
    });
  };

  const addSeries = () => {
    setLineSeries((prev) => [
      ...prev,
      {
        name: `Series ${prev.length + 1}`,
        points: [
          { x: "0", y: "0" },
          { x: "1", y: "0" },
        ],
      },
    ]);
  };

  const removeSeries = (si: number) => {
    setLineSeries((prev) => prev.filter((_, idx) => idx !== si));
  };

  // --- Drawing ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 600;
    const H = 400;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = "#111827";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(title, W / 2, 24);

    if (tab === "bar") drawBarChart(ctx, W, H);
    else if (tab === "pie") drawPieChart(ctx, W, H, false);
    else if (tab === "doughnut") drawPieChart(ctx, W, H, true);
    else if (tab === "line") drawLineChart(ctx, W, H);
  }, [tab, title, bgColor, tableData, lineSeries]);

  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number
  ) => {
    const pad = { top: 50, right: 30, bottom: 50, left: 60 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;

    const values = tableData.map((r) => parseFloat(r.value) || 0);
    const maxVal = Math.max(...values, 1);
    const niceMax = Math.ceil(maxVal / 5) * 5 || 5;
    const gridLines = 5;

    // Gridlines + y-axis labels
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= gridLines; i++) {
      const y = pad.top + cH - (i / gridLines) * cH;
      const val = ((i / gridLines) * niceMax).toFixed(0);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      ctx.fillText(val, pad.left - 8, y + 4);
    }

    // Bars
    const barCount = tableData.length;
    if (barCount === 0) return;
    const barGap = 8;
    const barW = Math.max(4, (cW - barGap * (barCount + 1)) / barCount);

    tableData.forEach((row, i) => {
      const val = parseFloat(row.value) || 0;
      const barH = (val / niceMax) * cH;
      const x = pad.left + barGap + i * (barW + barGap);
      const y = pad.top + cH - barH;

      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(x, y, barW, barH);

      // Value on top
      ctx.fillStyle = "#111827";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(val.toString(), x + barW / 2, y - 4);

      // Label on x-axis
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px monospace";
      ctx.fillText(row.label || "", x + barW / 2, pad.top + cH + 18);
    });

    // Axes
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + cH);
    ctx.lineTo(W - pad.right, pad.top + cH);
    ctx.stroke();
  };

  const drawPieChart = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    isDoughnut: boolean
  ) => {
    const cx = W / 2 - 60;
    const cy = H / 2 + 10;
    const outerR = 130;
    const innerR = isDoughnut ? outerR * 0.6 : 0;

    const values = tableData.map((r) => parseFloat(r.value) || 0);
    const total = values.reduce((a, b) => a + b, 0) || 1;

    let startAngle = -Math.PI / 2;
    const slices: { midAngle: number; pct: string; label: string }[] = [];

    tableData.forEach((row, i) => {
      const val = parseFloat(row.value) || 0;
      const sweep = (val / total) * 2 * Math.PI;
      const midAngle = startAngle + sweep / 2;
      const pct = ((val / total) * 100).toFixed(1) + "%";

      ctx.beginPath();
      ctx.moveTo(
        cx + innerR * Math.cos(startAngle),
        cy + innerR * Math.sin(startAngle)
      );
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      slices.push({ midAngle, pct, label: row.label });
      startAngle += sweep;
    });

    // Labels on slices
    slices.forEach((s) => {
      const labelR = innerR > 0 ? (outerR + innerR) / 2 : outerR * 0.65;
      const lx = cx + labelR * Math.cos(s.midAngle);
      const ly = cy + labelR * Math.sin(s.midAngle);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.pct, lx, ly);
    });

    // Center total for doughnut
    if (isDoughnut) {
      ctx.fillStyle = "#111827";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(total.toString(), cx, cy - 8);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Total", cx, cy + 12);
    }

    // Legend
    const legendX = W - 150;
    let legendY = 60;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    tableData.forEach((row, i) => {
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(legendX, legendY, 12, 12);
      ctx.fillStyle = "#111827";
      ctx.font = "11px monospace";
      ctx.fillText(row.label || `Item ${i + 1}`, legendX + 18, legendY + 1);
      legendY += 20;
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number
  ) => {
    const pad = { top: 50, right: 30, bottom: 50, left: 60 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;

    // Gather all numeric values
    let allX: number[] = [];
    let allY: number[] = [];
    lineSeries.forEach((s) => {
      s.points.forEach((p) => {
        const px = parseFloat(p.x);
        const py = parseFloat(p.y);
        if (!isNaN(px)) allX.push(px);
        if (!isNaN(py)) allY.push(py);
      });
    });

    if (allX.length === 0 || allY.length === 0) return;

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY, 0);
    const rawMaxY = Math.max(...allY, 1);
    const niceMaxY = Math.ceil(rawMaxY / 5) * 5 || 5;
    const rangeX = maxX - minX || 1;

    const toCanvasX = (v: number) => pad.left + ((v - minX) / rangeX) * cW;
    const toCanvasY = (v: number) =>
      pad.top + cH - ((v - minY) / (niceMaxY - minY)) * cH;

    // Gridlines
    const gridLines = 5;
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= gridLines; i++) {
      const val = minY + (i / gridLines) * (niceMaxY - minY);
      const y = toCanvasY(val);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(0), pad.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = "center";
    const xSteps = Math.min(allX.length, 10);
    for (let i = 0; i <= xSteps; i++) {
      const val = minX + (i / xSteps) * rangeX;
      ctx.fillText(val.toFixed(1), toCanvasX(val), pad.top + cH + 18);
    }

    // Axes
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + cH);
    ctx.lineTo(W - pad.right, pad.top + cH);
    ctx.stroke();

    // Draw series
    lineSeries.forEach((series, si) => {
      const color = COLORS[si % COLORS.length];
      const pts = series.points
        .map((p) => ({ x: parseFloat(p.x), y: parseFloat(p.y) }))
        .filter((p) => !isNaN(p.x) && !isNaN(p.y))
        .sort((a, b) => a.x - b.x);

      if (pts.length === 0) return;

      // Line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const cx2 = toCanvasX(p.x);
        const cy2 = toCanvasY(p.y);
        if (i === 0) ctx.moveTo(cx2, cy2);
        else ctx.lineTo(cx2, cy2);
      });
      ctx.stroke();

      // Dots
      pts.forEach((p) => {
        const cx2 = toCanvasX(p.x);
        const cy2 = toCanvasY(p.y);
        ctx.beginPath();
        ctx.arc(cx2, cy2, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = bgColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // Legend
    let legendY = 42;
    ctx.textAlign = "left";
    lineSeries.forEach((series, si) => {
      const lx = pad.left + 10;
      ctx.fillStyle = COLORS[si % COLORS.length];
      ctx.fillRect(lx, legendY, 12, 12);
      ctx.fillStyle = "#111827";
      ctx.font = "11px monospace";
      ctx.fillText(series.name, lx + 18, legendY + 10);
      legendY += 18;
    });
  };

  // --- Download ---
  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${title || "chart"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // --- Shared input class ---
  const inputCls =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const btnPrimary =
    "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";
  const btnSmall =
    "px-2 py-1 rounded-md bg-primary text-primary-foreground font-mono text-xs hover:opacity-90 transition-opacity";
  const btnDanger =
    "px-2 py-1 rounded-md bg-destructive text-destructive-foreground font-mono text-xs hover:opacity-90 transition-opacity";

  const isTableChart = tab === "bar" || tab === "pie" || tab === "doughnut";

  return (
    <Layout>
      <SEO title="Chart Maker" description="Create bar charts, pie charts, line charts, and doughnut charts online. Download as PNG." canonical="/chart-maker" keywords="chart maker, pie chart maker, bar chart maker, line chart maker, graph maker online" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Chart Maker
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
                tab === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* Title + BG color */}
            <div className="bg-secondary rounded-lg border border-border p-4">
              <label className="block font-mono text-sm text-foreground mb-1">
                Chart Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
              />
              <label className="block font-mono text-sm text-foreground mt-3 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Data table for bar/pie/doughnut */}
            {isTableChart && (
              <div className="bg-secondary rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold text-foreground">
                    Data
                  </span>
                  <button onClick={addRow} className={btnSmall}>
                    + Add Row
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 font-mono text-xs text-muted-foreground">
                    <span>Label</span>
                    <span>Value</span>
                    <span className="w-8" />
                  </div>
                  {tableData.map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => updateRow(i, "label", e.target.value)}
                        placeholder="Label"
                        className={inputCls}
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => updateRow(i, "value", e.target.value)}
                        placeholder="0"
                        className={inputCls}
                      />
                      <button
                        onClick={() => removeRow(i)}
                        className={btnDanger}
                        title="Remove row"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data table for line chart */}
            {tab === "line" && (
              <div className="bg-secondary rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-foreground">
                    Series Data
                  </span>
                  <button onClick={addSeries} className={btnSmall}>
                    + Add Series
                  </button>
                </div>
                {lineSeries.map((series, si) => (
                  <div
                    key={si}
                    className="bg-background rounded-md border border-border p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={series.name}
                        onChange={(e) => updateSeriesName(si, e.target.value)}
                        className={inputCls}
                        placeholder="Series name"
                      />
                      {lineSeries.length > 1 && (
                        <button
                          onClick={() => removeSeries(si)}
                          className={btnDanger}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2 font-mono text-xs text-muted-foreground">
                      <span>X</span>
                      <span>Y</span>
                      <span className="w-8" />
                    </div>
                    {series.points.map((pt, pi) => (
                      <div
                        key={pi}
                        className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
                      >
                        <input
                          type="text"
                          value={pt.x}
                          onChange={(e) =>
                            updatePoint(si, pi, "x", e.target.value)
                          }
                          placeholder="X"
                          className={inputCls}
                        />
                        <input
                          type="text"
                          value={pt.y}
                          onChange={(e) =>
                            updatePoint(si, pi, "y", e.target.value)
                          }
                          placeholder="Y"
                          className={inputCls}
                        />
                        <button
                          onClick={() => removePoint(si, pi)}
                          className={btnDanger}
                          title="Remove point"
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addPoint(si)} className={btnSmall}>
                      + Add Point
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart preview */}
          <div className="space-y-4">
            <div className="bg-secondary rounded-lg border border-border p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{ maxWidth: "100%", height: "auto" }}
                className="rounded"
              />
            </div>
            <button onClick={downloadPng} className={btnPrimary}>
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChartMakerTool;
