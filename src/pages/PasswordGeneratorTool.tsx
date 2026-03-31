import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~";

function secureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function generatePassword(
  length: number,
  useUppercase: boolean,
  useLowercase: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string {
  let charset = "";
  if (useUppercase) charset += UPPERCASE;
  if (useLowercase) charset += LOWERCASE;
  if (useNumbers) charset += NUMBERS;
  if (useSymbols) charset += SYMBOLS;

  if (charset.length === 0) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[secureRandom(charset.length)];
  }
  return password;
}

function calcEntropy(
  length: number,
  useUppercase: boolean,
  useLowercase: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): number {
  let poolSize = 0;
  if (useUppercase) poolSize += UPPERCASE.length;
  if (useLowercase) poolSize += LOWERCASE.length;
  if (useNumbers) poolSize += NUMBERS.length;
  if (useSymbols) poolSize += SYMBOLS.length;
  if (poolSize === 0) return 0;
  return Math.round(length * Math.log2(poolSize) * 100) / 100;
}

type Strength = "weak" | "fair" | "medium" | "strong" | "very strong";

function getStrength(entropy: number): { label: Strength; percent: number; color: string } {
  if (entropy < 28) return { label: "weak", percent: 10, color: "text-destructive" };
  if (entropy < 36) return { label: "fair", percent: 30, color: "text-amber-500" };
  if (entropy < 60) return { label: "medium", percent: 55, color: "text-yellow-500" };
  if (entropy < 80) return { label: "strong", percent: 80, color: "text-primary" };
  return { label: "very strong", percent: 100, color: "text-green-500" };
}

function getBarBg(entropy: number): string {
  if (entropy < 28) return "bg-destructive";
  if (entropy < 36) return "bg-amber-500";
  if (entropy < 60) return "bg-yellow-500";
  if (entropy < 80) return "bg-primary";
  return "bg-green-500";
}

const PasswordGeneratorTool = () => {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState(() =>
    generatePassword(16, true, true, true, true)
  );
  const [copied, setCopied] = useState(false);

  const entropy = calcEntropy(length, useUppercase, useLowercase, useNumbers, useSymbols);
  const strength = getStrength(entropy);

  const handleGenerate = () => {
    const pw = generatePassword(length, useUppercase, useLowercase, useNumbers, useSymbols);
    setPassword(pw);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO title="Password Generator" description="Generate secure random passwords with customizable length, characters, and strength indicator. Uses cryptographic randomness." canonical="/password-generator" keywords="password generator, random password, secure password generator, strong password" />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Password Generator
        </h1>

        {/* Password Display */}
        <div className="text-lg font-mono bg-secondary p-4 rounded-lg border border-border text-center select-all break-all mb-4">
          {password || <span className="text-muted-foreground">No characters selected</span>}
        </div>

        {/* Strength Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-mono font-semibold capitalize ${strength.color}`}>
              {strength.label}
            </span>
            <span className="text-sm font-mono text-muted-foreground">
              {entropy} bits of entropy
            </span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getBarBg(entropy)}`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Generate
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Settings Card */}
        <div className="bg-secondary rounded-lg border border-border p-4">
          {/* Length Slider */}
          <div className="mb-4">
            <label className="text-sm font-mono text-muted-foreground mb-1 block">
              Length: {length}
            </label>
            <input
              type="range"
              min={4}
              max={128}
              value={length}
              onChange={(e) => {
                setLength(Number(e.target.value));
              }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* Character Set Checkboxes */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Uppercase (A-Z)", checked: useUppercase, setter: setUseUppercase },
              { label: "Lowercase (a-z)", checked: useLowercase, setter: setUseLowercase },
              { label: "Numbers (0-9)", checked: useNumbers, setter: setUseNumbers },
              { label: "Symbols (!@#$...)", checked: useSymbols, setter: setUseSymbols },
            ].map(({ label, checked, setter }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setter(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-mono text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordGeneratorTool;
