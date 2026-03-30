import { Layout } from "@/components/Layout";
import { useState } from "react";

const RegexTool = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const test = () => {
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...testStr.matchAll(re)].map((m) => m[0]);
      setResults(matches);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setResults([]);
    }
  };

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Regex Tool</h1>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">Pattern</label>
              <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="\w+" />
            </div>
            <div className="w-24">
              <label className="text-sm font-mono text-muted-foreground mb-1 block">Flags</label>
              <input value={flags} onChange={(e) => setFlags(e.target.value)} className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-1 block">Test String</label>
            <textarea value={testStr} onChange={(e) => setTestStr(e.target.value)} className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button onClick={test} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Test</button>
          {error && <p className="text-destructive text-sm font-mono">{error}</p>}
          {results.length > 0 && (
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-sm font-mono text-muted-foreground mb-2">{results.length} match(es)</p>
              <div className="flex flex-wrap gap-2">
                {results.map((m, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegexTool;
