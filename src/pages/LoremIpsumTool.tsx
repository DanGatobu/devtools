import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitationem", "ullam", "corporis", "suscipit", "laboriosam", "nisi",
  "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure",
  "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat",
  "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim",
  "id", "est", "laborum", "autem", "vel", "eum", "fugit", "quo", "voluptas",
  "nemo", "ipsam", "voluptatem", "quia", "consequuntur", "magni", "dolores",
  "ratione", "sequi", "nesciunt", "neque", "porro", "quisquam", "nihil",
  "impedit", "minus", "quod", "maxime", "placeat", "facere", "possimus",
  "omnis", "voluptas", "assumenda", "repudiandae", "temporibus", "quibusdam",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";

type GenerateType = "paragraphs" | "sentences" | "words";

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(): string {
  const length = 8 + Math.floor(Math.random() * 12);
  const words: string[] = [];
  for (let i = 0; i < length; i++) {
    words.push(randomWord());
  }
  words[0] = capitalize(words[0]);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

function generate(
  type: GenerateType,
  count: number,
  startWithLorem: boolean
): string {
  let result = "";

  if (type === "words") {
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(randomWord());
    }
    if (startWithLorem) {
      const loremStart = ["lorem", "ipsum", "dolor", "sit", "amet"];
      for (let i = 0; i < Math.min(count, loremStart.length); i++) {
        words[i] = loremStart[i];
      }
    }
    words[0] = capitalize(words[0]);
    result = words.join(" ");
  } else if (type === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      sentences.push(generateSentence());
    }
    result = sentences.join(" ");
    if (startWithLorem) {
      result = LOREM_START + result;
    }
  } else {
    const paragraphs: string[] = [];
    for (let i = 0; i < count; i++) {
      paragraphs.push(generateParagraph());
    }
    result = paragraphs.join("\n\n");
    if (startWithLorem) {
      result = LOREM_START + result;
    }
  }

  return result;
}

function countStats(text: string) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const characters = text.length;
  return { words, characters };
}

function LoremIpsumTool() {
  const [type, setType] = useState<GenerateType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = countStats(output);

  const handleGenerate = () => {
    const clamped = Math.max(1, Math.min(50, count));
    setOutput(generate(type, clamped, startWithLorem));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeOptions: { label: string; value: GenerateType }[] = [
    { label: "Paragraphs", value: "paragraphs" },
    { label: "Sentences", value: "sentences" },
    { label: "Words", value: "words" },
  ];

  return (
    <Layout>
      <SEO title="Lorem Ipsum Generator" description="Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words. Free dummy text generator." canonical="/lorem-ipsum" keywords="lorem ipsum generator, placeholder text, dummy text, lipsum generator" />
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Lorem Ipsum Generator
        </h1>

        <div className="space-y-4">
          {/* Type selector */}
          <div>
            <label className="block font-mono text-sm text-foreground mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={
                    type === opt.value
                      ? "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
                      : "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count input */}
          <div>
            <label className="block font-mono text-sm text-foreground mb-2">
              Count (1–50)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-secondary rounded-md border border-border px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-24"
            />
          </div>

          {/* Start with Lorem Ipsum checkbox */}
          <label className="flex items-center gap-2 font-mono text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-border"
            />
            Start with &quot;Lorem ipsum dolor sit amet...&quot;
          </label>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Generate
          </button>

          {/* Output area */}
          {output && (
            <div className="space-y-3">
              <div className="bg-secondary rounded-lg border border-border p-6 whitespace-pre-wrap font-mono text-sm text-foreground">
                {output}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  {stats.words} words · {stats.characters} characters
                </span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default LoremIpsumTool;
