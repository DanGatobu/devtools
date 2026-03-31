import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";
import { marked } from "marked";

function sanitizeHtml(html: string): string {
  // Remove script tags and their content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove on* event handlers
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  // Remove javascript: protocol
  clean = clean.replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'src=""');
  return clean;
}

const SAMPLE_MARKDOWN = `# Hello World

This is a **bold** and *italic* example.

## Features

- Item one
- Item two
- Item three

1. First
2. Second
3. Third

> This is a blockquote

\`inline code\` and a code block:

\`\`\`js
const greeting = "Hello!";
console.log(greeting);
\`\`\`

[Visit OpenAI](https://openai.com)

![Alt text](https://via.placeholder.com/150)
`;

const SAMPLE_HTML = `<h1>Hello World</h1>
<p>This is a <strong>bold</strong> and <em>italic</em> example.</p>
<h2>Features</h2>
<ul>
<li>Item one</li>
<li>Item two</li>
<li>Item three</li>
</ul>
<ol>
<li>First</li>
<li>Second</li>
<li>Third</li>
</ol>
<blockquote>This is a blockquote</blockquote>
<p><code>inline code</code> and a code block:</p>
<pre><code>const greeting = "Hello!";
console.log(greeting);</code></pre>
<p><a href="https://openai.com">Visit OpenAI</a></p>
<p><img src="https://via.placeholder.com/150" alt="Alt text" /></p>
`;

function htmlToMarkdown(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(walk).join("");

    switch (tag) {
      case "h1":
        return `# ${children.trim()}\n\n`;
      case "h2":
        return `## ${children.trim()}\n\n`;
      case "h3":
        return `### ${children.trim()}\n\n`;
      case "h4":
        return `#### ${children.trim()}\n\n`;
      case "h5":
        return `##### ${children.trim()}\n\n`;
      case "h6":
        return `###### ${children.trim()}\n\n`;
      case "p":
        return `${children.trim()}\n\n`;
      case "strong":
      case "b":
        return `**${children}**`;
      case "em":
      case "i":
        return `*${children}*`;
      case "a":
        return `[${children}](${el.getAttribute("href") || ""})`;
      case "img":
        return `![${el.getAttribute("alt") || ""}](${el.getAttribute("src") || ""})`;
      case "ul":
        return (
          Array.from(el.children)
            .map((li) => `- ${walk(li).trim()}`)
            .join("\n") + "\n\n"
        );
      case "ol":
        return (
          Array.from(el.children)
            .map((li, i) => `${i + 1}. ${walk(li).trim()}`)
            .join("\n") + "\n\n"
        );
      case "li":
        return children;
      case "blockquote":
        return (
          children
            .trim()
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n") + "\n\n"
        );
      case "code":
        if (el.parentElement?.tagName.toLowerCase() === "pre") {
          return children;
        }
        return `\`${children}\``;
      case "pre": {
        const codeEl = el.querySelector("code");
        const codeContent = codeEl ? walk(codeEl) : children;
        return `\`\`\`\n${codeContent.trim()}\n\`\`\`\n\n`;
      }
      case "br":
        return "\n";
      case "hr":
        return "---\n\n";
      case "div":
      case "span":
      case "section":
      case "article":
        return children;
      default:
        return children;
    }
  }

  return walk(doc.body).replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

const MarkdownTool = () => {
  const [activeTab, setActiveTab] = useState<"md-to-html" | "html-to-md">("md-to-html");
  const [markdownInput, setMarkdownInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [outputView, setOutputView] = useState<"code" | "preview">("code");
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "md-to-html") {
      try {
        setError("");
        const result = marked.parse(markdownInput, { async: false }) as string;
        setHtmlOutput(sanitizeHtml(result));
      } catch {
        setError("Error parsing Markdown");
        setHtmlOutput("");
      }
    }
  }, [markdownInput, activeTab]);

  useEffect(() => {
    if (activeTab === "html-to-md") {
      try {
        setError("");
        if (htmlInput.trim()) {
          setMarkdownOutput(htmlToMarkdown(htmlInput));
        } else {
          setMarkdownOutput("");
        }
      } catch {
        setError("Error converting HTML");
        setMarkdownOutput("");
      }
    }
  }, [htmlInput, activeTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleLoadSample = () => {
    if (activeTab === "md-to-html") {
      setMarkdownInput(SAMPLE_MARKDOWN);
    } else {
      setHtmlInput(SAMPLE_HTML);
    }
  };

  const primaryBtn =
    "px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity";
  const secondaryBtn =
    "px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors";
  const textareaClass =
    "w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary";
  const labelClass = "text-sm font-mono text-muted-foreground mb-2 block";

  return (
    <Layout>
      <SEO title="Markdown to HTML Converter" description="Convert Markdown to HTML and HTML to Markdown. Live preview with syntax highlighting." canonical="/markdown" keywords="markdown to html, html to markdown, markdown converter, markdown preview" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">Markdown Tool</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("md-to-html")}
            className={activeTab === "md-to-html" ? primaryBtn : secondaryBtn}
          >
            Markdown to HTML
          </button>
          <button
            onClick={() => setActiveTab("html-to-md")}
            className={activeTab === "html-to-md" ? primaryBtn : secondaryBtn}
          >
            HTML to Markdown
          </button>
          <button onClick={handleLoadSample} className={secondaryBtn}>
            Load Sample
          </button>
        </div>

        {activeTab === "md-to-html" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Markdown Input</label>
              <textarea
                value={markdownInput}
                onChange={(e) => setMarkdownInput(e.target.value)}
                className={textareaClass}
                placeholder="Enter Markdown..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setOutputView("code")}
                    className={
                      outputView === "code"
                        ? "px-3 py-1 rounded-md bg-primary text-primary-foreground font-mono text-xs hover:opacity-90 transition-opacity"
                        : "px-3 py-1 rounded-md bg-secondary text-secondary-foreground font-mono text-xs hover:bg-secondary/80 transition-colors"
                    }
                  >
                    HTML Code
                  </button>
                  <button
                    onClick={() => setOutputView("preview")}
                    className={
                      outputView === "preview"
                        ? "px-3 py-1 rounded-md bg-primary text-primary-foreground font-mono text-xs hover:opacity-90 transition-opacity"
                        : "px-3 py-1 rounded-md bg-secondary text-secondary-foreground font-mono text-xs hover:bg-secondary/80 transition-colors"
                    }
                  >
                    Preview
                  </button>
                </div>
                <button onClick={() => handleCopy(htmlOutput)} className={secondaryBtn}>
                  Copy
                </button>
              </div>
              {outputView === "code" ? (
                <textarea value={htmlOutput} readOnly className={textareaClass} />
              ) : (
                <div
                  className="w-full h-64 bg-secondary rounded-lg border border-border p-4 text-sm text-foreground overflow-auto prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "html-to-md" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>HTML Input</label>
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                className={textareaClass}
                placeholder="Enter HTML..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Markdown Output</label>
                <button onClick={() => handleCopy(markdownOutput)} className={secondaryBtn}>
                  Copy
                </button>
              </div>
              <textarea value={markdownOutput} readOnly className={textareaClass} />
            </div>
          </div>
        )}

        {error && <p className="text-destructive text-sm font-mono mt-2">{error}</p>}
      </div>
    </Layout>
  );
};

export default MarkdownTool;
