import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOfDate, setAsOfDate] = useState("");
  const [result, setResult] = useState<null | {
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    nextBirthdayDays: number;
    isBirthdayToday: boolean;
  }>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    if (!dob) {
      setError("Please enter a date of birth.");
      return;
    }

    const birthDate = new Date(dob + "T00:00:00");
    const referenceDate = asOfDate
      ? new Date(asOfDate + "T00:00:00")
      : new Date(new Date().toISOString().split("T")[0] + "T00:00:00");

    if (birthDate > referenceDate) {
      setError("Date of birth cannot be in the future relative to the reference date.");
      return;
    }

    // Calculate years, months, days
    let years = referenceDate.getFullYear() - birthDate.getFullYear();
    let months = referenceDate.getMonth() - birthDate.getMonth();
    let days = referenceDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        0
      );
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total calculations
    const diffMs = referenceDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMonths = years * 12 + months;

    // Next birthday countdown
    let nextBirthday = new Date(
      referenceDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (nextBirthday < referenceDate) {
      nextBirthday = new Date(
        referenceDate.getFullYear() + 1,
        birthDate.getMonth(),
        birthDate.getDate()
      );
    }

    const isBirthdayToday = nextBirthday.getTime() === referenceDate.getTime();
    const nextBirthdayDays = isBirthdayToday
      ? 0
      : Math.ceil(
          (nextBirthday.getTime() - referenceDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

    setResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      nextBirthdayDays,
      isBirthdayToday,
    });
  };

  const inputClass =
    "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";
  const buttonClass =
    "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";

  return (
    <Layout>
      <SEO title="Age Calculator" description="Calculate your exact age in years, months, days, hours. Next birthday countdown included." canonical="/age-calculator" keywords="age calculator, calculate age, how old am i, birthday calculator, age from date of birth" />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Age Calculator
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Calculate as of (optional, defaults to today)</label>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <button onClick={handleCalculate} className={buttonClass}>
            Calculate
          </button>
        </div>

        {error && (
          <div className="bg-secondary rounded-lg border border-border p-4 mb-6">
            <p className="font-mono text-sm text-red-500">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-secondary rounded-lg border border-border p-6 space-y-4">
            {result.isBirthdayToday && (
              <div className="text-center py-2">
                <span className="text-lg font-mono font-bold text-primary">
                  Happy Birthday!
                </span>
              </div>
            )}

            <ResultRow
              label="Age"
              value={`${result.years} years, ${result.months} months, ${result.days} days`}
            />
            <ResultRow
              label="Total Months"
              value={result.totalMonths.toLocaleString()}
              unit="months"
            />
            <ResultRow
              label="Total Weeks"
              value={result.totalWeeks.toLocaleString()}
              unit="weeks"
            />
            <ResultRow
              label="Total Days"
              value={result.totalDays.toLocaleString()}
              unit="days"
            />
            <ResultRow
              label="Total Hours"
              value={result.totalHours.toLocaleString()}
              unit="hours"
            />
            {!result.isBirthdayToday && (
              <ResultRow
                label="Next Birthday"
                value={result.nextBirthdayDays.toLocaleString()}
                unit="days away"
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ResultRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-sm font-mono text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">
        <span className="text-lg font-bold text-primary">{value}</span>
        {unit && (
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        )}
      </span>
    </div>
  );
}

export default AgeCalculator;
