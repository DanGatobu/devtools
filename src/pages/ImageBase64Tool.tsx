import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useRef, useCallback } from "react";

const ImageBase64Tool = () => {
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [base64Output, setBase64Output] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const processFile = (file: File) => {
    setError("");
    setBase64Output("");
    setFileInfo(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setFileInfo({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    });

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64Output(result);
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(base64Output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleDecodeBase64 = () => {
    setError("");
    setImagePreview("");

    if (!base64Input.trim()) {
      setError("Please paste a Base64 string.");
      return;
    }

    let src = base64Input.trim();
    if (!src.startsWith("data:image/")) {
      src = "data:image/png;base64," + src;
    }

    const img = new Image();
    img.onload = () => {
      setImagePreview(src);
    };
    img.onerror = () => {
      setError("Invalid Base64 string or not a valid image.");
    };
    img.src = src;
  };

  return (
    <Layout>
      <SEO title="Image to Base64 Converter" description="Convert images to Base64 strings and decode Base64 back to images. Supports drag and drop." canonical="/image-base64" keywords="image to base64, base64 to image, image encoder, base64 image converter" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Image Base64 Tool</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab("encode"); setError(""); }}
            className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
              activeTab === "encode"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Image to Base64
          </button>
          <button
            onClick={() => { setActiveTab("decode"); setError(""); }}
            className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
              activeTab === "decode"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Base64 to Image
          </button>
        </div>

        {activeTab === "encode" && (
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Upload Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary hover:border-primary/50"
              }`}
            >
              <p className="text-muted-foreground font-mono text-sm">
                Drag & drop an image here, or click to select a file
              </p>
            </div>

            {fileInfo && (
              <div className="mt-4 p-3 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-mono text-foreground">
                  <span className="text-muted-foreground">Name:</span> {fileInfo.name}
                </p>
                <p className="text-sm font-mono text-foreground">
                  <span className="text-muted-foreground">Size:</span> {fileInfo.size}
                </p>
                <p className="text-sm font-mono text-foreground">
                  <span className="text-muted-foreground">Type:</span> {fileInfo.type}
                </p>
              </div>
            )}

            {error && <p className="text-destructive text-sm font-mono mt-2">{error}</p>}

            {base64Output && (
              <div className="mt-4">
                <label className="text-sm font-mono text-muted-foreground mb-2 block">
                  Base64 Output
                </label>
                <textarea
                  value={base64Output}
                  readOnly
                  className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleCopy}
                  className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "decode" && (
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Base64 String
            </label>
            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Paste a Base64-encoded image string..."
            />
            <button
              onClick={handleDecodeBase64}
              className="mt-3 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Decode
            </button>

            {error && <p className="text-destructive text-sm font-mono mt-2">{error}</p>}

            {imagePreview && (
              <div className="mt-4">
                <label className="text-sm font-mono text-muted-foreground mb-2 block">
                  Image Preview
                </label>
                <div className="bg-secondary rounded-lg border border-border p-4">
                  <img
                    src={imagePreview}
                    alt="Decoded preview"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ImageBase64Tool;
