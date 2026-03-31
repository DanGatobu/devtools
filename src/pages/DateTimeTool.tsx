import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

type Tab =
  | "difference"
  | "calculator"
  | "countdown"
  | "stopwatch"
  | "timezone"
  | "weeknumber"
  | "military";

const TABS: { id: Tab; label: string }[] = [
  { id: "difference", label: "Date Difference" },
  { id: "calculator", label: "Date Calculator" },
  { id: "countdown", label: "Countdown" },
  { id: "stopwatch", label: "Stopwatch" },
  { id: "timezone", label: "Time Zone Converter" },
  { id: "weeknumber", label: "Week Number" },
  { id: "military", label: "Military Time" },
];

const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "EST (America/New_York)", value: "America/New_York" },
  { label: "CST (America/Chicago)", value: "America/Chicago" },
  { label: "MST (America/Denver)", value: "America/Denver" },
  { label: "PST (America/Los_Angeles)", value: "America/Los_Angeles" },
  { label: "GMT (Europe/London)", value: "Europe/London" },
  { label: "CET (Europe/Berlin)", value: "Europe/Berlin" },
  { label: "EET (Europe/Bucharest)", value: "Europe/Bucharest" },
  { label: "IST (Asia/Kolkata)", value: "Asia/Kolkata" },
  { label: "JST (Asia/Tokyo)", value: "Asia/Tokyo" },
  { label: "CST China (Asia/Shanghai)", value: "Asia/Shanghai" },
  { label: "AEST (Australia/Sydney)", value: "Australia/Sydney" },
  { label: "NZST (Pacific/Auckland)", value: "Pacific/Auckland" },
  { label: "HST (Pacific/Honolulu)", value: "Pacific/Honolulu" },
  { label: "AKST (America/Anchorage)", value: "America/Anchorage" },
  { label: "BRT (America/Sao_Paulo)", value: "America/Sao_Paulo" },
  { label: "SGT (Asia/Singapore)", value: "Asia/Singapore" },
  { label: "HKT (Asia/Hong_Kong)", value: "Asia/Hong_Kong" },
  { label: "KST (Asia/Seoul)", value: "Asia/Seoul" },
  { label: "GST (Asia/Dubai)", value: "Asia/Dubai" },
];

const inputClass =
  "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "text-sm font-mono text-muted-foreground mb-1 block";
const cardClass = "bg-secondary rounded-lg border border-border p-4";
const resultClass = "text-2xl font-bold text-primary font-mono";

// ── Helpers ──

function countBusinessDays(a: Date, b: Date): number {
  let start = new Date(Math.min(a.getTime(), b.getTime()));
  const end = new Date(Math.max(a.getTime(), b.getTime()));
  let count = 0;
  while (start < end) {
    const day = start.getDay();
    if (day !== 0 && day !== 6) count++;
    start.setDate(start.getDate() + 1);
  }
  return count;
}

function diffMonths(a: Date, b: Date): number {
  const early = a < b ? a : b;
  const late = a < b ? b : a;
  return (
    (late.getFullYear() - early.getFullYear()) * 12 +
    (late.getMonth() - early.getMonth())
  );
}

function getISOWeek(d: Date): number {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

// ── Tab Components ──

function DateDifference() {
  const [dateA, setDateA] = useState("");
  const [dateB, setDateB] = useState("");

  const a = dateA ? new Date(dateA + "T00:00:00") : null;
  const b = dateB ? new Date(dateB + "T00:00:00") : null;
  const valid = a && b && !isNaN(a.getTime()) && !isNaN(b.getTime());

  let days = 0,
    weeks = 0,
    months = 0,
    years = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    businessDays = 0;

  if (valid) {
    const ms = Math.abs(a.getTime() - b.getTime());
    days = Math.floor(ms / 86400000);
    weeks = Math.floor(days / 7);
    months = diffMonths(a, b);
    years = Math.floor(months / 12);
    hours = days * 24;
    minutes = hours * 60;
    seconds = minutes * 60;
    businessDays = countBusinessDays(a, b);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start Date</label>
          <input
            type="date"
            className={inputClass}
            value={dateA}
            onChange={(e) => setDateA(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input
            type="date"
            className={inputClass}
            value={dateB}
            onChange={(e) => setDateB(e.target.value)}
          />
        </div>
      </div>
      {valid && (
        <div className={cardClass}>
          <p className={resultClass}>{days} days</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm font-mono text-muted-foreground">
            <span>{weeks} weeks</span>
            <span>{months} months</span>
            <span>{years} years</span>
            <span>{businessDays} business days</span>
            <span>{hours.toLocaleString()} hours</span>
            <span>{minutes.toLocaleString()} minutes</span>
            <span>{seconds.toLocaleString()} seconds</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DateCalculator() {
  const [startDate, setStartDate] = useState("");
  const [amount, setAmount] = useState("0");
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">(
    "days"
  );
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  let result = "";
  if (startDate) {
    const d = new Date(startDate + "T00:00:00");
    const n = parseInt(amount, 10) || 0;
    const val = operation === "add" ? n : -n;
    switch (unit) {
      case "days":
        d.setDate(d.getDate() + val);
        break;
      case "weeks":
        d.setDate(d.getDate() + val * 7);
        break;
      case "months":
        d.setMonth(d.getMonth() + val);
        break;
      case "years":
        d.setFullYear(d.getFullYear() + val);
        break;
    }
    result = d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Start Date</label>
        <input
          type="date"
          className={inputClass}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Operation</label>
          <select
            className={inputClass}
            value={operation}
            onChange={(e) =>
              setOperation(e.target.value as "add" | "subtract")
            }
          >
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Amount</label>
          <input
            type="number"
            className={inputClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className={labelClass}>Unit</label>
          <select
            className={inputClass}
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>
      {result && (
        <div className={cardClass}>
          <label className={labelClass}>Result</label>
          <p className={resultClass}>{result}</p>
        </div>
      )}
    </div>
  );
}

function Countdown() {
  const [target, setTarget] = useState("");
  const [remaining, setRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (!target) {
      setRemaining(null);
      return;
    }
    const tick = () => {
      const diff = new Date(target + "T00:00:00").getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setPassed(true);
        return;
      }
      setPassed(false);
      const s = Math.floor(diff / 1000);
      setRemaining({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Target Date</label>
        <input
          type="date"
          className={inputClass}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
      </div>
      {remaining && (
        <div className={cardClass + " text-center"}>
          {passed ? (
            <p className="text-sm font-mono text-muted-foreground">
              Target date has passed!
            </p>
          ) : (
            <p className={resultClass}>
              {remaining.days}:{pad(remaining.hours)}:{pad(remaining.minutes)}:
              {pad(remaining.seconds)}
            </p>
          )}
          {!passed && (
            <p className="text-sm font-mono text-muted-foreground mt-1">
              days : hours : minutes : seconds
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 10);
    return () => clearInterval(id);
  }, [running, startTime]);

  const handleStart = () => {
    setStartTime(Date.now() - elapsed);
    setRunning(true);
  };
  const handleStop = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };
  const handleLap = () => {
    setLaps((prev) => [...prev, elapsed]);
  };

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(millis)}`;
  };

  return (
    <div className="space-y-4">
      <div className={cardClass + " text-center"}>
        <p className={resultClass}>{formatMs(elapsed)}</p>
      </div>
      <div className="flex gap-2 justify-center">
        {!running ? (
          <button
            onClick={handleStart}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground font-mono text-sm"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleLap}
          disabled={!running}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm border border-border disabled:opacity-50"
        >
          Lap
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm border border-border"
        >
          Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div className={cardClass}>
          <label className={labelClass}>Laps</label>
          <ul className="space-y-1 font-mono text-sm text-foreground">
            {laps.map((lap, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-muted-foreground">Lap {i + 1}</span>
                <span>{formatMs(lap)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TimezoneConverter() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState("America/New_York");
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!time || !date) {
      setResult("");
      return;
    }
    try {
      const sourceFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: sourceZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      // Build a UTC date then adjust
      const [h, m] = time.split(":").map(Number);
      const baseDate = new Date(date + "T00:00:00Z");
      // Get offset of source timezone
      const tempDate = new Date(
        Date.UTC(
          baseDate.getUTCFullYear(),
          baseDate.getUTCMonth(),
          baseDate.getUTCDate(),
          h,
          m,
          0
        )
      );

      // Use the source timezone to figure out what UTC time corresponds
      // to the user's input in the source timezone. We do this by
      // finding the UTC offset of the source timezone.
      const sourceParts = sourceFormatter.formatToParts(tempDate);
      const sp: Record<string, string> = {};
      for (const p of sourceParts) sp[p.type] = p.value;
      const sourceHour = parseInt(sp.hour, 10);
      const sourceMinute = parseInt(sp.minute, 10);
      const sourceDay = parseInt(sp.day, 10);

      // Offset between what we set in UTC and what shows in source TZ
      let hourDiff = sourceHour - h;
      const minuteDiff = sourceMinute - m;
      if (sourceDay !== baseDate.getUTCDate()) {
        hourDiff += sourceDay > baseDate.getUTCDate() ? 24 : -24;
      }
      // Adjust tempDate backward by that offset to get actual UTC
      const actualUtc = new Date(
        tempDate.getTime() - (hourDiff * 60 + minuteDiff) * 60000
      );

      const targetFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: targetZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setResult(targetFormatter.format(actualUtc));
    } catch {
      setResult("Invalid input");
    }
  }, [time, date, sourceZone, targetZone]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input
            type="time"
            className={inputClass}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Source Timezone</label>
          <select
            className={inputClass}
            value={sourceZone}
            onChange={(e) => setSourceZone(e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Target Timezone</label>
          <select
            className={inputClass}
            value={targetZone}
            onChange={(e) => setTargetZone(e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {result && (
        <div className={cardClass}>
          <label className={labelClass}>Converted Time</label>
          <p className={resultClass + " text-lg"}>{result}</p>
        </div>
      )}
    </div>
  );
}

function WeekNumber() {
  const [date, setDate] = useState("");

  const d = date ? new Date(date + "T00:00:00") : null;
  const valid = d && !isNaN(d.getTime());

  let isoWeek = 0,
    dayOfYear = 0,
    quarter = 0,
    daysRemaining = 0;
  if (valid) {
    isoWeek = getISOWeek(d);
    dayOfYear = getDayOfYear(d);
    quarter = Math.ceil((d.getMonth() + 1) / 3);
    const endOfYear = new Date(d.getFullYear(), 11, 31);
    daysRemaining = Math.floor(
      (endOfYear.getTime() - d.getTime()) / 86400000
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Date</label>
        <input
          type="date"
          className={inputClass}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {valid && (
        <div className={cardClass}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>ISO Week Number</label>
              <p className={resultClass}>{isoWeek}</p>
            </div>
            <div>
              <label className={labelClass}>Day of Year</label>
              <p className={resultClass}>{dayOfYear}</p>
            </div>
            <div>
              <label className={labelClass}>Quarter</label>
              <p className={resultClass}>Q{quarter}</p>
            </div>
            <div>
              <label className={labelClass}>Days Remaining in Year</label>
              <p className={resultClass}>{daysRemaining}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MilitaryTime() {
  const [time12, setTime12] = useState("");
  const [time24, setTime24] = useState("");
  const [result12to24, setResult12to24] = useState("");
  const [result24to12, setResult24to12] = useState("");

  useEffect(() => {
    if (!time12) {
      setResult12to24("");
      return;
    }
    // Parse 12h format like "02:30 PM" or "2:30 PM"
    const match = time12
      .trim()
      .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      setResult12to24("Invalid format (use HH:MM AM/PM)");
      return;
    }
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (h < 1 || h > 12 || m < 0 || m > 59) {
      setResult12to24("Invalid time");
      return;
    }
    if (period === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h += 12;
    }
    setResult12to24(`${pad(h)}:${pad(m)}`);
  }, [time12]);

  useEffect(() => {
    if (!time24) {
      setResult24to12("");
      return;
    }
    const match = time24.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
      setResult24to12("Invalid format (use HH:MM)");
      return;
    }
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      setResult24to12("Invalid time");
      return;
    }
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    setResult24to12(`${h}:${pad(m)} ${period}`);
  }, [time24]);

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <h3 className="text-sm font-mono font-bold text-foreground mb-3">
          12-Hour to 24-Hour
        </h3>
        <div>
          <label className={labelClass}>12-Hour Time (e.g. 2:30 PM)</label>
          <input
            type="text"
            className={inputClass}
            value={time12}
            onChange={(e) => setTime12(e.target.value)}
            placeholder="2:30 PM"
          />
        </div>
        {result12to24 && (
          <div className="mt-3">
            <label className={labelClass}>24-Hour Result</label>
            <p className={resultClass}>{result12to24}</p>
          </div>
        )}
      </div>
      <div className={cardClass}>
        <h3 className="text-sm font-mono font-bold text-foreground mb-3">
          24-Hour to 12-Hour
        </h3>
        <div>
          <label className={labelClass}>24-Hour Time (e.g. 14:30)</label>
          <input
            type="text"
            className={inputClass}
            value={time24}
            onChange={(e) => setTime24(e.target.value)}
            placeholder="14:30"
          />
        </div>
        {result24to12 && (
          <div className="mt-3">
            <label className={labelClass}>12-Hour Result</label>
            <p className={resultClass}>{result24to12}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ──

function DateTimeTool() {
  const [activeTab, setActiveTab] = useState<Tab>("difference");

  return (
    <Layout>
      <SEO title="Date & Time Tools" description="Date difference, countdown timer, stopwatch, time zone converter, week number calculator and more." canonical="/date-time" keywords="date difference calculator, countdown timer, stopwatch online, time zone converter" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Date &amp; Time Tools
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-mono text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "difference" && <DateDifference />}
        {activeTab === "calculator" && <DateCalculator />}
        {activeTab === "countdown" && <Countdown />}
        {activeTab === "stopwatch" && <Stopwatch />}
        {activeTab === "timezone" && <TimezoneConverter />}
        {activeTab === "weeknumber" && <WeekNumber />}
        {activeTab === "military" && <MilitaryTime />}
      </div>
    </Layout>
  );
}

export default DateTimeTool;
