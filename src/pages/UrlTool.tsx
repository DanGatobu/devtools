import { Layout } from "@/components/Layout";
import { useState } from "react";

const UrlTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("Error decoding"); } };

  const parse = () => {
    try {
      const url = new URL(input);
      setOutput(JSON.stringify({ protocol: url.protocol, host: url.host, pathname: url.pathname, search: url.search, hash: url.hash, params: Object.fromEntries(url.searchParams) }, null, 2));
    } catch { setOutput("Invalid URL"); }
  };

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">URL Tool</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="https://example.com?key=value" />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Output</label>
            <textarea value={output} readOnly className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={encode} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Encode</button>
          <button onClick={decode} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors">Decode</button>
          <button onClick={parse} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors">Parse</button>
        </div>
      </div>
    </Layout>
  );
};

export default UrlTool;
