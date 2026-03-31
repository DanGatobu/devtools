import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useRef, useEffect } from "react";

const SIZES = [128, 256, 512] as const;
type Size = (typeof SIZES)[number];

const ECC_LEVELS = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
] as const;

type PresetType = "text" | "url" | "wifi" | "email" | "phone" | "sms";

const PRESETS: { value: PresetType; label: string }[] = [
  { value: "text", label: "Plain Text" },
  { value: "url", label: "URL" },
  { value: "wifi", label: "WiFi" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
];

const QRCodeTool = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState<Size>(256);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [ecc, setEcc] = useState("M");
  const [preset, setPreset] = useState<PresetType>("text");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedText, setDebouncedText] = useState("");

  const hasInput = preset === "wifi" ? wifiSsid.trim() !== "" : debouncedText.trim() !== "";

  const encodedData = (() => {
    if (!hasInput) return "";
    const t = debouncedText.trim();
    switch (preset) {
      case "wifi":
        return encodeURIComponent(`WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`);
      case "email":
        return encodeURIComponent(`mailto:${t}`);
      case "phone":
        return encodeURIComponent(`tel:${t}`);
      case "sms":
        return encodeURIComponent(`smsto:${t}`);
      default:
        return encodeURIComponent(t);
    }
  })();

  const qrUrl =
    encodedData !== ""
      ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&color=${fgColor.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}&ecc=${ecc}${retryCount > 0 ? `&_r=${retryCount}` : ""}`
      : "";

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (preset === "wifi") {
      // For WiFi, debounce based on WiFi fields
      if (wifiSsid.trim() === "") {
        setDebouncedText("");
        setError("");
        setImageLoaded(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        setDebouncedText(`wifi-${wifiSsid}-${wifiPassword}-${wifiEncryption}`);
      }, 500);
    } else {
      if (text.trim() === "") {
        setDebouncedText("");
        setError("");
        setImageLoaded(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        setDebouncedText(text);
      }, 500);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, preset, wifiSsid, wifiPassword, wifiEncryption]);

  useEffect(() => {
    if (qrUrl === "") {
      setLoading(false);
      setError("");
      setImageLoaded(false);
      return;
    }
    setLoading(true);
    setError("");
    setImageLoaded(false);
  }, [qrUrl]);

  const handleImageLoad = () => {
    setLoading(false);
    setImageLoaded(true);
    setError("");
  };

  const handleImageError = () => {
    setLoading(false);
    setImageLoaded(false);
    setError("QR code generation failed. Please try again.");
  };

  const handleRetry = () => {
    setError("");
    setRetryCount((c) => c + 1);
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "qrcode.png";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open image in new tab if fetch fails (e.g. CORS)
      try {
        window.open(qrUrl, "_blank", "noopener,noreferrer");
      } catch {
        setError("Failed to download QR code. Please try again.");
      }
    }
  };

  const handleCopyUrl = async () => {
    if (!qrUrl) return;
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy URL to clipboard.");
    }
  };

  return (
    <Layout>
      <SEO title="QR Code Generator" description="Generate QR codes from text or URLs for free. Download as PNG with customizable size." canonical="/qr-code" keywords="qr code generator, create qr code, qr code maker, generate qr code online" />
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          QR Code Generator
        </h1>

        <div className="space-y-4">
          {/* Preset selector */}
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              QR Code Type
            </label>
            <select
              value={preset}
              onChange={(e) => {
                setPreset(e.target.value as PresetType);
                setText("");
                setDebouncedText("");
                setError("");
                setImageLoaded(false);
              }}
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional input fields based on preset */}
          {preset === "wifi" ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-mono text-muted-foreground mb-2 block">
                  SSID (Network Name)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="MyNetwork"
                  className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-mono text-muted-foreground mb-2 block">
                  Password
                </label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-mono text-muted-foreground mb-2 block">
                  Encryption
                </label>
                <select
                  value={wifiEncryption}
                  onChange={(e) => setWifiEncryption(e.target.value)}
                  className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-2 block">
                {preset === "url" ? "URL" : preset === "email" ? "Email Address" : preset === "phone" ? "Phone Number" : preset === "sms" ? "Phone Number" : "Text or URL"}
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  preset === "url" ? "https://example.com" :
                  preset === "email" ? "user@example.com" :
                  preset === "phone" ? "+1234567890" :
                  preset === "sms" ? "+1234567890" :
                  "Enter text or URL..."
                }
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* Size selector */}
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Size
            </label>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={
                    s === size
                      ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                      : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors border border-border"
                  }
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>

          {/* Error correction level */}
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Error Correction
            </label>
            <select
              value={ecc}
              onChange={(e) => setEcc(e.target.value)}
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {ECC_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color pickers */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-mono text-muted-foreground mb-2 block">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-mono text-muted-foreground mb-2 block">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* QR code display */}
          <div className="flex flex-col items-center gap-4 mt-6">
            <div
              className="flex items-center justify-center rounded-lg border border-border bg-white"
              style={{ width: size + 32, height: size + 32 }}
            >
              {!hasInput && (
                <span className="text-sm font-mono text-muted-foreground text-center px-4">
                  {preset === "wifi" ? "Enter SSID above to generate a QR code" : "Enter text above to generate a QR code"}
                </span>
              )}

              {hasInput && loading && (
                <span className="text-sm font-mono text-muted-foreground animate-pulse">
                  Generating...
                </span>
              )}

              {hasInput && error && !loading && (
                <div className="flex flex-col items-center gap-2 px-4">
                  <span className="text-sm font-mono text-destructive text-center">
                    {error}
                  </span>
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                  >
                    Retry
                  </button>
                </div>
              )}

              {qrUrl && (
                <img
                  ref={imgRef}
                  src={qrUrl}
                  alt="QR Code"
                  width={size}
                  height={size}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={imageLoaded && !error ? "block" : "hidden"}
                />
              )}
            </div>

            {/* Error message below the display area */}
            {error && !loading && hasInput && (
              <p className="text-sm font-mono text-destructive">{error}</p>
            )}

            {/* Action buttons */}
            {imageLoaded && !error && (
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                >
                  Download PNG
                </button>
                <button
                  onClick={handleCopyUrl}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors border border-border"
                >
                  {copied ? "Copied!" : "Copy URL"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QRCodeTool;
