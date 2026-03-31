import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const TABS = [
  "YouTube Thumbnail",
  "OG Meta Generator",
  "Twitter Card Generator",
  "Social Image Size Guide",
  "Meta Tag Generator",
  "Emoji Picker",
] as const;

type Tab = (typeof TABS)[number];

/* ------------------------------------------------------------------ */
/*  YouTube Thumbnail Tab                                             */
/* ------------------------------------------------------------------ */

const THUMB_QUALITIES = [
  { label: "Default (120x90)", file: "default" },
  { label: "Medium (320x180)", file: "mqdefault" },
  { label: "High (480x360)", file: "hqdefault" },
  { label: "Standard (640x480)", file: "sddefault" },
  { label: "Max Resolution (1280x720)", file: "maxresdefault" },
];

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

function YouTubeThumbnailTab() {
  const [url, setUrl] = useState("");
  const videoId = url ? extractVideoId(url) : null;

  const handleDownload = async (file: string) => {
    if (!videoId) return;
    const src = `https://img.youtube.com/vi/${videoId}/${file}.jpg`;
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${videoId}_${file}.jpg`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-mono text-muted-foreground block">YouTube URL or Video ID</label>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {videoId && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {THUMB_QUALITIES.map((q) => {
            const src = `https://img.youtube.com/vi/${videoId}/${q.file}.jpg`;
            return (
              <div key={q.file} className="bg-secondary rounded-lg border border-border p-4">
                <p className="text-sm font-mono text-muted-foreground mb-2">{q.label}</p>
                <a href={src} target="_blank" rel="noopener noreferrer">
                  <img src={src} alt={q.label} className="w-full rounded-md border border-border" />
                </a>
                <button
                  onClick={() => handleDownload(q.file)}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity mt-2 w-full"
                >
                  Download
                </button>
              </div>
            );
          })}
        </div>
      )}
      {url && !videoId && (
        <p className="text-sm font-mono text-destructive">Could not extract a video ID from this URL.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OG Meta Generator Tab                                             */
/* ------------------------------------------------------------------ */

function OGMetaGeneratorTab() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    image: "",
    siteName: "",
    type: "website",
    locale: "en_US",
  });
  const [copied, setCopied] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const code = [
    `<meta property="og:title" content="${form.title}" />`,
    `<meta property="og:description" content="${form.description}" />`,
    `<meta property="og:url" content="${form.url}" />`,
    `<meta property="og:image" content="${form.image}" />`,
    `<meta property="og:site_name" content="${form.siteName}" />`,
    `<meta property="og:type" content="${form.type}" />`,
    `<meta property="og:locale" content="${form.locale}" />`,
  ].join("\n");

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["title", "Title"],
          ["description", "Description"],
          ["url", "URL"],
          ["image", "Image URL"],
          ["siteName", "Site Name"],
        ].map(([k, l]) => (
          <div key={k}>
            <label className="text-sm font-mono text-muted-foreground mb-1 block">{l}</label>
            <input
              value={(form as Record<string, string>)[k]}
              onChange={(e) => set(k, e.target.value)}
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1 block">Type</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="website">website</option>
            <option value="article">article</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1 block">Locale</label>
          <input
            value={form.locale}
            onChange={(e) => set("locale", e.target.value)}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Preview */}
      <p className="text-sm font-mono text-muted-foreground mt-4">Facebook / LinkedIn Preview</p>
      <div className="bg-secondary rounded-lg border border-border overflow-hidden max-w-md">
        {form.image && (
          <img src={form.image} alt="og preview" className="w-full h-48 object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
        )}
        <div className="p-3">
          <p className="text-xs font-mono text-muted-foreground uppercase">{form.siteName || "example.com"}</p>
          <p className="text-sm font-mono font-bold text-foreground mt-1 line-clamp-2">{form.title || "Page Title"}</p>
          <p className="text-xs font-mono text-muted-foreground mt-1 line-clamp-2">{form.description || "Page description goes here."}</p>
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">{code}</pre>
        <button
          onClick={copy}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity absolute top-2 right-2"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Twitter Card Generator Tab                                        */
/* ------------------------------------------------------------------ */

function TwitterCardGeneratorTab() {
  const [form, setForm] = useState({
    card: "summary_large_image",
    title: "",
    description: "",
    image: "",
    site: "",
    creator: "",
  });
  const [copied, setCopied] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const code = [
    `<meta name="twitter:card" content="${form.card}" />`,
    `<meta name="twitter:title" content="${form.title}" />`,
    `<meta name="twitter:description" content="${form.description}" />`,
    `<meta name="twitter:image" content="${form.image}" />`,
    `<meta name="twitter:site" content="${form.site}" />`,
    `<meta name="twitter:creator" content="${form.creator}" />`,
  ].join("\n");

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isLarge = form.card === "summary_large_image";

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1 block">Card Type</label>
          <select
            value={form.card}
            onChange={(e) => set("card", e.target.value)}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="summary">summary</option>
            <option value="summary_large_image">summary_large_image</option>
          </select>
        </div>
        {[
          ["title", "Title"],
          ["description", "Description"],
          ["image", "Image URL"],
          ["site", "Site @handle"],
          ["creator", "Creator @handle"],
        ].map(([k, l]) => (
          <div key={k}>
            <label className="text-sm font-mono text-muted-foreground mb-1 block">{l}</label>
            <input
              value={(form as Record<string, string>)[k]}
              onChange={(e) => set(k, e.target.value)}
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
      </div>

      {/* Preview */}
      <p className="text-sm font-mono text-muted-foreground mt-4">Twitter / X Preview</p>
      <div className="bg-secondary rounded-lg border border-border overflow-hidden max-w-md">
        {isLarge && form.image && (
          <img src={form.image} alt="twitter preview" className="w-full h-48 object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
        )}
        <div className={`p-3 flex ${!isLarge ? "gap-3" : ""}`}>
          {!isLarge && form.image && (
            <img src={form.image} alt="twitter preview" className="w-24 h-24 object-cover rounded-md flex-shrink-0" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          )}
          <div>
            <p className="text-sm font-mono font-bold text-foreground line-clamp-1">{form.title || "Card Title"}</p>
            <p className="text-xs font-mono text-muted-foreground mt-1 line-clamp-2">{form.description || "Card description goes here."}</p>
            <p className="text-xs font-mono text-muted-foreground mt-1">{form.site || "@site"}</p>
          </div>
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">{code}</pre>
        <button
          onClick={copy}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity absolute top-2 right-2"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Social Image Size Guide Tab                                       */
/* ------------------------------------------------------------------ */

const SIZE_DATA: { platform: string; type: string; dimensions: string; aspect: string }[] = [
  { platform: "Facebook", type: "Profile Photo", dimensions: "170 x 170", aspect: "1:1" },
  { platform: "Facebook", type: "Cover Photo", dimensions: "820 x 312", aspect: "2.63:1" },
  { platform: "Facebook", type: "Post Image", dimensions: "1200 x 630", aspect: "1.91:1" },
  { platform: "Facebook", type: "Story", dimensions: "1080 x 1920", aspect: "9:16" },
  { platform: "Facebook", type: "Ad Image", dimensions: "1200 x 628", aspect: "1.91:1" },
  { platform: "Instagram", type: "Profile Photo", dimensions: "320 x 320", aspect: "1:1" },
  { platform: "Instagram", type: "Post (Square)", dimensions: "1080 x 1080", aspect: "1:1" },
  { platform: "Instagram", type: "Post (Landscape)", dimensions: "1080 x 566", aspect: "1.91:1" },
  { platform: "Instagram", type: "Post (Portrait)", dimensions: "1080 x 1350", aspect: "4:5" },
  { platform: "Instagram", type: "Story", dimensions: "1080 x 1920", aspect: "9:16" },
  { platform: "Instagram", type: "Reel", dimensions: "1080 x 1920", aspect: "9:16" },
  { platform: "Twitter / X", type: "Profile Photo", dimensions: "400 x 400", aspect: "1:1" },
  { platform: "Twitter / X", type: "Header", dimensions: "1500 x 500", aspect: "3:1" },
  { platform: "Twitter / X", type: "Post Image", dimensions: "1200 x 675", aspect: "16:9" },
  { platform: "LinkedIn", type: "Profile Photo", dimensions: "400 x 400", aspect: "1:1" },
  { platform: "LinkedIn", type: "Cover Photo", dimensions: "1584 x 396", aspect: "4:1" },
  { platform: "LinkedIn", type: "Post Image", dimensions: "1200 x 627", aspect: "1.91:1" },
  { platform: "YouTube", type: "Thumbnail", dimensions: "1280 x 720", aspect: "16:9" },
  { platform: "YouTube", type: "Channel Art", dimensions: "2560 x 1440", aspect: "16:9" },
  { platform: "YouTube", type: "Banner", dimensions: "2048 x 1152", aspect: "16:9" },
  { platform: "TikTok", type: "Profile Photo", dimensions: "200 x 200", aspect: "1:1" },
  { platform: "TikTok", type: "Video", dimensions: "1080 x 1920", aspect: "9:16" },
  { platform: "Pinterest", type: "Pin", dimensions: "1000 x 1500", aspect: "2:3" },
];

function SocialImageSizeGuideTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full font-mono text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Platform", "Type", "Dimensions (px)", "Aspect Ratio"].map((h) => (
              <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SIZE_DATA.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="py-2 px-3 text-foreground font-bold">{row.platform}</td>
              <td className="py-2 px-3 text-foreground">{row.type}</td>
              <td className="py-2 px-3 text-foreground">{row.dimensions}</td>
              <td className="py-2 px-3 text-muted-foreground">{row.aspect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Meta Tag Generator Tab                                            */
/* ------------------------------------------------------------------ */

function MetaTagGeneratorTab() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    viewport: "width=device-width, initial-scale=1.0",
    charset: "UTF-8",
    robotsIndex: "index",
    robotsFollow: "follow",
    canonical: "",
  });
  const [copied, setCopied] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const lines: string[] = [
    `<meta charset="${form.charset}" />`,
    `<meta name="viewport" content="${form.viewport}" />`,
    `<title>${form.title}</title>`,
    `<meta name="description" content="${form.description}" />`,
  ];
  if (form.keywords) lines.push(`<meta name="keywords" content="${form.keywords}" />`);
  if (form.author) lines.push(`<meta name="author" content="${form.author}" />`);
  lines.push(`<meta name="robots" content="${form.robotsIndex}, ${form.robotsFollow}" />`);
  if (form.canonical) lines.push(`<link rel="canonical" href="${form.canonical}" />`);

  const code = lines.join("\n");

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["title", "Title"],
          ["description", "Description"],
          ["keywords", "Keywords (comma-separated)"],
          ["author", "Author"],
          ["viewport", "Viewport"],
          ["charset", "Charset"],
          ["canonical", "Canonical URL"],
        ].map(([k, l]) => (
          <div key={k}>
            <label className="text-sm font-mono text-muted-foreground mb-1 block">{l}</label>
            <input
              value={(form as Record<string, string>)[k]}
              onChange={(e) => set(k, e.target.value)}
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1 block">Robots Indexing</label>
          <select
            value={form.robotsIndex}
            onChange={(e) => set("robotsIndex", e.target.value)}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="index">index</option>
            <option value="noindex">noindex</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1 block">Robots Follow</label>
          <select
            value={form.robotsFollow}
            onChange={(e) => set("robotsFollow", e.target.value)}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="follow">follow</option>
            <option value="nofollow">nofollow</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <pre className="bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground overflow-x-auto whitespace-pre-wrap">{code}</pre>
        <button
          onClick={copy}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity absolute top-2 right-2"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Emoji Picker Tab                                                  */
/* ------------------------------------------------------------------ */

interface EmojiEntry {
  emoji: string;
  name: string;
  category: string;
}

const EMOJI_DATA: EmojiEntry[] = [
  // Smileys
  { emoji: "\u{1F600}", name: "grinning face", category: "Smileys" },
  { emoji: "\u{1F603}", name: "smiley", category: "Smileys" },
  { emoji: "\u{1F604}", name: "smile", category: "Smileys" },
  { emoji: "\u{1F601}", name: "grin", category: "Smileys" },
  { emoji: "\u{1F606}", name: "laughing", category: "Smileys" },
  { emoji: "\u{1F605}", name: "sweat smile", category: "Smileys" },
  { emoji: "\u{1F602}", name: "joy", category: "Smileys" },
  { emoji: "\u{1F923}", name: "rofl", category: "Smileys" },
  { emoji: "\u{1F60A}", name: "blush", category: "Smileys" },
  { emoji: "\u{1F607}", name: "innocent", category: "Smileys" },
  { emoji: "\u{1F609}", name: "wink", category: "Smileys" },
  { emoji: "\u{1F60D}", name: "heart eyes", category: "Smileys" },
  { emoji: "\u{1F970}", name: "smiling face with hearts", category: "Smileys" },
  { emoji: "\u{1F618}", name: "kissing heart", category: "Smileys" },
  { emoji: "\u{1F61C}", name: "stuck out tongue wink", category: "Smileys" },
  { emoji: "\u{1F92A}", name: "zany face", category: "Smileys" },
  { emoji: "\u{1F928}", name: "raised eyebrow", category: "Smileys" },
  { emoji: "\u{1F914}", name: "thinking", category: "Smileys" },
  { emoji: "\u{1F910}", name: "zipper mouth", category: "Smileys" },
  { emoji: "\u{1F60E}", name: "sunglasses", category: "Smileys" },
  { emoji: "\u{1F615}", name: "confused", category: "Smileys" },
  { emoji: "\u{1F61F}", name: "worried", category: "Smileys" },
  { emoji: "\u{1F622}", name: "cry", category: "Smileys" },
  { emoji: "\u{1F62D}", name: "sob", category: "Smileys" },
  { emoji: "\u{1F624}", name: "triumph", category: "Smileys" },
  { emoji: "\u{1F621}", name: "rage", category: "Smileys" },
  { emoji: "\u{1F631}", name: "scream", category: "Smileys" },
  { emoji: "\u{1F633}", name: "flushed", category: "Smileys" },
  { emoji: "\u{1F634}", name: "sleeping", category: "Smileys" },
  { emoji: "\u{1F60F}", name: "smirk", category: "Smileys" },
  { emoji: "\u{1F973}", name: "partying face", category: "Smileys" },
  { emoji: "\u{1F978}", name: "disguised face", category: "Smileys" },
  { emoji: "\u{1F925}", name: "lying face", category: "Smileys" },
  // People
  { emoji: "\u{1F44D}", name: "thumbs up", category: "People" },
  { emoji: "\u{1F44E}", name: "thumbs down", category: "People" },
  { emoji: "\u{1F44F}", name: "clap", category: "People" },
  { emoji: "\u{1F64C}", name: "raised hands", category: "People" },
  { emoji: "\u{1F64F}", name: "pray", category: "People" },
  { emoji: "\u{1F91D}", name: "handshake", category: "People" },
  { emoji: "\u{270C}\u{FE0F}", name: "victory", category: "People" },
  { emoji: "\u{1F91E}", name: "crossed fingers", category: "People" },
  { emoji: "\u{1F918}", name: "rock on", category: "People" },
  { emoji: "\u{1F44C}", name: "ok hand", category: "People" },
  { emoji: "\u{1F44B}", name: "wave", category: "People" },
  { emoji: "\u{1F4AA}", name: "muscle", category: "People" },
  { emoji: "\u{1F9D1}\u{200D}\u{1F4BB}", name: "technologist", category: "People" },
  { emoji: "\u{1F468}\u{200D}\u{1F4BC}", name: "man office worker", category: "People" },
  { emoji: "\u{1F469}\u{200D}\u{1F4BC}", name: "woman office worker", category: "People" },
  { emoji: "\u{1F9D1}\u{200D}\u{1F3A8}", name: "artist", category: "People" },
  { emoji: "\u{1F9D1}\u{200D}\u{1F680}", name: "astronaut", category: "People" },
  { emoji: "\u{1F477}", name: "construction worker", category: "People" },
  { emoji: "\u{1F478}", name: "princess", category: "People" },
  { emoji: "\u{1F934}", name: "prince", category: "People" },
  { emoji: "\u{1F936}", name: "mrs claus", category: "People" },
  { emoji: "\u{1F385}", name: "santa", category: "People" },
  { emoji: "\u{1F9B8}", name: "superhero", category: "People" },
  // Animals
  { emoji: "\u{1F436}", name: "dog", category: "Animals" },
  { emoji: "\u{1F431}", name: "cat", category: "Animals" },
  { emoji: "\u{1F42D}", name: "mouse", category: "Animals" },
  { emoji: "\u{1F439}", name: "hamster", category: "Animals" },
  { emoji: "\u{1F430}", name: "rabbit", category: "Animals" },
  { emoji: "\u{1F98A}", name: "fox", category: "Animals" },
  { emoji: "\u{1F43B}", name: "bear", category: "Animals" },
  { emoji: "\u{1F43C}", name: "panda", category: "Animals" },
  { emoji: "\u{1F428}", name: "koala", category: "Animals" },
  { emoji: "\u{1F981}", name: "lion", category: "Animals" },
  { emoji: "\u{1F42E}", name: "cow", category: "Animals" },
  { emoji: "\u{1F437}", name: "pig", category: "Animals" },
  { emoji: "\u{1F438}", name: "frog", category: "Animals" },
  { emoji: "\u{1F435}", name: "monkey face", category: "Animals" },
  { emoji: "\u{1F984}", name: "unicorn", category: "Animals" },
  { emoji: "\u{1F40D}", name: "snake", category: "Animals" },
  { emoji: "\u{1F422}", name: "turtle", category: "Animals" },
  { emoji: "\u{1F420}", name: "tropical fish", category: "Animals" },
  { emoji: "\u{1F433}", name: "whale", category: "Animals" },
  { emoji: "\u{1F427}", name: "penguin", category: "Animals" },
  { emoji: "\u{1F426}", name: "bird", category: "Animals" },
  { emoji: "\u{1F985}", name: "eagle", category: "Animals" },
  { emoji: "\u{1F98B}", name: "butterfly", category: "Animals" },
  // Food
  { emoji: "\u{1F34E}", name: "apple", category: "Food" },
  { emoji: "\u{1F34A}", name: "orange", category: "Food" },
  { emoji: "\u{1F34B}", name: "lemon", category: "Food" },
  { emoji: "\u{1F34C}", name: "banana", category: "Food" },
  { emoji: "\u{1F34F}", name: "green apple", category: "Food" },
  { emoji: "\u{1F353}", name: "strawberry", category: "Food" },
  { emoji: "\u{1F349}", name: "watermelon", category: "Food" },
  { emoji: "\u{1F347}", name: "grapes", category: "Food" },
  { emoji: "\u{1F355}", name: "pizza", category: "Food" },
  { emoji: "\u{1F354}", name: "hamburger", category: "Food" },
  { emoji: "\u{1F35F}", name: "fries", category: "Food" },
  { emoji: "\u{1F32E}", name: "taco", category: "Food" },
  { emoji: "\u{1F363}", name: "sushi", category: "Food" },
  { emoji: "\u{1F370}", name: "cake", category: "Food" },
  { emoji: "\u{1F369}", name: "doughnut", category: "Food" },
  { emoji: "\u{2615}", name: "coffee", category: "Food" },
  { emoji: "\u{1F37A}", name: "beer", category: "Food" },
  { emoji: "\u{1F377}", name: "wine", category: "Food" },
  { emoji: "\u{1F36B}", name: "chocolate", category: "Food" },
  { emoji: "\u{1F32D}", name: "hot dog", category: "Food" },
  { emoji: "\u{1F950}", name: "croissant", category: "Food" },
  { emoji: "\u{1F96A}", name: "sandwich", category: "Food" },
  // Travel
  { emoji: "\u{2708}\u{FE0F}", name: "airplane", category: "Travel" },
  { emoji: "\u{1F697}", name: "car", category: "Travel" },
  { emoji: "\u{1F68C}", name: "bus", category: "Travel" },
  { emoji: "\u{1F682}", name: "train", category: "Travel" },
  { emoji: "\u{1F6A2}", name: "ship", category: "Travel" },
  { emoji: "\u{1F680}", name: "rocket", category: "Travel" },
  { emoji: "\u{1F3D6}\u{FE0F}", name: "beach", category: "Travel" },
  { emoji: "\u{1F3D4}\u{FE0F}", name: "mountain", category: "Travel" },
  { emoji: "\u{1F3E0}", name: "house", category: "Travel" },
  { emoji: "\u{1F3E2}", name: "office building", category: "Travel" },
  { emoji: "\u{1F307}", name: "city sunset", category: "Travel" },
  { emoji: "\u{1F30D}", name: "globe europe", category: "Travel" },
  { emoji: "\u{1F30E}", name: "globe americas", category: "Travel" },
  { emoji: "\u{1F5FC}", name: "tokyo tower", category: "Travel" },
  { emoji: "\u{1F5FD}", name: "statue of liberty", category: "Travel" },
  { emoji: "\u{26F2}", name: "fountain", category: "Travel" },
  { emoji: "\u{1F3AA}", name: "circus tent", category: "Travel" },
  // Activities
  { emoji: "\u{26BD}", name: "soccer", category: "Activities" },
  { emoji: "\u{1F3C0}", name: "basketball", category: "Activities" },
  { emoji: "\u{1F3C8}", name: "football", category: "Activities" },
  { emoji: "\u{26BE}", name: "baseball", category: "Activities" },
  { emoji: "\u{1F3BE}", name: "tennis", category: "Activities" },
  { emoji: "\u{1F3B3}", name: "bowling", category: "Activities" },
  { emoji: "\u{1F3AE}", name: "video game", category: "Activities" },
  { emoji: "\u{1F3B2}", name: "dice", category: "Activities" },
  { emoji: "\u{1F3AF}", name: "bullseye", category: "Activities" },
  { emoji: "\u{1F3C6}", name: "trophy", category: "Activities" },
  { emoji: "\u{1F3C5}", name: "medal", category: "Activities" },
  { emoji: "\u{1F3A4}", name: "microphone", category: "Activities" },
  { emoji: "\u{1F3B5}", name: "music note", category: "Activities" },
  { emoji: "\u{1F3B6}", name: "music notes", category: "Activities" },
  { emoji: "\u{1F3A8}", name: "palette", category: "Activities" },
  { emoji: "\u{1F3AD}", name: "performing arts", category: "Activities" },
  { emoji: "\u{1F9E9}", name: "puzzle", category: "Activities" },
  // Objects
  { emoji: "\u{1F4F1}", name: "phone", category: "Objects" },
  { emoji: "\u{1F4BB}", name: "laptop", category: "Objects" },
  { emoji: "\u{2328}\u{FE0F}", name: "keyboard", category: "Objects" },
  { emoji: "\u{1F4F7}", name: "camera", category: "Objects" },
  { emoji: "\u{1F4A1}", name: "light bulb", category: "Objects" },
  { emoji: "\u{1F4DA}", name: "books", category: "Objects" },
  { emoji: "\u{270F}\u{FE0F}", name: "pencil", category: "Objects" },
  { emoji: "\u{1F4CE}", name: "paperclip", category: "Objects" },
  { emoji: "\u{1F512}", name: "lock", category: "Objects" },
  { emoji: "\u{1F511}", name: "key", category: "Objects" },
  { emoji: "\u{1F528}", name: "hammer", category: "Objects" },
  { emoji: "\u{1F4E6}", name: "package", category: "Objects" },
  { emoji: "\u{1F4E7}", name: "email", category: "Objects" },
  { emoji: "\u{23F0}", name: "alarm clock", category: "Objects" },
  { emoji: "\u{1F4B0}", name: "money bag", category: "Objects" },
  { emoji: "\u{1F48E}", name: "gem", category: "Objects" },
  { emoji: "\u{1F6E0}\u{FE0F}", name: "tools", category: "Objects" },
  { emoji: "\u{2699}\u{FE0F}", name: "gear", category: "Objects" },
  { emoji: "\u{1F50D}", name: "magnifying glass", category: "Objects" },
  { emoji: "\u{1F4CB}", name: "clipboard", category: "Objects" },
  // Symbols
  { emoji: "\u{2764}\u{FE0F}", name: "red heart", category: "Symbols" },
  { emoji: "\u{1F9E1}", name: "orange heart", category: "Symbols" },
  { emoji: "\u{1F49B}", name: "yellow heart", category: "Symbols" },
  { emoji: "\u{1F49A}", name: "green heart", category: "Symbols" },
  { emoji: "\u{1F499}", name: "blue heart", category: "Symbols" },
  { emoji: "\u{1F49C}", name: "purple heart", category: "Symbols" },
  { emoji: "\u{2B50}", name: "star", category: "Symbols" },
  { emoji: "\u{1F31F}", name: "glowing star", category: "Symbols" },
  { emoji: "\u{2728}", name: "sparkles", category: "Symbols" },
  { emoji: "\u{1F525}", name: "fire", category: "Symbols" },
  { emoji: "\u{1F4AF}", name: "100", category: "Symbols" },
  { emoji: "\u{2705}", name: "check mark", category: "Symbols" },
  { emoji: "\u{274C}", name: "cross mark", category: "Symbols" },
  { emoji: "\u{26A0}\u{FE0F}", name: "warning", category: "Symbols" },
  { emoji: "\u{267B}\u{FE0F}", name: "recycle", category: "Symbols" },
  { emoji: "\u{1F6AB}", name: "prohibited", category: "Symbols" },
  { emoji: "\u{2049}\u{FE0F}", name: "exclamation question", category: "Symbols" },
  { emoji: "\u{1F4A4}", name: "zzz", category: "Symbols" },
  { emoji: "\u{1F4AC}", name: "speech bubble", category: "Symbols" },
  { emoji: "\u{1F440}", name: "eyes", category: "Symbols" },
  // Flags
  { emoji: "\u{1F1FA}\u{1F1F8}", name: "USA", category: "Flags" },
  { emoji: "\u{1F1EC}\u{1F1E7}", name: "UK", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1E6}", name: "Canada", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1FA}", name: "Australia", category: "Flags" },
  { emoji: "\u{1F1E9}\u{1F1EA}", name: "Germany", category: "Flags" },
  { emoji: "\u{1F1EB}\u{1F1F7}", name: "France", category: "Flags" },
  { emoji: "\u{1F1EF}\u{1F1F5}", name: "Japan", category: "Flags" },
  { emoji: "\u{1F1F0}\u{1F1F7}", name: "South Korea", category: "Flags" },
  { emoji: "\u{1F1E7}\u{1F1F7}", name: "Brazil", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F3}", name: "India", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F9}", name: "Italy", category: "Flags" },
  { emoji: "\u{1F1EA}\u{1F1F8}", name: "Spain", category: "Flags" },
  { emoji: "\u{1F1F2}\u{1F1FD}", name: "Mexico", category: "Flags" },
  { emoji: "\u{1F1F3}\u{1F1EC}", name: "Nigeria", category: "Flags" },
  { emoji: "\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", name: "rainbow flag", category: "Flags" },
  { emoji: "\u{1F3C1}", name: "checkered flag", category: "Flags" },
  { emoji: "\u{1F6A9}", name: "triangular flag", category: "Flags" },
];

const EMOJI_CATEGORIES = ["Smileys", "People", "Animals", "Food", "Travel", "Activities", "Objects", "Symbols", "Flags"];

function EmojiPickerTab() {
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  const filtered = search
    ? EMOJI_DATA.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()))
    : EMOJI_DATA;

  const handleCopy = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setRecent((prev) => [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 10));
  };

  const grouped = EMOJI_CATEGORIES.map((cat) => ({
    category: cat,
    emojis: filtered.filter((e) => e.category === cat),
  })).filter((g) => g.emojis.length > 0);

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search emojis..."
        className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {recent.length > 0 && (
        <div className="bg-secondary rounded-lg border border-border p-4">
          <p className="text-sm font-mono text-muted-foreground mb-2">Recently Copied</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleCopy(emoji)}
                className="text-2xl hover:bg-primary/10 rounded p-1 transition-colors"
                title="Click to copy"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {grouped.map((group) => (
        <div key={group.category}>
          <p className="text-sm font-mono font-bold text-foreground mb-2">{group.category}</p>
          <div className="flex flex-wrap gap-1">
            {group.emojis.map((entry, i) => (
              <button
                key={i}
                onClick={() => handleCopy(entry.emoji)}
                className="text-2xl hover:bg-primary/10 rounded p-1 transition-colors"
                title={entry.name}
              >
                {entry.emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */

const SocialMediaTool = () => {
  const [tab, setTab] = useState<Tab>("YouTube Thumbnail");

  return (
    <Layout>
      <SEO title="Social Media Tools" description="Download YouTube thumbnails, generate OG meta tags, Twitter cards, and browse emoji. Free social tools." canonical="/social-media" keywords="youtube thumbnail downloader, og meta generator, twitter card generator, emoji picker" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Social Media Tool</h1>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-opacity ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "YouTube Thumbnail" && <YouTubeThumbnailTab />}
        {tab === "OG Meta Generator" && <OGMetaGeneratorTab />}
        {tab === "Twitter Card Generator" && <TwitterCardGeneratorTab />}
        {tab === "Social Image Size Guide" && <SocialImageSizeGuideTab />}
        {tab === "Meta Tag Generator" && <MetaTagGeneratorTab />}
        {tab === "Emoji Picker" && <EmojiPickerTab />}
      </div>
    </Layout>
  );
};

export default SocialMediaTool;
