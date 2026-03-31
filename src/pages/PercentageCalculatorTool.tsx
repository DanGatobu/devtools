import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

function formatResult(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  return parseFloat(value.toFixed(2)).toString();
}

function PercentageCalculatorTool() {
  const [percentOf, setPercentOf] = useState({ x: "", y: "" });
  const [whatPercent, setWhatPercent] = useState({ x: "", y: "" });
  const [change, setChange] = useState({ x: "", y: "" });
  const [difference, setDifference] = useState({ x: "", y: "" });

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const cardClass = "bg-secondary rounded-lg border border-border p-6";
  const resultClass = "text-xl font-bold text-primary font-mono";

  const computePercentOf = () => {
    if (percentOf.x === "" || percentOf.y === "") return "";
    const x = parseFloat(percentOf.x);
    const y = parseFloat(percentOf.y);
    if (isNaN(x) || isNaN(y)) return "";
    return formatResult((x / 100) * y);
  };

  const computeWhatPercent = () => {
    if (whatPercent.x === "" || whatPercent.y === "") return "";
    const x = parseFloat(whatPercent.x);
    const y = parseFloat(whatPercent.y);
    if (isNaN(x) || isNaN(y)) return "";
    if (y === 0) return "—";
    return formatResult((x / y) * 100) + "%";
  };

  const computeChange = () => {
    if (change.x === "" || change.y === "") return "";
    const x = parseFloat(change.x);
    const y = parseFloat(change.y);
    if (isNaN(x) || isNaN(y)) return "";
    if (x === 0) return "—";
    const result = ((y - x) / Math.abs(x)) * 100;
    const formatted = formatResult(Math.abs(result));
    if (result > 0) return `${formatted}% increase`;
    if (result < 0) return `${formatted}% decrease`;
    return "0% change";
  };

  const computeDifference = () => {
    if (difference.x === "" || difference.y === "") return "";
    const x = parseFloat(difference.x);
    const y = parseFloat(difference.y);
    if (isNaN(x) || isNaN(y)) return "";
    const avg = (Math.abs(x) + Math.abs(y)) / 2;
    if (avg === 0) return "—";
    return formatResult((Math.abs(x - y) / avg) * 100) + "%";
  };

  return (
    <Layout>
      <SEO title="Percentage Calculator" description="Calculate percentages four ways: X% of Y, what percent, percentage change, and percentage difference." canonical="/percentage-calculator" keywords="percentage calculator, percent calculator, calculate percentage, percentage change" />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Percentage Calculator
        </h1>

        <div className="flex flex-col gap-6">
          {/* Card 1: What is X% of Y? */}
          <div className={cardClass}>
            <label className="block font-mono text-sm text-foreground mb-3">
              What is X% of Y?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={inputClass}
                placeholder="X"
                value={percentOf.x}
                onChange={(e) =>
                  setPercentOf({ ...percentOf, x: e.target.value })
                }
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                % of
              </span>
              <input
                type="number"
                className={inputClass}
                placeholder="Y"
                value={percentOf.y}
                onChange={(e) =>
                  setPercentOf({ ...percentOf, y: e.target.value })
                }
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                =
              </span>
              <span className={resultClass}>{computePercentOf()}</span>
            </div>
          </div>

          {/* Card 2: X is what % of Y? */}
          <div className={cardClass}>
            <label className="block font-mono text-sm text-foreground mb-3">
              X is what % of Y?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={inputClass}
                placeholder="X"
                value={whatPercent.x}
                onChange={(e) =>
                  setWhatPercent({ ...whatPercent, x: e.target.value })
                }
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                is what % of
              </span>
              <input
                type="number"
                className={inputClass}
                placeholder="Y"
                value={whatPercent.y}
                onChange={(e) =>
                  setWhatPercent({ ...whatPercent, y: e.target.value })
                }
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                =
              </span>
              <span className={resultClass}>{computeWhatPercent()}</span>
            </div>
          </div>

          {/* Card 3: Percentage change from X to Y */}
          <div className={cardClass}>
            <label className="block font-mono text-sm text-foreground mb-3">
              Percentage change from X to Y
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={inputClass}
                placeholder="X"
                value={change.x}
                onChange={(e) => setChange({ ...change, x: e.target.value })}
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                to
              </span>
              <input
                type="number"
                className={inputClass}
                placeholder="Y"
                value={change.y}
                onChange={(e) => setChange({ ...change, y: e.target.value })}
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                =
              </span>
              <span className={resultClass}>{computeChange()}</span>
            </div>
          </div>

          {/* Card 4: Percentage difference between X and Y */}
          <div className={cardClass}>
            <label className="block font-mono text-sm text-foreground mb-3">
              Percentage difference between X and Y
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className={inputClass}
                placeholder="X"
                value={difference.x}
                onChange={(e) =>
                  setDifference({ ...difference, x: e.target.value })
                }
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                and
              </span>
              <input
                type="number"
                className={inputClass}
                placeholder="Y"
                value={difference.y}
                onChange={(e) =>
                  setDifference({ ...difference, y: e.target.value })
                }
              />
              <span className="font-mono text-sm text-foreground shrink-0">
                =
              </span>
              <span className={resultClass}>{computeDifference()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PercentageCalculatorTool;
