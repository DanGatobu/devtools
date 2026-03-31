import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type Tab = "average" | "fraction" | "gcflcm" | "exponent" | "factorial" | "prime" | "ratio" | "bitwise" | "bmi" | "tip";

const tabs: { id: Tab; label: string }[] = [
  { id: "average", label: "Average" },
  { id: "fraction", label: "Fraction" },
  { id: "gcflcm", label: "GCF/LCM" },
  { id: "exponent", label: "Exponent" },
  { id: "factorial", label: "Factorial" },
  { id: "prime", label: "Prime" },
  { id: "ratio", label: "Ratio" },
  { id: "bitwise", label: "Bitwise" },
  { id: "bmi", label: "BMI" },
  { id: "tip", label: "Tip" },
];

const inputClass = "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";
const cardClass = "bg-secondary rounded-lg border border-border p-4";
const resultClass = "text-2xl font-bold text-primary font-mono";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function primeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let num = Math.abs(n);
  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) {
      factors.set(d, (factors.get(d) || 0) + 1);
      num /= d;
    }
  }
  if (num > 1) factors.set(num, (factors.get(num) || 0) + 1);
  return factors;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function getFactors(n: number): number[] {
  const abs = Math.abs(n);
  const result: number[] = [];
  for (let i = 1; i * i <= abs; i++) {
    if (abs % i === 0) {
      result.push(i);
      if (i !== abs / i) result.push(abs / i);
    }
  }
  return result.sort((a, b) => a - b);
}

function generatePrimes(count: number): number[] {
  const primes: number[] = [];
  let num = 2;
  while (primes.length < count) {
    if (isPrime(num)) primes.push(num);
    num++;
  }
  return primes;
}

// --- Tab Components ---

function AverageTab() {
  const [input, setInput] = useState("");
  const nums = input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map(Number)
    .filter((n) => !isNaN(n));

  const count = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = count > 0 ? sum / count : 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const median =
    count > 0
      ? count % 2 === 1
        ? sorted[Math.floor(count / 2)]
        : (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : 0;

  const freqMap = new Map<number, number>();
  nums.forEach((n) => freqMap.set(n, (freqMap.get(n) || 0) + 1));
  let maxFreq = 0;
  freqMap.forEach((v) => { if (v > maxFreq) maxFreq = v; });
  const modes = maxFreq > 1 ? [...freqMap.entries()].filter(([, v]) => v === maxFreq).map(([k]) => k) : [];

  const min = count > 0 ? sorted[0] : 0;
  const max = count > 0 ? sorted[count - 1] : 0;
  const range = max - min;

  const popVariance = count > 0 ? nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count : 0;
  const sampleVariance = count > 1 ? nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / (count - 1) : 0;
  const popStdDev = Math.sqrt(popVariance);
  const sampleStdDev = Math.sqrt(sampleVariance);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Numbers (comma-separated)</label>
        <input className={inputClass} value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 5, 10, 15, 20, 25" />
      </div>
      {count > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Mean", mean.toFixed(4)],
            ["Median", median.toFixed(4)],
            ["Mode", modes.length > 0 ? modes.join(", ") : "No mode"],
            ["Range", range.toFixed(4)],
            ["Sum", sum.toFixed(4)],
            ["Count", count.toString()],
            ["Min", min.toFixed(4)],
            ["Max", max.toFixed(4)],
            ["Std Dev (Pop)", popStdDev.toFixed(4)],
            ["Std Dev (Sample)", count > 1 ? sampleStdDev.toFixed(4) : "N/A (need 2+)"],
          ].map(([label, value]) => (
            <div key={label} className={cardClass}>
              <label className={labelClass}>{label}</label>
              <div className={resultClass}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FractionTab() {
  const [n1, setN1] = useState("");
  const [d1, setD1] = useState("");
  const [n2, setN2] = useState("");
  const [d2, setD2] = useState("");
  const [op, setOp] = useState<"+" | "-" | "×" | "÷">("+");

  const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
  const valid = [a, b, c, d].every((v) => !isNaN(v)) && b !== 0 && d !== 0;

  let rn = 0, rd = 1, error = "";
  if (valid) {
    if (op === "+") { rn = a * d + c * b; rd = b * d; }
    else if (op === "-") { rn = a * d - c * b; rd = b * d; }
    else if (op === "×") { rn = a * c; rd = b * d; }
    else if (op === "÷") {
      if (c === 0) { error = "Cannot divide by zero"; }
      else { rn = a * d; rd = b * c; }
    }
    if (!error) {
      const g = gcd(Math.abs(rn), Math.abs(rd));
      rn /= g;
      rd /= g;
      if (rd < 0) { rn = -rn; rd = -rd; }
    }
  }

  const ops: ("+" | "-" | "×" | "÷")[] = ["+", "-", "×", "÷"];

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 flex-wrap">
        <div>
          <label className={labelClass}>Numerator 1</label>
          <input className={inputClass} value={n1} onChange={(e) => setN1(e.target.value)} placeholder="a" style={{ width: 80 }} />
        </div>
        <span className="text-foreground font-mono text-xl pb-2">/</span>
        <div>
          <label className={labelClass}>Denominator 1</label>
          <input className={inputClass} value={d1} onChange={(e) => setD1(e.target.value)} placeholder="b" style={{ width: 80 }} />
        </div>
        <div>
          <label className={labelClass}>Operation</label>
          <div className="flex gap-1">
            {ops.map((o) => (
              <button key={o} onClick={() => setOp(o)} className={op === o ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm" : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm"}>
                {o}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Numerator 2</label>
          <input className={inputClass} value={n2} onChange={(e) => setN2(e.target.value)} placeholder="c" style={{ width: 80 }} />
        </div>
        <span className="text-foreground font-mono text-xl pb-2">/</span>
        <div>
          <label className={labelClass}>Denominator 2</label>
          <input className={inputClass} value={d2} onChange={(e) => setD2(e.target.value)} placeholder="d" style={{ width: 80 }} />
        </div>
      </div>
      {valid && (
        <div className={cardClass}>
          {error ? (
            <div className="text-red-500 font-mono">{error}</div>
          ) : (
            <>
              <label className={labelClass}>Result (simplified)</label>
              <div className={resultClass}>{rn}{rd !== 1 ? ` / ${rd}` : ""}</div>
              <div className="text-sm font-mono text-muted-foreground mt-2">Decimal: {(rn / rd).toFixed(6)}</div>
              <div className="text-sm font-mono text-muted-foreground">GCD used to simplify: {gcd(Math.abs(rn * (gcd(Math.abs(parseInt(n1) * parseInt(d2) + parseInt(n2) * parseInt(d1)), Math.abs(parseInt(d1) * parseInt(d2))) || 1)), Math.abs(rd * (gcd(Math.abs(parseInt(n1) * parseInt(d2) + parseInt(n2) * parseInt(d1)), Math.abs(parseInt(d1) * parseInt(d2))) || 1))) || "already simplified"}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GcfLcmTab() {
  const [input, setInput] = useState("");
  const nums = input.split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number).filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);

  const gcfResult = nums.length >= 2 ? nums.reduce((a, b) => gcd(a, b)) : null;
  const lcmResult = nums.length >= 2 ? nums.reduce((a, b) => lcm(a, b)) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Numbers (comma-separated, 2 or more positive integers)</label>
        <input className={inputClass} value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 12, 18, 24" />
      </div>
      {nums.length >= 2 && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className={cardClass}>
              <label className={labelClass}>Greatest Common Factor (GCF)</label>
              <div className={resultClass}>{gcfResult}</div>
            </div>
            <div className={cardClass}>
              <label className={labelClass}>Least Common Multiple (LCM)</label>
              <div className={resultClass}>{lcmResult}</div>
            </div>
          </div>
          <div className={cardClass}>
            <label className={labelClass}>Prime Factorizations</label>
            <div className="space-y-2 mt-2">
              {nums.map((n, i) => {
                const factors = primeFactors(n);
                const parts: string[] = [];
                factors.forEach((exp, base) => { parts.push(exp > 1 ? `${base}^${exp}` : `${base}`); });
                return (
                  <div key={i} className="font-mono text-sm text-foreground">
                    {n} = {parts.length > 0 ? parts.join(" x ") : "1"}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ExponentTab() {
  const [base, setBase] = useState("");
  const [exp, setExp] = useState("");

  const b = parseFloat(base);
  const e = parseFloat(exp);
  const validBase = !isNaN(b);
  const validExp = !isNaN(e);
  const valid = validBase && validExp;

  let result = "";
  let error = "";
  if (valid) {
    if (b === 0 && e < 0) error = "Cannot raise 0 to a negative exponent";
    else result = (b ** e).toString();
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Base</label>
          <input className={inputClass} value={base} onChange={(ev) => setBase(ev.target.value)} placeholder="e.g. 2" />
        </div>
        <div>
          <label className={labelClass}>Exponent</label>
          <input className={inputClass} value={exp} onChange={(ev) => setExp(ev.target.value)} placeholder="e.g. 10" />
        </div>
      </div>
      {valid && !error && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={cardClass}>
            <label className={labelClass}>{b} ^ {e}</label>
            <div className={resultClass}>{result}</div>
          </div>
          {validBase && (
            <>
              <div className={cardClass}>
                <label className={labelClass}>Square Root of {b}</label>
                <div className={resultClass}>{b >= 0 ? Math.sqrt(b).toFixed(6) : "Undefined (negative)"}</div>
              </div>
              <div className={cardClass}>
                <label className={labelClass}>Cube Root of {b}</label>
                <div className={resultClass}>{Math.cbrt(b).toFixed(6)}</div>
              </div>
              {validExp && e !== 0 && (
                <div className={cardClass}>
                  <label className={labelClass}>{e}th Root of {b}</label>
                  <div className={resultClass}>
                    {b < 0 && e % 2 === 0
                      ? "Undefined (even root of negative)"
                      : (b < 0 ? -Math.pow(-b, 1 / e) : Math.pow(b, 1 / e)).toFixed(6)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {error && <div className={cardClass}><div className="text-red-500 font-mono">{error}</div></div>}
    </div>
  );
}

function FactorialTab() {
  const [input, setInput] = useState("");
  const n = parseInt(input);
  const valid = !isNaN(n) && Number.isInteger(n);

  let result = "";
  let steps = "";
  let error = "";

  if (valid) {
    if (n < 0) {
      error = "Factorial is not defined for negative numbers";
    } else if (n > 170) {
      error = "Number too large (max 170 to avoid Infinity)";
    } else {
      let f = 1;
      for (let i = 2; i <= n; i++) f *= i;
      result = f.toLocaleString("fullwide", { useGrouping: false });
      if (n <= 20) {
        const parts: string[] = [];
        for (let i = n; i >= 1; i--) parts.push(i.toString());
        steps = parts.join(" x ") + " = " + result;
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Number (0-170)</label>
        <input className={inputClass} value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 10" />
      </div>
      {valid && !error && (
        <div className={cardClass}>
          <label className={labelClass}>{n}!</label>
          <div className={resultClass} style={{ wordBreak: "break-all", fontSize: result.length > 20 ? "1rem" : undefined }}>{result}</div>
          {steps && <div className="text-sm font-mono text-muted-foreground mt-2">{steps}</div>}
        </div>
      )}
      {error && <div className={cardClass}><div className="text-red-500 font-mono">{error}</div></div>}
    </div>
  );
}

function PrimeTab() {
  const [input, setInput] = useState("");
  const [primeCount, setPrimeCount] = useState("10");
  const n = parseInt(input);
  const pc = parseInt(primeCount);
  const valid = !isNaN(n) && Number.isInteger(n) && n >= 0;
  const validPc = !isNaN(pc) && pc > 0 && pc <= 10000;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Check if Prime</label>
          <input className={inputClass} value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 97" />
        </div>
        <div>
          <label className={labelClass}>Generate first N primes</label>
          <input className={inputClass} value={primeCount} onChange={(e) => setPrimeCount(e.target.value)} placeholder="e.g. 10" />
        </div>
      </div>
      {valid && (
        <div className={cardClass}>
          <label className={labelClass}>Is {n} prime?</label>
          <div className={resultClass} style={{ color: isPrime(n) ? "var(--primary)" : undefined }}>
            {n < 2 ? "No (must be >= 2)" : isPrime(n) ? "Yes, it is prime!" : "No, it is not prime"}
          </div>
          {!isPrime(n) && n >= 2 && (
            <div className="text-sm font-mono text-muted-foreground mt-2">
              Factors: {getFactors(n).join(", ")}
            </div>
          )}
        </div>
      )}
      {validPc && (
        <div className={cardClass}>
          <label className={labelClass}>First {pc} primes</label>
          <div className="font-mono text-sm text-foreground mt-2" style={{ wordBreak: "break-all" }}>
            {generatePrimes(pc).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}

function RatioTab() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [simplifyInput, setSimplifyInput] = useState("");

  const na = parseFloat(a), nb = parseFloat(b), nc = parseFloat(c);
  const valid = !isNaN(na) && !isNaN(nb) && !isNaN(nc) && nb !== 0;
  const missing = valid ? (nc * nb) / na : 0;

  const simplifyNums = simplifyInput.split(":").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
  let simplified = "";
  if (simplifyNums.length === 2 && simplifyNums[0] !== 0 && simplifyNums[1] !== 0) {
    const g = gcd(Math.round(simplifyNums[0]), Math.round(simplifyNums[1]));
    simplified = `${Math.round(simplifyNums[0]) / g}:${Math.round(simplifyNums[1]) / g}`;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Solve A:B = C:? (find the missing value)</label>
        <div className="flex items-center gap-2 flex-wrap">
          <input className={inputClass} value={a} onChange={(e) => setA(e.target.value)} placeholder="A" style={{ width: 80 }} />
          <span className="text-foreground font-mono">:</span>
          <input className={inputClass} value={b} onChange={(e) => setB(e.target.value)} placeholder="B" style={{ width: 80 }} />
          <span className="text-foreground font-mono">=</span>
          <input className={inputClass} value={c} onChange={(e) => setC(e.target.value)} placeholder="C" style={{ width: 80 }} />
          <span className="text-foreground font-mono">:</span>
          <span className="text-foreground font-mono font-bold">?</span>
        </div>
      </div>
      {valid && (
        <div className={cardClass}>
          <label className={labelClass}>Missing Value</label>
          <div className={resultClass}>{na === 0 ? "Undefined (A cannot be 0)" : missing.toFixed(4)}</div>
          {na !== 0 && <div className="text-sm font-mono text-muted-foreground mt-1">{na}:{nb} = {nc}:{missing.toFixed(4)}</div>}
        </div>
      )}
      <div>
        <label className={labelClass}>Simplify Ratio (e.g. 12:8)</label>
        <input className={inputClass} value={simplifyInput} onChange={(e) => setSimplifyInput(e.target.value)} placeholder="e.g. 12:8" />
      </div>
      {simplified && (
        <div className={cardClass}>
          <label className={labelClass}>Simplified</label>
          <div className={resultClass}>{simplified}</div>
        </div>
      )}
    </div>
  );
}

function BitwiseTab() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [shift, setShift] = useState("1");

  const na = parseInt(a), nb = parseInt(b), ns = parseInt(shift);
  const valid = !isNaN(na) && !isNaN(nb);
  const validShift = !isNaN(ns);

  const fmt = (n: number) => ({
    dec: n.toString(),
    bin: (n >>> 0).toString(2),
    hex: "0x" + (n >>> 0).toString(16).toUpperCase(),
  });

  const ops = valid
    ? [
        { label: `${na} AND ${nb}`, value: na & nb },
        { label: `${na} OR ${nb}`, value: na | nb },
        { label: `${na} XOR ${nb}`, value: na ^ nb },
        { label: `NOT ${na}`, value: ~na },
        { label: `NOT ${nb}`, value: ~nb },
        ...(validShift
          ? [
              { label: `${na} << ${ns}`, value: na << ns },
              { label: `${na} >> ${ns}`, value: na >> ns },
              { label: `${nb} << ${ns}`, value: nb << ns },
              { label: `${nb} >> ${ns}`, value: nb >> ns },
            ]
          : []),
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Number A</label>
          <input className={inputClass} value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 42" />
        </div>
        <div>
          <label className={labelClass}>Number B</label>
          <input className={inputClass} value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 27" />
        </div>
        <div>
          <label className={labelClass}>Shift Amount</label>
          <input className={inputClass} value={shift} onChange={(e) => setShift(e.target.value)} placeholder="e.g. 1" />
        </div>
      </div>
      {valid && (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground">Operation</th>
                  <th className="text-left py-2 text-muted-foreground">Decimal</th>
                  <th className="text-left py-2 text-muted-foreground">Binary</th>
                  <th className="text-left py-2 text-muted-foreground">Hex</th>
                </tr>
              </thead>
              <tbody>
                {ops.map((op, i) => {
                  const f = fmt(op.value);
                  return (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 text-foreground">{op.label}</td>
                      <td className="py-2 text-primary font-bold">{f.dec}</td>
                      <td className="py-2 text-foreground">{f.bin}</td>
                      <td className="py-2 text-foreground">{f.hex}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function BmiTab() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  let bmi = 0;
  let valid = false;

  if (unit === "metric") {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);
    if (h > 0 && w > 0) { bmi = w / (h * h); valid = true; }
  } else {
    const totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
    const w = parseFloat(weightLbs);
    if (totalIn > 0 && w > 0) { bmi = (w / (totalIn * totalIn)) * 703; valid = true; }
  }

  let category = "";
  let color = "";
  if (valid) {
    if (bmi < 18.5) { category = "Underweight"; color = "#3b82f6"; }
    else if (bmi < 25) { category = "Normal"; color = "#22c55e"; }
    else if (bmi < 30) { category = "Overweight"; color = "#f59e0b"; }
    else { category = "Obese"; color = "#ef4444"; }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setUnit("metric")} className={unit === "metric" ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm" : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm"}>
          Metric (cm/kg)
        </button>
        <button onClick={() => setUnit("imperial")} className={unit === "imperial" ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm" : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm"}>
          Imperial (ft,in/lbs)
        </button>
      </div>
      {unit === "metric" ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Height (cm)</label>
            <input className={inputClass} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 175" />
          </div>
          <div>
            <label className={labelClass}>Weight (kg)</label>
            <input className={inputClass} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 70" />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Height (ft)</label>
            <input className={inputClass} value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="e.g. 5" />
          </div>
          <div>
            <label className={labelClass}>Height (in)</label>
            <input className={inputClass} value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="e.g. 9" />
          </div>
          <div>
            <label className={labelClass}>Weight (lbs)</label>
            <input className={inputClass} value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} placeholder="e.g. 154" />
          </div>
        </div>
      )}
      {valid && (
        <div className={cardClass}>
          <label className={labelClass}>Your BMI</label>
          <div className={resultClass}>{bmi.toFixed(1)}</div>
          <div className="mt-2 font-mono text-lg font-bold" style={{ color }}>{category}</div>
          <div className="mt-3 text-sm font-mono text-muted-foreground">
            <div>Underweight: &lt; 18.5</div>
            <div>Normal: 18.5 - 24.9</div>
            <div>Overweight: 25 - 29.9</div>
            <div>Obese: 30+</div>
          </div>
        </div>
      )}
    </div>
  );
}

function TipTab() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("1");

  const b = parseFloat(bill);
  const t = parseFloat(tipPct);
  const p = parseInt(people);
  const valid = !isNaN(b) && b >= 0 && !isNaN(t) && t >= 0 && !isNaN(p) && p >= 1;

  const tipAmount = valid ? b * (t / 100) : 0;
  const total = valid ? b + tipAmount : 0;
  const perPerson = valid && p > 0 ? total / p : 0;

  const presets = [10, 15, 18, 20, 25];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Bill Amount ($)</label>
          <input className={inputClass} value={bill} onChange={(e) => setBill(e.target.value)} placeholder="e.g. 85.50" />
        </div>
        <div>
          <label className={labelClass}>Tip %</label>
          <input className={inputClass} value={tipPct} onChange={(e) => setTipPct(e.target.value)} placeholder="e.g. 18" />
          <div className="flex gap-1 mt-2 flex-wrap">
            {presets.map((p) => (
              <button key={p} onClick={() => setTipPct(p.toString())} className={tipPct === p.toString() ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm" : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm"}>
                {p}%
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Number of People</label>
          <input className={inputClass} value={people} onChange={(e) => setPeople(e.target.value)} placeholder="e.g. 2" />
        </div>
      </div>
      {valid && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className={cardClass}>
            <label className={labelClass}>Tip Amount</label>
            <div className={resultClass}>${tipAmount.toFixed(2)}</div>
          </div>
          <div className={cardClass}>
            <label className={labelClass}>Total</label>
            <div className={resultClass}>${total.toFixed(2)}</div>
          </div>
          <div className={cardClass}>
            <label className={labelClass}>Per Person</label>
            <div className={resultClass}>${perPerson.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---

const MathToolsTool = () => {
  const [activeTab, setActiveTab] = useState<Tab>("average");

  const renderTab = () => {
    switch (activeTab) {
      case "average": return <AverageTab />;
      case "fraction": return <FractionTab />;
      case "gcflcm": return <GcfLcmTab />;
      case "exponent": return <ExponentTab />;
      case "factorial": return <FactorialTab />;
      case "prime": return <PrimeTab />;
      case "ratio": return <RatioTab />;
      case "bitwise": return <BitwiseTab />;
      case "bmi": return <BmiTab />;
      case "tip": return <TipTab />;
    }
  };

  return (
    <Layout>
      <SEO title="Math Tools & Calculators" description="Average, fraction, GCF/LCM, prime checker, BMI, tip calculator, and more math utilities." canonical="/math-tools" keywords="average calculator, fraction calculator, gcf calculator, lcm calculator, bmi calculator, prime checker" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Math Tools</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm" : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm"}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderTab()}
      </div>
    </Layout>
  );
};

export default MathToolsTool;
