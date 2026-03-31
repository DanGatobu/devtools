import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useMemo } from "react";

type FieldMode = "every" | "specific" | "range" | "interval";

interface CronField {
  mode: FieldMode;
  specific: number[];
  rangeFrom: number;
  rangeTo: number;
  interval: number;
}

const FIELD_DEFS = [
  { label: "Minute", min: 0, max: 59 },
  { label: "Hour", min: 0, max: 23 },
  { label: "Day of Month", min: 1, max: 31 },
  { label: "Month", min: 1, max: 12 },
  { label: "Day of Week", min: 0, max: 6 },
] as const;

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function makeField(): CronField {
  return { mode: "every", specific: [], rangeFrom: 0, rangeTo: 0, interval: 1 };
}

function fieldToString(field: CronField, def: typeof FIELD_DEFS[number]): string {
  switch (field.mode) {
    case "every":
      return "*";
    case "specific":
      return field.specific.length > 0 ? field.specific.sort((a, b) => a - b).join(",") : "*";
    case "range":
      return `${field.rangeFrom}-${field.rangeTo}`;
    case "interval":
      return field.interval > 0 ? `*/${field.interval}` : `*/${def.min === 0 ? 1 : def.min}`;
    default:
      return "*";
  }
}

function describeCron(parts: string[]): string {
  if (parts.length !== 5) return "Invalid cron expression";
  const [minute, hour, dom, month, dow] = parts;

  // Common patterns
  if (minute === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") {
    return "Every minute";
  }
  if (minute === "0" && hour === "*" && dom === "*" && month === "*" && dow === "*") {
    return "Every hour, at minute 0";
  }
  if (minute === "0" && hour === "0" && dom === "*" && month === "*" && dow === "*") {
    return "Every day at midnight";
  }
  if (minute === "0" && hour === "0" && dom === "1" && month === "*" && dow === "*") {
    return "At midnight on the 1st of every month";
  }
  if (minute === "0" && hour === "0" && dom === "1" && month === "1" && dow === "*") {
    return "At midnight on January 1st (yearly)";
  }

  const pieces: string[] = [];

  // Minute description
  if (minute === "*") {
    pieces.push("Every minute");
  } else if (minute.startsWith("*/")) {
    pieces.push(`Every ${minute.slice(2)} minutes`);
  } else if (minute.includes(",")) {
    pieces.push(`At minutes ${minute}`);
  } else if (minute.includes("-")) {
    const [f, t] = minute.split("-");
    pieces.push(`Minutes ${f} through ${t}`);
  } else {
    pieces.push(`At minute ${minute}`);
  }

  // Hour description
  if (hour === "*") {
    if (minute !== "*" && !minute.startsWith("*/")) {
      pieces.push("every hour");
    }
  } else if (hour.startsWith("*/")) {
    pieces.push(`every ${hour.slice(2)} hours`);
  } else if (hour.includes(",")) {
    pieces.push(`at hours ${hour}`);
  } else if (hour.includes("-")) {
    const [f, t] = hour.split("-");
    pieces.push(`during hours ${f}-${t}`);
  } else {
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    pieces.push(`at ${h12}${ampm}`);
  }

  // Day of month
  if (dom !== "*") {
    if (dom.startsWith("*/")) {
      pieces.push(`every ${dom.slice(2)} days`);
    } else if (dom.includes(",")) {
      pieces.push(`on days ${dom} of the month`);
    } else if (dom.includes("-")) {
      const [f, t] = dom.split("-");
      pieces.push(`on days ${f}-${t} of the month`);
    } else {
      pieces.push(`on day ${dom} of the month`);
    }
  }

  // Month
  if (month !== "*") {
    if (month.startsWith("*/")) {
      pieces.push(`every ${month.slice(2)} months`);
    } else if (month.includes(",")) {
      const names = month.split(",").map(m => MONTH_NAMES[parseInt(m, 10)] || m).join(", ");
      pieces.push(`in ${names}`);
    } else if (month.includes("-")) {
      const [f, t] = month.split("-");
      pieces.push(`in ${MONTH_NAMES[parseInt(f, 10)] || f}-${MONTH_NAMES[parseInt(t, 10)] || t}`);
    } else {
      pieces.push(`in ${MONTH_NAMES[parseInt(month, 10)] || month}`);
    }
  }

  // Day of week
  if (dow !== "*") {
    if (dow.startsWith("*/")) {
      pieces.push(`every ${dow.slice(2)} days of the week`);
    } else if (dow.includes(",")) {
      const names = dow.split(",").map(d => DOW_NAMES[parseInt(d, 10)] || d).join(", ");
      pieces.push(`on ${names}`);
    } else if (dow.includes("-")) {
      const [f, t] = dow.split("-");
      pieces.push(`on ${DOW_NAMES[parseInt(f, 10)] || f}-${DOW_NAMES[parseInt(t, 10)] || t}`);
    } else {
      pieces.push(`on ${DOW_NAMES[parseInt(dow, 10)] || dow}`);
    }
  }

  return pieces.join(", ");
}

function expandField(token: string, min: number, max: number): number[] | null {
  const values: Set<number> = new Set();
  const parts = token.split(",");
  for (const part of parts) {
    if (part === "*") {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.startsWith("*/")) {
      const step = parseInt(part.slice(2), 10);
      if (isNaN(step) || step <= 0) return null;
      for (let i = min; i <= max; i += step) values.add(i);
    } else if (part.includes("-")) {
      const [fromStr, toStr] = part.split("-");
      const from = parseInt(fromStr, 10);
      const to = parseInt(toStr, 10);
      if (isNaN(from) || isNaN(to)) return null;
      for (let i = from; i <= to; i++) values.add(i);
    } else {
      const v = parseInt(part, 10);
      if (isNaN(v)) return null;
      values.add(v);
    }
  }
  return Array.from(values).sort((a, b) => a - b);
}

function getNextExecutions(cronStr: string, count: number): Date[] {
  const parts = cronStr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const minutes = expandField(parts[0], 0, 59);
  const hours = expandField(parts[1], 0, 23);
  const doms = expandField(parts[2], 1, 31);
  const months = expandField(parts[3], 1, 12);
  const dows = expandField(parts[4], 0, 6);

  if (!minutes || !hours || !doms || !months || !dows) return [];

  const hasDowConstraint = parts[4] !== "*";
  const hasDomConstraint = parts[2] !== "*";

  const results: Date[] = [];
  const now = new Date();
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

  const maxIterations = 525960; // ~1 year of minutes
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    iterations++;
    const mo = cursor.getMonth() + 1;
    const d = cursor.getDate();
    const dow = cursor.getDay();
    const h = cursor.getHours();
    const m = cursor.getMinutes();

    if (!months.includes(mo)) {
      cursor.setMonth(cursor.getMonth() + 1, 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }
    if (!hours.includes(h)) {
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
      continue;
    }

    const domMatch = doms.includes(d);
    const dowMatch = dows.includes(dow);

    let dayOk: boolean;
    if (hasDomConstraint && hasDowConstraint) {
      dayOk = domMatch || dowMatch;
    } else if (hasDomConstraint) {
      dayOk = domMatch;
    } else if (hasDowConstraint) {
      dayOk = dowMatch;
    } else {
      dayOk = true;
    }

    if (!dayOk) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    if (!minutes.includes(m)) {
      cursor.setMinutes(cursor.getMinutes() + 1);
      continue;
    }

    results.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

function parseCronToken(token: string, def: typeof FIELD_DEFS[number]): CronField {
  if (token === "*") return makeField();
  if (token.startsWith("*/")) {
    return { ...makeField(), mode: "interval", interval: parseInt(token.slice(2), 10) || 1 };
  }
  if (token.includes("-") && !token.includes(",")) {
    const [f, t] = token.split("-");
    return { ...makeField(), mode: "range", rangeFrom: parseInt(f, 10) || def.min, rangeTo: parseInt(t, 10) || def.max };
  }
  const nums = token.split(",").map(n => parseInt(n, 10)).filter(n => !isNaN(n));
  if (nums.length > 0) {
    return { ...makeField(), mode: "specific", specific: nums };
  }
  return makeField();
}

interface Preset {
  label: string;
  cron: string;
}

const PRESETS: Preset[] = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every Monday", cron: "0 0 * * 1" },
  { label: "Every weekday at 9am", cron: "0 9 * * 1-5" },
  { label: "Twice daily", cron: "0 0,12 * * *" },
  { label: "Weekly", cron: "0 0 * * 0" },
  { label: "Monthly", cron: "0 0 1 * *" },
  { label: "Yearly", cron: "0 0 1 1 *" },
];

const primaryBtn = "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";
const secondaryBtn = "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors";
const inputCls = "bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const labelCls = "text-sm font-mono text-muted-foreground mb-1 block";

const CronTool = () => {
  const [mode, setMode] = useState<"builder" | "parser">("builder");
  const [fields, setFields] = useState<CronField[]>([
    makeField(), makeField(), makeField(), makeField(), makeField(),
  ]);
  const [parserInput, setParserInput] = useState("");

  const cronExpression = useMemo(() => {
    return fields.map((f, i) => fieldToString(f, FIELD_DEFS[i])).join(" ");
  }, [fields]);

  const builderDescription = useMemo(() => {
    const parts = cronExpression.split(" ");
    return describeCron(parts);
  }, [cronExpression]);

  const builderNextExecs = useMemo(() => {
    return getNextExecutions(cronExpression, 5);
  }, [cronExpression]);

  const parsedParts = useMemo(() => {
    return parserInput.trim().split(/\s+/);
  }, [parserInput]);

  const parserValid = parsedParts.length === 5;

  const parserDescription = useMemo(() => {
    if (!parserValid) return "Enter a valid 5-field cron expression";
    return describeCron(parsedParts);
  }, [parsedParts, parserValid]);

  const parserNextExecs = useMemo(() => {
    if (!parserValid) return [];
    return getNextExecutions(parserInput.trim(), 5);
  }, [parserInput, parserValid]);

  const updateField = (index: number, updates: Partial<CronField>) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f));
  };

  const applyPreset = (cron: string) => {
    const tokens = cron.split(" ");
    setFields(tokens.map((t, i) => parseCronToken(t, FIELD_DEFS[i])));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderSpecificOptions = (fieldIndex: number, field: CronField) => {
    const def = FIELD_DEFS[fieldIndex];
    const count = def.max - def.min + 1;

    if (count <= 12) {
      const labels = fieldIndex === 3
        ? MONTH_NAMES.slice(1)
        : fieldIndex === 4
          ? DOW_NAMES
          : null;

      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from({ length: count }, (_, i) => {
            const val = def.min + i;
            const checked = field.specific.includes(val);
            return (
              <label key={val} className="flex items-center gap-1 text-xs font-mono text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? field.specific.filter(v => v !== val)
                      : [...field.specific, val];
                    updateField(fieldIndex, { specific: next });
                  }}
                  className="accent-primary"
                />
                {labels ? labels[i] : val}
              </label>
            );
          })}
        </div>
      );
    }

    return (
      <div className="mt-2">
        <input
          type="text"
          className={inputCls + " w-full"}
          placeholder={`Comma-separated values (${def.min}-${def.max})`}
          value={field.specific.join(",")}
          onChange={(e) => {
            const nums = e.target.value
              .split(",")
              .map(s => parseInt(s.trim(), 10))
              .filter(n => !isNaN(n) && n >= def.min && n <= def.max);
            updateField(fieldIndex, { specific: nums });
          }}
        />
      </div>
    );
  };

  return (
    <Layout>
      <SEO title="Cron Expression Generator" description="Build and parse cron expressions with a visual editor. See next execution times and human-readable descriptions." canonical="/cron" keywords="cron expression generator, cron builder, crontab generator, cron schedule" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Cron Expression Tool</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("builder")}
            className={mode === "builder" ? primaryBtn : secondaryBtn}
          >
            Builder
          </button>
          <button
            onClick={() => setMode("parser")}
            className={mode === "parser" ? primaryBtn : secondaryBtn}
          >
            Parser
          </button>
        </div>

        {mode === "builder" && (
          <div className="space-y-6">
            {/* Cron expression display */}
            <div className="text-xl font-mono bg-secondary p-4 rounded-lg border border-border text-center text-foreground select-all">
              {cronExpression}
            </div>

            <div className="flex justify-center">
              <button onClick={() => copyToClipboard(cronExpression)} className={secondaryBtn}>
                Copy Expression
              </button>
            </div>

            {/* Human-readable description */}
            <div className="bg-secondary/50 rounded-lg border border-border p-3">
              <span className="text-sm font-mono text-muted-foreground">Description: </span>
              <span className="text-sm font-mono text-primary">{builderDescription}</span>
            </div>

            {/* Quick presets */}
            <div>
              <label className={labelCls}>Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.cron}
                    onClick={() => applyPreset(preset.cron)}
                    className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground font-mono text-xs hover:bg-secondary/80 transition-colors border border-border"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field editors */}
            <div className="space-y-4">
              {FIELD_DEFS.map((def, i) => (
                <div key={def.label} className="bg-secondary rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-mono font-bold text-foreground">{def.label}</label>
                    <span className="text-xs font-mono text-muted-foreground">
                      ({def.min}-{def.max}) = <span className="text-primary">{fieldToString(fields[i], def)}</span>
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-2">
                    {(["every", "specific", "range", "interval"] as FieldMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => updateField(i, { mode: m })}
                        className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                          fields[i].mode === m
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground border border-border hover:text-foreground"
                        }`}
                      >
                        {m === "every" ? "Every (*)" : m === "specific" ? "Specific" : m === "range" ? "Range" : "Interval (*/n)"}
                      </button>
                    ))}
                  </div>

                  {fields[i].mode === "specific" && renderSpecificOptions(i, fields[i])}

                  {fields[i].mode === "range" && (
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs font-mono text-muted-foreground">From</label>
                      <input
                        type="number"
                        min={def.min}
                        max={def.max}
                        value={fields[i].rangeFrom}
                        onChange={(e) => updateField(i, { rangeFrom: parseInt(e.target.value, 10) || def.min })}
                        className={inputCls + " w-20"}
                      />
                      <label className="text-xs font-mono text-muted-foreground">To</label>
                      <input
                        type="number"
                        min={def.min}
                        max={def.max}
                        value={fields[i].rangeTo}
                        onChange={(e) => updateField(i, { rangeTo: parseInt(e.target.value, 10) || def.max })}
                        className={inputCls + " w-20"}
                      />
                    </div>
                  )}

                  {fields[i].mode === "interval" && (
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs font-mono text-muted-foreground">Every</label>
                      <input
                        type="number"
                        min={1}
                        max={def.max}
                        value={fields[i].interval}
                        onChange={(e) => updateField(i, { interval: parseInt(e.target.value, 10) || 1 })}
                        className={inputCls + " w-20"}
                      />
                      <span className="text-xs font-mono text-muted-foreground">{def.label.toLowerCase()}(s)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Next executions */}
            {builderNextExecs.length > 0 && (
              <div>
                <label className={labelCls}>Next 5 Executions</label>
                <div className="bg-secondary rounded-lg border border-border p-3 space-y-1">
                  {builderNextExecs.map((d, i) => (
                    <div key={i} className="text-sm font-mono text-foreground">
                      {d.toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "parser" && (
          <div className="space-y-6">
            {/* Input */}
            <div>
              <label className={labelCls}>Cron Expression</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={parserInput}
                  onChange={(e) => setParserInput(e.target.value)}
                  placeholder="* * * * *"
                  className={inputCls + " flex-1"}
                />
                <button onClick={() => setParserInput("")} className={secondaryBtn}>
                  Clear
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-secondary/50 rounded-lg border border-border p-3">
              <span className="text-sm font-mono text-muted-foreground">Description: </span>
              <span className="text-sm font-mono text-primary">{parserDescription}</span>
            </div>

            {/* Field breakdown */}
            {parserValid && (
              <div>
                <label className={labelCls}>Field Breakdown</label>
                <div className="bg-secondary rounded-lg border border-border divide-y divide-border">
                  {FIELD_DEFS.map((def, i) => {
                    const token = parsedParts[i];
                    const expanded = expandField(token, def.min, def.max);
                    return (
                      <div key={def.label} className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm font-mono text-muted-foreground">{def.label}</span>
                        <span className="text-sm font-mono text-primary">{token}</span>
                        <span className="text-xs font-mono text-muted-foreground max-w-[200px] truncate">
                          {expanded
                            ? expanded.length > 10
                              ? `${expanded.slice(0, 10).join(", ")}... (${expanded.length} values)`
                              : expanded.join(", ")
                            : "invalid"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next executions */}
            {parserNextExecs.length > 0 && (
              <div>
                <label className={labelCls}>Next 5 Executions</label>
                <div className="bg-secondary rounded-lg border border-border p-3 space-y-1">
                  {parserNextExecs.map((d, i) => (
                    <div key={i} className="text-sm font-mono text-foreground">
                      {d.toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!parserValid && parserInput.trim().length > 0 && (
              <div className="text-sm font-mono text-red-500 bg-red-500/10 rounded-lg border border-red-500/20 p-3">
                Invalid cron expression. Expected 5 space-separated fields: minute hour day-of-month month day-of-week
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CronTool;
