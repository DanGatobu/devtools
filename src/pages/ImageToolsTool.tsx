import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useRef, useCallback } from "react";

type Tab = "compress" | "resize" | "convert" | "crop" | "rotate" | "filters" | "exif";

interface ImageFile {
  file: File;
  url: string;
  width: number;
  height: number;
  img: HTMLImageElement;
}

interface ExifData {
  [key: string]: string | number | undefined;
}

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "compress", label: "Compress" },
  { id: "resize", label: "Resize" },
  { id: "convert", label: "Convert" },
  { id: "crop", label: "Crop" },
  { id: "rotate", label: "Rotate & Flip" },
  { id: "filters", label: "Filters" },
  { id: "exif", label: "EXIF Viewer" },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function DropZone({
  onFile,
  fileName,
  fileSize,
  fileDimensions,
}: {
  onFile: (file: File) => void;
  fileName?: string;
  fileSize?: number;
  fileDimensions?: { w: number; h: number };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | undefined) => {
    if (f && f.type.startsWith("image/")) onFile(f);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        dragOver ? "border-primary" : "border-border hover:border-primary"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {fileName ? (
        <div className="font-mono text-sm text-foreground">
          <p className="font-bold">{fileName}</p>
          {fileSize !== undefined && <p className="text-muted-foreground">{formatBytes(fileSize)}</p>}
          {fileDimensions && (
            <p className="text-muted-foreground">
              {fileDimensions.w} x {fileDimensions.h}
            </p>
          )}
        </div>
      ) : (
        <p className="font-mono text-sm text-muted-foreground">
          Drop an image here or click to upload
        </p>
      )}
    </div>
  );
}

function useImageUpload() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageFile({ file, url, width: img.naturalWidth, height: img.naturalHeight, img });
    };
    img.src = url;
  }, []);

  return { imageFile, loadFile, setImageFile };
}

// --- Compress Tab ---
function CompressTab() {
  const { imageFile, loadFile } = useImageUpload();
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  const compress = useCallback(() => {
    if (!imageFile) return;
    const canvas = document.createElement("canvas");
    canvas.width = imageFile.width;
    canvas.height = imageFile.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageFile.img, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          if (result?.url) URL.revokeObjectURL(result.url);
          setResult({ blob, url: URL.createObjectURL(blob) });
        }
      },
      "image/jpeg",
      quality / 100
    );
  }, [imageFile, quality, result?.url]);

  return (
    <div className="space-y-4">
      <DropZone
        onFile={loadFile}
        fileName={imageFile?.file.name}
        fileSize={imageFile?.file.size}
        fileDimensions={imageFile ? { w: imageFile.width, h: imageFile.height } : undefined}
      />
      {imageFile && (
        <>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-1 block">
              Quality: {quality}%
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={compress}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Compress
          </button>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-sm font-mono text-muted-foreground mb-2">Original</p>
              <img src={imageFile.url} alt="Original" className="max-w-full max-h-64 mx-auto" />
              <p className="text-sm font-mono text-muted-foreground mt-2">
                {formatBytes(imageFile.file.size)}
              </p>
            </div>
            {result && (
              <div className="bg-secondary rounded-lg border border-border p-4">
                <p className="text-sm font-mono text-muted-foreground mb-2">Compressed</p>
                <img src={result.url} alt="Compressed" className="max-w-full max-h-64 mx-auto" />
                <p className="text-sm font-mono text-muted-foreground mt-2">
                  {formatBytes(result.blob.size)} (
                  {((1 - result.blob.size / imageFile.file.size) * 100).toFixed(1)}% reduction)
                </p>
                <button
                  onClick={() => downloadBlob(result.blob, "compressed_" + imageFile.file.name)}
                  className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// --- Resize Tab ---
function ResizeTab() {
  const { imageFile, loadFile } = useImageUpload();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [method, setMethod] = useState<"fit" | "fill">("fit");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const aspectRef = useRef(1);

  const handleFile = useCallback(
    (file: File) => {
      loadFile(file);
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        aspectRef.current = img.naturalWidth / img.naturalHeight;
      };
      img.src = url;
    },
    [loadFile]
  );

  const handleWidth = (v: number) => {
    setWidth(v);
    if (keepAspect) setHeight(Math.round(v / aspectRef.current));
  };

  const handleHeight = (v: number) => {
    setHeight(v);
    if (keepAspect) setWidth(Math.round(v * aspectRef.current));
  };

  const resize = useCallback(() => {
    if (!imageFile) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    if (method === "fit") {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imageFile.img, 0, 0, width, height);
    } else {
      canvas.width = width;
      canvas.height = height;
      const scale = Math.max(width / imageFile.width, height / imageFile.height);
      const sw = imageFile.width * scale;
      const sh = imageFile.height * scale;
      const sx = (width - sw) / 2;
      const sy = (height - sh) / 2;
      ctx.drawImage(imageFile.img, sx, sy, sw, sh);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        if (result?.url) URL.revokeObjectURL(result.url);
        setResult({ blob, url: URL.createObjectURL(blob) });
      }
    }, "image/png");
  }, [imageFile, width, height, method, result?.url]);

  return (
    <div className="space-y-4">
      <DropZone
        onFile={handleFile}
        fileName={imageFile?.file.name}
        fileSize={imageFile?.file.size}
        fileDimensions={imageFile ? { w: imageFile.width, h: imageFile.height } : undefined}
      />
      {imageFile && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidth(Number(e.target.value))}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeight(Number(e.target.value))}
                className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-mono text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={keepAspect}
                onChange={(e) => setKeepAspect(e.target.checked)}
              />
              Maintain aspect ratio
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMethod("fit")}
                className={`px-4 py-2 rounded-md font-mono text-sm ${
                  method === "fit"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Fit
              </button>
              <button
                onClick={() => setMethod("fill")}
                className={`px-4 py-2 rounded-md font-mono text-sm ${
                  method === "fill"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Fill
              </button>
            </div>
          </div>
          <button
            onClick={resize}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Resize
          </button>
          {result && (
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-sm font-mono text-muted-foreground mb-2">
                Resized ({width} x {height})
              </p>
              <img src={result.url} alt="Resized" className="max-w-full max-h-64 mx-auto" />
              <button
                onClick={() => downloadBlob(result.blob, "resized_" + imageFile.file.name)}
                className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
              >
                Download
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Convert Tab ---
function ConvertTab() {
  const { imageFile, loadFile } = useImageUpload();
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  const convert = useCallback(() => {
    if (!imageFile) return;
    const canvas = document.createElement("canvas");
    canvas.width = imageFile.width;
    canvas.height = imageFile.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageFile.img, 0, 0);
    const q = format === "image/png" ? undefined : quality / 100;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          if (result?.url) URL.revokeObjectURL(result.url);
          setResult({ blob, url: URL.createObjectURL(blob) });
        }
      },
      format,
      q
    );
  }, [imageFile, format, quality, result?.url]);

  const extMap: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
  };

  return (
    <div className="space-y-4">
      <DropZone
        onFile={loadFile}
        fileName={imageFile?.file.name}
        fileSize={imageFile?.file.size}
        fileDimensions={imageFile ? { w: imageFile.width, h: imageFile.height } : undefined}
      />
      {imageFile && (
        <>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-1 block">
              Target Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>
          {format !== "image/png" && (
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1 block">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          <button
            onClick={convert}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Convert
          </button>
          {result && (
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-sm font-mono text-muted-foreground mb-2">
                Converted ({formatBytes(result.blob.size)})
              </p>
              <img src={result.url} alt="Converted" className="max-w-full max-h-64 mx-auto" />
              <button
                onClick={() => {
                  const base = imageFile.file.name.replace(/\.[^.]+$/, "");
                  downloadBlob(result.blob, base + extMap[format]);
                }}
                className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
              >
                Download
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Crop Tab ---
function CropTab() {
  const { imageFile, loadFile } = useImageUpload();
  const containerRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  const getRelativePos = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const pos = getRelativePos(e);
    startRef.current = pos;
    setCrop({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const pos = getRelativePos(e);
    const x = Math.min(startRef.current.x, pos.x);
    const y = Math.min(startRef.current.y, pos.y);
    const w = Math.abs(pos.x - startRef.current.x);
    const h = Math.abs(pos.y - startRef.current.y);
    setCrop({ x, y, w, h });
  };

  const onMouseUp = () => setDragging(false);

  const applyCrop = useCallback(() => {
    if (!imageFile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const imgEl = containerRef.current.querySelector("img");
    if (!imgEl) return;
    const imgRect = imgEl.getBoundingClientRect();

    const scaleX = imageFile.width / imgRect.width;
    const scaleY = imageFile.height / imgRect.height;
    const offsetX = imgRect.left - rect.left;
    const offsetY = imgRect.top - rect.top;

    const sx = Math.max(0, (crop.x - offsetX) * scaleX);
    const sy = Math.max(0, (crop.y - offsetY) * scaleY);
    const sw = Math.min(imageFile.width - sx, crop.w * scaleX);
    const sh = Math.min(imageFile.height - sy, crop.h * scaleY);

    if (sw <= 0 || sh <= 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageFile.img, sx, sy, sw, sh, 0, 0, sw, sh);
    canvas.toBlob((blob) => {
      if (blob) {
        if (result?.url) URL.revokeObjectURL(result.url);
        setResult({ blob, url: URL.createObjectURL(blob) });
      }
    }, "image/png");
  }, [imageFile, crop, result?.url]);

  return (
    <div className="space-y-4">
      <DropZone
        onFile={loadFile}
        fileName={imageFile?.file.name}
        fileSize={imageFile?.file.size}
        fileDimensions={imageFile ? { w: imageFile.width, h: imageFile.height } : undefined}
      />
      {imageFile && (
        <>
          <p className="text-sm font-mono text-muted-foreground">
            Click and drag on the image to select a crop area.
            {crop.w > 0 && crop.h > 0 && ` Selection: ${Math.round(crop.w)} x ${Math.round(crop.h)}`}
          </p>
          <div
            ref={containerRef}
            className="relative inline-block cursor-crosshair select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <img
              src={imageFile.url}
              alt="Crop source"
              className="max-w-full max-h-96"
              draggable={false}
            />
            {crop.w > 0 && crop.h > 0 && (
              <div
                className="absolute border-2 border-primary bg-primary/20 pointer-events-none"
                style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={applyCrop}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Apply Crop
            </button>
          </div>
          {result && (
            <div className="bg-secondary rounded-lg border border-border p-4">
              <p className="text-sm font-mono text-muted-foreground mb-2">Cropped</p>
              <img src={result.url} alt="Cropped" className="max-w-full max-h-64 mx-auto" />
              <button
                onClick={() => downloadBlob(result.blob, "cropped_" + imageFile.file.name)}
                className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
              >
                Download
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Rotate & Flip Tab ---
function RotateFlipTab() {
  const { imageFile, loadFile } = useImageUpload();
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const currentImg = useRef<HTMLImageElement | null>(null);

  const applyTransform = useCallback(
    (transformFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => { cw: number; ch: number }) => {
      const img = currentImg.current || imageFile?.img;
      if (!img) return;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = img.naturalWidth || img.width;
      tempCanvas.height = img.naturalHeight || img.height;
      const tempCtx = tempCanvas.getContext("2d")!;
      tempCtx.drawImage(img, 0, 0);

      const srcW = tempCanvas.width;
      const srcH = tempCanvas.height;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const { cw, ch } = transformFn(ctx, srcW, srcH);
      canvas.width = cw;
      canvas.height = ch;

      transformFn(ctx, srcW, srcH);
      ctx.drawImage(tempCanvas, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          if (result?.url) URL.revokeObjectURL(result.url);
          const url = URL.createObjectURL(blob);
          const newImg = new Image();
          newImg.onload = () => {
            currentImg.current = newImg;
          };
          newImg.src = url;
          setResult({ blob, url });
        }
      }, "image/png");
    },
    [imageFile, result?.url]
  );

  const rotateCW = () =>
    applyTransform((ctx, w, h) => {
      ctx.canvas.width = h;
      ctx.canvas.height = w;
      ctx.translate(h, 0);
      ctx.rotate(Math.PI / 2);
      return { cw: h, ch: w };
    });

  const rotateCCW = () =>
    applyTransform((ctx, w, h) => {
      ctx.canvas.width = h;
      ctx.canvas.height = w;
      ctx.translate(0, w);
      ctx.rotate(-Math.PI / 2);
      return { cw: h, ch: w };
    });

  const rotate180 = () =>
    applyTransform((ctx, w, h) => {
      ctx.canvas.width = w;
      ctx.canvas.height = h;
      ctx.translate(w, h);
      ctx.rotate(Math.PI);
      return { cw: w, ch: h };
    });

  const flipH = () =>
    applyTransform((ctx, w, h) => {
      ctx.canvas.width = w;
      ctx.canvas.height = h;
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      return { cw: w, ch: h };
    });

  const flipV = () =>
    applyTransform((ctx, w, h) => {
      ctx.canvas.width = w;
      ctx.canvas.height = h;
      ctx.translate(0, h);
      ctx.scale(1, -1);
      return { cw: w, ch: h };
    });

  const handleFile = (file: File) => {
    currentImg.current = null;
    setResult(null);
    loadFile(file);
  };

  return (
    <div className="space-y-4">
      <DropZone
        onFile={handleFile}
        fileName={imageFile?.file.name}
        fileSize={imageFile?.file.size}
        fileDimensions={imageFile ? { w: imageFile.width, h: imageFile.height } : undefined}
      />
      {imageFile && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={rotateCW}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Rotate 90° CW
            </button>
            <button
              onClick={rotateCCW}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Rotate 90° CCW
            </button>
            <button
              onClick={rotate180}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Rotate 180°
            </button>
            <button
              onClick={flipH}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Flip Horizontal
            </button>
            <button
              onClick={flipV}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Flip Vertical
            </button>
          </div>
          <div className="bg-secondary rounded-lg border border-border p-4">
            <p className="text-sm font-mono text-muted-foreground mb-2">Preview</p>
            <img
              src={result?.url || imageFile.url}
              alt="Preview"
              className="max-w-full max-h-64 mx-auto"
            />
          </div>
          {result && (
            <button
              onClick={() => downloadBlob(result.blob, "transformed_" + imageFile.file.name)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Download
            </button>
          )}
        </>
      )}
    </div>
  );
}

// --- Filters Tab ---
function FiltersTab() {
  const { imageFile, loadFile } = useImageUpload();
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawToCanvas = useCallback(() => {
    if (!imageFile || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = imageFile.width;
    canvas.height = imageFile.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageFile.img, 0, 0);
  }, [imageFile]);

  const handleFile = (file: File) => {
    setResult(null);
    loadFile(file);
  };

  const getSourceCanvas = (): HTMLCanvasElement => {
    if (result) {
      const c = document.createElement("canvas");
      const img = new Image();
      img.src = result.url;
      c.width = img.naturalWidth || imageFile!.width;
      c.height = img.naturalHeight || imageFile!.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return c;
    }
    const c = document.createElement("canvas");
    c.width = imageFile!.width;
    c.height = imageFile!.height;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(imageFile!.img, 0, 0);
    return c;
  };

  const applyPixelFilter = (fn: (data: ImageData) => void) => {
    if (!imageFile) return;
    const source = getSourceCanvas();
    const ctx = source.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, source.width, source.height);
    fn(imageData);
    ctx.putImageData(imageData, 0, 0);
    source.toBlob((blob) => {
      if (blob) {
        if (result?.url) URL.revokeObjectURL(result.url);
        setResult({ blob, url: URL.createObjectURL(blob) });
      }
    }, "image/png");
  };

  const applyCanvasFilter = (filter: string) => {
    if (!imageFile) return;
    const canvas = document.createElement("canvas");
    const srcImg = result ? (() => { const i = new Image(); i.src = result.url; return i; })() : imageFile.img;
    canvas.width = imageFile.width;
    canvas.height = imageFile.height;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = filter;
    ctx.drawImage(srcImg, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        if (result?.url) URL.revokeObjectURL(result.url);
        setResult({ blob, url: URL.createObjectURL(blob) });
      }
    }, "image/png");
  };

  const grayscale = () =>
    applyPixelFilter((data) => {
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const avg = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        d[i] = d[i + 1] = d[i + 2] = avg;
      }
    });

  const sepia = () =>
    applyPixelFilter((data) => {
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        d[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        d[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        d[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
    });

  const invert = () =>
    applyPixelFilter((data) => {
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i] = 255 - d[i];
        d[i + 1] = 255 - d[i + 1];
        d[i + 2] = 255 - d[i + 2];
      }
    });

  const blur = () => applyCanvasFilter("blur(4px)");
  const brightnessUp = () => applyCanvasFilter("brightness(1.2)");
  const brightnessDown = () => applyCanvasFilter("brightness(0.8)");
  const contrastUp = () => applyCanvasFilter("contrast(1.3)");
  const contrastDown = () => applyCanvasFilter("contrast(0.7)");

  const resetFilters = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    drawToCanvas();
  };

  return (
    <div className="space-y-4">
      <DropZone
        onFile={handleFile}
        fileName={imageFile?.file.name}
        fileSize={imageFile?.file.size}
        fileDimensions={imageFile ? { w: imageFile.width, h: imageFile.height } : undefined}
      />
      {imageFile && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={grayscale}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Grayscale
            </button>
            <button
              onClick={sepia}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Sepia
            </button>
            <button
              onClick={invert}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Invert
            </button>
            <button
              onClick={blur}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Blur
            </button>
            <button
              onClick={brightnessUp}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Brightness +
            </button>
            <button
              onClick={brightnessDown}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Brightness -
            </button>
            <button
              onClick={contrastUp}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Contrast +
            </button>
            <button
              onClick={contrastDown}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Contrast -
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="bg-secondary rounded-lg border border-border p-4">
            <p className="text-sm font-mono text-muted-foreground mb-2">Preview</p>
            <img
              src={result?.url || imageFile.url}
              alt="Filtered"
              className="max-w-full max-h-64 mx-auto"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          {result && (
            <button
              onClick={() => downloadBlob(result.blob, "filtered_" + imageFile.file.name)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Download
            </button>
          )}
        </>
      )}
    </div>
  );
}

// --- EXIF Viewer Tab ---
function parseExif(buffer: ArrayBuffer): ExifData {
  const view = new DataView(buffer);
  const data: ExifData = {};

  if (view.getUint16(0) !== 0xffd8) return { error: "Not a JPEG file" };

  let offset = 2;
  while (offset < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint16(offset);
    if (marker === 0xffe1) {
      const length = view.getUint16(offset + 2);
      const exifStart = offset + 4;

      const exifHeader =
        String.fromCharCode(view.getUint8(exifStart)) +
        String.fromCharCode(view.getUint8(exifStart + 1)) +
        String.fromCharCode(view.getUint8(exifStart + 2)) +
        String.fromCharCode(view.getUint8(exifStart + 3));

      if (exifHeader !== "Exif") return { error: "No EXIF data found" };

      const tiffStart = exifStart + 6;
      const byteOrder = view.getUint16(tiffStart);
      const littleEndian = byteOrder === 0x4949;

      const get16 = (o: number) => view.getUint16(o, littleEndian);
      const get32 = (o: number) => view.getUint32(o, littleEndian);

      const ifdOffset = get32(tiffStart + 4);
      const ifd0Start = tiffStart + ifdOffset;
      const entryCount = get16(ifd0Start);

      const tagNames: Record<number, string> = {
        0x010f: "Camera Make",
        0x0110: "Camera Model",
        0x0132: "Date/Time",
        0x829a: "Exposure Time",
        0x8827: "ISO",
        0x920a: "Focal Length",
        0x8825: "GPS IFD",
        0x0112: "Orientation",
        0xa002: "Image Width",
        0xa003: "Image Height",
      };

      const readString = (valueOffset: number, count: number): string => {
        let str = "";
        for (let i = 0; i < count - 1; i++) {
          str += String.fromCharCode(view.getUint8(valueOffset + i));
        }
        return str;
      };

      const readRational = (valueOffset: number): string => {
        const num = get32(valueOffset);
        const den = get32(valueOffset + 4);
        return den === 0 ? "0" : (num / den).toFixed(4);
      };

      let exifIfdOffset = 0;
      let gpsIfdOffset = 0;

      for (let i = 0; i < entryCount; i++) {
        const entryOffset = ifd0Start + 2 + i * 12;
        const tag = get16(entryOffset);
        const type = get16(entryOffset + 2);
        const count = get32(entryOffset + 4);
        const valueField = entryOffset + 8;

        if (tag === 0x8769) {
          exifIfdOffset = tiffStart + get32(valueField);
          continue;
        }
        if (tag === 0x8825) {
          gpsIfdOffset = tiffStart + get32(valueField);
          continue;
        }

        const name = tagNames[tag];
        if (!name) continue;

        if (type === 2) {
          const strOffset = count > 4 ? tiffStart + get32(valueField) : valueField;
          data[name] = readString(strOffset, count);
        } else if (type === 3) {
          data[name] = get16(valueField);
        } else if (type === 4) {
          data[name] = get32(valueField);
        } else if (type === 5) {
          const ratOffset = tiffStart + get32(valueField);
          data[name] = readRational(ratOffset);
        }
      }

      // Parse sub-EXIF IFD
      if (exifIfdOffset) {
        const subCount = get16(exifIfdOffset);
        for (let i = 0; i < subCount; i++) {
          const entryOffset = exifIfdOffset + 2 + i * 12;
          if (entryOffset + 12 > view.byteLength) break;
          const tag = get16(entryOffset);
          const type = get16(entryOffset + 2);
          const count = get32(entryOffset + 4);
          const valueField = entryOffset + 8;

          const name = tagNames[tag];
          if (!name) continue;

          if (type === 2) {
            const strOffset = count > 4 ? tiffStart + get32(valueField) : valueField;
            data[name] = readString(strOffset, count);
          } else if (type === 3) {
            data[name] = get16(valueField);
          } else if (type === 4) {
            data[name] = get32(valueField);
          } else if (type === 5) {
            const ratOffset = tiffStart + get32(valueField);
            data[name] = readRational(ratOffset);
          }
        }
      }

      // Parse GPS IFD
      if (gpsIfdOffset) {
        const gpsCount = get16(gpsIfdOffset);
        const gpsTagNames: Record<number, string> = {
          0x0001: "GPS Latitude Ref",
          0x0002: "GPS Latitude",
          0x0003: "GPS Longitude Ref",
          0x0004: "GPS Longitude",
          0x0005: "GPS Altitude Ref",
          0x0006: "GPS Altitude",
        };

        const readGpsCoord = (ratOffset: number): string => {
          const deg = get32(ratOffset) / get32(ratOffset + 4);
          const min = get32(ratOffset + 8) / get32(ratOffset + 12);
          const sec = get32(ratOffset + 16) / get32(ratOffset + 20);
          return `${deg.toFixed(0)}° ${min.toFixed(0)}' ${sec.toFixed(2)}"`;
        };

        for (let i = 0; i < gpsCount; i++) {
          const entryOffset = gpsIfdOffset + 2 + i * 12;
          if (entryOffset + 12 > view.byteLength) break;
          const tag = get16(entryOffset);
          const type = get16(entryOffset + 2);
          const count = get32(entryOffset + 4);
          const valueField = entryOffset + 8;

          const name = gpsTagNames[tag];
          if (!name) continue;

          if (type === 2) {
            const strOffset = count > 4 ? tiffStart + get32(valueField) : valueField;
            data[name] = readString(strOffset, count);
          } else if (type === 5 && count === 3) {
            const ratOffset = tiffStart + get32(valueField);
            data[name] = readGpsCoord(ratOffset);
          } else if (type === 5) {
            const ratOffset = tiffStart + get32(valueField);
            data[name] = readRational(ratOffset);
          } else if (type === 1) {
            data[name] = view.getUint8(valueField);
          }
        }
      }

      return data;
    }

    const segLen = view.getUint16(offset + 2);
    offset += 2 + segLen;
  }

  return { error: "No EXIF data found" };
}

function ExifTab() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [exifData, setExifData] = useState<ExifData | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        setExifData(parseExif(reader.result));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={handleFile} fileName={fileName} fileSize={fileSize || undefined} />
      {exifData && (
        <div className="bg-secondary rounded-lg border border-border p-4">
          <p className="text-sm font-mono text-muted-foreground mb-3">EXIF Data</p>
          {exifData.error ? (
            <p className="text-sm font-mono text-foreground">{String(exifData.error)}</p>
          ) : (
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground">Property</th>
                  <th className="text-left py-2 text-muted-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(exifData)
                  .filter(([, v]) => v !== undefined)
                  .map(([key, value]) => (
                    <tr key={key} className="border-b border-border">
                      <td className="py-2 text-foreground">{key}</td>
                      <td className="py-2 text-foreground">{String(value)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
const ImageToolsTool = () => {
  const [activeTab, setActiveTab] = useState<Tab>("compress");

  return (
    <Layout>
      <SEO title="Image Tools" description="Compress, resize, convert, crop, rotate images and apply filters. All processing done in your browser." canonical="/image-tools" keywords="image compressor, image resizer, image converter, crop image online, rotate image" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Image Tools</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "compress" && <CompressTab />}
        {activeTab === "resize" && <ResizeTab />}
        {activeTab === "convert" && <ConvertTab />}
        {activeTab === "crop" && <CropTab />}
        {activeTab === "rotate" && <RotateFlipTab />}
        {activeTab === "filters" && <FiltersTab />}
        {activeTab === "exif" && <ExifTab />}
      </div>
    </Layout>
  );
};

export default ImageToolsTool;
