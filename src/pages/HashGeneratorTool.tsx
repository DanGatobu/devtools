import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useEffect, useCallback, useRef } from "react";

// ---------- MD5 Implementation ----------

function md5(input: ArrayBuffer): string {
  const bytes = new Uint8Array(input);

  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }

  function rotl(x: number, n: number) { return (x << n) | (x >>> (32 - n)); }

  function add(...args: number[]) {
    let s = 0;
    for (const v of args) s = (s + v) | 0;
    return s >>> 0;
  }

  // Pre-computed sine table
  const T: number[] = [];
  for (let i = 0; i < 64; i++) {
    T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
  }

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  // Padding
  const bitLen = bytes.length * 8;
  const padLen = bytes.length % 64;
  const needed = padLen < 56 ? 56 - padLen : 120 - padLen;
  const padded = new Uint8Array(bytes.length + needed + 8);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  // Append original length in bits as 64-bit little-endian
  const lo = bitLen >>> 0;
  const hi = (bitLen / 0x100000000) >>> 0;
  const lenOffset = padded.length - 8;
  padded[lenOffset] = lo & 0xff;
  padded[lenOffset + 1] = (lo >>> 8) & 0xff;
  padded[lenOffset + 2] = (lo >>> 16) & 0xff;
  padded[lenOffset + 3] = (lo >>> 24) & 0xff;
  padded[lenOffset + 4] = hi & 0xff;
  padded[lenOffset + 5] = (hi >>> 8) & 0xff;
  padded[lenOffset + 6] = (hi >>> 16) & 0xff;
  padded[lenOffset + 7] = (hi >>> 24) & 0xff;

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const view = new DataView(padded.buffer);
  for (let offset = 0; offset < padded.length; offset += 64) {
    const M: number[] = [];
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(offset + j * 4, true);
    }

    let a = a0, b = b0, c = c0, d = d0;

    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) {
        f = F(b, c, d);
        g = i;
      } else if (i < 32) {
        f = G(b, c, d);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = H(b, c, d);
        g = (3 * i + 5) % 16;
      } else {
        f = I(b, c, d);
        g = (7 * i) % 16;
      }
      const temp = d;
      d = c;
      c = b;
      b = add(b, rotl(add(a, f, T[i], M[g]), S[i]));
      a = temp;
    }

    a0 = add(a0, a);
    b0 = add(b0, b);
    c0 = add(c0, c);
    d0 = add(d0, d);
  }

  function toLEHex(val: number) {
    const bytes = [
      val & 0xff,
      (val >>> 8) & 0xff,
      (val >>> 16) & 0xff,
      (val >>> 24) & 0xff,
    ];
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  return toLEHex(a0) + toLEHex(b0) + toLEHex(c0) + toLEHex(d0);
}

// ---------- Utility ----------

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha(algorithm: string, data: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest(algorithm, data);
  return bufferToHex(hash);
}

// ---------- Types ----------

interface HashResult {
  name: string;
  value: string;
}

const ALGORITHMS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

// ---------- Component ----------

function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [source, setSource] = useState<"text" | "file">("text");
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);

  const computeHashes = useCallback(async (data: ArrayBuffer) => {
    const results: HashResult[] = [];

    // MD5 (sync)
    results.push({ name: "MD5", value: md5(data) });

    // SHA family (async via Web Crypto)
    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const) {
      const hex = await sha(algo, data);
      results.push({ name: algo, value: hex });
    }

    setHashes(results);
  }, []);

  // Auto-hash on text input change
  useEffect(() => {
    if (source !== "text") return;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    computeHashes(data.buffer);
  }, [input, source, computeHashes]);

  // Auto-hash on file change
  useEffect(() => {
    if (source !== "file" || !fileBuffer) return;
    computeHashes(fileBuffer);
  }, [fileBuffer, source, computeHashes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setSource("file");
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        setFileBuffer(reader.result);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const switchToText = () => {
    setSource("text");
    setFileName(null);
    setFileBuffer(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const copyToClipboard = (value: string, index: number) => {
    const text = uppercase ? value.toUpperCase() : value;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const formatHash = (value: string) => (uppercase ? value.toUpperCase() : value);

  return (
    <Layout>
      <SEO title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Free online hash calculator." canonical="/hash-generator" keywords="md5 hash generator, sha256 generator, hash calculator, sha1 generator, file hash" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Hash Generator
        </h1>

        {/* Input section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={switchToText}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
                source === "text"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground border border-border hover:opacity-90"
              }`}
            >
              Text Input
            </button>
            <label
              className={`px-4 py-2 rounded-md font-mono text-sm cursor-pointer transition-opacity ${
                source === "file"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground border border-border hover:opacity-90"
              }`}
            >
              File Input
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {source === "text" ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text to hash..."
              className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          ) : (
            <div className="bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground">
              {fileName ? (
                <span>Selected file: {fileName}</span>
              ) : (
                <span className="text-muted-foreground">
                  No file selected. Click "File Input" to choose a file.
                </span>
              )}
            </div>
          )}

          {/* Uppercase toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 font-mono text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="accent-primary"
              />
              Uppercase hex output
            </label>
          </div>
        </div>

        {/* Hash results */}
        <div className="space-y-3">
          {hashes.map((hash, index) => (
            <div
              key={hash.name}
              className="bg-secondary rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {hash.name}
                </span>
                <button
                  onClick={() => copyToClipboard(hash.value, index)}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>
              <input
                readOnly
                value={formatHash(hash.value)}
                className="w-full bg-background rounded border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default HashGeneratorTool;
