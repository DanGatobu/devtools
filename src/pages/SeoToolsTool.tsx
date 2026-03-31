import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

// ─── Stop Words ──────────────────────────────────────────────
const STOP_WORDS = new Set([
  "the","is","at","which","on","a","an","and","or","but","in","with","to",
  "of","for","not","no","it","its","be","was","were","been","being","have",
  "has","had","do","does","did","will","would","shall","should","may","might",
  "can","could","this","that","these","those","i","me","my","we","our","you",
  "your","he","him","his","she","her","they","them","their","am","are","if",
  "so","as","by","from","up","about","into","through","during","before","after",
]);

// ─── Power / Emotional Words ─────────────────────────────────
const POWER_WORDS = new Set([
  "ultimate","proven","secret","amazing","powerful","exclusive","guaranteed",
  "instant","revolutionary","breakthrough","stunning","remarkable","incredible",
  "essential","critical","urgent","massive","epic","genius","hack","insider",
  "unleash","dominate","skyrocket","boost","supercharge","transform","explode",
  "effortless","simple",
]);
const EMOTIONAL_WORDS = new Set([
  "love","fear","joy","angry","happy","sad","excited","worried","hopeful",
  "inspire","surprise","shocking","heartbreaking","thrilling","devastating",
  "wonderful","terrible","awesome","horrible","beautiful","ugly","brilliant",
  "painful","delightful","scary","hilarious","tragic","glorious","dreadful",
  "magnificent",
]);

// ─── Accent Map ──────────────────────────────────────────────
const ACCENT_MAP: Record<string, string> = {
  "à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae",
  "ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i",
  "î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o",
  "õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u",
  "ý":"y","ÿ":"y","ß":"ss","ž":"z","š":"s","đ":"d","ć":"c","č":"c",
};

// ─── Schema Templates ────────────────────────────────────────
type SchemaType = "FAQ" | "HowTo" | "Article" | "Product" | "LocalBusiness" | "Event" | "Recipe" | "BreadcrumbList";

const TABS = [
  "URL Slug",
  "Keyword Density",
  "Headline Analyzer",
  "Robots.txt",
  "Schema Markup",
  "Hreflang",
  "Redirects",
] as const;

type Tab = (typeof TABS)[number];

// ═════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════
function SeoToolsTool() {
  const [activeTab, setActiveTab] = useState<Tab>("URL Slug");

  return (
    <Layout>
      <SEO title="SEO Tools" description="URL slug generator, keyword density checker, headline analyzer, robots.txt builder, and schema markup generator." canonical="/seo-tools" keywords="seo tools, url slug generator, keyword density checker, schema markup generator, robots.txt generator" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          SEO Tools
        </h1>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                tab === activeTab
                  ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                  : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "URL Slug" && <UrlSlugTab />}
        {activeTab === "Keyword Density" && <KeywordDensityTab />}
        {activeTab === "Headline Analyzer" && <HeadlineAnalyzerTab />}
        {activeTab === "Robots.txt" && <RobotsTxtTab />}
        {activeTab === "Schema Markup" && <SchemaMarkupTab />}
        {activeTab === "Hreflang" && <HreflangTab />}
        {activeTab === "Redirects" && <RedirectTab />}
      </div>
    </Layout>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. URL Slug Generator
// ─────────────────────────────────────────────────────────────
function UrlSlugTab() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState<"-" | "_">("-");
  const [maxLen, setMaxLen] = useState<number>(0);
  const [transliterate, setTransliterate] = useState(true);
  const [copied, setCopied] = useState(false);

  const generateSlug = (input: string) => {
    let s = input.toLowerCase().trim();
    if (transliterate) {
      s = s
        .split("")
        .map((c) => ACCENT_MAP[c] ?? c)
        .join("");
    }
    s = s.replace(/[^a-z0-9\s-_]/g, "");
    s = s.replace(/[\s-_]+/g, separator);
    s = s.replace(new RegExp(`^\\${separator}|\\${separator}$`, "g"), "");
    if (maxLen > 0) s = s.slice(0, maxLen).replace(new RegExp(`\\${separator}$`), "");
    return s;
  };

  const slug = generateSlug(text);

  const copy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Input Text</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to slugify..."
          className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-secondary rounded-lg border border-border p-4 flex-1 min-w-[200px]">
          <label className="block font-mono text-sm text-foreground mb-2">Separator</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as "-" | "_")}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4 flex-1 min-w-[200px]">
          <label className="block font-mono text-sm text-foreground mb-2">Max Length (0 = no limit)</label>
          <input
            type="number"
            min={0}
            value={maxLen}
            onChange={(e) => setMaxLen(Number(e.target.value))}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={transliterate}
            onChange={(e) => setTransliterate(e.target.checked)}
            id="transliterate"
          />
          <label htmlFor="transliterate" className="font-mono text-sm text-foreground">
            Transliterate accents
          </label>
        </div>
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Generated Slug</label>
        <div className="flex gap-2">
          <input
            readOnly
            value={slug}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={copy} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Keyword Density
// ─────────────────────────────────────────────────────────────
interface KWResult {
  word: string;
  count: number;
  pct: number;
}

function KeywordDensityTab() {
  const [content, setContent] = useState("");
  const [minLen, setMinLen] = useState(3);
  const [results, setResults] = useState<{
    totalWords: number;
    uniqueWords: number;
    single: KWResult[];
    two: KWResult[];
    three: KWResult[];
  } | null>(null);

  const analyze = () => {
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);

    const totalWords = words.length;
    if (totalWords === 0) {
      setResults(null);
      return;
    }

    const filtered = words.filter((w) => w.length >= minLen && !STOP_WORDS.has(w));
    const uniqueWords = new Set(filtered).size;

    const freq = (arr: string[]): KWResult[] => {
      const map = new Map<string, number>();
      arr.forEach((w) => map.set(w, (map.get(w) || 0) + 1));
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word, count]) => ({
          word,
          count,
          pct: +((count / totalWords) * 100).toFixed(2),
        }));
    };

    const ngrams = (n: number) => {
      const out: string[] = [];
      for (let i = 0; i <= filtered.length - n; i++) {
        out.push(filtered.slice(i, i + n).join(" "));
      }
      return freq(out);
    };

    setResults({
      totalWords,
      uniqueWords,
      single: freq(filtered),
      two: ngrams(2),
      three: ngrams(3),
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your content here..."
          className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">Min Word Length</label>
          <input
            type="number"
            min={1}
            value={minLen}
            onChange={(e) => setMinLen(Number(e.target.value))}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button onClick={analyze} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
          Analyze
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="bg-secondary rounded-lg border border-border p-4">
              <span className="font-mono text-sm text-muted-foreground">Total Words</span>
              <p className="font-mono text-lg font-bold text-foreground">{results.totalWords}</p>
            </div>
            <div className="bg-secondary rounded-lg border border-border p-4">
              <span className="font-mono text-sm text-muted-foreground">Unique Keywords</span>
              <p className="font-mono text-lg font-bold text-foreground">{results.uniqueWords}</p>
            </div>
          </div>

          <KWTable title="Single Keywords" data={results.single} />
          <KWTable title="2-Word Phrases" data={results.two} />
          <KWTable title="3-Word Phrases" data={results.three} />
        </div>
      )}
    </div>
  );
}

function KWTable({ title, data }: { title: string; data: KWResult[] }) {
  if (data.length === 0) return null;
  return (
    <div className="bg-secondary rounded-lg border border-border p-4">
      <h3 className="font-mono text-sm font-bold text-foreground mb-2">{title}</h3>
      <table className="w-full font-mono text-sm">
        <thead>
          <tr className="text-muted-foreground">
            <th className="text-left py-1">Keyword</th>
            <th className="text-right py-1">Count</th>
            <th className="text-right py-1">Density</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.word} className="border-t border-border">
              <td className="py-1 text-foreground">{r.word}</td>
              <td className="py-1 text-right text-foreground">{r.count}</td>
              <td className="py-1 text-right text-foreground">{r.pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Headline Analyzer
// ─────────────────────────────────────────────────────────────
interface HeadlineFactor {
  name: string;
  score: number;
  max: number;
  detail: string;
}

function HeadlineAnalyzerTab() {
  const [headline, setHeadline] = useState("");

  const analyzeHeadline = (): { total: number; factors: HeadlineFactor[] } => {
    if (!headline.trim()) return { total: 0, factors: [] };

    const words = headline.trim().split(/\s+/);
    const wordCount = words.length;
    const charCount = headline.trim().length;
    const lower = headline.toLowerCase();
    const lowerWords = lower.split(/\s+/);

    const factors: HeadlineFactor[] = [];

    // Word count (ideal 6-12) — 25 pts
    let wcScore = 0;
    if (wordCount >= 6 && wordCount <= 12) wcScore = 25;
    else if (wordCount >= 4 && wordCount <= 14) wcScore = 15;
    else if (wordCount >= 2) wcScore = 5;
    factors.push({ name: "Word Count", score: wcScore, max: 25, detail: `${wordCount} words (ideal: 6-12)` });

    // Character count (<60) — 15 pts
    let ccScore = charCount <= 60 ? 15 : charCount <= 80 ? 8 : 3;
    factors.push({ name: "Character Count", score: ccScore, max: 15, detail: `${charCount} chars (ideal: <60)` });

    // Power words — 20 pts
    const pw = lowerWords.filter((w) => POWER_WORDS.has(w));
    let pwScore = Math.min(20, pw.length * 10);
    factors.push({ name: "Power Words", score: pwScore, max: 20, detail: pw.length > 0 ? `Found: ${pw.join(", ")}` : "None found" });

    // Emotional words — 15 pts
    const ew = lowerWords.filter((w) => EMOTIONAL_WORDS.has(w));
    let ewScore = Math.min(15, ew.length * 8);
    factors.push({ name: "Emotional Words", score: ewScore, max: 15, detail: ew.length > 0 ? `Found: ${ew.join(", ")}` : "None found" });

    // Numbers — 10 pts
    const hasNum = /\d/.test(headline);
    factors.push({ name: "Numbers", score: hasNum ? 10 : 0, max: 10, detail: hasNum ? "Contains numbers" : "No numbers found" });

    // Question — 10 pts
    const isQ = headline.trim().endsWith("?") || /^(how|what|why|when|where|who|which|can|do|does|is|are|will|should)\b/i.test(headline);
    factors.push({ name: "Question Format", score: isQ ? 10 : 0, max: 10, detail: isQ ? "Question format detected" : "Not a question" });

    // Uniqueness bonus — 5 pts
    const unique = new Set(lowerWords).size / lowerWords.length;
    const uScore = unique >= 0.8 ? 5 : unique >= 0.6 ? 3 : 1;
    factors.push({ name: "Word Variety", score: uScore, max: 5, detail: `${Math.round(unique * 100)}% unique words` });

    const total = factors.reduce((s, f) => s + f.score, 0);
    return { total, factors };
  };

  const { total, factors } = analyzeHeadline();
  const scoreColor = total >= 70 ? "text-green-500" : total >= 40 ? "text-yellow-500" : "text-red-500";
  const scoreBg = total >= 70 ? "bg-green-500/10 border-green-500/30" : total >= 40 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30";

  return (
    <div className="space-y-4">
      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Headline</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Enter your headline..."
          className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {headline.trim() && (
        <>
          <div className={`rounded-lg border p-6 text-center ${scoreBg}`}>
            <p className="font-mono text-sm text-muted-foreground mb-1">Overall Score</p>
            <p className={`font-mono text-4xl font-bold ${scoreColor}`}>{total}/100</p>
          </div>

          <div className="space-y-2">
            {factors.map((f) => (
              <div key={f.name} className="bg-secondary rounded-lg border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-bold text-foreground">{f.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{f.detail}</p>
                </div>
                <span className="font-mono text-sm font-bold text-foreground">
                  {f.score}/{f.max}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Robots.txt Generator
// ─────────────────────────────────────────────────────────────
function RobotsTxtTab() {
  const [userAgent, setUserAgent] = useState("*");
  const [allows, setAllows] = useState<string[]>([]);
  const [disallows, setDisallows] = useState<string[]>([]);
  const [sitemap, setSitemap] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [newAllow, setNewAllow] = useState("");
  const [newDisallow, setNewDisallow] = useState("");
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: string) => {
    if (preset === "allow") {
      setUserAgent("*");
      setAllows(["/"]);
      setDisallows([]);
    } else if (preset === "block") {
      setUserAgent("*");
      setAllows([]);
      setDisallows(["/"]);
    } else if (preset === "block-bots") {
      setUserAgent("*");
      setAllows(["/"]);
      setDisallows([]);
    }
  };

  const output = (() => {
    let lines: string[] = [];
    lines.push(`User-agent: ${userAgent}`);
    allows.forEach((p) => lines.push(`Allow: ${p}`));
    disallows.forEach((p) => lines.push(`Disallow: ${p}`));
    if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
    if (sitemap) {
      lines.push("");
      lines.push(`Sitemap: ${sitemap}`);
    }
    return lines.join("\n");
  })();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => applyPreset("allow")} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
          Allow All
        </button>
        <button onClick={() => applyPreset("block")} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
          Block All
        </button>
        <button onClick={() => applyPreset("block-bots")} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
          Block Specific Bots
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">User-agent</label>
          <input
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">Crawl Delay (seconds)</label>
          <input
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
            placeholder="e.g. 10"
            className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">Allow Paths</label>
          <div className="flex gap-2 mb-2">
            <input
              value={newAllow}
              onChange={(e) => setNewAllow(e.target.value)}
              placeholder="/path"
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => { if (newAllow) { setAllows([...allows, newAllow]); setNewAllow(""); } }}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
          {allows.map((p, i) => (
            <div key={i} className="flex justify-between items-center py-1 font-mono text-sm text-foreground">
              <span>{p}</span>
              <button onClick={() => setAllows(allows.filter((_, j) => j !== i))} className="text-red-500 font-mono text-sm">Remove</button>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">Disallow Paths</label>
          <div className="flex gap-2 mb-2">
            <input
              value={newDisallow}
              onChange={(e) => setNewDisallow(e.target.value)}
              placeholder="/path"
              className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => { if (newDisallow) { setDisallows([...disallows, newDisallow]); setNewDisallow(""); } }}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
          {disallows.map((p, i) => (
            <div key={i} className="flex justify-between items-center py-1 font-mono text-sm text-foreground">
              <span>{p}</span>
              <button onClick={() => setDisallows(disallows.filter((_, j) => j !== i))} className="text-red-500 font-mono text-sm">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Sitemap URL</label>
        <input
          value={sitemap}
          onChange={(e) => setSitemap(e.target.value)}
          placeholder="https://example.com/sitemap.xml"
          className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Generated robots.txt</label>
        <pre className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
        <div className="flex gap-2 mt-2">
          <button onClick={copy} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
            {copied ? "Copied!" : "Copy"}
          </button>
          <button onClick={download} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Schema Markup Generator (JSON-LD)
// ─────────────────────────────────────────────────────────────
function SchemaMarkupTab() {
  const [schemaType, setSchemaType] = useState<SchemaType>("FAQ");
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // FAQ
  const [faqItems, setFaqItems] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  // Article
  const [articleHeadline, setArticleHeadline] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");
  const [articleDate, setArticleDate] = useState("");
  const [articleImage, setArticleImage] = useState("");

  // Product
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCurrency, setProdCurrency] = useState("USD");
  const [prodAvailability, setProdAvailability] = useState("InStock");

  // LocalBusiness
  const [bizName, setBizName] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizUrl, setBizUrl] = useState("");

  // Event
  const [eventName, setEventName] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // Recipe
  const [recipeName, setRecipeName] = useState("");
  const [recipeDesc, setRecipeDesc] = useState("");
  const [recipePrepTime, setRecipePrepTime] = useState("");
  const [recipeCookTime, setRecipeCookTime] = useState("");

  // HowTo
  const [howToName, setHowToName] = useState("");
  const [howToSteps, setHowToSteps] = useState<string[]>([""]);

  // BreadcrumbList
  const [breadcrumbs, setBreadcrumbs] = useState<{ name: string; url: string }[]>([{ name: "", url: "" }]);

  const generateSchema = (): object => {
    switch (schemaType) {
      case "FAQ":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.filter((i) => i.q && i.a).map((i) => ({
            "@type": "Question",
            name: i.q,
            acceptedAnswer: { "@type": "Answer", text: i.a },
          })),
        };
      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: articleHeadline,
          author: { "@type": "Person", name: articleAuthor },
          datePublished: articleDate,
          image: articleImage || undefined,
        };
      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: prodName,
          description: prodDesc,
          offers: {
            "@type": "Offer",
            price: prodPrice,
            priceCurrency: prodCurrency,
            availability: `https://schema.org/${prodAvailability}`,
          },
        };
      case "LocalBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: bizName,
          address: bizAddress,
          telephone: bizPhone,
          url: bizUrl,
        };
      case "Event":
        return {
          "@context": "https://schema.org",
          "@type": "Event",
          name: eventName,
          startDate: eventStart,
          endDate: eventEnd,
          location: { "@type": "Place", name: eventLocation },
        };
      case "Recipe":
        return {
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: recipeName,
          description: recipeDesc,
          prepTime: recipePrepTime ? `PT${recipePrepTime}M` : undefined,
          cookTime: recipeCookTime ? `PT${recipeCookTime}M` : undefined,
        };
      case "HowTo":
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: howToName,
          step: howToSteps.filter(Boolean).map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            text: s,
          })),
        };
      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.filter((b) => b.name && b.url).map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.name,
            item: b.url,
          })),
        };
    }
  };

  const schema = generateSchema();
  const jsonLd = JSON.stringify(schema, null, 2);
  const scriptTag = `<script type="application/ld+json">\n${jsonLd}\n</script>`;

  const validate = () => {
    const errs: string[] = [];
    switch (schemaType) {
      case "FAQ":
        if (faqItems.every((i) => !i.q || !i.a)) errs.push("At least one Q&A pair is required.");
        break;
      case "Article":
        if (!articleHeadline) errs.push("Headline is required.");
        if (!articleAuthor) errs.push("Author is required.");
        if (!articleDate) errs.push("Date published is required.");
        break;
      case "Product":
        if (!prodName) errs.push("Product name is required.");
        if (!prodPrice) errs.push("Price is required.");
        break;
      case "LocalBusiness":
        if (!bizName) errs.push("Business name is required.");
        break;
      case "Event":
        if (!eventName) errs.push("Event name is required.");
        if (!eventStart) errs.push("Start date is required.");
        break;
      case "Recipe":
        if (!recipeName) errs.push("Recipe name is required.");
        break;
      case "HowTo":
        if (!howToName) errs.push("Name is required.");
        if (howToSteps.every((s) => !s)) errs.push("At least one step is required.");
        break;
      case "BreadcrumbList":
        if (breadcrumbs.every((b) => !b.name || !b.url)) errs.push("At least one breadcrumb item is required.");
        break;
    }
    setValidationErrors(errs);
  };

  const copy = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const inputCls = "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  const renderFields = () => {
    switch (schemaType) {
      case "FAQ":
        return (
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-secondary rounded-lg border border-border p-4 space-y-2">
                <input value={item.q} onChange={(e) => { const n = [...faqItems]; n[i].q = e.target.value; setFaqItems(n); }} placeholder="Question" className={inputCls} />
                <textarea value={item.a} onChange={(e) => { const n = [...faqItems]; n[i].a = e.target.value; setFaqItems(n); }} placeholder="Answer" className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
                <button onClick={() => setFaqItems(faqItems.filter((_, j) => j !== i))} className="text-red-500 font-mono text-sm">Remove</button>
              </div>
            ))}
            <button onClick={() => setFaqItems([...faqItems, { q: "", a: "" }])} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Add Q&A</button>
          </div>
        );
      case "Article":
        return (
          <div className="space-y-3">
            <div><label className="block font-mono text-sm text-foreground mb-1">Headline</label><input value={articleHeadline} onChange={(e) => setArticleHeadline(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Author</label><input value={articleAuthor} onChange={(e) => setArticleAuthor(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Date Published</label><input type="date" value={articleDate} onChange={(e) => setArticleDate(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Image URL</label><input value={articleImage} onChange={(e) => setArticleImage(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case "Product":
        return (
          <div className="space-y-3">
            <div><label className="block font-mono text-sm text-foreground mb-1">Name</label><input value={prodName} onChange={(e) => setProdName(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Description</label><textarea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="block font-mono text-sm text-foreground mb-1">Price</label><input value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className={inputCls} /></div>
              <div><label className="block font-mono text-sm text-foreground mb-1">Currency</label><input value={prodCurrency} onChange={(e) => setProdCurrency(e.target.value)} className={inputCls} /></div>
              <div>
                <label className="block font-mono text-sm text-foreground mb-1">Availability</label>
                <select value={prodAvailability} onChange={(e) => setProdAvailability(e.target.value)} className={inputCls}>
                  <option value="InStock">In Stock</option>
                  <option value="OutOfStock">Out of Stock</option>
                  <option value="PreOrder">Pre-Order</option>
                </select>
              </div>
            </div>
          </div>
        );
      case "LocalBusiness":
        return (
          <div className="space-y-3">
            <div><label className="block font-mono text-sm text-foreground mb-1">Business Name</label><input value={bizName} onChange={(e) => setBizName(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Address</label><input value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Phone</label><input value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Website URL</label><input value={bizUrl} onChange={(e) => setBizUrl(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case "Event":
        return (
          <div className="space-y-3">
            <div><label className="block font-mono text-sm text-foreground mb-1">Event Name</label><input value={eventName} onChange={(e) => setEventName(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Start Date</label><input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">End Date</label><input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Location</label><input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className={inputCls} /></div>
          </div>
        );
      case "Recipe":
        return (
          <div className="space-y-3">
            <div><label className="block font-mono text-sm text-foreground mb-1">Recipe Name</label><input value={recipeName} onChange={(e) => setRecipeName(e.target.value)} className={inputCls} /></div>
            <div><label className="block font-mono text-sm text-foreground mb-1">Description</label><textarea value={recipeDesc} onChange={(e) => setRecipeDesc(e.target.value)} className="w-full h-32 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block font-mono text-sm text-foreground mb-1">Prep Time (minutes)</label><input value={recipePrepTime} onChange={(e) => setRecipePrepTime(e.target.value)} className={inputCls} /></div>
              <div><label className="block font-mono text-sm text-foreground mb-1">Cook Time (minutes)</label><input value={recipeCookTime} onChange={(e) => setRecipeCookTime(e.target.value)} className={inputCls} /></div>
            </div>
          </div>
        );
      case "HowTo":
        return (
          <div className="space-y-3">
            <div><label className="block font-mono text-sm text-foreground mb-1">Name</label><input value={howToName} onChange={(e) => setHowToName(e.target.value)} className={inputCls} /></div>
            <label className="block font-mono text-sm text-foreground">Steps</label>
            {howToSteps.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s} onChange={(e) => { const n = [...howToSteps]; n[i] = e.target.value; setHowToSteps(n); }} placeholder={`Step ${i + 1}`} className={inputCls} />
                <button onClick={() => setHowToSteps(howToSteps.filter((_, j) => j !== i))} className="text-red-500 font-mono text-sm">Remove</button>
              </div>
            ))}
            <button onClick={() => setHowToSteps([...howToSteps, ""])} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Add Step</button>
          </div>
        );
      case "BreadcrumbList":
        return (
          <div className="space-y-2">
            {breadcrumbs.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input value={b.name} onChange={(e) => { const n = [...breadcrumbs]; n[i].name = e.target.value; setBreadcrumbs(n); }} placeholder="Name" className={inputCls} />
                <input value={b.url} onChange={(e) => { const n = [...breadcrumbs]; n[i].url = e.target.value; setBreadcrumbs(n); }} placeholder="URL" className={inputCls} />
                <button onClick={() => setBreadcrumbs(breadcrumbs.filter((_, j) => j !== i))} className="text-red-500 font-mono text-sm">Remove</button>
              </div>
            ))}
            <button onClick={() => setBreadcrumbs([...breadcrumbs, { name: "", url: "" }])} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Add Item</button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Schema Type</label>
        <select value={schemaType} onChange={(e) => { setSchemaType(e.target.value as SchemaType); setValidationErrors([]); }} className={inputCls}>
          {(["FAQ","HowTo","Article","Product","LocalBusiness","Event","Recipe","BreadcrumbList"] as SchemaType[]).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4">
        {renderFields()}
      </div>

      <div className="flex gap-2">
        <button onClick={validate} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Validate</button>
        <button onClick={copy} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">{copied ? "Copied!" : "Copy"}</button>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          {validationErrors.map((e, i) => (
            <p key={i} className="font-mono text-sm text-red-500">{e}</p>
          ))}
        </div>
      )}

      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Generated JSON-LD</label>
        <pre className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground whitespace-pre-wrap overflow-auto max-h-96">{scriptTag}</pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. Hreflang Generator
// ─────────────────────────────────────────────────────────────
function HreflangTab() {
  const [entries, setEntries] = useState<{ url: string; lang: string }[]>([{ url: "", lang: "en" }]);
  const [includeXDefault, setIncludeXDefault] = useState(true);
  const [xDefaultUrl, setXDefaultUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const output = (() => {
    const lines = entries
      .filter((e) => e.url && e.lang)
      .map((e) => `<link rel="alternate" hreflang="${e.lang}" href="${e.url}" />`);
    if (includeXDefault && xDefaultUrl) {
      lines.push(`<link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`);
    }
    return lines.join("\n");
  })();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const inputCls = "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-4">
      <div className="bg-secondary rounded-lg border border-border p-4 space-y-2">
        <label className="block font-mono text-sm text-foreground mb-2">URL + Language Pairs</label>
        {entries.map((e, i) => (
          <div key={i} className="flex gap-2">
            <input value={e.url} onChange={(ev) => { const n = [...entries]; n[i].url = ev.target.value; setEntries(n); }} placeholder="https://example.com/page" className={inputCls} />
            <input value={e.lang} onChange={(ev) => { const n = [...entries]; n[i].lang = ev.target.value; setEntries(n); }} placeholder="en-US" className="w-32 bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            <button onClick={() => setEntries(entries.filter((_, j) => j !== i))} className="text-red-500 font-mono text-sm whitespace-nowrap">Remove</button>
          </div>
        ))}
        <button onClick={() => setEntries([...entries, { url: "", lang: "" }])} className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">Add Pair</button>
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4 flex items-center gap-4">
        <input type="checkbox" checked={includeXDefault} onChange={(e) => setIncludeXDefault(e.target.checked)} id="xdefault" />
        <label htmlFor="xdefault" className="font-mono text-sm text-foreground">Include x-default</label>
        {includeXDefault && (
          <input value={xDefaultUrl} onChange={(e) => setXDefaultUrl(e.target.value)} placeholder="x-default URL" className={inputCls} />
        )}
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Generated Hreflang Tags</label>
        <pre className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground whitespace-pre-wrap">{output || "Add URL/language pairs above to generate tags."}</pre>
        <button onClick={copy} className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. Redirect Generator
// ─────────────────────────────────────────────────────────────
type RedirectFormat = "Apache" | "Nginx" | "Vercel" | "Netlify" | "JavaScript" | "PHP";
const REDIRECT_FORMATS: RedirectFormat[] = ["Apache", "Nginx", "Vercel", "Netlify", "JavaScript", "PHP"];

function RedirectTab() {
  const [fromUrl, setFromUrl] = useState("");
  const [toUrl, setToUrl] = useState("");
  const [redirectType, setRedirectType] = useState<"301" | "302">("301");
  const [format, setFormat] = useState<RedirectFormat>("Apache");
  const [copied, setCopied] = useState(false);

  const generate = (): string => {
    const from = fromUrl || "/old-path";
    const to = toUrl || "/new-path";
    const code = redirectType;

    switch (format) {
      case "Apache":
        return `RewriteEngine On\nRewriteRule ^${from.replace(/^\//, "")}$ ${to} [R=${code},L]`;
      case "Nginx":
        return `location = ${from} {\n    return ${code} ${to};\n}`;
      case "Vercel":
        return JSON.stringify(
          {
            redirects: [
              { source: from, destination: to, statusCode: Number(code) },
            ],
          },
          null,
          2
        );
      case "Netlify":
        return `${from}    ${to}    ${code}`;
      case "JavaScript":
        return code === "301"
          ? `// Note: 301 redirects should be handled server-side.\n// Client-side redirect:\nwindow.location.replace("${to}");`
          : `window.location.href = "${to}";`;
      case "PHP":
        return `<?php\nheader("Location: ${to}", true, ${code});\nexit();\n?>`;
    }
  };

  const output = generate();
  const inputCls = "w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">From URL</label>
          <input value={fromUrl} onChange={(e) => setFromUrl(e.target.value)} placeholder="/old-path" className={inputCls} />
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">To URL</label>
          <input value={toUrl} onChange={(e) => setToUrl(e.target.value)} placeholder="/new-path" className={inputCls} />
        </div>
        <div className="bg-secondary rounded-lg border border-border p-4">
          <label className="block font-mono text-sm text-foreground mb-2">Redirect Type</label>
          <select value={redirectType} onChange={(e) => setRedirectType(e.target.value as "301" | "302")} className={inputCls}>
            <option value="301">301 (Permanent)</option>
            <option value="302">302 (Temporary)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {REDIRECT_FORMATS.map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={
              f === format
                ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4">
        <label className="block font-mono text-sm text-foreground mb-2">Generated {format} Redirect</label>
        <pre className="w-full bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
        <button onClick={copy} className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default SeoToolsTool;
