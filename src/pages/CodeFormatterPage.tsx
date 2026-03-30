import { Layout } from "@/components/Layout";
import { useState } from "react";

const CodeFormatterPage = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatJson = () => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); } catch { setOutput("Could not parse as JSON"); }
  };

  const formatXml = () => {
    let formatted = "";
    let indent = 0;
    input.replace(/>\s*</g, ">\n<").split("\n").forEach((line) => {
      if (line.match(/^<\/\w/)) indent--;
      formatted += "  ".repeat(Math.max(indent, 0)) + line.trim() + "\n";
      if (line.match(/^<\w[^>]*[^/]>.*$/) && !line.match(/^<\w.*>.*<\/\w/)) indent++;
    });
    setOutput(formatted.trim());
  };

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Code Formatter</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Paste code..." />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Output</label>
            <textarea value={output} readOnly className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={formatJson} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Format JSON</button>
          <button onClick={formatXml} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors">Format XML</button>
        </div>
      </div>
    </Layout>
  );
};

export default CodeFormatterPage;
