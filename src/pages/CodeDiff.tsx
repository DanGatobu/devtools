import { Layout } from "@/components/Layout";
import { useState } from "react";

const CodeDiff = () => {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const maxLines = Math.max(leftLines.length, rightLines.length);

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Code Diff</h1>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Original</label>
            <textarea value={left} onChange={(e) => setLeft(e.target.value)} className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Modified</label>
            <textarea value={right} onChange={(e) => setRight(e.target.value)} className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        {(left || right) && (
          <div className="bg-secondary rounded-lg border border-border overflow-auto">
            <table className="w-full font-mono text-sm">
              <tbody>
                {Array.from({ length: maxLines }).map((_, i) => {
                  const l = leftLines[i] ?? "";
                  const r = rightLines[i] ?? "";
                  const same = l === r;
                  return (
                    <tr key={i} className={same ? "" : "bg-destructive/10"}>
                      <td className="px-3 py-0.5 text-muted-foreground text-right w-10 select-none border-r border-border">{i + 1}</td>
                      <td className="px-3 py-0.5 whitespace-pre">{l}</td>
                      <td className="px-3 py-0.5 text-muted-foreground text-right w-10 select-none border-x border-border">{i + 1}</td>
                      <td className="px-3 py-0.5 whitespace-pre">{r}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CodeDiff;
