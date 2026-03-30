import { Layout } from "@/components/Layout";
import { useState } from "react";

const JwtTool = () => {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<{ header: any; payload: any } | null>(null);
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      setDecoded({ header, payload });
      setError("");
    } catch (e: any) {
      setError(e.message);
      setDecoded(null);
    }
  };

  return (
    <Layout>
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">JWT Tool</h1>
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-2 block">Token</label>
          <textarea value={token} onChange={(e) => setToken(e.target.value)} className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="eyJhbGciOiJIUzI1NiIs..." />
        </div>
        <button onClick={decode} className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Decode</button>
        {error && <p className="text-destructive text-sm font-mono mt-2">{error}</p>}
        {decoded && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-mono text-cyan mb-2">Header</h3>
              <pre className="bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div>
              <h3 className="text-sm font-mono text-amber mb-2">Payload</h3>
              <pre className="bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JwtTool;
