import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type Tab =
  | "compound"
  | "mortgage"
  | "discount"
  | "vat"
  | "loan"
  | "savings";

function fmt(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtInt(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "—";
  return Math.ceil(value).toLocaleString("en-US");
}

function parseNum(s: string): number {
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

// ---------- Compound Interest ----------
function CompoundInterest() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [freq, setFreq] = useState("12");
  const [years, setYears] = useState("");

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";

  const P = parseNum(principal);
  const r = parseNum(rate) / 100;
  const n = parseNum(freq);
  const t = parseNum(years);

  const canCalc = P > 0 && t > 0;
  const finalAmount =
    canCalc && n > 0
      ? P * Math.pow(1 + r / n, n * t)
      : canCalc && r === 0
        ? P
        : 0;
  const totalInterest = canCalc ? finalAmount - P : 0;

  const breakdown: { year: number; balance: number; interest: number }[] = [];
  if (canCalc) {
    for (let y = 1; y <= t; y++) {
      const bal =
        n > 0 && r > 0 ? P * Math.pow(1 + r / n, n * y) : P;
      breakdown.push({ year: y, balance: bal, interest: bal - P });
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Principal ($)</label>
          <input className={inputClass} type="number" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="10000" />
        </div>
        <div>
          <label className={labelClass}>Annual Rate (%)</label>
          <input className={inputClass} type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5" />
        </div>
        <div>
          <label className={labelClass}>Compounding Frequency</label>
          <select className={inputClass} value={freq} onChange={(e) => setFreq(e.target.value)}>
            <option value="365">Daily</option>
            <option value="12">Monthly</option>
            <option value="4">Quarterly</option>
            <option value="1">Yearly</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Time (years)</label>
          <input className={inputClass} type="number" min="0" step="1" value={years} onChange={(e) => setYears(e.target.value)} placeholder="10" />
        </div>
      </div>

      {canCalc && (
        <div className="bg-secondary rounded-lg border border-border p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className={labelClass}>Final Amount</span>
            <span className="text-2xl font-bold text-primary font-mono">${fmt(finalAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Total Interest Earned</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(totalInterest)}</span>
          </div>

          {breakdown.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-1 pr-4">Year</th>
                    <th className="text-right py-1 pr-4">Balance</th>
                    <th className="text-right py-1">Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((row) => (
                    <tr key={row.year} className="border-b border-border/50">
                      <td className="py-1 pr-4">{row.year}</td>
                      <td className="text-right py-1 pr-4">${fmt(row.balance)}</td>
                      <td className="text-right py-1">${fmt(row.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Mortgage ----------
function Mortgage() {
  const [loanAmt, setLoanAmt] = useState("");
  const [rate, setRate] = useState("");
  const [termYears, setTermYears] = useState("");
  const [showAll, setShowAll] = useState(false);

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";

  const L = parseNum(loanAmt);
  const annualRate = parseNum(rate) / 100;
  const T = Math.round(parseNum(termYears));
  const totalMonths = T * 12;
  const monthlyRate = annualRate / 12;

  const canCalc = L > 0 && T > 0;

  let monthlyPayment = 0;
  if (canCalc) {
    if (monthlyRate === 0) {
      monthlyPayment = L / totalMonths;
    } else {
      monthlyPayment =
        (L * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
  }

  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - L;

  // Amortization schedule
  const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  if (canCalc) {
    let balance = L;
    for (let m = 1; m <= totalMonths; m++) {
      const intPart = balance * monthlyRate;
      const prinPart = monthlyPayment - intPart;
      balance = Math.max(0, balance - prinPart);
      schedule.push({ month: m, payment: monthlyPayment, principal: prinPart, interest: intPart, balance });
    }
  }

  const visibleRows = showAll
    ? schedule
    : [
        ...schedule.slice(0, 12),
        ...(schedule.length > 24 ? schedule.slice(-12) : schedule.slice(12)),
      ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Loan Amount ($)</label>
          <input className={inputClass} type="number" min="0" value={loanAmt} onChange={(e) => setLoanAmt(e.target.value)} placeholder="300000" />
        </div>
        <div>
          <label className={labelClass}>Annual Rate (%)</label>
          <input className={inputClass} type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="6.5" />
        </div>
        <div>
          <label className={labelClass}>Term (years)</label>
          <input className={inputClass} type="number" min="1" step="1" value={termYears} onChange={(e) => setTermYears(e.target.value)} placeholder="30" />
        </div>
      </div>

      {canCalc && (
        <div className="bg-secondary rounded-lg border border-border p-4 space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className={labelClass}>Monthly Payment</span>
              <div className="text-2xl font-bold text-primary font-mono">${fmt(monthlyPayment)}</div>
            </div>
            <div>
              <span className={labelClass}>Total Payment</span>
              <div className="text-lg font-bold text-primary font-mono">${fmt(totalPayment)}</div>
            </div>
            <div>
              <span className={labelClass}>Total Interest</span>
              <div className="text-lg font-bold text-primary font-mono">${fmt(totalInterest)}</div>
            </div>
          </div>

          {schedule.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-mono text-muted-foreground font-semibold">Amortization Schedule</span>
                {schedule.length > 24 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs font-mono text-primary hover:underline"
                  >
                    {showAll ? "Show less" : "Show all months"}
                  </button>
                )}
              </div>
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-1 pr-2">Month</th>
                    <th className="text-right py-1 pr-2">Payment</th>
                    <th className="text-right py-1 pr-2">Principal</th>
                    <th className="text-right py-1 pr-2">Interest</th>
                    <th className="text-right py-1">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => {
                    const prevMonth = i > 0 ? visibleRows[i - 1].month : 0;
                    const showGap = row.month - prevMonth > 1 && i > 0;
                    return (
                      <>
                        {showGap && (
                          <tr key={`gap-${row.month}`}>
                            <td colSpan={5} className="text-center text-muted-foreground py-1">...</td>
                          </tr>
                        )}
                        <tr key={row.month} className="border-b border-border/50">
                          <td className="py-1 pr-2">{row.month}</td>
                          <td className="text-right py-1 pr-2">${fmt(row.payment)}</td>
                          <td className="text-right py-1 pr-2">${fmt(row.principal)}</td>
                          <td className="text-right py-1 pr-2">${fmt(row.interest)}</td>
                          <td className="text-right py-1">${fmt(row.balance)}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Discount ----------
function Discount() {
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";

  const tabBase = "px-3 py-1.5 text-sm font-mono rounded-md transition-colors";
  const activeTab = `${tabBase} bg-primary text-primary-foreground`;
  const inactiveTab = `${tabBase} bg-secondary text-secondary-foreground`;

  // Forward: original + discount% -> final
  const origFwd = parseNum(originalPrice);
  const discFwd = parseNum(discountPct);
  const discountAmountFwd = origFwd * (discFwd / 100);
  const finalFwd = origFwd - discountAmountFwd;

  // Reverse: final + discount% -> original
  const finalRev = parseNum(finalPrice);
  const discRev = parseNum(discountPct);
  const origRev = discRev === 100 ? 0 : finalRev / (1 - discRev / 100);
  const discountAmountRev = origRev - finalRev;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button className={mode === "forward" ? activeTab : inactiveTab} onClick={() => setMode("forward")}>
          Original to Final
        </button>
        <button className={mode === "reverse" ? activeTab : inactiveTab} onClick={() => setMode("reverse")}>
          Final to Original
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mode === "forward" ? (
          <div>
            <label className={labelClass}>Original Price ($)</label>
            <input className={inputClass} type="number" min="0" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="100" />
          </div>
        ) : (
          <div>
            <label className={labelClass}>Final Price ($)</label>
            <input className={inputClass} type="number" min="0" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} placeholder="80" />
          </div>
        )}
        <div>
          <label className={labelClass}>Discount (%)</label>
          <input className={inputClass} type="number" min="0" max="100" step="0.01" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} placeholder="20" />
        </div>
      </div>

      {mode === "forward" && origFwd > 0 && (
        <div className="bg-secondary rounded-lg border border-border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className={labelClass}>Discount Amount</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(discountAmountFwd)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Final Price</span>
            <span className="text-2xl font-bold text-primary font-mono">${fmt(finalFwd)}</span>
          </div>
        </div>
      )}

      {mode === "reverse" && finalRev > 0 && (
        <div className="bg-secondary rounded-lg border border-border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className={labelClass}>Original Price</span>
            <span className="text-2xl font-bold text-primary font-mono">${fmt(origRev)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Discount Amount</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(discountAmountRev)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- VAT/Tax ----------
function VatTax() {
  const [amount, setAmount] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";

  const tabBase = "px-3 py-1.5 text-sm font-mono rounded-md transition-colors";
  const activeTab = `${tabBase} bg-primary text-primary-foreground`;
  const inactiveTab = `${tabBase} bg-secondary text-secondary-foreground`;

  const amt = parseNum(amount);
  const rate = parseNum(taxRate) / 100;

  let net = 0;
  let tax = 0;
  let gross = 0;

  if (amt > 0) {
    if (mode === "add") {
      net = amt;
      tax = amt * rate;
      gross = amt + tax;
    } else {
      gross = amt;
      net = rate === 0 ? amt : amt / (1 + rate);
      tax = gross - net;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button className={mode === "add" ? activeTab : inactiveTab} onClick={() => setMode("add")}>
          Add Tax
        </button>
        <button className={mode === "remove" ? activeTab : inactiveTab} onClick={() => setMode("remove")}>
          Remove Tax
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{mode === "add" ? "Net Amount ($)" : "Gross Amount ($)"}</label>
          <input className={inputClass} type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100" />
        </div>
        <div>
          <label className={labelClass}>Tax Rate (%)</label>
          <input className={inputClass} type="number" min="0" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="20" />
        </div>
      </div>

      {amt > 0 && (
        <div className="bg-secondary rounded-lg border border-border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className={labelClass}>Net Amount</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(net)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Tax Amount</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(tax)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-2">
            <span className={labelClass}>Gross Amount</span>
            <span className="text-2xl font-bold text-primary font-mono">${fmt(gross)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Loan ----------
function Loan() {
  const [loanAmt, setLoanAmt] = useState("");
  const [rate, setRate] = useState("");
  const [termMonths, setTermMonths] = useState("");

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";

  const L = parseNum(loanAmt);
  const annualRate = parseNum(rate) / 100;
  const n = Math.round(parseNum(termMonths));
  const monthlyRate = annualRate / 12;

  const canCalc = L > 0 && n > 0;

  let monthlyPayment = 0;
  if (canCalc) {
    if (monthlyRate === 0) {
      monthlyPayment = L / n;
    } else {
      monthlyPayment =
        (L * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);
    }
  }

  const totalCost = monthlyPayment * n;
  const totalInterest = totalCost - L;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Loan Amount ($)</label>
          <input className={inputClass} type="number" min="0" value={loanAmt} onChange={(e) => setLoanAmt(e.target.value)} placeholder="25000" />
        </div>
        <div>
          <label className={labelClass}>Annual Rate (%)</label>
          <input className={inputClass} type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="7" />
        </div>
        <div>
          <label className={labelClass}>Term (months)</label>
          <input className={inputClass} type="number" min="1" step="1" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} placeholder="60" />
        </div>
      </div>

      {canCalc && (
        <div className="bg-secondary rounded-lg border border-border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className={labelClass}>Monthly Payment</span>
            <span className="text-2xl font-bold text-primary font-mono">${fmt(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Total Cost</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(totalCost)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Total Interest</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(totalInterest)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Savings Goal ----------
function SavingsGoal() {
  const [target, setTarget] = useState("");
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";

  const T = parseNum(target);
  const M = parseNum(monthly);
  const annualRate = parseNum(rate) / 100;
  const monthlyRate = annualRate / 12;

  const canCalc = T > 0 && M > 0;

  let months = 0;
  let totalContributed = 0;
  let interestEarned = 0;

  if (canCalc) {
    if (monthlyRate === 0) {
      months = Math.ceil(T / M);
      totalContributed = months * M;
      interestEarned = 0;
    } else {
      // Future value of annuity: FV = M * ((1+r)^n - 1) / r
      // Solve for n: n = log(FV*r/M + 1) / log(1+r)
      const inner = (T * monthlyRate) / M + 1;
      if (inner <= 0) {
        months = 0;
      } else {
        months = Math.ceil(Math.log(inner) / Math.log(1 + monthlyRate));
      }
      totalContributed = months * M;
      // Actual FV at that month count
      const actualFV = M * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      interestEarned = actualFV - totalContributed;
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Target Amount ($)</label>
          <input className={inputClass} type="number" min="0" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="50000" />
        </div>
        <div>
          <label className={labelClass}>Monthly Contribution ($)</label>
          <input className={inputClass} type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="500" />
        </div>
        <div>
          <label className={labelClass}>Annual Rate (%)</label>
          <input className={inputClass} type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5" />
        </div>
      </div>

      {canCalc && months > 0 && (
        <div className="bg-secondary rounded-lg border border-border p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className={labelClass}>Months to Reach Goal</span>
            <span className="text-2xl font-bold text-primary font-mono">
              {fmtInt(months)} {months === 1 ? "month" : "months"}
              {months >= 12 && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({fmt(months / 12)} years)
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Total Contributed</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(totalContributed)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={labelClass}>Interest Earned</span>
            <span className="text-lg font-bold text-primary font-mono">${fmt(interestEarned)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Component ----------
const tabs: { key: Tab; label: string }[] = [
  { key: "compound", label: "Compound Interest" },
  { key: "mortgage", label: "Mortgage" },
  { key: "discount", label: "Discount" },
  { key: "vat", label: "VAT / Tax" },
  { key: "loan", label: "Loan" },
  { key: "savings", label: "Savings Goal" },
];

function FinanceToolsTool() {
  const [activeTab, setActiveTab] = useState<Tab>("compound");

  const tabBase = "px-3 py-1.5 text-sm font-mono rounded-md transition-colors";
  const activeClass = `${tabBase} bg-primary text-primary-foreground`;
  const inactiveClass = `${tabBase} bg-secondary text-secondary-foreground`;

  return (
    <Layout>
      <SEO title="Finance Calculators" description="Compound interest, mortgage, loan, savings goal, discount, and VAT calculators. Free financial tools." canonical="/finance-tools" keywords="compound interest calculator, mortgage calculator, loan calculator, savings calculator, vat calculator" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Finance Tools
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? activeClass : inactiveClass}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "compound" && <CompoundInterest />}
        {activeTab === "mortgage" && <Mortgage />}
        {activeTab === "discount" && <Discount />}
        {activeTab === "vat" && <VatTax />}
        {activeTab === "loan" && <Loan />}
        {activeTab === "savings" && <SavingsGoal />}
      </div>
    </Layout>
  );
}

export default FinanceToolsTool;
