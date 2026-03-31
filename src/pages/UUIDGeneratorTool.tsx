import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const UUIDGeneratorTool = () => {
  const [singleUUID, setSingleUUID] = useState("");
  const [bulkUUIDs, setBulkUUIDs] = useState<string[]>([]);
  const [bulkCount, setBulkCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [validateInput, setValidateInput] = useState("");
  const [validationResult, setValidationResult] = useState<null | boolean>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const formatUUID = (uuid: string) => {
    let result = hyphens ? uuid : uuid.replace(/-/g, "");
    return uppercase ? result.toUpperCase() : result.toLowerCase();
  };

  const generateSingle = () => {
    setSingleUUID(formatUUID(crypto.randomUUID()));
  };

  const generateBulk = () => {
    const count = Math.min(Math.max(1, bulkCount), 100);
    const uuids = Array.from({ length: count }, () =>
      formatUUID(crypto.randomUUID())
    );
    setBulkUUIDs(uuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const copySingle = async () => {
    await copyToClipboard(singleUUID);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 1500);
  };

  const copyBulkItem = async (uuid: string, index: number) => {
    await copyToClipboard(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = async () => {
    await copyToClipboard(bulkUUIDs.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const validateUUID = () => {
    const v4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    setValidationResult(v4Regex.test(validateInput.trim()));
  };

  return (
    <Layout>
      <SEO title="UUID Generator" description="Generate random UUID v4 identifiers. Bulk generate, validate, and copy UUIDs instantly." canonical="/uuid-generator" keywords="uuid generator, guid generator, uuid v4, random uuid, unique identifier" />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          UUID Generator
        </h1>

        {/* Options */}
        <div className="bg-secondary rounded-lg border border-border p-4 mb-6">
          <h2 className="text-sm font-mono text-muted-foreground mb-3">
            Options
          </h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-mono text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="accent-primary"
              />
              Uppercase
            </label>
            <label className="flex items-center gap-2 font-mono text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="accent-primary"
              />
              Hyphens
            </label>
          </div>
        </div>

        {/* Single UUID */}
        <div className="bg-secondary rounded-lg border border-border p-4 mb-6">
          <h2 className="text-sm font-mono text-muted-foreground mb-3">
            Generate Single UUID
          </h2>
          <div className="flex gap-3 mb-3">
            <button
              onClick={generateSingle}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Generate
            </button>
            {singleUUID && (
              <button
                onClick={copySingle}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors border border-border"
              >
                {copiedSingle ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          {singleUUID && (
            <div className="text-lg font-mono text-foreground select-all break-all">
              {singleUUID}
            </div>
          )}
        </div>

        {/* Bulk Generation */}
        <div className="bg-secondary rounded-lg border border-border p-4 mb-6">
          <h2 className="text-sm font-mono text-muted-foreground mb-3">
            Bulk Generation
          </h2>
          <div className="flex gap-3 items-center mb-3">
            <input
              type="number"
              min={1}
              max={100}
              value={bulkCount}
              onChange={(e) =>
                setBulkCount(
                  Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className="w-24 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={generateBulk}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Generate Bulk
            </button>
            {bulkUUIDs.length > 0 && (
              <button
                onClick={copyAll}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors border border-border"
              >
                {copiedAll ? "Copied All!" : "Copy All"}
              </button>
            )}
          </div>
          {bulkUUIDs.length > 0 && (
            <div className="max-h-64 overflow-y-auto rounded-md border border-border bg-background">
              {bulkUUIDs.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-secondary/50"
                >
                  <span className="font-mono text-sm text-foreground select-all break-all">
                    {uuid}
                  </span>
                  <button
                    onClick={() => copyBulkItem(uuid, index)}
                    className="ml-2 px-2 py-1 rounded text-xs font-mono text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UUID Validator */}
        <div className="bg-secondary rounded-lg border border-border p-4">
          <h2 className="text-sm font-mono text-muted-foreground mb-3">
            UUID v4 Validator
          </h2>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={validateInput}
              onChange={(e) => {
                setValidateInput(e.target.value);
                setValidationResult(null);
              }}
              placeholder="Paste a UUID to validate..."
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={validateUUID}
              disabled={!validateInput.trim()}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
            >
              Validate
            </button>
          </div>
          {validationResult !== null && (
            <div
              className={`font-mono text-sm ${
                validationResult ? "text-green-500" : "text-red-500"
              }`}
            >
              {validationResult
                ? "Valid UUID v4"
                : "Invalid UUID v4 format"}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UUIDGeneratorTool;
