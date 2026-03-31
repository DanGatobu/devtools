import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type ConversionCategory = {
  name: string;
  units: string[];
  factors: Record<string, number>;
};

type TemperatureCategory = {
  name: "Temperature";
  units: string[];
};

type Category = ConversionCategory | TemperatureCategory;

const categories: Category[] = [
  {
    name: "Length",
    units: ["mm", "cm", "m", "km", "inch", "foot", "yard", "mile"],
    factors: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344,
    },
  },
  {
    name: "Weight",
    units: ["mg", "g", "kg", "oz", "lb", "stone", "ton"],
    factors: {
      mg: 0.000001,
      g: 0.001,
      kg: 1,
      oz: 0.028349523125,
      lb: 0.45359237,
      stone: 6.35029318,
      ton: 907.18474,
    },
  },
  {
    name: "Temperature",
    units: ["Celsius", "Fahrenheit", "Kelvin"],
  },
  {
    name: "Volume",
    units: ["ml", "L", "gallon(US)", "cup", "tablespoon", "teaspoon", "fl oz", "pint", "quart"],
    factors: {
      ml: 0.001,
      L: 1,
      "gallon(US)": 3.785411784,
      cup: 0.2365882365,
      tablespoon: 0.01478676478125,
      teaspoon: 0.00492892159375,
      "fl oz": 0.0295735295625,
      pint: 0.473176473,
      quart: 0.946352946,
    },
  },
  {
    name: "Area",
    units: ["sq mm", "sq cm", "sq m", "sq km", "sq inch", "sq foot", "sq yard", "acre", "hectare"],
    factors: {
      "sq mm": 0.000001,
      "sq cm": 0.0001,
      "sq m": 1,
      "sq km": 1000000,
      "sq inch": 0.00064516,
      "sq foot": 0.09290304,
      "sq yard": 0.83612736,
      acre: 4046.8564224,
      hectare: 10000,
    },
  },
  {
    name: "Speed",
    units: ["m/s", "km/h", "mph", "knots", "ft/s"],
    factors: {
      "m/s": 1,
      "km/h": 1 / 3.6,
      mph: 0.44704,
      knots: 0.514444,
      "ft/s": 0.3048,
    },
  },
  {
    name: "Data",
    units: ["bit", "byte", "KB", "MB", "GB", "TB", "PB"],
    factors: {
      bit: 1,
      byte: 8,
      KB: 8 * 1024,
      MB: 8 * 1024 * 1024,
      GB: 8 * 1024 * 1024 * 1024,
      TB: 8 * 1024 * 1024 * 1024 * 1024,
      PB: 8 * 1024 * 1024 * 1024 * 1024 * 1024,
    },
  },
  {
    name: "Time",
    units: ["ms", "second", "minute", "hour", "day", "week", "month(30d)", "year(365d)"],
    factors: {
      ms: 0.001,
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      "month(30d)": 2592000,
      "year(365d)": 31536000,
    },
  },
  {
    name: "Pressure",
    units: ["Pa", "kPa", "bar", "atm", "psi", "mmHg"],
    factors: {
      Pa: 1,
      kPa: 1000,
      bar: 100000,
      atm: 101325,
      psi: 6894.757293168,
      mmHg: 133.322387415,
    },
  },
  {
    name: "Energy",
    units: ["J", "kJ", "cal", "kcal", "Wh", "kWh", "BTU"],
    factors: {
      J: 1,
      kJ: 1000,
      cal: 4.184,
      kcal: 4184,
      Wh: 3600,
      kWh: 3600000,
      BTU: 1055.06,
    },
  },
];

function isTemperatureCategory(cat: Category): cat is TemperatureCategory {
  return cat.name === "Temperature";
}

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;

  // Convert from source to Celsius first
  let celsius: number;
  switch (from) {
    case "Celsius":
      celsius = value;
      break;
    case "Fahrenheit":
      celsius = (value - 32) * (5 / 9);
      break;
    case "Kelvin":
      celsius = value - 273.15;
      break;
    default:
      return NaN;
  }

  // Convert from Celsius to target
  switch (to) {
    case "Celsius":
      return celsius;
    case "Fahrenheit":
      return celsius * (9 / 5) + 32;
    case "Kelvin":
      return celsius + 273.15;
    default:
      return NaN;
  }
}

function getTemperatureFormula(from: string, to: string): string {
  if (from === to) return `${to} = ${from}`;
  const key = `${from}->${to}`;
  const formulas: Record<string, string> = {
    "Celsius->Fahrenheit": "F = C x 9/5 + 32",
    "Celsius->Kelvin": "K = C + 273.15",
    "Fahrenheit->Celsius": "C = (F - 32) x 5/9",
    "Fahrenheit->Kelvin": "K = (F - 32) x 5/9 + 273.15",
    "Kelvin->Celsius": "C = K - 273.15",
    "Kelvin->Fahrenheit": "F = (K - 273.15) x 9/5 + 32",
  };
  return formulas[key] || "";
}

function convert(category: Category, value: number, from: string, to: string): number {
  if (isTemperatureCategory(category)) {
    return convertTemperature(value, from, to);
  }
  const cat = category as ConversionCategory;
  const fromFactor = cat.factors[from];
  const toFactor = cat.factors[to];
  if (fromFactor === undefined || toFactor === undefined) return NaN;
  return (value * fromFactor) / toFactor;
}

function formatNumber(n: number): string {
  if (isNaN(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 0.0001 && abs < 1e15) {
    // Remove trailing zeros
    const fixed = n.toPrecision(12);
    return parseFloat(fixed).toString();
  }
  return n.toExponential(6);
}

function getFormulaText(category: Category, from: string, to: string): string {
  if (isTemperatureCategory(category)) {
    return getTemperatureFormula(from, to);
  }
  const cat = category as ConversionCategory;
  const factor = cat.factors[from] / cat.factors[to];
  return `1 ${from} = ${formatNumber(factor)} ${to}`;
}

function UnitConverterTool() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(categories[0].units[0]);
  const [toUnit, setToUnit] = useState(categories[0].units[1]);

  const activeCategory = categories[activeCategoryIndex];
  const numericValue = parseFloat(inputValue);
  const result = isNaN(numericValue)
    ? NaN
    : convert(activeCategory, numericValue, fromUnit, toUnit);

  function handleCategoryChange(index: number) {
    setActiveCategoryIndex(index);
    const cat = categories[index];
    setFromUnit(cat.units[0]);
    setToUnit(cat.units[1]);
    setInputValue("1");
  }

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <Layout>
      <SEO title="Unit Converter" description="Convert between units of length, weight, temperature, volume, area, speed, data, time, pressure, and energy." canonical="/unit-converter" keywords="unit converter, length converter, weight converter, temperature converter, metric converter" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Unit Converter
        </h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(i)}
              className={
                i === activeCategoryIndex
                  ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                  : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
              }
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="bg-secondary rounded-lg border border-border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            {/* From */}
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                Value
              </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter value"
              />
              <label className="text-sm font-mono text-muted-foreground mb-1 block mt-3">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {activeCategory.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <div className="flex items-center justify-center">
              <button
                onClick={handleSwap}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                title="Swap units"
              >
                ⇄
              </button>
            </div>

            {/* To */}
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                Result
              </label>
              <div className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground min-h-[38px] flex items-center">
                {isNaN(result) ? "—" : formatNumber(result)}
              </div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block mt-3">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {activeCategory.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Formula */}
          <div className="mt-4 pt-3 border-t border-border">
            <span className="text-sm font-mono text-muted-foreground">
              Formula:{" "}
            </span>
            <span className="text-sm font-mono text-foreground">
              {getFormulaText(activeCategory, fromUnit, toUnit)}
            </span>
          </div>
        </div>

        {/* Reference Table */}
        <h2 className="text-lg font-mono font-bold text-foreground mb-4">
          {isNaN(numericValue) ? "1" : inputValue} {fromUnit} in all{" "}
          {activeCategory.name} units
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {activeCategory.units.map((unit) => {
            const val = isNaN(numericValue)
              ? NaN
              : convert(activeCategory, numericValue, fromUnit, unit);
            return (
              <div
                key={unit}
                className="bg-secondary rounded-lg border border-border p-4"
              >
                <div className="text-sm font-mono text-muted-foreground mb-1">
                  {unit}
                </div>
                <div className="text-lg font-mono font-bold text-foreground truncate">
                  {formatNumber(val)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default UnitConverterTool;
