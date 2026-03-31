import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useCallback, useRef, useEffect } from "react";

// --- UTF-8 safe Base64 helpers ---

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromUrlSafe(b64: string): string {
  let result = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = result.length % 4;
  if (pad === 2) result += "==";
  else if (pad === 3) result += "=";
  return result;
}

function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageDataUrl(dataUrl: string): boolean {
  return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml|bmp|ico);base64,/.test(dataUrl);
}

function detectMimeFromBase64(b64: string): string | null {
  try {
    const binary = atob(b64.slice(0, 16));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
    if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) return "application/zip";
  } catch {
    // not valid base64
  }
  return null;
}

const Base64Tool = () => {
  const [text, setText] = useState("");
  const [base64, setBase64] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState("");
  const [copiedSide, setCopiedSide] = useState<"text" | "base64" | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Direction tracking to avoid circular updates
  const lastEditRef = useRef<"text" | "base64" | null>(null);

  const encodeText = useCallback(
    (input: string) => {
      setError("");
      setImagePreview(null);
      if (!input) {
        setBase64("");
        return;
      }
      try {
        let encoded = utf8ToBase64(input);
        if (urlSafe) encoded = toUrlSafe(encoded);
        setBase64(encoded);
      } catch {
        setError("Failed to encode text.");
      }
    },
    [urlSafe]
  );

  const decodeBase64 = useCallback(
    (input: string) => {
      setError("");
      setImagePreview(null);
      if (!input) {
        setText("");
        return;
      }
      try {
        const normalized = urlSafe ? fromUrlSafe(input) : input;
        // Check if it looks like a data URL with image
        if (isImageDataUrl(input)) {
          setImagePreview(input);
          setText("[Data URL — image preview shown below]");
          return;
        }
        // Check if raw base64 decodes to an image
        const mime = detectMimeFromBase64(normalized);
        if (mime && mime.startsWith("image/")) {
          const dataUrl = `data:${mime};base64,${normalized}`;
          setImagePreview(dataUrl);
        }
        const decoded = base64ToUtf8(normalized);
        setText(decoded);
      } catch {
        setError("Invalid Base64 string. Check your input.");
      }
    },
    [urlSafe]
  );

  const handleTextChange = useCallback(
    (value: string) => {
      lastEditRef.current = "text";
      setText(value);
      setFileInfo(null);
      encodeText(value);
    },
    [encodeText]
  );

  const handleBase64Change = useCallback(
    (value: string) => {
      lastEditRef.current = "base64";
      setBase64(value);
      setFileInfo(null);
      decodeBase64(value);
    },
    [decodeBase64]
  );

  // Re-encode/decode when URL-safe toggle changes
  useEffect(() => {
    if (lastEditRef.current === "text" || lastEditRef.current === null) {
      if (text) encodeText(text);
    } else {
      if (base64) decodeBase64(base64);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSafe]);

  const handleCopy = useCallback(
    async (side: "text" | "base64") => {
      const content = side === "text" ? text : base64;
      if (!content) return;
      try {
        await navigator.clipboard.writeText(content);
        setCopiedSide(side);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setCopiedSide(null), 1500);
      } catch {
        // clipboard API may fail in insecure contexts
      }
    },
    [text, base64]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileInfo({ name: file.name, size: file.size });
      setError("");
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // dataUrl is like "data:<mime>;base64,<data>"
        const raw = dataUrl.split(",")[1] || "";
        let encoded = raw;
        if (urlSafe) encoded = toUrlSafe(raw);
        lastEditRef.current = "base64";
        setBase64(encoded);
        setText("");
        if (isImageDataUrl(dataUrl)) {
          setImagePreview(dataUrl);
        } else {
          const mime = detectMimeFromBase64(raw);
          if (mime && mime.startsWith("image/")) {
            setImagePreview(`data:${mime};base64,${raw}`);
          } else {
            setImagePreview(null);
          }
        }
      };
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsDataURL(file);
      // Reset the input so the same file can be re-selected
      e.target.value = "";
    },
    [urlSafe]
  );

  const handleDownload = useCallback(() => {
    if (!base64) return;
    try {
      const normalized = urlSafe ? fromUrlSafe(base64) : base64;
      const mime = detectMimeFromBase64(normalized) || "application/octet-stream";
      const binary = atob(normalized);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = mime.split("/")[1]?.replace("+xml", "") || "bin";
      a.download = fileInfo?.name || `decoded.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Cannot decode Base64 to a downloadable file.");
    }
  }, [base64, urlSafe, fileInfo]);

  const handleClear = useCallback(() => {
    setText("");
    setBase64("");
    setError("");
    setImagePreview(null);
    setFileInfo(null);
    lastEditRef.current = null;
  }, []);

  // Stats
  const textBytes = byteSize(text);
  const base64Bytes = byteSize(base64);
  const ratio = textBytes > 0 ? (base64Bytes / textBytes).toFixed(2) : "—";

  return (
    <Layout>
      <SEO title="Base64 Encoder/Decoder" description="Encode text to Base64 or decode Base64 strings online instantly. Free Base64 tool with no sign-up." canonical="/base64" keywords="base64 encode, base64 decode, base64 converter, base64 online" faq={[{question:"What is Base64 encoding?",answer:"Base64 converts binary data into ASCII text using 64 characters, commonly used for embedding data in URLs and emails."},{question:"Is Base64 encryption?",answer:"No, Base64 is encoding, not encryption. It can be easily decoded by anyone."}]} />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Base64 Tool</h1>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            URL-safe Base64
          </label>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />

          {base64 && (
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Download as File
            </button>
          )}

          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* File info */}
        {fileInfo && (
          <p className="font-mono text-xs text-muted-foreground mb-3">
            File: {fileInfo.name} ({formatBytes(fileInfo.size)})
          </p>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-4 px-4 py-2 rounded-md bg-destructive/10 border border-destructive/30 font-mono text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Side-by-side textareas */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Text side */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground">Text</label>
              <button
                onClick={() => handleCopy("text")}
                className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground font-mono text-xs hover:bg-secondary/80 transition-colors"
              >
                {copiedSide === "text" ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Type or paste text here..."
              spellCheck={false}
            />
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatBytes(textBytes)}
            </p>
          </div>

          {/* Base64 side */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground">
                Base64{urlSafe ? " (URL-safe)" : ""}
              </label>
              <button
                onClick={() => handleCopy("base64")}
                className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground font-mono text-xs hover:bg-secondary/80 transition-colors"
              >
                {copiedSide === "base64" ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={base64}
              onChange={(e) => handleBase64Change(e.target.value)}
              className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Type or paste Base64 here..."
              spellCheck={false}
            />
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {formatBytes(base64Bytes)}
              {textBytes > 0 && <> &middot; Ratio: {ratio}x</>}
            </p>
          </div>
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="mt-6">
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Image Preview</label>
            <div className="inline-block rounded-lg border border-border bg-secondary p-2">
              <img
                src={imagePreview}
                alt="Decoded preview"
                className="max-w-full max-h-64 rounded"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Base64Tool;
