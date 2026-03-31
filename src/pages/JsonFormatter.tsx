import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  return (
    <Layout>
      <SEO title="JSON Formatter & Validator" description="Format, validate, and minify JSON data online for free. Pretty print JSON with configurable indentation." canonical="/json" keywords="json formatter, json validator, json beautifier, json minifier, pretty print json" faq={[{question:"How do I format JSON online?",answer:"Paste your JSON into the input, click Format, and get perfectly indented JSON instantly."},{question:"Is this JSON validator free?",answer:"Yes, completely free with no sign-up required."},{question:"Can I minify JSON?",answer:"Yes, click the Minify button to compress JSON by removing all whitespace."}]} />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">JSON Formatter</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder='{"key": "value"}'
            />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Output</label>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none"
            />
          </div>
        </div>
        {error && <p className="text-destructive text-sm font-mono mt-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button onClick={format} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Format</button>
          <button onClick={minify} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors">Minify</button>
        </div>
      </div>
    </Layout>
  );
};

export default JsonFormatter;
