// Full blog content for all 35 blog posts
// Each post contains comprehensive markdown content (800-1500 words)

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag: string;
  content: string;
}

export const blogPostsMetadata: Omit<BlogPost, 'content'>[] = [
  { id: 1, slug: "base64-encoding-guide", title: "How to Encode and Decode Base64: A Complete Developer's Guide", date: "2026-03-28", excerpt: "Base64 encoding is a fundamental concept every developer should understand. Learn how it works and when to use it.", tag: "Fundamentals" },
  { id: 2, slug: "base64-when-to-use", title: "Base64 Encoding Explained: When and Why to Use It", date: "2026-03-27", excerpt: "Understand when Base64 is the right choice and when you should consider alternatives.", tag: "Best Practices" },
  { id: 3, slug: "base64-vs-other-encoding", title: "Base64 vs Other Encoding Methods: Comparison Guide", date: "2026-03-26", excerpt: "Compare Base64 with other popular encoding methods to make informed decisions.", tag: "Comparison" },
  { id: 4, slug: "base64-common-errors", title: "Common Base64 Encoding Errors and How to Fix Them", date: "2026-03-25", excerpt: "Identify and fix the most common Base64 encoding errors in your applications.", tag: "Troubleshooting" },
  { id: 5, slug: "base64-api-best-practices", title: "Base64 in API Development: Best Practices", date: "2026-03-24", excerpt: "Learn best practices for using Base64 effectively in modern APIs.", tag: "API" },
  { id: 6, slug: "code-diff-tools-guide", title: "Code Diff Tools: The Ultimate Guide for Developers", date: "2026-03-23", excerpt: "Master code diff tools to improve your productivity and code review process.", tag: "Tools" },
  { id: 7, slug: "compare-code-files-tutorial", title: "How to Compare Code Files: Step-by-Step Tutorial", date: "2026-03-22", excerpt: "Learn effective techniques for comparing code files and understanding changes.", tag: "Tutorial" },
  { id: 8, slug: "git-diff-vs-online-tools", title: "Git Diff vs Online Diff Tools: Which Should You Use?", date: "2026-03-21", excerpt: "Compare Git diff and online tools to choose the right solution for your workflow.", tag: "Comparison" },
  { id: 9, slug: "spotting-code-changes", title: "Spotting Code Changes: Using Diff Tools Effectively", date: "2026-03-20", excerpt: "Advanced techniques for identifying and analyzing code changes using diff tools.", tag: "Advanced" },
  { id: 10, slug: "merging-code-changes", title: "Merging Code Changes: Diff Tools in Version Control", date: "2026-03-19", excerpt: "Strategies and best practices for successful code merges using diff tools.", tag: "Version Control" },
  { id: 11, slug: "code-formatter-vs-beautifier", title: "Code Formatter vs Code Beautifier: What's the Difference?", date: "2026-03-18", excerpt: "Understand the distinction between formatters and beautifiers to choose the right tool.", tag: "Comparison" },
  { id: 12, slug: "top-code-formatters-2026", title: "Top 5 Code Formatters for 2026: Comparison and Review", date: "2026-03-17", excerpt: "Comprehensive review of the top code formatters available in 2026.", tag: "Review" },
  { id: 13, slug: "prettier-vs-black", title: "Prettier vs Black: Choosing the Right Code Formatter", date: "2026-03-16", excerpt: "Detailed comparison of Prettier and Black to help you choose the right formatter.", tag: "Comparison" },
  { id: 14, slug: "automatic-code-formatting", title: "Automatic Code Formatting: Improving Code Quality", date: "2026-03-15", excerpt: "Explore how automated formatting improves code quality and team collaboration.", tag: "Best Practices" },
  { id: 15, slug: "code-formatting-teams", title: "Code Formatting Best Practices for Teams", date: "2026-03-14", excerpt: "Establish effective code formatting standards for development teams.", tag: "Team" },
  { id: 16, slug: "color-pickers-guide", title: "Complete Guide to Color Pickers: Tools and Techniques", date: "2026-03-13", excerpt: "Master color pickers and techniques for effective color management.", tag: "Design" },
  { id: 17, slug: "rgb-hex-hsl-comparison", title: "RGB vs Hex vs HSL: Understanding Color Formats", date: "2026-03-12", excerpt: "Learn the differences between color formats and when to use each one.", tag: "Fundamentals" },
  { id: 18, slug: "harmonious-color-palettes", title: "Creating Harmonious Color Palettes: A Designer's Guide", date: "2026-03-11", excerpt: "Learn color theory and practical techniques for creating beautiful palettes.", tag: "Design" },
  { id: 19, slug: "color-psychology-web-design", title: "Color Psychology in Web Design: Choosing the Right Palette", date: "2026-03-10", excerpt: "Explore color psychology and choose effective palettes for web design.", tag: "Psychology" },
  { id: 20, slug: "accessibility-color-selection", title: "Accessibility in Color Selection: WCAG Guidelines", date: "2026-03-09", excerpt: "Learn WCAG guidelines and techniques for choosing accessible colors.", tag: "Accessibility" },
  { id: 21, slug: "jwt-decoder-debug", title: "JWT Decoder: How to Debug JSON Web Tokens", date: "2026-03-08", excerpt: "Learn how to decode and debug JWT tokens effectively.", tag: "Security" },
  { id: 22, slug: "understanding-jwt-guide", title: "Understanding JWT: A Complete Guide for Developers", date: "2026-03-07", excerpt: "Comprehensive guide covering everything you need to know about JWT.", tag: "Fundamentals" },
  { id: 23, slug: "jwt-authentication-security", title: "JWT Authentication: Security Best Practices", date: "2026-03-06", excerpt: "Essential security practices for JWT authentication implementation.", tag: "Security" },
  { id: 24, slug: "decoding-jwt-claims", title: "Decoding JWT Claims: What Each Part Means", date: "2026-03-05", excerpt: "Understand JWT claims and their purposes for effective token management.", tag: "Guide" },
  { id: 25, slug: "jwt-vs-session-tokens", title: "JWT vs Session Tokens: Which Should You Use?", date: "2026-03-04", excerpt: "Compare JWT and session-based authentication to choose the right approach.", tag: "Comparison" },
  { id: 26, slug: "regex-tester-tutorial", title: "Regex Tester Tutorial: Master Regular Expressions", date: "2026-03-03", excerpt: "Learn how to test and debug regex patterns effectively.", tag: "Tutorial" },
  { id: 27, slug: "common-regex-patterns", title: "Common Regex Patterns: Email, Phone, URL Validation", date: "2026-03-02", excerpt: "Battle-tested regex patterns for common validation tasks.", tag: "Patterns" },
  { id: 28, slug: "regex-performance-optimization", title: "Regex Performance: Optimization Tips and Tricks", date: "2026-03-01", excerpt: "Optimize regex patterns for better application performance.", tag: "Performance" },
  { id: 29, slug: "regex-different-languages", title: "Regex in Different Languages: JavaScript, Python, PHP", date: "2026-02-28", excerpt: "Write portable regex patterns across different programming languages.", tag: "Cross-Platform" },
  { id: 30, slug: "debugging-regex-patterns", title: "Debugging Regex Patterns: Common Mistakes and Solutions", date: "2026-02-27", excerpt: "Identify and fix common regex mistakes with effective debugging techniques.", tag: "Debugging" },
  { id: 31, slug: "url-encoding-explained", title: "URL Encoding Explained: Why and How It Works", date: "2026-02-26", excerpt: "Understand why URL encoding exists and how to properly encode URLs.", tag: "Fundamentals" },
  { id: 32, slug: "url-encoder-vs-decoder", title: "URL Encoder vs URL Decoder: When to Use Each", date: "2026-02-25", excerpt: "Learn when to use URL encoding and decoding techniques.", tag: "Guide" },
  { id: 33, slug: "percent-encoding-guide", title: "Percent Encoding in URLs: A Complete Guide", date: "2026-02-24", excerpt: "Master percent encoding rules, examples, and best practices.", tag: "Guide" },
  { id: 34, slug: "url-encoding-special-characters", title: "URL Encoding Special Characters: Best Practices", date: "2026-02-23", excerpt: "Learn best practices for encoding special characters in URLs safely.", tag: "Best Practices" },
  { id: 35, slug: "url-encoding-programming-languages", title: "URL Encoding in Different Programming Languages", date: "2026-02-22", excerpt: "Compare URL encoding implementations across JavaScript, Python, PHP, Java, and C#.", tag: "Cross-Platform" },
];

