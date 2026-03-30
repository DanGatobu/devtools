import { Layout } from "@/components/Layout";
import { useState } from "react";

const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => { try { setOutput(btoa(input)); } catch { setOutput("Error encoding"); } };
  const decode = () => { try { setOutput(atob(input)); } catch { setOutput("Error decoding"); } };

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Base64 Tool</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter text..." />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Output</label>
            <textarea value={output} readOnly className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={encode} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Encode</button>
          <button onClick={decode} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors">Decode</button>
        </div>
      </div>
    </Layout>
  );
};

export default Base64Tool;
