import {
  Braces,
  Binary,
  Link,
  Palette,
  Regex,
  KeyRound,
  Code2,
  GitCompare,
  FileCode,
} from "lucide-react";

export const toolsList = [
  { title: "JSON Formatter", description: "Format, validate and minify JSON data", href: "/json", icon: Braces, color: "primary" as const },
  { title: "Base64 Tool", description: "Encode and decode Base64 strings", href: "/base64", icon: Binary, color: "cyan" as const },
  { title: "URL Tool", description: "Encode, decode and parse URLs", href: "/url", icon: Link, color: "amber" as const },
  { title: "Color Tool", description: "Convert between HEX, RGB, HSL formats", href: "/color", icon: Palette, color: "violet" as const },
  { title: "Regex Tool", description: "Test and debug regular expressions", href: "/regex", icon: Regex, color: "primary" as const },
  { title: "JWT Tool", description: "Decode and inspect JWT tokens", href: "/jwt", icon: KeyRound, color: "cyan" as const },
  { title: "Code Formatter", description: "Format and beautify code snippets", href: "/code-formatter", icon: Code2, color: "amber" as const },
  { title: "Code Diff", description: "Compare two code snippets side by side", href: "/code-diff", icon: GitCompare, color: "violet" as const },
  { title: "XML Tool", description: "Format, validate and minify XML data", href: "/xml", icon: FileCode, color: "primary" as const },
];
