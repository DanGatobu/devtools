import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState, useCallback } from "react";

type IndentStyle = "2" | "4" | "tab";

interface XmlStats {
  elements: number;
  attributes: number;
  depth: number;
}

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog xmlns:dc="http://purl.org/dc/elements/1.1/">
  <book id="bk101" lang="en">
    <dc:title>XML Developer's Guide</dc:title>
    <author>Gambardella, Matthew</author>
    <price currency="USD">44.95</price>
    <description><![CDATA[An in-depth look at creating applications with <XML>.]]></description>
    <!-- Available in stores -->
    <publish_date>2000-10-01</publish_date>
  </book>
  <book id="bk102" lang="en">
    <dc:title>Midnight Rain</dc:title>
    <author>Ralls, Kim</author>
    <price currency="USD">5.95</price>
    <description>A former architect battles corporate zombies &amp; an evil sorceress.</description>
    <publish_date>2000-12-16</publish_date>
  </book>
</catalog>`;

function getIndentUnit(style: IndentStyle): string {
  if (style === "tab") return "\t";
  return " ".repeat(Number(style));
}

function parseXml(xml: string): { doc: Document; error: string | null } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    const msg = parserError.textContent || "Unknown XML parse error";
    return { doc, error: msg.trim() };
  }
  return { doc, error: null };
}

function serializeNode(
  node: Node,
  indentUnit: string,
  level: number,
): string {
  const indent = indentUnit.repeat(level);

  switch (node.nodeType) {
    case Node.DOCUMENT_NODE: {
      const parts: string[] = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        parts.push(serializeNode(node.childNodes[i], indentUnit, 0));
      }
      return parts.join("\n");
    }

    case Node.PROCESSING_INSTRUCTION_NODE: {
      const pi = node as ProcessingInstruction;
      return `${indent}<?${pi.target} ${pi.data}?>`;
    }

    case Node.COMMENT_NODE: {
      return `${indent}<!-- ${(node as Comment).data.trim()} -->`;
    }

    case Node.CDATA_SECTION_NODE: {
      return `<![CDATA[${(node as CDATASection).data}]]>`;
    }

    case Node.TEXT_NODE: {
      const text = node.textContent || "";
      const trimmed = text.trim();
      if (!trimmed) return "";
      return trimmed;
    }

    case Node.ELEMENT_NODE: {
      const el = node as Element;
      let tag = el.localName;
      if (el.prefix) {
        tag = `${el.prefix}:${el.localName}`;
      }

      // Build attribute string
      let attrs = "";
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        let attrName = attr.localName;
        if (attr.prefix) {
          attrName = `${attr.prefix}:${attr.localName}`;
        }
        // Skip redundant xmlns declarations that the serializer would add
        if (
          attrName === "xmlns" &&
          attr.value === el.namespaceURI &&
          el.parentElement?.namespaceURI === el.namespaceURI
        ) {
          continue;
        }
        attrs += ` ${attrName}="${escapeAttr(attr.value)}"`;
      }

      // Collect child nodes, filtering empty text
      const children: Node[] = [];
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (
          child.nodeType === Node.TEXT_NODE &&
          !(child.textContent || "").trim()
        ) {
          continue;
        }
        children.push(child);
      }

      // Self-closing
      if (children.length === 0) {
        return `${indent}<${tag}${attrs} />`;
      }

      // Mixed content detection: has both element children and text/cdata
      const hasElements = children.some(
        (c) => c.nodeType === Node.ELEMENT_NODE,
      );
      const hasInline = children.some(
        (c) =>
          c.nodeType === Node.TEXT_NODE ||
          c.nodeType === Node.CDATA_SECTION_NODE,
      );
      const isMixed = hasElements && hasInline;

      // Simple text-only or cdata-only content (single child)
      if (
        !hasElements &&
        children.length === 1 &&
        (children[0].nodeType === Node.TEXT_NODE ||
          children[0].nodeType === Node.CDATA_SECTION_NODE)
      ) {
        const inner = serializeNode(children[0], indentUnit, 0);
        return `${indent}<${tag}${attrs}>${inner}</${tag}>`;
      }

      if (isMixed) {
        // Mixed content: inline everything
        let inner = "";
        for (const child of children) {
          if (child.nodeType === Node.TEXT_NODE) {
            inner += (child.textContent || "").trim();
          } else if (child.nodeType === Node.CDATA_SECTION_NODE) {
            inner += `<![CDATA[${(child as CDATASection).data}]]>`;
          } else {
            inner += serializeNode(child, indentUnit, 0);
          }
        }
        return `${indent}<${tag}${attrs}>${inner}</${tag}>`;
      }

      // Normal element children
      const parts: string[] = [];
      parts.push(`${indent}<${tag}${attrs}>`);
      for (const child of children) {
        const s = serializeNode(child, indentUnit, level + 1);
        if (s) parts.push(s);
      }
      parts.push(`${indent}</${tag}>`);
      return parts.join("\n");
    }

    default:
      return "";
  }
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatXml(xml: string, indentStyle: IndentStyle): string {
  const { doc, error } = parseXml(xml);
  if (error) throw new Error(error);
  const unit = getIndentUnit(indentStyle);
  return serializeNode(doc, unit, 0);
}

function minifyXml(xml: string): string {
  const { doc, error } = parseXml(xml);
  if (error) throw new Error(error);

  function minNode(node: Node): string {
    switch (node.nodeType) {
      case Node.DOCUMENT_NODE: {
        let out = "";
        for (let i = 0; i < node.childNodes.length; i++) {
          out += minNode(node.childNodes[i]);
        }
        return out;
      }
      case Node.PROCESSING_INSTRUCTION_NODE: {
        const pi = node as ProcessingInstruction;
        return `<?${pi.target} ${pi.data}?>`;
      }
      case Node.COMMENT_NODE:
        return `<!--${(node as Comment).data}-->`;
      case Node.CDATA_SECTION_NODE:
        return `<![CDATA[${(node as CDATASection).data}]]>`;
      case Node.TEXT_NODE: {
        const text = (node.textContent || "").trim();
        return text;
      }
      case Node.ELEMENT_NODE: {
        const el = node as Element;
        let tag = el.localName;
        if (el.prefix) tag = `${el.prefix}:${el.localName}`;

        let attrs = "";
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          let attrName = attr.localName;
          if (attr.prefix) attrName = `${attr.prefix}:${attr.localName}`;
          if (
            attrName === "xmlns" &&
            attr.value === el.namespaceURI &&
            el.parentElement?.namespaceURI === el.namespaceURI
          ) {
            continue;
          }
          attrs += ` ${attrName}="${escapeAttr(attr.value)}"`;
        }

        const children: Node[] = [];
        for (let i = 0; i < el.childNodes.length; i++) {
          const child = el.childNodes[i];
          if (
            child.nodeType === Node.TEXT_NODE &&
            !(child.textContent || "").trim()
          ) {
            continue;
          }
          children.push(child);
        }

        if (children.length === 0) return `<${tag}${attrs}/>`;

        let inner = "";
        for (const child of children) {
          inner += minNode(child);
        }
        return `<${tag}${attrs}>${inner}</${tag}>`;
      }
      default:
        return "";
    }
  }

  return minNode(doc);
}

function computeStats(doc: Document): XmlStats {
  let elements = 0;
  let attributes = 0;
  let maxDepth = 0;

  function walk(node: Node, depth: number) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      elements++;
      attributes += (node as Element).attributes.length;
      if (depth > maxDepth) maxDepth = depth;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i], depth + (node.nodeType === Node.ELEMENT_NODE ? 1 : 0));
    }
  }

  walk(doc, 0);
  return { elements, attributes, depth: maxDepth };
}

function xmlNodeToJson(node: Node): unknown {
  if (node.nodeType === Node.DOCUMENT_NODE) {
    for (let i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType === Node.ELEMENT_NODE) {
        return xmlNodeToJson(node.childNodes[i]);
      }
    }
    return {};
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return (node.textContent || "").trim();
  }

  const el = node as Element;
  const obj: Record<string, unknown> = {};

  // Attributes
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    let name = attr.localName;
    if (attr.prefix) name = `${attr.prefix}:${attr.localName}`;
    obj[`@${name}`] = attr.value;
  }

  // Children
  const childElements: Element[] = [];
  let textContent = "";
  for (let i = 0; i < el.childNodes.length; i++) {
    const child = el.childNodes[i];
    if (child.nodeType === Node.ELEMENT_NODE) {
      childElements.push(child as Element);
    } else if (
      child.nodeType === Node.TEXT_NODE ||
      child.nodeType === Node.CDATA_SECTION_NODE
    ) {
      textContent += child.textContent || "";
    }
  }

  if (childElements.length === 0) {
    const trimmed = textContent.trim();
    if (Object.keys(obj).length === 0) return trimmed;
    if (trimmed) obj["#text"] = trimmed;
    return obj;
  }

  // Group child elements by tag name
  const groups: Record<string, unknown[]> = {};
  for (const child of childElements) {
    let tag = child.localName;
    if (child.prefix) tag = `${child.prefix}:${child.localName}`;
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(xmlNodeToJson(child));
  }

  for (const [tag, values] of Object.entries(groups)) {
    obj[tag] = values.length === 1 ? values[0] : values;
  }

  const trimmedText = textContent.trim();
  if (trimmedText) obj["#text"] = trimmedText;

  return obj;
}

function xmlToJson(xml: string): string {
  const { doc, error } = parseXml(xml);
  if (error) throw new Error(error);

  const rootEl = doc.documentElement;
  let tag = rootEl.localName;
  if (rootEl.prefix) tag = `${rootEl.prefix}:${rootEl.localName}`;

  const result = { [tag]: xmlNodeToJson(rootEl) };
  return JSON.stringify(result, null, 2);
}

const XmlTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indentStyle, setIndentStyle] = useState<IndentStyle>("2");
  const [stats, setStats] = useState<XmlStats | null>(null);
  const [copied, setCopied] = useState(false);

  const clearError = () => setError(null);

  const updateStats = useCallback((xml: string) => {
    try {
      const { doc, error: parseErr } = parseXml(xml);
      if (!parseErr) {
        setStats(computeStats(doc));
      } else {
        setStats(null);
      }
    } catch {
      setStats(null);
    }
  }, []);

  const handleFormat = () => {
    clearError();
    if (!input.trim()) {
      setError("Input is empty.");
      return;
    }
    try {
      const result = formatXml(input, indentStyle);
      setOutput(result);
      updateStats(input);
    } catch (e) {
      setError(`Format error: ${e instanceof Error ? e.message : String(e)}`);
      setOutput("");
      setStats(null);
    }
  };

  const handleMinify = () => {
    clearError();
    if (!input.trim()) {
      setError("Input is empty.");
      return;
    }
    try {
      const result = minifyXml(input);
      setOutput(result);
      updateStats(input);
    } catch (e) {
      setError(`Minify error: ${e instanceof Error ? e.message : String(e)}`);
      setOutput("");
      setStats(null);
    }
  };

  const handleValidate = () => {
    clearError();
    if (!input.trim()) {
      setError("Input is empty.");
      return;
    }
    const { error: parseErr } = parseXml(input);
    if (parseErr) {
      setError(parseErr);
      setOutput("");
      setStats(null);
    } else {
      setError(null);
      setOutput("Valid XML.");
      updateStats(input);
    }
  };

  const handleToJson = () => {
    clearError();
    if (!input.trim()) {
      setError("Input is empty.");
      return;
    }
    try {
      const result = xmlToJson(input);
      setOutput(result);
      updateStats(input);
    } catch (e) {
      setError(`Conversion error: ${e instanceof Error ? e.message : String(e)}`);
      setOutput("");
      setStats(null);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_XML);
    setOutput("");
    setError(null);
    setStats(null);
  };

  return (
    <Layout>
      <SEO
        title="XML Formatter"
        description="Format, validate, and minify XML data online. Pretty print XML with proper indentation."
        canonical="/xml"
        keywords="xml formatter, xml beautifier, xml validator, xml minifier, format xml online"
      />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          XML Tool
        </h1>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={handleFormat}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Minify
          </button>
          <button
            onClick={handleValidate}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Validate
          </button>
          <button
            onClick={handleToJson}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            XML to JSON
          </button>

          <div className="h-6 w-px bg-border" />

          <label className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
            Indent:
            <select
              value={indentStyle}
              onChange={(e) => setIndentStyle(e.target.value as IndentStyle)}
              className="bg-secondary border border-border rounded px-2 py-1 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </label>

          <div className="h-6 w-px bg-border" />

          <button
            onClick={handleLoadSample}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Load Sample
          </button>
        </div>

        {/* Side-by-side textareas */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder='<?xml version="1.0"?><root><item>...</item></root>'
              spellCheck={false}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground">
                Output
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground font-mono text-xs hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Error display */}
        {error && (
          <p className="text-destructive text-sm font-mono mt-2">{error}</p>
        )}

        {/* Stats */}
        {stats && (
          <div className="flex gap-6 mt-4">
            <span className="font-mono text-sm text-muted-foreground">
              Elements: <span className="text-foreground">{stats.elements}</span>
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              Attributes: <span className="text-foreground">{stats.attributes}</span>
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              Max depth: <span className="text-foreground">{stats.depth}</span>
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default XmlTool;
