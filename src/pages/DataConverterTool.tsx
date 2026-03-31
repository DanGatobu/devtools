import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { useState } from "react";

type Format =
  | "JSON"
  | "YAML"
  | "XML"
  | "CSV"
  | "TSV"
  | "SQL INSERT"
  | "HTML Table"
  | "TypeScript Interface"
  | "JSON Schema";

const parseFormats: Format[] = ["JSON", "YAML", "XML", "CSV", "TSV"];
const serializeFormats: Format[] = [
  "JSON",
  "YAML",
  "XML",
  "CSV",
  "TSV",
  "SQL INSERT",
  "HTML Table",
  "TypeScript Interface",
  "JSON Schema",
];

// --------------- PARSERS ---------------

function parseJSON(input: string): unknown {
  return JSON.parse(input);
}

function parseYAML(input: string): unknown {
  const lines = input.split("\n");
  return parseYAMLLines(lines, 0, 0).value;
}

function parseYAMLLines(
  lines: string[],
  start: number,
  baseIndent: number
): { value: unknown; nextIndex: number } {
  if (start >= lines.length) return { value: null, nextIndex: start };

  const firstLine = lines[start];
  const trimmed = firstLine.trimStart();

  // Check if this is an array item at base indent
  if (trimmed.startsWith("- ")) {
    const arr: unknown[] = [];
    let i = start;
    while (i < lines.length) {
      const line = lines[i];
      const indent = line.length - line.trimStart().length;
      const lt = line.trimStart();
      if (lt === "" || lt.startsWith("#")) {
        i++;
        continue;
      }
      if (indent < baseIndent) break;
      if (indent === baseIndent && lt.startsWith("- ")) {
        const afterDash = lt.slice(2);
        if (afterDash.includes(":") && !afterDash.startsWith('"')) {
          // Inline object in array: - key: value
          const fakeLines = [" ".repeat(baseIndent + 2) + afterDash];
          // Collect child lines
          let j = i + 1;
          while (j < lines.length) {
            const cl = lines[j];
            const ci = cl.length - cl.trimStart().length;
            const ct = cl.trimStart();
            if (ct === "" || ct.startsWith("#")) {
              j++;
              continue;
            }
            if (ci <= baseIndent) break;
            fakeLines.push(cl);
            j++;
          }
          const parsed = parseYAMLLines(fakeLines, 0, baseIndent + 2);
          arr.push(parsed.value);
          i = j;
        } else {
          arr.push(parseYAMLScalar(afterDash));
          i++;
        }
      } else if (indent > baseIndent) {
        i++;
      } else {
        break;
      }
    }
    return { value: arr, nextIndex: i };
  }

  // Object
  const obj: Record<string, unknown> = {};
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    const indent = line.length - line.trimStart().length;
    const lt = line.trimStart();
    if (lt === "" || lt.startsWith("#")) {
      i++;
      continue;
    }
    if (indent < baseIndent) break;
    if (indent > baseIndent) {
      i++;
      continue;
    }
    const colonIdx = lt.indexOf(":");
    if (colonIdx === -1) {
      i++;
      continue;
    }
    const key = lt.slice(0, colonIdx).trim();
    const afterColon = lt.slice(colonIdx + 1).trim();
    if (afterColon === "" || afterColon === "|" || afterColon === ">") {
      // Nested value
      let j = i + 1;
      const childIndent = baseIndent + 2;
      const childLines: string[] = [];
      while (j < lines.length) {
        const cl = lines[j];
        const ci = cl.length - cl.trimStart().length;
        const ct = cl.trimStart();
        if (ct === "" || ct.startsWith("#")) {
          childLines.push(cl);
          j++;
          continue;
        }
        if (ci < childIndent) break;
        childLines.push(cl);
        j++;
      }
      if (childLines.length > 0) {
        const parsed = parseYAMLLines(childLines, 0, childIndent);
        obj[key] = parsed.value;
      } else {
        obj[key] = null;
      }
      i = j;
    } else {
      obj[key] = parseYAMLScalar(afterColon);
      i++;
    }
  }
  return { value: obj, nextIndex: i };
}

function parseYAMLScalar(s: string): unknown {
  const trimmed = s.trim();
  if (trimmed === "null" || trimmed === "~" || trimmed === "") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseXML(input: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) throw new Error("Invalid XML: " + errorNode.textContent);
  return xmlNodeToObj(doc.documentElement);
}

function xmlNodeToObj(node: Element): unknown {
  const obj: Record<string, unknown> = {};

  // Attributes
  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i];
    obj["@" + attr.name] = attr.value;
  }

  const children = Array.from(node.childNodes);
  const elementChildren = children.filter(
    (c) => c.nodeType === Node.ELEMENT_NODE
  ) as Element[];

  if (elementChildren.length === 0) {
    const text = node.textContent?.trim() ?? "";
    if (Object.keys(obj).length === 0) return text;
    obj["#text"] = text;
    return obj;
  }

  const grouped: Record<string, unknown[]> = {};
  for (const child of elementChildren) {
    const tag = child.tagName;
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(xmlNodeToObj(child));
  }

  for (const [tag, vals] of Object.entries(grouped)) {
    obj[tag] = vals.length === 1 ? vals[0] : vals;
  }

  return obj;
}

function parseCSV(input: string, delimiter: string = ","): unknown {
  const rows = parseDelimitedRows(input, delimiter);
  if (rows.length < 2) throw new Error("CSV must have a header row and at least one data row");
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    return obj;
  });
}

function parseDelimitedRows(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < input.length && input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        current.push(field);
        field = "";
      } else if (ch === "\n") {
        current.push(field);
        field = "";
        if (current.some((c) => c !== "")) rows.push(current);
        current = [];
      } else if (ch === "\r") {
        // skip
      } else {
        field += ch;
      }
    }
  }
  current.push(field);
  if (current.some((c) => c !== "")) rows.push(current);
  return rows;
}

// --------------- SERIALIZERS ---------------

function serializeJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

function serializeYAML(data: unknown, indent: number = 0): string {
  const prefix = " ".repeat(indent);
  if (data === null || data === undefined) return prefix + "null\n";
  if (typeof data === "boolean") return prefix + (data ? "true" : "false") + "\n";
  if (typeof data === "number") return prefix + String(data) + "\n";
  if (typeof data === "string") {
    if (data.includes("\n") || data.includes(":") || data.includes("#")) {
      return prefix + '"' + data.replace(/"/g, '\\"') + '"\n';
    }
    return prefix + data + "\n";
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return prefix + "[]\n";
    let result = "";
    for (const item of data) {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const entries = Object.entries(item as Record<string, unknown>);
        if (entries.length > 0) {
          const [firstKey, firstVal] = entries[0];
          const firstValStr =
            typeof firstVal === "object" && firstVal !== null
              ? "\n" + serializeYAML(firstVal, indent + 4).trimEnd()
              : " " + serializeYAMLScalar(firstVal);
          result += prefix + "- " + firstKey + ":" + firstValStr + "\n";
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            const vStr =
              typeof v === "object" && v !== null
                ? "\n" + serializeYAML(v, indent + 4).trimEnd()
                : " " + serializeYAMLScalar(v);
            result += prefix + "  " + k + ":" + vStr + "\n";
          }
        }
      } else {
        result += prefix + "- " + serializeYAMLScalar(item) + "\n";
      }
    }
    return result;
  }
  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return prefix + "{}\n";
    let result = "";
    for (const [key, val] of entries) {
      if (typeof val === "object" && val !== null) {
        result += prefix + key + ":\n" + serializeYAML(val, indent + 2);
      } else {
        result += prefix + key + ": " + serializeYAMLScalar(val) + "\n";
      }
    }
    return result;
  }
  return prefix + String(data) + "\n";
}

function serializeYAMLScalar(val: unknown): string {
  if (val === null || val === undefined) return "null";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  if (typeof val === "string") {
    if (val.includes(":") || val.includes("#") || val.includes("\n")) {
      return '"' + val.replace(/"/g, '\\"') + '"';
    }
    return val;
  }
  return String(val);
}

function serializeXML(data: unknown, rootTag: string = "root", indent: number = 0): string {
  const prefix = " ".repeat(indent);
  if (typeof data !== "object" || data === null) {
    return prefix + `<${rootTag}>${escapeXML(String(data))}</${rootTag}>`;
  }
  if (Array.isArray(data)) {
    return data.map((item) => serializeXML(item, "item", indent)).join("\n");
  }
  const entries = Object.entries(data as Record<string, unknown>);
  const attrs = entries
    .filter(([k]) => k.startsWith("@"))
    .map(([k, v]) => ` ${k.slice(1)}="${escapeXML(String(v))}"`)
    .join("");
  const children = entries.filter(([k]) => !k.startsWith("@") && k !== "#text");
  const textVal = entries.find(([k]) => k === "#text");
  if (children.length === 0) {
    const text = textVal ? escapeXML(String(textVal[1])) : "";
    return prefix + `<${rootTag}${attrs}>${text}</${rootTag}>`;
  }
  let result = prefix + `<${rootTag}${attrs}>\n`;
  for (const [key, val] of children) {
    if (Array.isArray(val)) {
      for (const item of val) {
        result += serializeXML(item, key, indent + 2) + "\n";
      }
    } else {
      result += serializeXML(val, key, indent + 2) + "\n";
    }
  }
  result += prefix + `</${rootTag}>`;
  return result;
}

function escapeXML(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function serializeCSV(data: unknown, delimiter: string = ","): string {
  if (!Array.isArray(data)) throw new Error("Data must be an array of objects for CSV/TSV");
  if (data.length === 0) return "";
  const headers = Object.keys(data[0] as Record<string, unknown>);
  const escapeField = (val: unknown): string => {
    const s = val === null || val === undefined ? "" : String(val);
    if (s.includes(delimiter) || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const rows = [headers.map(escapeField).join(delimiter)];
  for (const row of data) {
    const obj = row as Record<string, unknown>;
    rows.push(headers.map((h) => escapeField(obj[h])).join(delimiter));
  }
  return rows.join("\n");
}

function serializeSQLInsert(data: unknown, tableName: string): string {
  if (!Array.isArray(data)) throw new Error("Data must be an array of objects for SQL INSERT");
  if (data.length === 0) return "-- No data";
  const name = tableName.trim() || "table_name";
  const headers = Object.keys(data[0] as Record<string, unknown>);
  const colList = headers.map((h) => `"${h}"`).join(", ");
  const lines: string[] = [];
  for (const row of data) {
    const obj = row as Record<string, unknown>;
    const vals = headers
      .map((h) => {
        const v = obj[h];
        if (v === null || v === undefined) return "NULL";
        if (typeof v === "number") return String(v);
        if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
        return "'" + String(v).replace(/'/g, "''") + "'";
      })
      .join(", ");
    lines.push(`INSERT INTO ${name} (${colList}) VALUES (${vals});`);
  }
  return lines.join("\n");
}

function serializeHTMLTable(data: unknown): string {
  if (!Array.isArray(data)) throw new Error("Data must be an array of objects for HTML Table");
  if (data.length === 0) return "<table></table>";
  const headers = Object.keys(data[0] as Record<string, unknown>);
  let html = "<table>\n  <thead>\n    <tr>\n";
  for (const h of headers) {
    html += `      <th>${escapeXML(h)}</th>\n`;
  }
  html += "    </tr>\n  </thead>\n  <tbody>\n";
  for (const row of data) {
    const obj = row as Record<string, unknown>;
    html += "    <tr>\n";
    for (const h of headers) {
      const val = obj[h] ?? "";
      html += `      <td>${escapeXML(String(val))}</td>\n`;
    }
    html += "    </tr>\n";
  }
  html += "  </tbody>\n</table>";
  return html;
}

function serializeTSInterface(data: unknown, name: string = "Root"): string {
  if (typeof data !== "object" || data === null) {
    return `type ${name} = ${inferTSType(data)};`;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return `type ${name} = unknown[];`;
    const first = data[0];
    if (typeof first === "object" && first !== null && !Array.isArray(first)) {
      return serializeTSInterface(first, name) + `\n\ntype ${name}Array = ${name}[];`;
    }
    return `type ${name} = ${inferTSType(first)}[];`;
  }
  const entries = Object.entries(data as Record<string, unknown>);
  let result = `interface ${name} {\n`;
  const nested: string[] = [];
  for (const [key, val] of entries) {
    const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      const subName = key.charAt(0).toUpperCase() + key.slice(1);
      result += `  ${safeName}: ${subName};\n`;
      nested.push(serializeTSInterface(val, subName));
    } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
      const subName = key.charAt(0).toUpperCase() + key.slice(1) + "Item";
      result += `  ${safeName}: ${subName}[];\n`;
      nested.push(serializeTSInterface(val[0], subName));
    } else {
      result += `  ${safeName}: ${inferTSType(val)};\n`;
    }
  }
  result += "}";
  if (nested.length > 0) {
    result = nested.join("\n\n") + "\n\n" + result;
  }
  return result;
}

function inferTSType(val: unknown): string {
  if (val === null || val === undefined) return "null";
  if (typeof val === "string") return "string";
  if (typeof val === "number") return "number";
  if (typeof val === "boolean") return "boolean";
  if (Array.isArray(val)) {
    if (val.length === 0) return "unknown[]";
    return inferTSType(val[0]) + "[]";
  }
  return "Record<string, unknown>";
}

function serializeJSONSchema(data: unknown): string {
  const schema = inferSchema(data);
  return JSON.stringify(
    { $schema: "http://json-schema.org/draft-07/schema#", ...schema },
    null,
    2
  );
}

function inferSchema(val: unknown): Record<string, unknown> {
  if (val === null) return { type: "null" };
  if (typeof val === "string") return { type: "string" };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { type: "integer" } : { type: "number" };
  }
  if (typeof val === "boolean") return { type: "boolean" };
  if (Array.isArray(val)) {
    if (val.length === 0) return { type: "array", items: {} };
    return { type: "array", items: inferSchema(val[0]) };
  }
  if (typeof val === "object") {
    const entries = Object.entries(val as Record<string, unknown>);
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [key, v] of entries) {
      properties[key] = inferSchema(v);
      required.push(key);
    }
    return { type: "object", properties, required };
  }
  return {};
}

// --------------- SAMPLES ---------------

const samples: Record<Format, string> = {
  JSON: JSON.stringify(
    [
      { id: 1, name: "Alice", email: "alice@example.com", active: true },
      { id: 2, name: "Bob", email: "bob@example.com", active: false },
      { id: 3, name: "Charlie", email: "charlie@example.com", active: true },
    ],
    null,
    2
  ),
  YAML: `- id: 1
  name: Alice
  email: alice@example.com
  active: true
- id: 2
  name: Bob
  email: bob@example.com
  active: false
- id: 3
  name: Charlie
  email: charlie@example.com
  active: true`,
  XML: `<users>
  <user>
    <id>1</id>
    <name>Alice</name>
    <email>alice@example.com</email>
    <active>true</active>
  </user>
  <user>
    <id>2</id>
    <name>Bob</name>
    <email>bob@example.com</email>
    <active>false</active>
  </user>
</users>`,
  CSV: `id,name,email,active
1,Alice,alice@example.com,true
2,Bob,bob@example.com,false
3,Charlie,charlie@example.com,true`,
  TSV: `id\tname\temail\tactive
1\tAlice\talice@example.com\ttrue
2\tBob\tbob@example.com\tfalse
3\tCharlie\tcharlie@example.com\ttrue`,
  "SQL INSERT": "",
  "HTML Table": "",
  "TypeScript Interface": "",
  "JSON Schema": "",
};

// --------------- CONVERSION ---------------

function parseInput(input: string, format: Format): unknown {
  switch (format) {
    case "JSON":
      return parseJSON(input);
    case "YAML":
      return parseYAML(input);
    case "XML":
      return parseXML(input);
    case "CSV":
      return parseCSV(input);
    case "TSV":
      return parseCSV(input, "\t");
    default:
      throw new Error(`Parsing from "${format}" is not supported`);
  }
}

function serializeOutput(data: unknown, format: Format, tableName: string): string {
  switch (format) {
    case "JSON":
      return serializeJSON(data);
    case "YAML":
      return serializeYAML(data).trimEnd();
    case "XML":
      return serializeXML(data);
    case "CSV":
      return serializeCSV(data);
    case "TSV":
      return serializeCSV(data, "\t");
    case "SQL INSERT":
      return serializeSQLInsert(data, tableName);
    case "HTML Table":
      return serializeHTMLTable(data);
    case "TypeScript Interface":
      return serializeTSInterface(data);
    case "JSON Schema":
      return serializeJSONSchema(data);
    default:
      throw new Error(`Serializing to "${format}" is not supported`);
  }
}

// --------------- COMPONENT ---------------

function DataConverterTool() {
  const [fromFormat, setFromFormat] = useState<Format>("JSON");
  const [toFormat, setToFormat] = useState<Format>("YAML");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [tableName, setTableName] = useState("table_name");

  const handleConvert = () => {
    setError("");
    setOutput("");
    try {
      const data = parseInput(input, fromFormat);
      const result = serializeOutput(data, toFormat, tableName);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const extMap: Record<Format, string> = {
      JSON: "json",
      YAML: "yaml",
      XML: "xml",
      CSV: "csv",
      TSV: "tsv",
      "SQL INSERT": "sql",
      "HTML Table": "html",
      "TypeScript Interface": "ts",
      "JSON Schema": "json",
    };
    const ext = extMap[toFormat] || "txt";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    const sample = samples[fromFormat];
    if (sample) {
      setInput(sample);
      setError("");
    } else {
      setError(`No sample available for "${fromFormat}" (serialize-only format)`);
    }
  };

  return (
    <Layout>
      <SEO title="Data Format Converter" description="Convert between JSON, YAML, XML, CSV, TSV, SQL, HTML Table, TypeScript, and JSON Schema." canonical="/data-converter" keywords="json to yaml, yaml to json, json to xml, csv to json, data converter" />
      <div className="container py-10">
        <h1 className="text-2xl font-mono font-bold text-foreground mb-6">
          Data Converter
        </h1>

        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-1">
              From
            </label>
            <select
              value={fromFormat}
              onChange={(e) => setFromFormat(e.target.value as Format)}
              className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {parseFormats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <span className="text-muted-foreground font-mono text-lg pb-1">&rarr;</span>

          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-1">
              To
            </label>
            <select
              value={toFormat}
              onChange={(e) => setToFormat(e.target.value as Format)}
              className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {serializeFormats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {toFormat === "SQL INSERT" && (
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-1">
                Table Name
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="table_name"
              />
            </div>
          )}

          <button
            onClick={handleConvert}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            Convert
          </button>

          <button
            onClick={handleLoadSample}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
          >
            Load Sample
          </button>
        </div>

        {error && (
          <p className="text-destructive text-sm font-mono mt-2 mb-4">{error}</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-mono text-muted-foreground mb-2">
              Input ({fromFormat})
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={`Paste your ${fromFormat} here...`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-mono text-muted-foreground">
                Output ({toFormat})
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-secondary rounded-lg border border-border p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Converted output will appear here..."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DataConverterTool;
