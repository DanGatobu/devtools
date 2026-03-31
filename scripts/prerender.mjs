/**
 * Post-build prerendering script.
 * Generates per-route HTML files with proper meta tags and visible content
 * so Googlebot sees real HTML instead of an empty <div id="root">.
 *
 * Runs after `vite build` and modifies files in dist/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// All routes with their SEO data
const routes = [
  // Homepage
  { path: '/', title: 'DevTools - Free Online Developer Utilities', description: 'Free online developer utilities including JSON formatter, Base64 encoder, password generator, and 40+ more tools. No sign-up required.', keywords: 'developer tools, online tools, free tools, json formatter, base64 encoder' },

  // Original tools
  { path: '/json', title: 'JSON Formatter & Validator', description: 'Format, validate, and minify JSON data online for free. Pretty print JSON with configurable indentation.', keywords: 'json formatter, json validator, json beautifier, json minifier, pretty print json' },
  { path: '/base64', title: 'Base64 Encoder/Decoder', description: 'Encode text to Base64 or decode Base64 strings online instantly. Supports UTF-8 and file encoding.', keywords: 'base64 encode, base64 decode, base64 converter, base64 online' },
  { path: '/url', title: 'URL Encoder/Decoder', description: 'Encode, decode, and parse URLs online. Extract query parameters, protocol, host, and path from any URL.', keywords: 'url encoder, url decoder, url parser, encode url online' },
  { path: '/color', title: 'Color Converter', description: 'Convert colors between HEX, RGB, HSL, HSV, and CMYK formats. Free online color converter with live preview.', keywords: 'hex to rgb, rgb to hex, color converter, hsl converter, color picker' },
  { path: '/regex', title: 'Regex Tester', description: 'Test and debug regular expressions online with real-time matching, flags support, and match highlighting.', keywords: 'regex tester, regex validator, regular expression tester, regex online' },
  { path: '/jwt', title: 'JWT Decoder', description: 'Decode and inspect JWT tokens online. View header, payload, and claims without verification.', keywords: 'jwt decoder, jwt parser, json web token decoder, jwt online' },
  { path: '/code-formatter', title: 'Code Formatter', description: 'Format and beautify code in JSON, XML, HTML, CSS, SQL, and JavaScript. Free online code beautifier.', keywords: 'code formatter, code beautifier, javascript formatter, html formatter' },
  { path: '/code-diff', title: 'Code Diff Tool', description: 'Compare two code snippets side by side with a real diff algorithm. Highlight insertions, deletions, and modifications.', keywords: 'code diff, diff checker, compare code, text diff, file comparison' },
  { path: '/xml', title: 'XML Formatter', description: 'Format, validate, and minify XML data online. Proper DOMParser-based formatting with CDATA and namespace support.', keywords: 'xml formatter, xml beautifier, xml validator, xml minifier' },

  // Phase 1
  { path: '/password-generator', title: 'Password Generator', description: 'Generate secure random passwords with customizable length and character sets. Uses cryptographic randomness.', keywords: 'password generator, random password, secure password generator, strong password' },
  { path: '/word-counter', title: 'Word Counter', description: 'Count words, characters, sentences, paragraphs with reading time. Free online word counter with frequency analysis.', keywords: 'word counter, character counter, letter counter, word count online' },
  { path: '/qr-code', title: 'QR Code Generator', description: 'Generate QR codes from text, URLs, WiFi, email, or phone numbers. Download as PNG with customizable colors.', keywords: 'qr code generator, create qr code, qr code maker, generate qr code' },
  { path: '/case-converter', title: 'Case Converter', description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and 6 more formats.', keywords: 'case converter, text case changer, uppercase converter, lowercase converter' },
  { path: '/uuid-generator', title: 'UUID Generator', description: 'Generate random UUID v4 identifiers. Bulk generate, validate, and copy UUIDs instantly.', keywords: 'uuid generator, guid generator, uuid v4, random uuid, unique identifier' },
  { path: '/lorem-ipsum', title: 'Lorem Ipsum Generator', description: 'Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words. Free dummy text generator.', keywords: 'lorem ipsum generator, placeholder text, dummy text, lipsum generator' },
  { path: '/hash-generator', title: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Free online hash calculator.', keywords: 'md5 hash generator, sha256 generator, hash calculator, sha1 generator' },
  { path: '/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages four ways: X% of Y, what percent, percentage change, and percentage difference.', keywords: 'percentage calculator, percent calculator, calculate percentage' },
  { path: '/timestamp-converter', title: 'Unix Timestamp Converter', description: 'Convert Unix timestamps to human-readable dates and back. Live current timestamp display.', keywords: 'unix timestamp converter, epoch converter, timestamp to date' },
  { path: '/number-base', title: 'Number Base Converter', description: 'Convert between decimal, binary, hexadecimal, and octal. Supports BigInt for large numbers.', keywords: 'binary converter, hex converter, decimal to binary, number base converter' },

  // Phase 2
  { path: '/image-base64', title: 'Image to Base64 Converter', description: 'Convert images to Base64 strings and decode Base64 back to images. Supports drag and drop.', keywords: 'image to base64, base64 to image, image encoder, base64 image converter' },
  { path: '/css-gradient', title: 'CSS Gradient Generator', description: 'Create beautiful CSS gradients visually. Supports linear, radial, and conic gradients.', keywords: 'css gradient generator, linear gradient, radial gradient, css gradient maker' },
  { path: '/css-box-shadow', title: 'CSS Box Shadow Generator', description: 'Design CSS box shadows with live preview. Multiple shadows and inset support.', keywords: 'css box shadow generator, box shadow css, shadow generator' },
  { path: '/json-csv', title: 'JSON to CSV Converter', description: 'Convert between JSON and CSV formats. Download results as files.', keywords: 'json to csv, csv to json, json csv converter' },
  { path: '/markdown', title: 'Markdown to HTML Converter', description: 'Convert Markdown to HTML and HTML to Markdown with live preview.', keywords: 'markdown to html, html to markdown, markdown converter' },
  { path: '/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age in years, months, days, hours. Next birthday countdown included.', keywords: 'age calculator, calculate age, how old am i, birthday calculator' },
  { path: '/color-palette', title: 'Color Palette Generator', description: 'Generate harmonious color palettes. Complementary, analogous, triadic, and monochromatic schemes.', keywords: 'color palette generator, color scheme generator, complementary colors' },
  { path: '/minifier', title: 'HTML CSS JS Minifier', description: 'Minify and beautify HTML, CSS, and JavaScript code. Reduce file sizes instantly.', keywords: 'html minifier, css minifier, javascript minifier, code minifier' },
  { path: '/cron', title: 'Cron Expression Generator', description: 'Build and parse cron expressions with a visual editor. See next execution times.', keywords: 'cron expression generator, cron builder, crontab generator, cron schedule' },
  { path: '/text-binary', title: 'Text to Binary Converter', description: 'Convert text to binary, decimal, hexadecimal, and octal. Real-time bidirectional conversion.', keywords: 'text to binary, binary to text, binary converter, ascii to binary' },

  // Phase 3
  { path: '/unit-converter', title: 'Unit Converter', description: 'Convert between units of length, weight, temperature, volume, area, speed, data, time, pressure, and energy.', keywords: 'unit converter, length converter, weight converter, temperature converter' },
  { path: '/text-tools', title: 'Text Tools', description: 'Sort lines, remove duplicates, reverse text, find and replace, add line numbers, and more text utilities.', keywords: 'sort text, remove duplicate lines, reverse text, find and replace' },
  { path: '/math-tools', title: 'Math Tools & Calculators', description: 'Average, fraction, GCF/LCM, prime checker, BMI, tip calculator, and more.', keywords: 'average calculator, fraction calculator, bmi calculator, prime checker' },
  { path: '/date-time', title: 'Date & Time Tools', description: 'Date difference, countdown timer, stopwatch, time zone converter, week number calculator.', keywords: 'date difference calculator, countdown timer, stopwatch online, time zone converter' },
  { path: '/random-generators', title: 'Random Generators', description: 'Generate random numbers, strings, names, colors, dice rolls, coin flips, and more.', keywords: 'random number generator, random name generator, dice roller, coin flip' },
  { path: '/fancy-text', title: 'Fancy Text Generator', description: 'Generate bold, italic, gothic, script, upside down, and 16 more Unicode text styles.', keywords: 'fancy text generator, unicode text, bold text generator, cursive text' },
  { path: '/morse-code', title: 'Morse Code Translator', description: 'Translate text to Morse code and back with audio playback. Adjustable speed.', keywords: 'morse code translator, text to morse, morse code converter' },
  { path: '/finance-tools', title: 'Finance Calculators', description: 'Compound interest, mortgage, loan, savings goal, discount, and VAT calculators.', keywords: 'compound interest calculator, mortgage calculator, loan calculator' },
  { path: '/string-encoder', title: 'String Encoder/Decoder', description: 'Encode and decode HTML entities, ROT13, Unicode, hex, JSON escape, SQL escape, and more.', keywords: 'html entity encoder, rot13, json escape, sql escape, string encoder' },
  { path: '/data-converter', title: 'Data Format Converter', description: 'Convert between JSON, YAML, XML, CSV, TSV, SQL, HTML Table, TypeScript, and JSON Schema.', keywords: 'json to yaml, yaml to json, json to xml, csv to json, data converter' },

  // Phase 4
  { path: '/image-tools', title: 'Image Tools', description: 'Compress, resize, convert, crop, rotate images and apply filters. All processing in your browser.', keywords: 'image compressor, image resizer, image converter, crop image online' },
  { path: '/chart-maker', title: 'Chart Maker', description: 'Create bar charts, pie charts, line charts, and doughnut charts online. Download as PNG.', keywords: 'chart maker, pie chart maker, bar chart maker, graph maker online' },
  { path: '/css-tools', title: 'CSS Generators', description: 'Generate CSS for border-radius, text-shadow, flexbox, grid, glassmorphism, triangles, and units.', keywords: 'css border radius generator, flexbox generator, css grid generator' },
  { path: '/social-media', title: 'Social Media Tools', description: 'Download YouTube thumbnails, generate OG meta tags, Twitter cards, and browse emoji.', keywords: 'youtube thumbnail downloader, og meta generator, twitter card generator' },
  { path: '/seo-tools', title: 'SEO Tools', description: 'URL slug generator, keyword density checker, headline analyzer, robots.txt builder, schema markup.', keywords: 'seo tools, url slug generator, keyword density checker, schema markup generator' },
  { path: '/interactive-tools', title: 'Interactive Tools', description: 'Click speed test, typing speed test, WCAG color contrast checker, and screen info.', keywords: 'click speed test, typing test, cps test, color contrast checker' },

  // Blog
  { path: '/blog', title: 'Developer Blog', description: 'Articles and guides about developer tools, coding best practices, and web development.', keywords: 'developer blog, coding tutorials, web development guides' },
];

// Read the template HTML
const templateHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

let created = 0;

for (const route of routes) {
  if (route.path === '/') continue; // Homepage already has index.html

  const fullTitle = route.path === '/'
    ? route.title
    : `${route.title} - Free Online Developer Tool | DevTools`;

  const canonicalUrl = `https://devtoolss.sbs${route.path}`;

  // Build the modified HTML with route-specific meta tags and visible content
  let html = templateHtml;

  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${fullTitle}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${route.description}"`
  );

  // Replace keywords
  html = html.replace(
    /<meta name="keywords" content="[^"]*"/,
    `<meta name="keywords" content="${route.keywords}"`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${canonicalUrl}"`
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${fullTitle}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${route.description}"`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${canonicalUrl}"`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${fullTitle}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${route.description}"`
  );
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*"/,
    `<meta name="twitter:url" content="${canonicalUrl}"`
  );

  // Add JSON-LD structured data and visible content for crawlers
  // Insert before closing </head>
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": route.title,
    "description": route.description,
    "url": canonicalUrl,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`
  );

  // Add visible pre-rendered content inside <div id="root"> for crawlers
  // React will hydrate over this, but crawlers see real content immediately
  const prerenderContent = `
    <div style="max-width:768px;margin:0 auto;padding:40px 16px;font-family:ui-monospace,monospace">
      <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:16px">${route.title}</h1>
      <p style="color:#888;margin-bottom:24px">${route.description}</p>
      <p style="color:#666;font-size:0.875rem">Loading tool...</p>
    </div>`;

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${prerenderContent}</div>`
  );

  // Create directory and write file
  const routeDir = path.join(distDir, route.path);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), html);
  created++;
}

console.log(`\n✅ Prerendered ${created} route HTML files for SEO`);
