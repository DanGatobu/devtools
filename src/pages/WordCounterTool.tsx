import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useMemo } from "react";

const WordCounterTool = () => {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const wordCount = words.length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?=\s|$)/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const readingTime = Math.ceil(wordCount / 200);
    const speakingTime = Math.ceil(wordCount / 130);

    return { wordCount, characters, charactersNoSpaces, sentences, paragraphs, lines, readingTime, speakingTime };
  }, [text]);

  const topWords = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return [];
    const words = trimmed.toLowerCase().split(/\s+/);
    const freq: Record<string, number> = {};
    for (const word of words) {
      const clean = word.replace(/[^a-z0-9'-]/g, "");
      if (clean) freq[clean] = (freq[clean] || 0) + 1;
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [text]);

  const statCards = [
    { label: "Words", value: stats.wordCount },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Reading Time (min)", value: stats.readingTime },
    { label: "Speaking Time (min)", value: stats.speakingTime },
  ];

  return (
    <Layout>
      <SEO title="Word Counter" description="Count words, characters, sentences, paragraphs with reading time. Free online word counter with frequency analysis." canonical="/word-counter" keywords="word counter, character counter, letter counter, word count online" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Word Counter</h1>

        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-mono text-muted-foreground mb-1 block">Text Input</label>
          <button
            onClick={() => setText("")}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Start typing or paste your text here..."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-secondary rounded-lg border border-border p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {topWords.length > 0 && (
          <div className="mt-6">
            <label className="text-sm font-mono text-muted-foreground mb-1 block">Top Words</label>
            <div className="bg-secondary rounded-lg border border-border p-4">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Word</th>
                    <th className="pb-2 text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topWords.map(([word, count], i) => (
                    <tr key={word} className="border-t border-border">
                      <td className="py-1 text-muted-foreground">{i + 1}</td>
                      <td className="py-1 text-foreground">{word}</td>
                      <td className="py-1 text-right text-primary">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WordCounterTool;
