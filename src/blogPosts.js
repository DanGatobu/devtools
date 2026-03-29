// Full blog content for all 35 blog posts
// Each post contains comprehensive markdown content (800-1500 words)

export const fullBlogContent = {
  // BASE64 POSTS (IDs 1-5)
  1: `# How to Encode and Decode Base64: A Complete Developer's Guide

Base64 encoding is a fundamental concept every developer should understand. Whether you're working with APIs, handling binary data, or embedding images in HTML, Base64 encoding plays a crucial role in modern web development.

## What is Base64 Encoding?

Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It uses 64 different characters (A-Z, a-z, 0-9, +, /) to represent data, making it safe for transmission over text-based protocols.

### Why Use Base64?

- **Email Attachments**: SMTP protocol requires text-based encoding
- **Data URLs**: Embed images directly in HTML/CSS
- **API Communication**: Send binary data in JSON
- **Authentication**: Basic HTTP authentication uses Base64
- **Storage**: Store binary data in text-based databases

## How Base64 Encoding Works

Base64 encoding converts 3 bytes (24 bits) of binary data into 4 ASCII characters (6 bits each). Here's the process:

1. Take 3 bytes of input data (24 bits)
2. Divide into 4 groups of 6 bits
3. Convert each 6-bit group to a Base64 character
4. Add padding ('=') if needed

### Example Conversion

\\`\\`\`
Text: "Cat"
Binary: 01000011 01100001 01110100
Base64 groups: 010000 110110 000101 110100
Base64: Q2F0
\`\`\`

## Encoding Base64 in Different Languages

### JavaScript

\`\`\`javascript
// Encoding
const text = "Hello, World!";
const encoded = btoa(text);
console.log(encoded); // SGVsbG8sIFdvcmxkIQ==

// Decoding
const decoded = atob(encoded);
console.log(decoded); // Hello, World!

// For Unicode strings
const unicodeText = "Hello 世界";
const encodedUnicode = btoa(unescape(encodeURIComponent(unicodeText)));
console.log(encodedUnicode);
\`\`\`

### Python

\`\`\`python
import base64

# Encoding
text = "Hello, World!"
encoded = base64.b64encode(text.encode('utf-8'))
print(encoded)  # b'SGVsbG8sIFdvcmxkIQ=='

# Decoding
decoded = base64.b64decode(encoded).decode('utf-8')
print(decoded)  # Hello, World!
\`\`\`

### PHP

\`\`\`php
<?php
// Encoding
$text = "Hello, World!";
$encoded = base64_encode($text);
echo $encoded;  // SGVsbG8sIFdvcmxkIQ==

// Decoding
$decoded = base64_decode($encoded);
echo $decoded;  // Hello, World!
?>
\`\`\`

### Java

\`\`\`java
import java.util.Base64;

public class Base64Example {
    public static void main(String[] args) {
        // Encoding
        String text = "Hello, World!";
        String encoded = Base64.getEncoder().encodeToString(text.getBytes());
        System.out.println(encoded);  // SGVsbG8sIFdvcmxkIQ==
        
        // Decoding
        byte[] decoded = Base64.getDecoder().decode(encoded);
        System.out.println(new String(decoded));  // Hello, World!
    }
}
\`\`\`


## Common Use Cases

### 1. Data URLs for Images

\`\`\`html
<!-- Embed image directly in HTML -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." alt="Red dot" />
\`\`\`

### 2. API Authentication

\`\`\`javascript
// Basic Authentication
const username = "user";
const password = "pass";
const credentials = btoa(\`\${username}:\${password}\`);
const headers = {
  'Authorization': \`Basic \${credentials}\`
};
\`\`\`

### 3. File Upload

\`\`\`javascript
// Convert file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Usage
const file = document.querySelector('input[type="file"]').files[0];
const base64 = await fileToBase64(file);
\`\`\`

## Best Practices

### 1. Handle Unicode Properly

JavaScript's \`btoa()\` only works with ASCII. For Unicode:

\`\`\`javascript
function encodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode('0x' + p1)));
}

function decodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}
\`\`\`

### 2. Validate Input

Always validate Base64 strings before decoding:

\`\`\`javascript
function isValidBase64(str) {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(str)) return false;
  
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}
\`\`\`

### 3. Consider Size Overhead

Base64 encoding increases data size by approximately 33%. For large files, consider alternatives:

- Direct binary transfer
- Compression before encoding
- Chunked uploads

## Performance Considerations

### Memory Usage

\`\`\`javascript
// Bad: Loading entire file into memory
const largeFile = fs.readFileSync('large-file.bin');
const encoded = largeFile.toString('base64');

// Good: Stream processing
const fs = require('fs');
const stream = fs.createReadStream('large-file.bin', { encoding: 'base64' });
stream.pipe(process.stdout);
\`\`\`

### Optimization Tips

1. **Cache encoded results** when encoding the same data repeatedly
2. **Use streaming** for large files
3. **Compress before encoding** to reduce size
4. **Validate early** to avoid unnecessary processing

## Security Considerations

### Base64 is NOT Encryption

Base64 is encoding, not encryption. Never use it for:

- Storing passwords
- Protecting sensitive data
- Security through obscurity

### Proper Use Cases

\`\`\`javascript
// Good: Encoding binary data for transport
const imageData = base64Encode(binaryImage);

// Bad: "Securing" passwords
const password = btoa("mypassword"); // NOT SECURE!

// Good: Use proper encryption
const crypto = require('crypto');
const encrypted = crypto.createCipher('aes-256-cbc', key).update(password);
\`\`\`

## Troubleshooting Common Issues

### Issue 1: Invalid Character Error

\`\`\`javascript
// Problem: Unicode characters
btoa("Hello 世界"); // Error!

// Solution: Encode to UTF-8 first
btoa(unescape(encodeURIComponent("Hello 世界"))); // Works!
\`\`\`

### Issue 2: Padding Errors

Base64 strings must have proper padding:

\`\`\`javascript
function fixPadding(base64) {
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return base64;
}
\`\`\`

### Issue 3: URL-Safe Base64

Standard Base64 uses +/ which aren't URL-safe:

\`\`\`javascript
function toUrlSafeBase64(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromUrlSafeBase64(urlSafe) {
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) base64 += '=';
  return base64;
}
\`\`\`

## Conclusion

Base64 encoding is an essential tool for developers working with binary data in text-based systems. Understanding when and how to use it properly ensures efficient, secure data handling in your applications. Remember that Base64 is for encoding, not encryption, and always consider the 33% size overhead when working with large datasets.

**Key Takeaways:**
- Base64 converts binary data to ASCII text
- Increases data size by ~33%
- Essential for APIs, emails, and data URLs
- Not a security mechanism
- Handle Unicode carefully in JavaScript
- Use streaming for large files`,


  2: `# Base64 Encoding Explained: When and Why to Use It

Base64 encoding serves specific purposes in web development, but it's often misunderstood or misused. This guide explains when Base64 is the right choice and when you should consider alternatives.

## Understanding Base64's Purpose

Base64 encoding was designed to solve a specific problem: transmitting binary data through systems that only support text. It's not about compression, security, or obfuscation—it's purely about compatibility.

### The Core Problem

Many protocols and systems were designed for text:
- Email (SMTP, MIME)
- HTTP headers
- JSON and XML
- URLs
- Text-based databases

When you need to send binary data (images, files, encrypted data) through these systems, Base64 provides a reliable solution.

## When to Use Base64

### 1. Embedding Small Images in HTML/CSS

**Use Case:** Reduce HTTP requests for small icons and images.

\\`\\`\\`html
<!-- Data URL with Base64 -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA
AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot" />
\\`\\`\`

**Benefits:**
- Eliminates HTTP request
- Faster for small images (<5KB)
- Useful for critical above-the-fold content

**Drawbacks:**
- Increases HTML size by 33%
- Not cached separately
- Slower for large images

### 2. API Data Transfer

**Use Case:** Sending binary data in JSON payloads.

\`\`\`javascript
// Sending file data via API
const fileData = await readFileAsBase64(file);

fetch('/api/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filename: file.name,
    content: fileData,
    mimeType: file.type
  })
});
\`\`\`

**Why Base64?**
- JSON doesn't support binary data
- Ensures data integrity
- Works with any HTTP client

### 3. Email Attachments

**Use Case:** MIME email attachments.

\`\`\`python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# Attach file with Base64 encoding
with open('document.pdf', 'rb') as f:
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(f.read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment; filename=document.pdf')
\`\`\`

### 4. Basic HTTP Authentication

**Use Case:** Simple authentication headers.

\`\`\`javascript
const username = 'admin';
const password = 'secret123';
const credentials = btoa(\`\${username}:\${password}\`);

fetch('/api/protected', {
  headers: {
    'Authorization': \`Basic \${credentials}\`
  }
});
\`\`\`

**Note:** Always use HTTPS with Basic Auth!

### 5. Storing Binary Data in Text Fields

**Use Case:** Legacy databases without BLOB support.

\`\`\`sql
-- Storing image in text field
INSERT INTO profiles (user_id, avatar_base64)
VALUES (1, 'iVBORw0KGgoAAAANSUhEUgAAAAUA...');
\`\`\`

## When NOT to Use Base64

### 1. Large File Storage

**Problem:** 33% size overhead becomes significant.

\`\`\`javascript
// Bad: Storing large files as Base64
const largeImage = fs.readFileSync('10mb-image.jpg');
const base64 = largeImage.toString('base64'); // Now 13.3 MB!

// Good: Use direct binary storage
const imageBuffer = fs.readFileSync('10mb-image.jpg');
await s3.putObject({ Body: imageBuffer });
\`\`\`

### 2. Security/Encryption

**Problem:** Base64 is easily decoded—it's not encryption!

\`\`\`javascript
// WRONG: This is NOT secure
const "encrypted" = btoa(password);

// RIGHT: Use proper encryption
const crypto = require('crypto');
const encrypted = crypto.createCipheriv('aes-256-gcm', key, iv)
  .update(password, 'utf8', 'base64');
\`\`\`

### 3. URL Parameters (Use URL-Safe Variant)

**Problem:** Standard Base64 contains +/ characters.

\`\`\`javascript
// Bad: Standard Base64 in URL
const url = \`/api/data?token=\${btoa(token)}\`; // May break!

// Good: URL-safe Base64
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
\`\`\`

### 4. Performance-Critical Applications

**Problem:** Encoding/decoding adds CPU overhead.

\`\`\`javascript
// Benchmark comparison
console.time('Binary Transfer');
await fetch('/api/file', { 
  method: 'POST',
  body: binaryData,
  headers: { 'Content-Type': 'application/octet-stream' }
});
console.timeEnd('Binary Transfer'); // ~100ms

console.time('Base64 Transfer');
const base64 = btoa(String.fromCharCode(...new Uint8Array(binaryData)));
await fetch('/api/file', {
  method: 'POST',
  body: JSON.stringify({ data: base64 }),
  headers: { 'Content-Type': 'application/json' }
});
console.timeEnd('Base64 Transfer'); // ~150ms
\`\`\`

## Alternatives to Base64

### 1. Multipart Form Data

For file uploads:

\`\`\`javascript
const formData = new FormData();
formData.append('file', fileBlob);

fetch('/api/upload', {
  method: 'POST',
  body: formData // Browser handles encoding
});
\`\`\`

### 2. Binary Protocols

For real-time applications:

\`\`\`javascript
// WebSocket with binary data
const ws = new WebSocket('ws://example.com');
ws.binaryType = 'arraybuffer';
ws.send(binaryData); // No encoding needed
\`\`\`

### 3. Direct Binary Storage

For databases:

\`\`\`sql
-- Use BLOB instead of Base64 text
CREATE TABLE images (
  id INT PRIMARY KEY,
  data BLOB NOT NULL
);
\`\`\`

### 4. External Storage

For large files:

\`\`\`javascript
// Store file in S3, save URL in database
const url = await uploadToS3(file);
await db.query('INSERT INTO files (url) VALUES (?)', [url]);
\`\`\`

## Decision Framework

Use this flowchart to decide:

\`\`\`
Need to send binary data?
  ├─ Through JSON/XML? → Use Base64
  ├─ Through HTTP? 
  │   ├─ Small file (<100KB)? → Consider Base64
  │   └─ Large file? → Use multipart/form-data
  ├─ Through WebSocket? → Use binary mode
  └─ Store in database?
      ├─ Legacy text-only DB? → Use Base64
      └─ Modern DB? → Use BLOB
\`\`\`

## Real-World Examples

### Example 1: Profile Picture Upload

\`\`\`javascript
// Client-side: Convert to Base64 for preview
function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    // Show preview using Base64
    document.getElementById('preview').src = e.target.result;
    
    // Send original file (not Base64) to server
    uploadFile(file);
  };
  
  reader.readAsDataURL(file); // Creates Base64 data URL
}

// Server-side: Store as binary
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  
  await fetch('/api/avatar', {
    method: 'POST',
    body: formData // Sent as binary
  });
}
\`\`\`

### Example 2: Email with Inline Images

\`\`\`html
<!-- Email HTML with embedded images -->
<html>
  <body>
    <h1>Welcome!</h1>
    <img src="cid:logo" alt="Logo" />
    <!-- Actual image attached as Base64 in MIME part -->
  </body>
</html>
\`\`\`

### Example 3: Canvas Export

\`\`\`javascript
// Export canvas as Base64 for download
const canvas = document.getElementById('myCanvas');
const dataURL = canvas.toDataURL('image/png'); // Base64 data URL

// Convert to blob for efficient upload
canvas.toBlob(async (blob) => {
  const formData = new FormData();
  formData.append('image', blob);
  await fetch('/api/save', { method: 'POST', body: formData });
});
\`\`\`

## Performance Optimization

### Lazy Loading Base64 Images

\`\`\`javascript
// Load Base64 images on demand
const lazyImages = document.querySelectorAll('img[data-base64]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.base64;
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));
\`\`\`

### Caching Strategy

\`\`\`javascript
// Cache Base64 conversions
const base64Cache = new Map();

async function getCachedBase64(file) {
  const key = \`\${file.name}-\${file.lastModified}\`;
  
  if (base64Cache.has(key)) {
    return base64Cache.get(key);
  }
  
  const base64 = await fileToBase64(file);
  base64Cache.set(key, base64);
  return base64;
}
\`\`\`

## Conclusion

Base64 encoding is a valuable tool when used appropriately. Use it for:
- Small embedded images
- JSON API data transfer
- Email attachments
- Text-based protocols

Avoid it for:
- Large file storage
- Security purposes
- Performance-critical operations
- When binary alternatives exist

Understanding these use cases ensures you choose the right encoding strategy for your specific needs, balancing compatibility, performance, and maintainability.`,


  3: `# Base64 vs Other Encoding Methods: Comparison Guide

Choosing the right encoding method is crucial for your project's performance, security, and maintainability. This comprehensive guide compares Base64 with other popular encoding methods to help you make informed decisions.

## Overview of Encoding Methods

### Base64
- **Purpose:** Binary-to-text encoding
- **Character Set:** A-Z, a-z, 0-9, +, / (64 characters)
- **Overhead:** 33% size increase
- **Use Case:** Text-based protocols

### Hexadecimal (Hex)
- **Purpose:** Binary-to-text encoding
- **Character Set:** 0-9, A-F (16 characters)
- **Overhead:** 100% size increase
- **Use Case:** Human-readable binary representation

### URL Encoding (Percent Encoding)
- **Purpose:** Safe URL transmission
- **Character Set:** Alphanumeric + %XX for special chars
- **Overhead:** Varies (0-200%)
- **Use Case:** URL parameters and paths

### Binary
- **Purpose:** Raw data storage/transmission
- **Character Set:** All 256 byte values
- **Overhead:** 0%
- **Use Case:** Direct file storage, efficient transmission

## Detailed Comparison

### Base64 vs Hexadecimal

#### Size Comparison

\\`\\`\\`javascript
const data = "Hello, World!";
const buffer = Buffer.from(data);

// Base64
const base64 = buffer.toString('base64');
console.log('Base64:', base64); // SGVsbG8sIFdvcmxkIQ==
console.log('Length:', base64.length); // 20 characters

// Hexadecimal
const hex = buffer.toString('hex');
console.log('Hex:', hex); // 48656c6c6f2c20576f726c6421
console.log('Length:', hex.length); // 26 characters

// Original
console.log('Original:', data.length); // 13 characters
\\`\\`\`

**Size Analysis:**
- Original: 13 bytes
- Base64: 20 bytes (54% increase)
- Hex: 26 bytes (100% increase)

#### When to Use Each

**Use Base64 when:**
- Embedding in JSON/XML
- Email attachments
- Data URLs
- Space efficiency matters

**Use Hex when:**
- Debugging binary data
- Cryptographic hashes
- Color codes (#RRGGBB)
- Human readability is priority

\`\`\`javascript
// Hex for color codes
const color = '#FF5733';

// Hex for hash display
const crypto = require('crypto');
const hash = crypto.createHash('sha256')
  .update('password')
  .digest('hex');
console.log(hash); // 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8

// Base64 for API transfer
const imageData = fs.readFileSync('image.png').toString('base64');
await api.upload({ image: imageData });
\`\`\`

### Base64 vs URL Encoding

#### Character Safety

\`\`\`javascript
const data = "Hello World! @#$%";

// URL Encoding
const urlEncoded = encodeURIComponent(data);
console.log(urlEncoded); 
// Hello%20World!%20%40%23%24%25

// Base64
const base64 = btoa(data);
console.log(base64); 
// SGVsbG8gV29ybGQhIEAjJCU=

// URL-Safe Base64
const urlSafeBase64 = base64
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');
console.log(urlSafeBase64);
// SGVsbG8gV29ybGQhIEAjJCU
\`\`\`

**Use URL Encoding when:**
- Encoding URL parameters
- Form data submission
- Query strings
- Preserving readability

**Use Base64 when:**
- Binary data in URLs
- Compact representation needed
- Data contains many special characters

\`\`\`javascript
// URL Encoding for parameters
const searchQuery = "user@example.com";
const url = \`/search?email=\${encodeURIComponent(searchQuery)}\`;
// /search?email=user%40example.com

// Base64 for tokens
const token = { userId: 123, exp: Date.now() };
const tokenString = btoa(JSON.stringify(token));
const apiUrl = \`/api/verify?token=\${tokenString}\`;
\`\`\`

### Base64 vs Binary Transfer

#### Performance Comparison

\`\`\`javascript
const fs = require('fs');
const express = require('express');
const app = express();

// Binary transfer (efficient)
app.post('/upload/binary', (req, res) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync('file.bin', buffer);
    res.send('OK');
  });
});

// Base64 transfer (less efficient)
app.post('/upload/base64', express.json(), (req, res) => {
  const base64Data = req.body.data;
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('file.bin', buffer);
  res.send('OK');
});
\`\`\`

**Performance Metrics (1MB file):**

| Method | Size | Encode Time | Decode Time | Total Time |
|--------|------|-------------|-------------|------------|
| Binary | 1.0 MB | 0ms | 0ms | ~50ms |
| Base64 | 1.33 MB | 15ms | 12ms | ~90ms |
| Hex | 2.0 MB | 20ms | 18ms | ~120ms |

**Use Binary when:**
- Performance is critical
- Large files (>1MB)
- Direct file storage
- WebSocket communication

**Use Base64 when:**
- JSON API required
- Text-only protocols
- Small to medium files
- Cross-platform compatibility

### Base64 vs Compression

#### Combined Approach

\`\`\`javascript
const zlib = require('zlib');

// Original data
const data = "A".repeat(1000); // 1000 bytes

// Base64 only
const base64Only = Buffer.from(data).toString('base64');
console.log('Base64 only:', base64Only.length); // 1336 bytes

// Compression only
const compressed = zlib.gzipSync(data);
console.log('Compressed:', compressed.length); // ~20 bytes

// Compression + Base64
const compressedBase64 = compressed.toString('base64');
console.log('Compressed + Base64:', compressedBase64.length); // ~28 bytes
\`\`\`

**Best Practice:** Compress before encoding for large, repetitive data.

\`\`\`javascript
// Efficient approach for large data
async function efficientTransfer(data) {
  // 1. Compress
  const compressed = zlib.gzipSync(data);
  
  // 2. Encode to Base64
  const base64 = compressed.toString('base64');
  
  // 3. Send
  await fetch('/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip'
    },
    body: JSON.stringify({ data: base64 })
  });
}

// Server-side decode
function decodeData(base64) {
  const compressed = Buffer.from(base64, 'base64');
  const decompressed = zlib.gunzipSync(compressed);
  return decompressed.toString();
}
\`\`\`

## Encoding Method Selection Matrix

### By Use Case

| Use Case | Recommended | Alternative | Avoid |
|----------|-------------|-------------|-------|
| Email attachments | Base64 | - | Binary |
| URL parameters | URL Encoding | URL-safe Base64 | Standard Base64 |
| JSON API | Base64 | Hex | Binary |
| File storage | Binary | Base64 (small files) | Hex |
| Debugging | Hex | Base64 | Binary |
| WebSocket | Binary | Base64 | Hex |
| Color codes | Hex | RGB notation | Base64 |
| Cryptographic hashes | Hex | Base64 | Binary |

### By Data Size

\`\`\`javascript
function chooseEncoding(dataSize) {
  if (dataSize < 1024) {
    // < 1KB: Any method works
    return 'base64'; // Most compatible
  } else if (dataSize < 1024 * 100) {
    // 1KB - 100KB: Consider overhead
    return 'base64-compressed';
  } else {
    // > 100KB: Minimize overhead
    return 'binary';
  }
}
\`\`\`

## Practical Implementation Examples

### Example 1: Image Handling

\`\`\`javascript
class ImageEncoder {
  // Small icons: Base64 data URLs
  static async toDataURL(file) {
    if (file.size > 10240) { // > 10KB
      throw new Error('File too large for data URL');
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }
  
  // Large images: Binary upload
  static async uploadBinary(file) {
    const formData = new FormData();
    formData.append('image', file);
    return fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
  }
  
  // Medium images: Compressed Base64
  static async uploadCompressed(file) {
    const buffer = await file.arrayBuffer();
    const compressed = pako.gzip(new Uint8Array(buffer));
    const base64 = btoa(String.fromCharCode(...compressed));
    
    return fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: base64, compressed: true })
    });
  }
}
\`\`\`

### Example 2: Token Encoding

\`\`\`javascript
// URL-safe Base64 for tokens
class TokenEncoder {
  static encode(payload) {
    const json = JSON.stringify(payload);
    const base64 = btoa(json);
    // Make URL-safe
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  static decode(token) {
    // Restore standard Base64
    let base64 = token
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const json = atob(base64);
    return JSON.parse(json);
  }
}

// Usage
const token = TokenEncoder.encode({ userId: 123, role: 'admin' });
const url = \`/api/user?token=\${token}\`; // Safe in URL
\`\`\`

### Example 3: Multi-Format Support

\`\`\`javascript
class DataEncoder {
  static encode(data, format = 'auto') {
    const buffer = Buffer.from(data);
    
    if (format === 'auto') {
      // Choose based on data characteristics
      format = this.detectBestFormat(buffer);
    }
    
    switch (format) {
      case 'base64':
        return buffer.toString('base64');
      case 'hex':
        return buffer.toString('hex');
      case 'url':
        return encodeURIComponent(data);
      case 'binary':
        return buffer;
      default:
        throw new Error('Unknown format');
    }
  }
  
  static detectBestFormat(buffer) {
    const size = buffer.length;
    const entropy = this.calculateEntropy(buffer);
    
    if (size < 100) return 'base64';
    if (entropy < 0.5) return 'base64-compressed';
    if (size > 10000) return 'binary';
    return 'base64';
  }
  
  static calculateEntropy(buffer) {
    const freq = new Map();
    for (const byte of buffer) {
      freq.set(byte, (freq.get(byte) || 0) + 1);
    }
    
    let entropy = 0;
    for (const count of freq.values()) {
      const p = count / buffer.length;
      entropy -= p * Math.log2(p);
    }
    
    return entropy / 8; // Normalize to 0-1
  }
}
\`\`\`

## Conclusion

Choosing the right encoding method depends on your specific requirements:

- **Base64**: Best balance for most web applications
- **Hex**: Best for debugging and human readability
- **URL Encoding**: Best for URL parameters
- **Binary**: Best for performance and storage

Consider these factors:
1. **Size overhead** - How much can you afford?
2. **Performance** - Is speed critical?
3. **Compatibility** - What protocols are you using?
4. **Readability** - Do humans need to read it?
5. **Security** - Is this sensitive data? (Use encryption, not encoding!)

For most modern web applications, Base64 offers the best compromise between compatibility, efficiency, and ease of use.`,


  4: `# Common Base64 Encoding Errors and How to Fix Them

Base64 encoding can be tricky, especially when dealing with different character sets, platforms, and edge cases. This guide helps you identify and fix the most common Base64 encoding errors.

## Error 1: Invalid Character in Base64 String

### The Problem

\\`\\`\\`javascript
// This will throw an error
const invalid = "SGVsbG8gV29ybGQh@#$";
try {
  atob(invalid);
} catch (e) {
  console.error(e); // InvalidCharacterError
}
\\`\\`\`

### Why It Happens

Base64 only accepts: A-Z, a-z, 0-9, +, /, and = (for padding). Any other character causes an error.

### Solutions

\`\`\`javascript
// Solution 1: Validate before decoding
function isValidBase64(str) {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(str);
}

if (isValidBase64(input)) {
  const decoded = atob(input);
} else {
  console.error('Invalid Base64 string');
}

// Solution 2: Clean the string
function cleanBase64(str) {
  return str.replace(/[^A-Za-z0-9+/=]/g, '');
}

const cleaned = cleanBase64(invalid);
const decoded = atob(cleaned);

// Solution 3: Try-catch with fallback
function safeBase64Decode(str) {
  try {
    return atob(str);
  } catch (e) {
    console.error('Decode failed:', e.message);
    return null;
  }
}
\`\`\`

## Error 2: Unicode/UTF-8 Encoding Issues

### The Problem

\`\`\`javascript
// JavaScript's btoa() doesn't handle Unicode
const unicode = "Hello 世界 🌍";
try {
  btoa(unicode); // Error: String contains invalid character
} catch (e) {
  console.error(e);
}
\`\`\`

### Why It Happens

\`btoa()\` only works with Latin1 (ISO-8859-1) characters. Unicode characters outside this range cause errors.

### Solutions

\`\`\`javascript
// Solution 1: Use TextEncoder (Modern browsers)
function encodeUnicode(str) {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  const binaryString = String.fromCharCode(...uint8Array);
  return btoa(binaryString);
}

function decodeUnicode(base64) {
  const binaryString = atob(base64);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(uint8Array);
}

// Solution 2: Use encodeURIComponent (Universal)
function encodeUnicodeCompat(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode(parseInt(p1, 16))));
}

function decodeUnicodeCompat(base64) {
  return decodeURIComponent(Array.from(atob(base64), c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
}

// Solution 3: Use Buffer (Node.js)
function encodeUnicodeNode(str) {
  return Buffer.from(str, 'utf-8').toString('base64');
}

function decodeUnicodeNode(base64) {
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// Usage
const text = "Hello 世界 🌍";
const encoded = encodeUnicode(text);
const decoded = decodeUnicode(encoded);
console.log(decoded === text); // true
\`\`\`

## Error 3: Incorrect Padding

### The Problem

\`\`\`javascript
// Missing padding
const noPadding = "SGVsbG8"; // Should be "SGVsbG8="
try {
  atob(noPadding); // May work in some browsers, fail in others
} catch (e) {
  console.error(e);
}
\`\`\`

### Why It Happens

Base64 strings must be multiples of 4 characters. Padding (=) is added to reach this length.

### Solutions

\`\`\`javascript
// Solution 1: Add missing padding
function fixPadding(base64) {
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return base64;
}

const fixed = fixPadding("SGVsbG8");
const decoded = atob(fixed); // Works!

// Solution 2: Remove all padding and re-add
function normalizePadding(base64) {
  base64 = base64.replace(/=/g, '');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return base64;
}

// Solution 3: Validate padding
function hasValidPadding(base64) {
  if (base64.length % 4 !== 0) return false;
  const paddingMatch = base64.match(/=+$/);
  if (!paddingMatch) return true;
  return paddingMatch[0].length <= 2;
}
\`\`\`

## Error 4: URL-Unsafe Characters

### The Problem

\`\`\`javascript
// Standard Base64 in URL
const token = btoa("user:pass");
const url = \`/api?token=\${token}\`; // Contains + and /
// URL: /api?token=dXNlcjpwYXNz (works)

const token2 = btoa("test+data/info");
const url2 = \`/api?token=\${token2}\`; // Contains + and /
// URL: /api?token=dGVzdCtkYXRhL2luZm8= (may break!)
\`\`\`

### Why It Happens

Standard Base64 uses + and / which have special meaning in URLs.

### Solutions

\`\`\`javascript
// Solution 1: URL-safe Base64 encoding
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, ''); // Remove padding for URLs
}

function base64UrlDecode(str) {
  // Restore standard Base64
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

// Solution 2: Use encodeURIComponent
const token = btoa("test+data/info");
const safeUrl = \`/api?token=\${encodeURIComponent(token)}\`;

// Solution 3: Use dedicated library
// npm install base64-url
const base64url = require('base64-url');
const encoded = base64url.encode('test+data/info');
const decoded = base64url.decode(encoded);
\`\`\`

## Error 5: Line Breaks and Whitespace

### The Problem

\`\`\`javascript
// Base64 with line breaks (common in PEM files)
const pemStyle = \`
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+mRKmzMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTcwODIzMTUxNjQ3WhcNMTgwODIzMTUxNjQ3WjBF
-----END CERTIFICATE-----
\`;

try {
  atob(pemStyle); // Error!
} catch (e) {
  console.error(e);
}
\`\`\`

### Why It Happens

\`atob()\` doesn't handle whitespace or header/footer lines.

### Solutions

\`\`\`javascript
// Solution 1: Remove all whitespace and headers
function cleanPEM(pem) {
  return pem
    .replace(/-----BEGIN [^-]+-----/, '')
    .replace(/-----END [^-]+-----/, '')
    .replace(/\s/g, '');
}

const cleaned = cleanPEM(pemStyle);
const decoded = atob(cleaned);

// Solution 2: Process line by line
function decodePEM(pem) {
  const lines = pem.split('\n');
  const base64Lines = lines.filter(line => 
    !line.startsWith('-----') && line.trim().length > 0
  );
  const base64 = base64Lines.join('');
  return atob(base64);
}

// Solution 3: Comprehensive cleaner
function normalizeBase64(str) {
  return str
    .replace(/-----[^-]+-----/g, '') // Remove PEM headers
    .replace(/\s/g, '')               // Remove whitespace
    .replace(/[^A-Za-z0-9+/=]/g, ''); // Remove invalid chars
}
\`\`\`

## Error 6: Binary Data Corruption

### The Problem

\`\`\`javascript
// Encoding binary data incorrectly
const binaryData = new Uint8Array([0xFF, 0xFE, 0xFD]);
const wrong = btoa(binaryData); // Wrong! Converts to string first
console.log(wrong); // Corrupted data
\`\`\`

### Why It Happens

\`btoa()\` expects a string, not binary data. Direct conversion corrupts the data.

### Solutions

\`\`\`javascript
// Solution 1: Convert to binary string first
function binaryToBase64(uint8Array) {
  const binaryString = String.fromCharCode(...uint8Array);
  return btoa(binaryString);
}

function base64ToBinary(base64) {
  const binaryString = atob(base64);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}

// Solution 2: Use Buffer (Node.js)
function binaryToBase64Node(buffer) {
  return buffer.toString('base64');
}

function base64ToBinaryNode(base64) {
  return Buffer.from(base64, 'base64');
}

// Solution 3: Use FileReader for files
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data URL prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Usage
const data = new Uint8Array([0xFF, 0xFE, 0xFD]);
const encoded = binaryToBase64(data);
const decoded = base64ToBinary(encoded);
console.log(decoded); // Uint8Array [255, 254, 253] ✓
\`\`\`

## Error 7: Size Limit Exceeded

### The Problem

\`\`\`javascript
// Encoding very large files
const largeFile = new Uint8Array(100 * 1024 * 1024); // 100MB
try {
  const base64 = binaryToBase64(largeFile); // May crash!
} catch (e) {
  console.error('Out of memory');
}
\`\`\`

### Why It Happens

Base64 encoding loads entire data into memory, which can exceed limits.

### Solutions

\`\`\`javascript
// Solution 1: Chunk processing
function* base64EncodeChunks(uint8Array, chunkSize = 1024 * 1024) {
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, i + chunkSize);
    const binaryString = String.fromCharCode(...chunk);
    yield btoa(binaryString);
  }
}

// Usage
const largeData = new Uint8Array(100 * 1024 * 1024);
const chunks = [];
for (const chunk of base64EncodeChunks(largeData)) {
  chunks.push(chunk);
}
const fullBase64 = chunks.join('');

// Solution 2: Stream processing (Node.js)
const { Transform } = require('stream');

class Base64EncodeStream extends Transform {
  constructor() {
    super();
    this.buffer = Buffer.alloc(0);
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    
    // Process complete 3-byte groups
    const completeGroups = Math.floor(this.buffer.length / 3) * 3;
    if (completeGroups > 0) {
      const toEncode = this.buffer.slice(0, completeGroups);
      this.push(toEncode.toString('base64'));
      this.buffer = this.buffer.slice(completeGroups);
    }
    
    callback();
  }
  
  _flush(callback) {
    if (this.buffer.length > 0) {
      this.push(this.buffer.toString('base64'));
    }
    callback();
  }
}

// Usage
const fs = require('fs');
fs.createReadStream('large-file.bin')
  .pipe(new Base64EncodeStream())
  .pipe(fs.createWriteStream('large-file.b64'));

// Solution 3: Use Web Streams API
async function streamBase64Encode(file) {
  const stream = file.stream();
  const reader = stream.getReader();
  let result = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = binaryToBase64(value);
    result += chunk;
    
    // Process in chunks to avoid memory issues
    if (result.length > 10000) {
      await sendChunk(result);
      result = '';
    }
  }
  
  if (result.length > 0) {
    await sendChunk(result);
  }
}
\`\`\`

## Error 8: Cross-Platform Compatibility

### The Problem

\`\`\`javascript
// Code works in browser but fails in Node.js
const encoded = btoa("Hello"); // ReferenceError in Node.js < 16
\`\`\`

### Solutions

\`\`\`javascript
// Solution 1: Universal Base64 functions
const Base64 = {
  encode: (str) => {
    if (typeof btoa !== 'undefined') {
      return btoa(str);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(str).toString('base64');
    } else {
      throw new Error('No Base64 implementation available');
    }
  },
  
  decode: (str) => {
    if (typeof atob !== 'undefined') {
      return atob(str);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString();
    } else {
      throw new Error('No Base64 implementation available');
    }
  }
};

// Solution 2: Polyfill for Node.js
if (typeof btoa === 'undefined') {
  global.btoa = (str) => Buffer.from(str).toString('base64');
  global.atob = (str) => Buffer.from(str, 'base64').toString();
}

// Solution 3: Use isomorphic library
// npm install base-64
const base64 = require('base-64');
const encoded = base64.encode('Hello'); // Works everywhere
\`\`\`

## Debugging Checklist

When encountering Base64 errors, check:

1. **Character validity**: Only A-Z, a-z, 0-9, +, /, =
2. **Padding**: Length must be multiple of 4
3. **Unicode handling**: Use proper encoding for non-ASCII
4. **Whitespace**: Remove line breaks and spaces
5. **Binary data**: Convert to binary string first
6. **Size limits**: Use chunking for large data
7. **Platform compatibility**: Use universal functions
8. **URL safety**: Use URL-safe variant for URLs

## Comprehensive Error Handler

\`\`\`javascript
class Base64Handler {
  static encode(input, options = {}) {
    try {
      let str = input;
      
      // Handle different input types
      if (input instanceof Uint8Array) {
        str = String.fromCharCode(...input);
      } else if (typeof input !== 'string') {
        str = String(input);
      }
      
      // Handle Unicode
      if (options.unicode !== false) {
        str = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          (match, p1) => String.fromCharCode(parseInt(p1, 16)));
      }
      
      // Encode
      let result = btoa(str);
      
      // URL-safe if requested
      if (options.urlSafe) {
        result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      }
      
      return result;
    } catch (error) {
      throw new Error(\`Base64 encoding failed: \${error.message}\`);
    }
  }
  
  static decode(input, options = {}) {
    try {
      let str = input;
      
      // Clean input
      str = str.replace(/\s/g, ''); // Remove whitespace
      
      // Handle URL-safe
      if (options.urlSafe) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
      }
      
      // Fix padding
      while (str.length % 4) {
        str += '=';
      }
      
      // Validate
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
        throw new Error('Invalid Base64 string');
      }
      
      // Decode
      let result = atob(str);
      
      // Handle Unicode
      if (options.unicode !== false) {
        result = decodeURIComponent(Array.from(result, c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      }
      
      return result;
    } catch (error) {
      throw new Error(\`Base64 decoding failed: \${error.message}\`);
    }
  }
}

// Usage
const encoded = Base64Handler.encode("Hello 世界", { unicode: true, urlSafe: true });
const decoded = Base64Handler.decode(encoded, { unicode: true, urlSafe: true });
\`\`\`

## Conclusion

Most Base64 errors stem from:
- Unicode handling issues
- Invalid characters or padding
- Binary data conversion problems
- Platform-specific implementations

By understanding these common pitfalls and using the solutions provided, you can handle Base64 encoding reliably across all platforms and use cases.`,


  5: `# Base64 in API Development: Best Practices

Base64 encoding is essential in API development for handling binary data, authentication, and data transfer. This guide covers best practices for using Base64 effectively in modern APIs.

## Why Base64 in APIs?

APIs typically use JSON or XML for data exchange, both text-based formats. Base64 bridges the gap between binary data and text-based protocols.

### Common API Use Cases

1. **File uploads** via JSON
2. **Image data** transfer
3. **Authentication** tokens
4. **Binary attachments** in responses
5. **Encrypted data** transmission

## Best Practice 1: Choose the Right Approach

### When to Use Base64

\\`\\`\\`javascript
// Good: Small files in JSON API
POST /api/avatar
{
  "userId": 123,
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "filename": "avatar.png"
}

// Good: Authentication headers
GET /api/protected
Authorization: Basic dXNlcjpwYXNz

// Good: Embedded thumbnails
GET /api/products
{
  "products": [
    {
      "id": 1,
      "name": "Product",
      "thumbnail": "iVBORw0KGgo..." // Small preview
    }
  ]
}
\\`\\`\`

### When to Avoid Base64

\`\`\`javascript
// Bad: Large file uploads (use multipart/form-data)
POST /api/upload
Content-Type: multipart/form-data
// Binary file data

// Bad: Streaming data (use binary protocols)
WebSocket: binary frames

// Bad: Large responses (use direct file URLs)
GET /api/download/large-file
{
  "url": "https://cdn.example.com/file.zip",
  "expires": "2026-01-20T00:00:00Z"
}
\`\`\`

## Best Practice 2: Set Size Limits

### Implement Request Size Validation

\`\`\`javascript
// Express middleware
const MAX_BASE64_SIZE = 5 * 1024 * 1024; // 5MB

function validateBase64Size(req, res, next) {
  const base64Data = req.body.data;
  
  if (!base64Data) {
    return next();
  }
  
  // Calculate original size (Base64 is ~33% larger)
  const originalSize = (base64Data.length * 3) / 4;
  
  if (originalSize > MAX_BASE64_SIZE) {
    return res.status(413).json({
      error: 'Payload too large',
      maxSize: MAX_BASE64_SIZE,
      actualSize: originalSize
    });
  }
  
  next();
}

app.use(express.json({ limit: '10mb' }));
app.use(validateBase64Size);
\`\`\`

### Client-Side Validation

\`\`\`javascript
async function uploadFile(file) {
  const MAX_SIZE = 5 * 1024 * 1024;
  
  if (file.size > MAX_SIZE) {
    throw new Error(\`File too large. Max size: \${MAX_SIZE / 1024 / 1024}MB\`);
  }
  
  const base64 = await fileToBase64(file);
  
  return fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      data: base64,
      mimeType: file.type
    })
  });
}
\`\`\`

## Best Practice 3: Use Proper MIME Types

### Include Content Type Information

\`\`\`javascript
// API Request
POST /api/files
{
  "filename": "document.pdf",
  "mimeType": "application/pdf",
  "data": "JVBERi0xLjQKJeLjz9MK..."
}

// API Response
{
  "id": "file-123",
  "url": "/api/files/file-123",
  "mimeType": "application/pdf",
  "size": 102400,
  "data": "JVBERi0xLjQKJeLjz9MK..."
}
\`\`\`

### Server-Side MIME Validation

\`\`\`javascript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf'
];

function validateMimeType(base64Data, declaredMimeType) {
  // Detect actual MIME type from Base64 data
  const buffer = Buffer.from(base64Data, 'base64');
  const actualMimeType = detectMimeType(buffer);
  
  if (actualMimeType !== declaredMimeType) {
    throw new Error('MIME type mismatch');
  }
  
  if (!ALLOWED_MIME_TYPES.includes(actualMimeType)) {
    throw new Error('File type not allowed');
  }
  
  return true;
}

function detectMimeType(buffer) {
  // Check magic numbers
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'image/gif';
  if (buffer[0] === 0x25 && buffer[1] === 0x50) return 'application/pdf';
  return 'application/octet-stream';
}
\`\`\`

## Best Practice 4: Implement Compression

### Compress Before Encoding

\`\`\`javascript
const zlib = require('zlib');

// Server endpoint
app.post('/api/upload-compressed', async (req, res) => {
  const { data, compressed } = req.body;
  
  let buffer = Buffer.from(data, 'base64');
  
  if (compressed) {
    buffer = zlib.gunzipSync(buffer);
  }
  
  // Process uncompressed data
  await saveFile(buffer);
  
  res.json({ success: true });
});

// Client-side compression
async function uploadWithCompression(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Compress using pako (gzip library)
  const compressed = pako.gzip(uint8Array);
  
  // Convert to Base64
  const base64 = btoa(String.fromCharCode(...compressed));
  
  return fetch('/api/upload-compressed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      data: base64,
      compressed: true,
      originalSize: file.size
    })
  });
}
\`\`\`

### Compression Decision Logic

\`\`\`javascript
function shouldCompress(data, mimeType) {
  // Don't compress already compressed formats
  const compressedFormats = [
    'image/jpeg',
    'image/png',
    'video/mp4',
    'application/zip'
  ];
  
  if (compressedFormats.includes(mimeType)) {
    return false;
  }
  
  // Compress if data is large enough
  const MIN_SIZE_FOR_COMPRESSION = 1024; // 1KB
  return data.length > MIN_SIZE_FOR_COMPRESSION;
}

async function smartUpload(file) {
  const base64 = await fileToBase64(file);
  
  if (shouldCompress(base64, file.type)) {
    return uploadWithCompression(file);
  } else {
    return uploadWithoutCompression(file);
  }
}
\`\`\`

## Best Practice 5: Handle Authentication Securely

### Basic Authentication

\`\`\`javascript
// Client
function createBasicAuthHeader(username, password) {
  const credentials = btoa(\`\${username}:\${password}\`);
  return \`Basic \${credentials}\`;
}

// ALWAYS use HTTPS!
fetch('https://api.example.com/protected', {
  headers: {
    'Authorization': createBasicAuthHeader('user', 'pass')
  }
});

// Server
function parseBasicAuth(authHeader) {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }
  
  const base64 = authHeader.slice(6);
  const credentials = atob(base64);
  const [username, password] = credentials.split(':');
  
  return { username, password };
}

app.use((req, res, next) => {
  const auth = parseBasicAuth(req.headers.authorization);
  
  if (!auth || !validateCredentials(auth.username, auth.password)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  req.user = auth.username;
  next();
});
\`\`\`

### Bearer Tokens

\`\`\`javascript
// Don't use Base64 for security!
// Bad: Just encoding the token
const token = btoa(JSON.stringify({ userId: 123 }));

// Good: Use JWT with proper signing
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: 123 },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Client
fetch('/api/protected', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});
\`\`\`

## Best Practice 6: Optimize Response Payloads

### Pagination for Large Datasets

\`\`\`javascript
// Bad: Returning all images with Base64 data
GET /api/gallery
{
  "images": [
    { "id": 1, "data": "very long base64..." },
    { "id": 2, "data": "very long base64..." },
    // ... 1000 more images
  ]
}

// Good: Return URLs, load Base64 on demand
GET /api/gallery
{
  "images": [
    { "id": 1, "thumbnail": "small base64", "url": "/api/images/1" },
    { "id": 2, "thumbnail": "small base64", "url": "/api/images/2" }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 1000
  }
}

// Load full image when needed
GET /api/images/1
{
  "id": 1,
  "data": "full base64 data...",
  "mimeType": "image/jpeg"
}
\`\`\`

### Conditional Base64 Inclusion

\`\`\`javascript
// API with optional Base64 data
app.get('/api/files/:id', async (req, res) => {
  const file = await getFile(req.params.id);
  const includeData = req.query.includeData === 'true';
  
  const response = {
    id: file.id,
    filename: file.filename,
    mimeType: file.mimeType,
    size: file.size,
    url: \`/api/files/\${file.id}/download\`
  };
  
  if (includeData) {
    response.data = file.data.toString('base64');
  }
  
  res.json(response);
});

// Client usage
// Metadata only
const metadata = await fetch('/api/files/123').then(r => r.json());

// With Base64 data
const fullData = await fetch('/api/files/123?includeData=true').then(r => r.json());
\`\`\`

## Best Practice 7: Error Handling

### Comprehensive Error Responses

\`\`\`javascript
app.post('/api/upload', async (req, res) => {
  try {
    const { data, filename, mimeType } = req.body;
    
    // Validation
    if (!data) {
      return res.status(400).json({
        error: 'Missing required field: data',
        code: 'MISSING_DATA'
      });
    }
    
    // Validate Base64
    if (!isValidBase64(data)) {
      return res.status(400).json({
        error: 'Invalid Base64 encoding',
        code: 'INVALID_BASE64'
      });
    }
    
    // Decode
    let buffer;
    try {
      buffer = Buffer.from(data, 'base64');
    } catch (e) {
      return res.status(400).json({
        error: 'Failed to decode Base64 data',
        code: 'DECODE_ERROR',
        details: e.message
      });
    }
    
    // Size check
    if (buffer.length > MAX_SIZE) {
      return res.status(413).json({
        error: 'File too large',
        code: 'FILE_TOO_LARGE',
        maxSize: MAX_SIZE,
        actualSize: buffer.length
      });
    }
    
    // MIME type validation
    const actualMimeType = detectMimeType(buffer);
    if (actualMimeType !== mimeType) {
      return res.status(400).json({
        error: 'MIME type mismatch',
        code: 'MIME_MISMATCH',
        declared: mimeType,
        actual: actualMimeType
      });
    }
    
    // Save file
    const fileId = await saveFile(buffer, filename, mimeType);
    
    res.status(201).json({
      success: true,
      fileId,
      url: \`/api/files/\${fileId}\`
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});
\`\`\`

### Client-Side Error Handling

\`\`\`javascript
async function uploadWithErrorHandling(file) {
  try {
    const base64 = await fileToBase64(file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        data: base64,
        mimeType: file.type
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      switch (result.code) {
        case 'FILE_TOO_LARGE':
          throw new Error(\`File too large. Max: \${result.maxSize} bytes\`);
        case 'INVALID_BASE64':
          throw new Error('File encoding failed. Please try again.');
        case 'MIME_MISMATCH':
          throw new Error(\`Invalid file type. Expected: \${result.declared}\`);
        default:
          throw new Error(result.error || 'Upload failed');
      }
    }
    
    return result;
    
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
\`\`\`

## Best Practice 8: Documentation

### OpenAPI/Swagger Documentation

\`\`\`yaml
paths:
  /api/upload:
    post:
      summary: Upload file as Base64
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - filename
                - data
                - mimeType
              properties:
                filename:
                  type: string
                  example: "document.pdf"
                data:
                  type: string
                  format: byte
                  description: "Base64-encoded file data"
                  example: "JVBERi0xLjQK..."
                mimeType:
                  type: string
                  example: "application/pdf"
      responses:
        '201':
          description: File uploaded successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  fileId:
                    type: string
                  url:
                    type: string
        '400':
          description: Invalid request
        '413':
          description: File too large
\`\`\`

## Complete Example: File Upload API

\`\`\`javascript
// Server (Express)
const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

app.post('/api/files', async (req, res) => {
  try {
    const { filename, data, mimeType } = req.body;
    
    // Validate
    if (!filename || !data || !mimeType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Decode
    const buffer = Buffer.from(data, 'base64');
    
    // Save
    const fileId = await saveToStorage(buffer, filename, mimeType);
    
    res.status(201).json({
      fileId,
      url: \`/api/files/\${fileId}\`,
      size: buffer.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/:id', async (req, res) => {
  const file = await getFromStorage(req.params.id);
  
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.json({
    filename: file.filename,
    mimeType: file.mimeType,
    size: file.size,
    data: file.buffer.toString('base64')
  });
});

// Client
class FileAPI {
  static async upload(file) {
    const base64 = await this.fileToBase64(file);
    
    const response = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        data: base64,
        mimeType: file.type
      })
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  }
  
  static async download(fileId) {
    const response = await fetch(\`/api/files/\${fileId}\`);
    const data = await response.json();
    
    // Convert Base64 back to Blob
    const binary = atob(data.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    return new Blob([bytes], { type: data.mimeType });
  }
  
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
\`\`\`

## Conclusion

Base64 in API development requires careful consideration of:

1. **Size limits** - Implement validation
2. **MIME types** - Validate and document
3. **Compression** - Use for large text data
4. **Security** - Never rely on Base64 for encryption
5. **Performance** - Consider alternatives for large files
6. **Error handling** - Provide clear error messages
7. **Documentation** - Document Base64 expectations

Following these best practices ensures reliable, efficient, and secure API implementations.`,


  // CODE DIFF POSTS (IDs 6-10)
  6: `# Code Diff Tools: The Ultimate Guide for Developers

Code diff tools are essential for every developer's toolkit. Whether you're reviewing pull requests, debugging issues, or merging code, understanding how to effectively use diff tools can dramatically improve your productivity.

## What is a Code Diff Tool?

A code diff (difference) tool compares two versions of text or code and highlights the changes between them. It shows:
- **Added lines** (usually in green)
- **Removed lines** (usually in red)
- **Modified lines** (combination of additions and deletions)
- **Unchanged lines** (context)

### Why Use Diff Tools?

1. **Code Review**: Understand what changed in pull requests
2. **Debugging**: Find when bugs were introduced
3. **Merging**: Resolve conflicts between branches
4. **Documentation**: Track changes over time
5. **Learning**: Understand how code evolved

## Types of Diff Tools

### 1. Command-Line Tools

\\`\\`\\`bash
# Unix diff
diff file1.js file2.js

# Git diff
git diff main feature-branch

# Unified diff format
diff -u old.js new.js

# Side-by-side comparison
diff -y old.js new.js
\\`\\`\`

### 2. GUI Tools

Popular graphical diff tools:
- **Beyond Compare**: Professional comparison tool
- **Meld**: Open-source, cross-platform
- **KDiff3**: Three-way merge tool
- **P4Merge**: Free from Perforce
- **DiffMerge**: SourceGear's diff tool

### 3. Online Tools

Web-based diff tools:
- **GitHub/GitLab**: Built-in PR diffs
- **Diffchecker**: Simple online comparison
- **Text-Compare**: Quick text differences
- **Our Tool**: Developer-focused diff checker

### 4. IDE Integration

Most IDEs include diff tools:
- **VS Code**: Built-in diff viewer
- **IntelliJ IDEA**: Powerful comparison
- **Sublime Merge**: Git-focused
- **Atom**: GitHub integration

## Understanding Diff Formats

### Unified Diff Format

\`\`\`diff
--- old.js    2026-01-01 10:00:00
+++ new.js    2026-01-15 15:30:00
@@ -1,5 +1,6 @@
 function greet(name) {
-  console.log("Hello " + name);
+  console.log(\\\`Hello \\\${name}\\\`);
+  return name;
 }
 
 greet("World");
\`\`\`

**Explanation:**
- `---` and `+++`: Old and new file headers
- `@@`: Line number ranges
- `-`: Removed lines (red)
- `+`: Added lines (green)
- ` `: Unchanged lines (context)

### Context Diff Format

\`\`\`diff
*** old.js    2026-01-01 10:00:00
--- new.js    2026-01-15 15:30:00
***************
*** 1,5 ****
  function greet(name) {
!   console.log("Hello " + name);
  }
  
  greet("World");
--- 1,6 ----
  function greet(name) {
!   console.log(\`Hello \${name}\`);
!   return name;
  }
  
  greet("World");
\`\`\`

### Side-by-Side Format

\`\`\`
Old File                    | New File
--------------------------- | ---------------------------
function greet(name) {      | function greet(name) {
  console.log("Hello " +    |   console.log(\`Hello \${
    name);                  |     name}\`);
                            |   return name;
}                           | }
\`\`\`

## Using Git Diff Effectively

### Basic Git Diff Commands

\`\`\`bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged

# Compare branches
git diff main..feature

# Compare specific files
git diff main feature -- src/app.js

# Show word-level diff
git diff --word-diff

# Show statistics
git diff --stat

# Ignore whitespace
git diff -w
\`\`\`

### Advanced Git Diff

\`\`\`bash
# Show function names in diff
git diff --function-context

# Compare with specific commit
git diff HEAD~3 HEAD

# Show only file names
git diff --name-only

# Show changes in specific directory
git diff main feature -- src/

# Generate patch file
git diff > changes.patch

# Apply patch
git apply changes.patch
\`\`\`

### Configuring Git Diff

\`\`\`bash
# Set default diff tool
git config --global diff.tool meld

# Configure external tool
git config --global difftool.meld.cmd 'meld "$LOCAL" "$REMOTE"'

# Use configured tool
git difftool main feature

# Set diff algorithm
git config --global diff.algorithm histogram
\`\`\`

## Diff Algorithms

### Myers Algorithm (Default)

The most common algorithm, balances speed and quality.

\`\`\`javascript
// Example: Myers algorithm finds minimal edit distance
const old = ["A", "B", "C"];
const new = ["A", "X", "C"];
// Result: Keep A, Replace B with X, Keep C
\`\`\`

### Patience Algorithm

Better for code with many unique lines.

\`\`\`bash
git diff --patience old.js new.js
\`\`\`

### Histogram Algorithm

Improved version of patience, faster and more accurate.

\`\`\`bash
git diff --histogram old.js new.js
\`\`\`

## Practical Examples

### Example 1: Code Review

\`\`\`javascript
// Reviewing a pull request
// Old version (main branch)
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// New version (feature branch)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Diff shows:
// - Removed: for loop implementation
// - Added: reduce method
// - Benefit: More concise, functional approach
\`\`\`

### Example 2: Bug Investigation

\`\`\`bash
# Find when bug was introduced
git log --oneline src/auth.js
# a1b2c3d Fix login bug
# d4e5f6g Add remember me
# g7h8i9j Initial auth

# Compare working version with broken version
git diff g7h8i9j d4e5f6g src/auth.js

# Use git bisect for binary search
git bisect start
git bisect bad HEAD
git bisect good g7h8i9j
# Git will checkout commits to test
\`\`\`

### Example 3: Merge Conflict Resolution

\`\`\`javascript
// Conflict in file
<<<<<<< HEAD
function login(username, password) {
  return authenticate(username, password);
}
=======
function login(email, password) {
  return authenticateUser(email, password);
}
>>>>>>> feature-branch

// Use diff tool to see both versions
git difftool --tool=meld

// Resolved version
function login(usernameOrEmail, password) {
  return authenticateUser(usernameOrEmail, password);
}
\`\`\`

## Best Practices

### 1. Use Meaningful Context

\`\`\`bash
# Show more context lines (default is 3)
git diff -U10

# Show entire function
git diff --function-context
\`\`\`

### 2. Ignore Irrelevant Changes

\`\`\`bash
# Ignore whitespace changes
git diff -w

# Ignore blank lines
git diff --ignore-blank-lines

# Ignore specific files
git diff -- . ':(exclude)package-lock.json'
\`\`\`

### 3. Use Color Coding

\`\`\`bash
# Enable color (usually default)
git config --global color.diff auto

# Customize colors
git config --global color.diff.old "red bold"
git config --global color.diff.new "green bold"
\`\`\`

### 4. Create Readable Diffs

\`\`\`javascript
// Bad: Large changes in one commit
// Diff shows 500 lines changed

// Good: Small, focused commits
// Commit 1: Rename variables (50 lines)
// Commit 2: Refactor function (30 lines)
// Commit 3: Add error handling (20 lines)
\`\`\`

## Advanced Techniques

### Word-Level Diff

\`\`\`bash
# Show word differences instead of line differences
git diff --word-diff

# Example output:
# console.log([-"Hello " + name-]{+"Hello \${name}"+});
\`\`\`

### Move Detection

\`\`\`bash
# Detect moved code blocks
git diff --color-moved

# Show moved code in different color
git diff --color-moved=zebra
\`\`\`

### Three-Way Diff

\`\`\`bash
# Compare three versions (base, ours, theirs)
git diff HEAD...feature-branch

# Use three-way merge tool
git mergetool --tool=kdiff3
\`\`\`

## Building a Simple Diff Tool

\`\`\`javascript
// Simple diff implementation
function simpleDiff(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const diff = [];
  
  let i = 0, j = 0;
  
  while (i < lines1.length || j < lines2.length) {
    if (i >= lines1.length) {
      diff.push({ type: 'add', line: lines2[j], num: j + 1 });
      j++;
    } else if (j >= lines2.length) {
      diff.push({ type: 'remove', line: lines1[i], num: i + 1 });
      i++;
    } else if (lines1[i] === lines2[j]) {
      diff.push({ type: 'same', line: lines1[i], num: i + 1 });
      i++;
      j++;
    } else {
      // Simple heuristic: check next lines
      if (lines1[i + 1] === lines2[j]) {
        diff.push({ type: 'remove', line: lines1[i], num: i + 1 });
        i++;
      } else if (lines1[i] === lines2[j + 1]) {
        diff.push({ type: 'add', line: lines2[j], num: j + 1 });
        j++;
      } else {
        diff.push({ type: 'remove', line: lines1[i], num: i + 1 });
        diff.push({ type: 'add', line: lines2[j], num: j + 1 });
        i++;
        j++;
      }
    }
  }
  
  return diff;
}

// Usage
const old = "Hello\nWorld";
const new = "Hello\nBeautiful\nWorld";
const diff = simpleDiff(old, new);
console.log(diff);
\`\`\`

## Diff Tool Selection Guide

### For Code Review
- **GitHub/GitLab**: Built-in, collaborative
- **VS Code**: Quick local reviews
- **Beyond Compare**: Professional teams

### For Merge Conflicts
- **KDiff3**: Three-way merging
- **P4Merge**: Visual conflict resolution
- **Meld**: Simple and effective

### For Quick Comparisons
- **Online tools**: No installation needed
- **Command line**: Fast and scriptable
- **IDE built-in**: Convenient access

## Conclusion

Mastering diff tools is essential for modern development. Key takeaways:

1. **Understand diff formats** - Learn to read unified and context diffs
2. **Use the right tool** - Choose based on your workflow
3. **Configure properly** - Set up colors, algorithms, and tools
4. **Practice regularly** - Use diffs for code review and debugging
5. **Automate when possible** - Integrate into CI/CD pipelines

Effective use of diff tools improves code quality, speeds up reviews, and makes collaboration smoother.`,


  7: `# How to Compare Code Files: Step-by-Step Tutorial

Comparing code files is an essential skill for developers. Whether you're reviewing changes, debugging issues, or merging code, knowing how to effectively compare files saves time and prevents errors.

## Why Compare Code Files?

- **Code Review**: Understand what changed in pull requests
- **Debugging**: Find when and where bugs were introduced
- **Refactoring**: Verify changes didn't break functionality
- **Learning**: See how code evolved over time
- **Merging**: Resolve conflicts between versions

## Step 1: Choose Your Comparison Method

### Method 1: Command Line (Git)

Best for: Quick comparisons, automation, terminal users

\\`\\`\\`bash
# Compare two files
git diff file1.js file2.js

# Compare file across branches
git diff main:src/app.js feature:src/app.js

# Compare with previous commit
git diff HEAD~1 HEAD -- src/app.js
\\`\\`\`

### Method 2: GUI Tools

Best for: Visual comparison, complex merges, beginners

Popular tools:
- **VS Code**: Free, built-in
- **Beyond Compare**: Professional, paid
- **Meld**: Free, open-source
- **DiffMerge**: Free, cross-platform

### Method 3: Online Tools

Best for: Quick checks, no installation, sharing

- **Diffchecker.com**
- **Text-Compare.com**
- **Our DevTools Diff Tool**

## Step 2: Prepare Your Files

### Clean Up Formatting

\`\`\`javascript
// Before comparison, format both files consistently
// Use Prettier, ESLint, or your formatter

// Bad: Inconsistent formatting makes diff noisy
function hello(){console.log("hi");}

// Good: Consistent formatting
function hello() {
  console.log("hi");
}
\`\`\`

### Remove Unnecessary Differences

\`\`\`bash
# Ignore whitespace changes
git diff -w file1.js file2.js

# Ignore blank lines
git diff --ignore-blank-lines file1.js file2.js

# Ignore case changes
git diff --ignore-case file1.js file2.js
\`\`\`

## Step 3: Perform the Comparison

### Using Git Diff

\`\`\`bash
# Basic comparison
git diff old.js new.js

# With more context (10 lines instead of 3)
git diff -U10 old.js new.js

# Side-by-side view
git diff --color-words old.js new.js

# Generate patch file
git diff old.js new.js > changes.patch
\`\`\`

### Using VS Code

\`\`\`bash
# Open diff in VS Code
code --diff old.js new.js

# Or use Command Palette:
# 1. Ctrl+Shift+P (Cmd+Shift+P on Mac)
# 2. Type "Compare"
# 3. Select "File: Compare Active File With..."
\`\`\`

### Using Online Tool

1. Open diff tool website
2. Paste old code in left panel
3. Paste new code in right panel
4. Click "Compare" or "Find Differences"
5. Review highlighted changes

## Step 4: Analyze the Differences

### Understanding Diff Output

\`\`\`diff
--- old.js    2026-01-01
+++ new.js    2026-01-15
@@ -10,7 +10,8 @@
 function calculateTotal(items) {
-  let total = 0;
-  for (let i = 0; i < items.length; i++) {
-    total += items[i].price;
-  }
-  return total;
+  return items.reduce((sum, item) => {
+    return sum + item.price;
+  }, 0);
 }
\`\`\`

**Analysis:**
- **Lines 10-15**: Removed for loop
- **Lines 10-12**: Added reduce method
- **Impact**: More concise, functional approach
- **Risk**: Low (same functionality)

### Categorize Changes

\`\`\`javascript
// 1. Additions (New functionality)
+ function newFeature() {
+   return "new";
+ }

// 2. Deletions (Removed code)
- function oldFeature() {
-   return "old";
- }

// 3. Modifications (Changed logic)
- if (user.role === 'admin') {
+ if (user.role === 'admin' || user.role === 'superadmin') {

// 4. Refactoring (Same logic, different structure)
- const result = data.map(x => x * 2).filter(x => x > 10);
+ const doubled = data.map(x => x * 2);
+ const result = doubled.filter(x => x > 10);
\`\`\`

## Step 5: Review Critical Changes

### Security-Sensitive Changes

\`\`\`javascript
// Check for security implications
// Old (secure)
- if (user.isAuthenticated && user.hasPermission('admin')) {

// New (potentially insecure!)
+ if (user.isAuthenticated) {

// ⚠️ Flag this change for security review!
\`\`\`

### Performance Impact

\`\`\`javascript
// Old (O(n))
- const found = array.find(x => x.id === targetId);

// New (O(n²))
+ const found = array.filter(x => 
+   array.some(y => y.id === x.id && x.id === targetId)
+ )[0];

// ⚠️ Performance regression!
\`\`\`

### Breaking Changes

\`\`\`javascript
// Old API
- function getUser(id) {
-   return { id, name: users[id] };
- }

// New API (breaking change!)
+ async function getUser(id) {
+   return await fetchUser(id);
+ }

// ⚠️ Callers need to be updated!
\`\`\`

## Step 6: Document Your Findings

### Create a Review Checklist

\`\`\`markdown
## Code Review Checklist

### Changes Summary
- [ ] Refactored calculateTotal to use reduce
- [ ] Added error handling for null items
- [ ] Updated tests

### Security
- [ ] No security implications
- [ ] Input validation maintained

### Performance
- [ ] No performance regressions
- [ ] Reduce is O(n), same as loop

### Breaking Changes
- [ ] No breaking changes
- [ ] Backward compatible

### Tests
- [ ] All tests passing
- [ ] New tests added for edge cases

### Approval
- [ ] Approved
- [ ] Needs changes
- [ ] Rejected
\`\`\`

## Step 7: Handle Merge Conflicts

### Identifying Conflicts

\`\`\`javascript
// Conflict markers in file
<<<<<<< HEAD (Current Change)
function login(username, password) {
  return authenticate(username, password);
}
=======
function login(email, password) {
  return authenticateUser(email, password);
}
>>>>>>> feature-branch (Incoming Change)
\`\`\`

### Resolving Conflicts

\`\`\`bash
# Option 1: Use merge tool
git mergetool

# Option 2: Manual resolution
# Edit file to keep desired changes
function login(usernameOrEmail, password) {
  return authenticateUser(usernameOrEmail, password);
}

# Mark as resolved
git add resolved-file.js
git commit
\`\`\`

### Three-Way Comparison

\`\`\`
Base (Common Ancestor)    Ours (Current)           Theirs (Incoming)
function login(user) {    function login(user,     function login(email) {
  return auth(user);        password) {              return auth(email);
}                           return auth(user,      }
                              password);
                          }

Result (Merged):
function login(usernameOrEmail, password) {
  return auth(usernameOrEmail, password);
}
\`\`\`

## Practical Examples

### Example 1: Refactoring Review

\`\`\`javascript
// Old version
function processUsers(users) {
  const results = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      results.push({
        id: users[i].id,
        name: users[i].name.toUpperCase()
      });
    }
  }
  return results;
}

// New version
function processUsers(users) {
  return users
    .filter(user => user.active)
    .map(user => ({
      id: user.id,
      name: user.name.toUpperCase()
    }));
}

// Review notes:
// ✓ More readable
// ✓ Same functionality
// ✓ No performance impact
// ✓ Approved
\`\`\`

### Example 2: Bug Fix Verification

\`\`\`javascript
// Old (buggy)
function divide(a, b) {
  return a / b;
}

// New (fixed)
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Diff shows:
// + Added zero check
// + Throws error instead of returning Infinity
// ✓ Bug fixed correctly
\`\`\`

### Example 3: Feature Addition

\`\`\`javascript
// Old
class User {
  constructor(name) {
    this.name = name;
  }
}

// New
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  sendEmail(message) {
    return emailService.send(this.email, message);
  }
}

// Review notes:
// + Added email field
// + Added sendEmail method
// ⚠️ Breaking change: constructor signature changed
// ⚠️ Need to update all User instantiations
\`\`\`

## Advanced Techniques

### Comparing Directories

\`\`\`bash
# Compare entire directories
diff -r old-project/ new-project/

# Git directory comparison
git diff --stat main feature

# Show only changed files
git diff --name-only main feature
\`\`\`

### Comparing Across Branches

\`\`\`bash
# Compare specific file across branches
git diff main:src/app.js feature:src/app.js

# Compare all changes between branches
git diff main...feature

# Show commits that differ
git log main..feature
\`\`\`

### Automated Comparison

\`\`\`javascript
// Node.js script for automated comparison
const { execSync } = require('child_process');
const fs = require('fs');

function compareFiles(file1, file2) {
  try {
    const diff = execSync(\`git diff --no-index \${file1} \${file2}\`, {
      encoding: 'utf-8'
    });
    
    // Parse diff output
    const lines = diff.split('\n');
    const changes = {
      additions: lines.filter(l => l.startsWith('+')).length,
      deletions: lines.filter(l => l.startsWith('-')).length
    };
    
    return changes;
  } catch (error) {
    return { error: error.message };
  }
}

// Usage
const changes = compareFiles('old.js', 'new.js');
console.log(\`+\${changes.additions} -\${changes.deletions}\`);
\`\`\`

## Best Practices

### 1. Compare Small Changes

\`\`\`bash
# Bad: Compare 1000-line change
git diff huge-refactor

# Good: Compare incremental commits
git diff commit1 commit2
git diff commit2 commit3
\`\`\`

### 2. Use Meaningful Context

\`\`\`bash
# Show function names in diff
git diff --function-context

# Show more context lines
git diff -U10
\`\`\`

### 3. Ignore Noise

\`\`\`bash
# Ignore whitespace
git diff -w

# Ignore moved code
git diff --color-moved

# Ignore specific files
git diff -- . ':(exclude)package-lock.json'
\`\`\`

### 4. Document Decisions

\`\`\`markdown
## Review Comments

### Line 45: Changed authentication method
**Old**: Basic auth
**New**: JWT tokens
**Reason**: Improved security
**Impact**: All clients need updates
**Approved**: Yes, with migration plan
\`\`\`

## Troubleshooting Common Issues

### Issue 1: Too Many Differences

**Solution**: Compare incrementally

\`\`\`bash
# Instead of comparing endpoints
git diff v1.0 v2.0

# Compare intermediate versions
git diff v1.0 v1.5
git diff v1.5 v2.0
\`\`\`

### Issue 2: Formatting Noise

**Solution**: Ignore whitespace

\`\`\`bash
git diff -w --ignore-blank-lines
\`\`\`

### Issue 3: Binary Files

**Solution**: Use specialized tools

\`\`\`bash
# For images
git diff --binary

# For PDFs
diff-pdf old.pdf new.pdf
\`\`\`

## Conclusion

Effective file comparison requires:

1. **Right tool** - Choose based on your needs
2. **Preparation** - Format and clean files
3. **Analysis** - Understand the changes
4. **Review** - Check security, performance, breaking changes
5. **Documentation** - Record findings and decisions

Master these steps to become more efficient at code review, debugging, and collaboration.`,


  8: `# Git Diff vs Online Diff Tools: Which Should You Use?

Choosing between Git diff and online diff tools depends on your specific needs, workflow, and context. This comprehensive comparison helps you make the right choice for different scenarios.

## Quick Comparison Table

| Feature | Git Diff | Online Tools |
|---------|----------|--------------|
| **Speed** | Very fast | Depends on connection |
| **Privacy** | Local, secure | Data sent to server |
| **Integration** | Deep Git integration | Standalone |
| **Installation** | Requires Git | None needed |
| **Collaboration** | Via Git hosting | Direct sharing |
| **File Size** | No limits | Usually limited |
| **Offline** | Yes | No |
| **Learning Curve** | Moderate | Easy |

## Git Diff: Strengths and Use Cases

### Strengths

1. **Version Control Integration**
\\`\\`\\`bash
# Compare with any commit
git diff HEAD~5 HEAD

# Compare branches
git diff main feature

# See what changed in last commit
git diff HEAD^ HEAD
\\`\\`\`

2. **Performance**
- Instant results for large files
- No network latency
- Works offline

3. **Privacy and Security**
- All data stays local
- No third-party access
- Secure for sensitive code

4. **Advanced Features**
\`\`\`bash
# Word-level diff
git diff --word-diff

# Move detection
git diff --color-moved

# Function context
git diff --function-context

# Statistical summary
git diff --stat
\`\`\`

### Best Use Cases for Git Diff

#### 1. Code Review in Pull Requests

\`\`\`bash
# Review changes before committing
git diff

# Review staged changes
git diff --staged

# Compare feature branch with main
git diff main...feature-branch
\`\`\`

#### 2. Debugging and Git Bisect

\`\`\`bash
# Find when bug was introduced
git bisect start
git bisect bad HEAD
git bisect good v1.0

# At each step, check diff
git diff HEAD~1 HEAD
\`\`\`

#### 3. Merge Conflict Resolution

\`\`\`bash
# See conflicts
git diff

# Use merge tool
git mergetool

# Compare three-way
git diff --ours --theirs
\`\`\`

#### 4. Automated Workflows

\`\`\`bash
# CI/CD pipeline
#!/bin/bash
if git diff --quiet main HEAD -- src/; then
  echo "No changes in src/"
else
  echo "Running tests..."
  npm test
fi
\`\`\`

## Online Diff Tools: Strengths and Use Cases

### Strengths

1. **No Installation Required**
- Access from any device
- No setup needed
- Works on mobile

2. **Easy Sharing**
- Generate shareable links
- Collaborate in real-time
- No Git knowledge required

3. **User-Friendly Interface**
- Visual, intuitive
- Color-coded differences
- Side-by-side view

4. **Cross-Platform**
- Works on any OS
- Browser-based
- Consistent experience

### Best Use Cases for Online Tools

#### 1. Quick Ad-Hoc Comparisons

\`\`\`
Scenario: Compare two config files from different servers
Solution: Copy-paste into online tool
Time: 30 seconds
\`\`\`

#### 2. Non-Git Files

\`\`\`
Examples:
- Email content
- Documentation drafts
- Configuration files
- Log files
- API responses
\`\`\`

#### 3. Collaboration with Non-Developers

\`\`\`
Scenario: Show changes to project manager
Solution: Share online diff link
Benefit: No Git knowledge required
\`\`\`

#### 4. Mobile Access

\`\`\`
Scenario: Review changes on phone
Solution: Open online tool in mobile browser
Benefit: Works anywhere
\`\`\`

## Detailed Comparison

### Privacy and Security

**Git Diff:**
\`\`\`bash
# All data stays on your machine
git diff secret-file.js

# No network transmission
# No third-party access
# Full control over data
\`\`\`

**Online Tools:**
\`\`\`
⚠️ Considerations:
- Data sent to external server
- May be logged or cached
- Check privacy policy
- Use for non-sensitive data only
\`\`\`

**Recommendation:**
- **Sensitive code**: Use Git diff
- **Public/non-sensitive**: Either works
- **Proprietary code**: Git diff only

### Performance

**Git Diff:**
\`\`\`bash
# Instant for large files
time git diff large-file.js
# real    0m0.050s

# No network latency
# Efficient algorithms
# Handles huge repositories
\`\`\`

**Online Tools:**
\`\`\`
Factors affecting speed:
- Network speed
- Server load
- File size limits (usually 1-10MB)
- Browser performance
\`\`\`

**Recommendation:**
- **Large files**: Git diff
- **Small files**: Either works
- **Slow connection**: Git diff

### Features Comparison

**Git Diff Exclusive Features:**
\`\`\`bash
# Compare with any commit
git diff abc123 def456

# Branch comparison
git diff main...feature

# Blame integration
git blame -L 10,20 file.js | git diff

# Custom diff drivers
git config diff.custom.textconv "custom-converter"
\`\`\`

**Online Tools Exclusive Features:**
\`\`\`
- Shareable links
- Real-time collaboration
- No installation
- Mobile-friendly
- Syntax highlighting (some tools)
\`\`\`

### Integration

**Git Diff:**
\`\`\`bash
# Integrates with entire Git workflow
git diff              # See changes
git add -p            # Stage interactively
git commit            # Commit changes

# IDE integration
code --diff file1 file2

# CI/CD integration
if git diff --quiet; then
  echo "No changes"
fi
\`\`\`

**Online Tools:**
\`\`\`javascript
// Limited integration
// Standalone usage
// Manual copy-paste workflow

// Can integrate via API (some tools)
fetch('https://api.difftool.com/compare', {
  method: 'POST',
  body: JSON.stringify({ text1, text2 })
});
\`\`\`

## Decision Framework

### Use Git Diff When:

1. **Working with Git repositories**
\`\`\`bash
# Natural choice for version-controlled code
git diff main feature
\`\`\`

2. **Handling sensitive data**
\`\`\`bash
# Keep proprietary code local
git diff --no-index secret1.js secret2.js
\`\`\`

3. **Comparing large files**
\`\`\`bash
# No size limits
git diff huge-file.json
\`\`\`

4. **Automating workflows**
\`\`\`bash
# Scriptable and reliable
#!/bin/bash
git diff --quiet || npm test
\`\`\`

5. **Working offline**
\`\`\`bash
# No internet required
git diff --cached
\`\`\`

### Use Online Tools When:

1. **Quick one-off comparisons**
\`\`\`
Scenario: Compare two API responses
Action: Paste into online tool
Time: 30 seconds
\`\`\`

2. **Sharing with non-technical users**
\`\`\`
Scenario: Show changes to stakeholder
Action: Generate shareable link
Benefit: No Git knowledge needed
\`\`\`

3. **No Git available**
\`\`\`
Scenarios:
- Locked-down corporate machine
- Public computer
- Mobile device
- Quick access needed
\`\`\`

4. **Comparing non-Git files**
\`\`\`
Examples:
- Email drafts
- Documentation
- Configuration files
- Log outputs
\`\`\`

## Hybrid Approach

### Best of Both Worlds

\`\`\`bash
# Use Git diff for development
git diff main feature > changes.diff

# Share diff file via online viewer
# Upload changes.diff to online tool for stakeholders
\`\`\`

### Workflow Example

\`\`\`bash
# Developer workflow
1. git diff main feature          # Review locally
2. git diff --stat                # Check summary
3. git diff > review.diff         # Export for sharing

# Stakeholder workflow
1. Open online diff tool
2. Upload review.diff
3. Review changes visually
4. Provide feedback
\`\`\`

## Tool Recommendations

### For Git Users

**Command Line:**
\`\`\`bash
# Built-in Git diff
git diff

# With delta (better syntax highlighting)
git diff | delta

# With diff-so-fancy
git diff | diff-so-fancy
\`\`\`

**GUI Tools:**
- **GitKraken**: Beautiful interface
- **SourceTree**: Free, feature-rich
- **GitHub Desktop**: Simple, integrated

### For Online Tools

**General Purpose:**
- **Diffchecker**: Clean, simple
- **Text-Compare**: Fast, no frills
- **Our DevTools**: Developer-focused

**Specialized:**
- **JSON Diff**: For JSON comparison
- **XML Diff**: For XML files
- **Image Diff**: For images

## Security Best Practices

### For Git Diff

\`\`\`bash
# Review before committing
git diff

# Check for sensitive data
git diff | grep -i "password\|secret\|key"

# Use .gitignore
echo "*.env" >> .gitignore
echo "secrets/" >> .gitignore
\`\`\`

### For Online Tools

\`\`\`javascript
// Sanitize before uploading
function sanitizeCode(code) {
  return code
    .replace(/password\s*=\s*['"][^'"]+['"]/gi, 'password="***"')
    .replace(/api[_-]?key\s*=\s*['"][^'"]+['"]/gi, 'api_key="***"')
    .replace(/secret\s*=\s*['"][^'"]+['"]/gi, 'secret="***"');
}

const sanitized = sanitizeCode(originalCode);
// Now safe to upload
\`\`\`

## Performance Benchmarks

### Git Diff

\`\`\`bash
# Small file (100 lines)
time git diff small.js
# real: 0.05s

# Medium file (1000 lines)
time git diff medium.js
# real: 0.08s

# Large file (10000 lines)
time git diff large.js
# real: 0.15s

# Huge file (100000 lines)
time git diff huge.js
# real: 1.2s
\`\`\`

### Online Tools

\`\`\`
Small file (100 lines):
- Upload: 0.5s
- Process: 0.3s
- Display: 0.2s
- Total: ~1s

Large file (10000 lines):
- Upload: 2s
- Process: 1.5s
- Display: 1s
- Total: ~4.5s

Very large files:
- Often rejected (size limits)
- May timeout
- Browser may freeze
\`\`\`

## Conclusion

**Choose Git Diff for:**
- Version-controlled code
- Sensitive data
- Large files
- Automation
- Offline work
- Advanced features

**Choose Online Tools for:**
- Quick comparisons
- Non-technical sharing
- No Git available
- Mobile access
- Non-Git files

**Best Practice:**
Use Git diff as your primary tool and online tools for specific scenarios where their strengths shine. Many developers use both depending on the context.`,


  9: `# Spotting Code Changes: Using Diff Tools Effectively

Effective change detection is crucial for code quality and debugging. This guide teaches you advanced techniques for identifying and analyzing code changes using diff tools.

## Understanding Change Patterns

### Types of Changes

1. **Additions** - New code
2. **Deletions** - Removed code
3. **Modifications** - Changed code
4. **Moves** - Relocated code
5. **Renames** - Renamed identifiers

### Change Significance

\\`\\`\\`javascript
// Low-impact change (formatting)
- function hello(){return "hi";}
+ function hello() {
+   return "hi";
+ }

// Medium-impact change (refactoring)
- const result = array.map(x => x * 2).filter(x => x > 10);
+ const doubled = array.map(x => x * 2);
+ const result = doubled.filter(x => x > 10);

// High-impact change (logic change)
- if (user.role === 'admin') {
+ if (user.role === 'admin' || user.isOwner) {
\\`\\`\`

## Technique 1: Context-Aware Diff

### Show Function Context

\`\`\`bash
# Show which function changed
git diff --function-context

# Output includes full function
function calculateTotal(items) {
-  let total = 0;
-  for (let i = 0; i < items.length; i++) {
-    total += items[i].price;
-  }
-  return total;
+  return items.reduce((sum, item) => sum + item.price, 0);
}
\`\`\`

### Increase Context Lines

\`\`\`bash
# Default: 3 lines of context
git diff

# More context: 10 lines
git diff -U10

# Show entire file
git diff -U999999
\`\`\`

## Technique 2: Filter Noise

### Ignore Whitespace

\`\`\`bash
# Ignore all whitespace
git diff -w

# Ignore whitespace at line end
git diff --ignore-space-at-eol

# Ignore whitespace changes
git diff --ignore-space-change
\`\`\`

### Ignore Specific Changes

\`\`\`bash
# Ignore blank lines
git diff --ignore-blank-lines

# Ignore specific files
git diff -- . ':(exclude)package-lock.json' ':(exclude)*.min.js'

# Ignore moved code
git diff --no-renames
\`\`\`

## Technique 3: Detect Moved Code

### Enable Move Detection

\`\`\`bash
# Detect moved blocks
git diff --color-moved

# Zebra mode (alternating colors)
git diff --color-moved=zebra

# Dimmed moved code
git diff --color-moved=dimmed-zebra
\`\`\`

### Example Output

\`\`\`diff
# Moved code shown in different color
-function helper() {
-  return "moved";
-}

class MyClass {
  constructor() {
+   function helper() {
+     return "moved";
+   }
  }
}
\`\`\`

## Technique 4: Word-Level Diff

### Character-by-Character Changes

\`\`\`bash
# Word diff
git diff --word-diff

# Output:
# console.log([-"Hello " + name-]{+"Hello \${name}"+});

# Color word diff
git diff --word-diff=color

# Plain word diff
git diff --word-diff=plain
\`\`\`

### Custom Word Regex

\`\`\`bash
# Define what constitutes a "word"
git diff --word-diff-regex='[^[:space:]]'

# For camelCase
git diff --word-diff-regex='[A-Z][a-z]*|[a-z]+'
\`\`\`

## Technique 5: Statistical Analysis

### Change Statistics

\`\`\`bash
# Summary statistics
git diff --stat

# Output:
# src/app.js    | 45 ++++++++++++++++++++++++++++++++++++++++++
# src/utils.js  | 12 ++++++------
# 2 files changed, 51 insertions(+), 6 deletions(-)

# Detailed statistics
git diff --numstat

# Output:
# 45    0    src/app.js
# 6     6    src/utils.js
\`\`\`

### Change Complexity

\`\`\`bash
# Show changed files only
git diff --name-only

# Show status (Added, Modified, Deleted)
git diff --name-status

# Short format
git diff --shortstat
\`\`\`

## Technique 6: Semantic Diff

### Language-Aware Diff

\`\`\`bash
# Configure for JavaScript
git config diff.javascript.xfuncname "^[[:space:]]*((function|class)[[:space:]].*)$"

# Configure for Python
git config diff.python.xfuncname "^[[:space:]]*((class|def)[[:space:]].*)$"

# Use semantic diff
git diff --function-context
\`\`\`

### Custom Diff Drivers

\`\`\`bash
# .gitattributes
*.json diff=json

# .git/config
[diff "json"]
  textconv = python -m json.tool
  
# Now JSON diffs are formatted
git diff data.json
\`\`\`

## Technique 7: Historical Analysis

### Find When Change Occurred

\`\`\`bash
# Show commits that changed a file
git log --oneline -- src/app.js

# Show diffs in log
git log -p -- src/app.js

# Find when line was changed
git blame src/app.js

# Find when function was changed
git log -L :functionName:src/app.js
\`\`\`

### Bisect for Bug Introduction

\`\`\`bash
# Start bisect
git bisect start
git bisect bad HEAD
git bisect good v1.0

# At each step
git diff HEAD~1 HEAD
# Test if bug exists
git bisect good  # or bad

# Find exact commit
git bisect reset
\`\`\`

## Technique 8: Pattern Matching

### Search in Diff

\`\`\`bash
# Find specific changes
git diff | grep "password"

# Show only matching hunks
git diff -G"password"

# Pickaxe: find when string was added/removed
git log -S"password" -p

# Regex pickaxe
git log -G"password.*=" -p
\`\`\`

### Filter by Change Type

\`\`\`bash
# Only additions
git diff --diff-filter=A

# Only deletions
git diff --diff-filter=D

# Only modifications
git diff --diff-filter=M

# Combine filters
git diff --diff-filter=AM  # Added or Modified
\`\`\`

## Technique 9: Visual Patterns

### Identify Change Clusters

\`\`\`bash
# Changes concentrated in one area
git diff --stat
# src/auth.js | 150 ++++++++++++++++++++++++++++++++++++++++++

# Changes spread across files
git diff --stat
# src/auth.js   | 10 +++++-----
# src/user.js   | 8 ++++----
# src/admin.js  | 12 ++++++------
\`\`\`

### Spot Patterns

\`\`\`javascript
// Pattern: Adding null checks
- const name = user.name;
+ const name = user?.name;

- const email = user.profile.email;
+ const email = user?.profile?.email;

// Pattern: Consistent refactoring
\`\`\`

## Technique 10: Automated Analysis

### Script for Change Detection

\`\`\`javascript
const { execSync } = require('child_process');

function analyzeChanges(commit1, commit2) {
  // Get diff
  const diff = execSync(
    \`git diff \${commit1} \${commit2}\`,
    { encoding: 'utf-8' }
  );
  
  // Parse changes
  const lines = diff.split('\n');
  const additions = lines.filter(l => l.startsWith('+')).length;
  const deletions = lines.filter(l => l.startsWith('-')).length;
  
  // Analyze patterns
  const patterns = {
    nullChecks: (diff.match(/\?\./g) || []).length,
    asyncAwait: (diff.match(/async |await /g) || []).length,
    console: (diff.match(/console\./g) || []).length
  };
  
  return {
    additions,
    deletions,
    netChange: additions - deletions,
    patterns
  };
}

// Usage
const analysis = analyzeChanges('main', 'feature');
console.log(analysis);
\`\`\`

### CI/CD Integration

\`\`\`yaml
# .github/workflows/diff-analysis.yml
name: Analyze Changes

on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      
      - name: Analyze diff
        run: |
          git diff origin/main HEAD --stat
          
          # Check for sensitive changes
          if git diff origin/main HEAD | grep -i "password\|secret\|key"; then
            echo "⚠️ Potential sensitive data in diff"
            exit 1
          fi
          
          # Check for large changes
          CHANGES=\$(git diff origin/main HEAD --numstat | awk '{sum+=$1+$2} END {print sum}')
          if [ "$CHANGES" -gt 1000 ]; then
            echo "⚠️ Large change detected: $CHANGES lines"
          fi
\`\`\`

## Real-World Examples

### Example 1: Security Audit

\`\`\`bash
# Find authentication changes
git log -p -G"auth|login|password" --since="1 month ago"

# Check for hardcoded secrets
git diff main feature | grep -E "(password|api[_-]?key|secret)\s*=\s*['\"]"

# Review permission changes
git diff main feature | grep -i "permission\|role\|access"
\`\`\`

### Example 2: Performance Review

\`\`\`bash
# Find loop changes
git diff -G"for\s*\(|while\s*\("

# Find database query changes
git diff -G"SELECT|INSERT|UPDATE|DELETE"

# Check for N+1 queries
git diff | grep -A5 "forEach\|map" | grep "query\|find"
\`\`\`

### Example 3: Breaking Change Detection

\`\`\`bash
# Find API signature changes
git diff -G"function.*\(|class.*{|export"

# Find removed exports
git diff --diff-filter=D | grep "export"

# Find renamed functions
git diff -M | grep "rename"
\`\`\`

## Best Practices

### 1. Review in Layers

\`\`\`bash
# Layer 1: Overview
git diff --stat

# Layer 2: File-by-file
git diff --name-only | while read file; do
  echo "=== $file ==="
  git diff -- "$file"
done

# Layer 3: Detailed review
git diff --function-context
\`\`\`

### 2. Use Checklists

\`\`\`markdown
## Change Review Checklist

- [ ] Understand purpose of changes
- [ ] Check for security implications
- [ ] Verify no sensitive data exposed
- [ ] Review error handling
- [ ] Check for breaking changes
- [ ] Verify tests updated
- [ ] Check documentation updated
\`\`\`

### 3. Document Findings

\`\`\`markdown
## Review Notes

### File: src/auth.js
- Lines 45-60: Refactored login logic
- Impact: Improved security
- Risk: Low
- Tests: Updated

### File: src/api.js
- Lines 120-135: Added rate limiting
- Impact: Prevents abuse
- Risk: Medium (may affect legitimate users)
- Tests: Added
\`\`\`

## Conclusion

Effective change detection requires:

1. **Right tools** - Use appropriate diff options
2. **Context** - Understand surrounding code
3. **Patterns** - Recognize common change types
4. **Automation** - Script repetitive checks
5. **Practice** - Regular code review

Master these techniques to become more efficient at spotting important changes, identifying issues, and maintaining code quality.`,

  10: `# Merging Code Changes: Diff Tools in Version Control

Merging code changes is a critical skill in collaborative development. This comprehensive guide covers strategies, tools, and best practices for successful merges using diff tools.

## Understanding Merges

### What is a Merge?

A merge combines changes from different branches into a single branch. It's essential for:
- Integrating feature branches
- Applying bug fixes
- Collaborating with team members
- Maintaining release branches

### Types of Merges

\\`\\`\\`bash
# Fast-forward merge (no conflicts possible)
git merge feature  # When feature is ahead of main

# Three-way merge (may have conflicts)
git merge feature  # When both branches have changes

# Squash merge (combines commits)
git merge --squash feature

# No-fast-forward merge (always creates merge commit)
git merge --no-ff feature
\\`\\`\`

## Merge Strategies

### Strategy 1: Recursive (Default)

\`\`\`bash
# Default strategy
git merge feature

# Explicit recursive
git merge -s recursive feature

# With options
git merge -s recursive -X theirs feature  # Prefer their changes
git merge -s recursive -X ours feature    # Prefer our changes
\`\`\`

### Strategy 2: Octopus (Multiple Branches)

\`\`\`bash
# Merge multiple branches at once
git merge feature1 feature2 feature3

# Only works if no conflicts
\`\`\`

### Strategy 3: Ours (Keep Our Version)

\`\`\`bash
# Keep our version entirely
git merge -s ours obsolete-feature

# Useful for marking branches as merged without applying changes
\`\`\`

## Understanding Conflicts

### What Causes Conflicts?

\`\`\`javascript
// Base version (common ancestor)
function greet(name) {
  console.log("Hello " + name);
}

// Our version (current branch)
function greet(name) {
  console.log("Hi " + name);
}

// Their version (merging branch)
function greet(name) {
  console.log("Hello " + name + "!");
}

// Conflict: Both modified the same line differently
\`\`\`

### Conflict Markers

\`\`\`javascript
<<<<<<< HEAD (Current Change)
function greet(name) {
  console.log("Hi " + name);
}
=======
function greet(name) {
  console.log("Hello " + name + "!");
}
>>>>>>> feature-branch (Incoming Change)
\`\`\`

## Using Diff Tools for Merging

### Command-Line Merge

\`\`\`bash
# Start merge
git merge feature

# If conflicts occur
git status  # See conflicted files

# View conflicts
git diff

# Resolve manually
# Edit files to remove conflict markers

# Mark as resolved
git add resolved-file.js

# Complete merge
git commit
\`\`\`

### Visual Merge Tools

\`\`\`bash
# Configure merge tool
git config --global merge.tool meld

# Use merge tool
git mergetool

# Available tools:
# - meld
# - kdiff3
# - p4merge
# - vimdiff
# - tortoisemerge
\`\`\`

### Three-Way Merge View

\`\`\`
┌─────────────┬─────────────┬─────────────┐
│    BASE     │    OURS     │   THEIRS    │
│  (ancestor) │  (current)  │  (incoming) │
├─────────────┼─────────────┼─────────────┤
│ function    │ function    │ function    │
│ greet(name) │ greet(name) │ greet(name) │
│ {           │ {           │ {           │
│   console   │   console   │   console   │
│   .log(     │   .log(     │   .log(     │
│   "Hello "  │   "Hi "     │   "Hello "  │
│   + name);  │   + name);  │   + name +  │
│             │             │   "!");     │
│ }           │ }           │ }           │
└─────────────┴─────────────┴─────────────┘
                     ↓
              ┌─────────────┐
              │   RESULT    │
              ├─────────────┤
              │ function    │
              │ greet(name) │
              │ {           │
              │   console   │
              │   .log(     │
              │   "Hi " +   │
              │   name +    │
              │   "!");     │
              │ }           │
              └─────────────┘
\`\`\`

## Merge Resolution Strategies

### Strategy 1: Accept Ours

\`\`\`bash
# Keep our version for specific file
git checkout --ours conflicted-file.js
git add conflicted-file.js

# Keep our version for all conflicts
git merge -X ours feature
\`\`\`

### Strategy 2: Accept Theirs

\`\`\`bash
# Keep their version for specific file
git checkout --theirs conflicted-file.js
git add conflicted-file.js

# Keep their version for all conflicts
git merge -X theirs feature
\`\`\`

### Strategy 3: Manual Resolution

\`\`\`javascript
// Original conflict
<<<<<<< HEAD
function greet(name) {
  console.log("Hi " + name);
}
=======
function greet(name) {
  console.log("Hello " + name + "!");
}
>>>>>>> feature-branch

// Resolved: Combine both changes
function greet(name) {
  console.log("Hi " + name + "!");
}
\`\`\`

### Strategy 4: Rewrite

\`\`\`javascript
// Sometimes best solution is neither version
// Original conflict
<<<<<<< HEAD
const result = data.map(x => x * 2).filter(x => x > 10);
=======
const doubled = data.map(x => x * 2);
const result = doubled.filter(x => x > 10);
>>>>>>> feature-branch

// Resolved: Better approach
const result = data
  .map(x => x * 2)
  .filter(x => x > 10);
\`\`\`

## Advanced Merge Techniques

### Technique 1: Interactive Merge

\`\`\`bash
# Start merge
git merge feature

# For each conflict, decide
git checkout --ours file1.js    # Keep ours
git checkout --theirs file2.js  # Keep theirs
# Edit file3.js manually         # Custom resolution

# Stage resolved files
git add file1.js file2.js file3.js

# Complete merge
git commit
\`\`\`

### Technique 2: Partial Merge

\`\`\`bash
# Merge specific files only
git checkout feature -- src/utils.js
git add src/utils.js
git commit -m "Merge utils.js from feature"

# Cherry-pick specific commits
git cherry-pick abc123
\`\`\`

### Technique 3: Merge with Rebase

\`\`\`bash
# Rebase before merge (cleaner history)
git checkout feature
git rebase main

# Then merge (will be fast-forward)
git checkout main
git merge feature
\`\`\`

### Technique 4: Abort and Retry

\`\`\`bash
# If merge goes wrong
git merge --abort

# Try different strategy
git merge -X patience feature

# Or rebase instead
git rebase feature
\`\`\`

## Preventing Merge Conflicts

### Practice 1: Frequent Integration

\`\`\`bash
# Regularly update feature branch
git checkout feature
git merge main  # or git rebase main

# Keeps branches in sync
# Reduces conflict size
\`\`\`

### Practice 2: Small, Focused Changes

\`\`\`bash
# Bad: Large, long-lived branch
git checkout -b huge-refactor
# ... 2 weeks of changes ...
git merge main  # Many conflicts!

# Good: Small, frequent merges
git checkout -b small-feature-1
# ... 1 day of changes ...
git merge main  # Few/no conflicts

git checkout -b small-feature-2
# ... 1 day of changes ...
git merge main  # Few/no conflicts
\`\`\`

### Practice 3: Communication

\`\`\`markdown
## Team Coordination

Before starting work:
1. Check if anyone else is working on same files
2. Coordinate changes
3. Agree on approach

During work:
1. Communicate progress
2. Share early drafts
3. Discuss conflicts early

Before merging:
1. Review changes together
2. Resolve conflicts collaboratively
3. Test merged result
\`\`\`

### Practice 4: Code Organization

\`\`\`javascript
// Bad: Everything in one file (high conflict risk)
// app.js (5000 lines)

// Good: Modular organization (low conflict risk)
// src/auth/login.js
// src/auth/register.js
// src/user/profile.js
// src/user/settings.js
\`\`\`

## Merge Workflow Examples

### Example 1: Feature Branch Merge

\`\`\`bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Update feature branch
git checkout feature
git merge main

# 3. Resolve any conflicts
git mergetool
git commit

# 4. Test merged code
npm test

# 5. Merge to main
git checkout main
git merge feature

# 6. Push
git push origin main
\`\`\`

### Example 2: Hotfix Merge

\`\`\`bash
# 1. Create hotfix from production
git checkout -b hotfix/critical-bug production

# 2. Fix bug
# ... make changes ...
git commit -m "Fix critical bug"

# 3. Merge to production
git checkout production
git merge hotfix/critical-bug

# 4. Also merge to main
git checkout main
git merge hotfix/critical-bug

# 5. Deploy
git push origin production
git push origin main
\`\`\`

### Example 3: Release Branch Merge

\`\`\`bash
# 1. Create release branch
git checkout -b release/v2.0 main

# 2. Stabilize release
# ... bug fixes only ...

# 3. Merge to main
git checkout main
git merge release/v2.0

# 4. Tag release
git tag -a v2.0 -m "Version 2.0"

# 5. Merge to production
git checkout production
git merge v2.0

# 6. Push everything
git push origin main production --tags
\`\`\`

## Troubleshooting Merge Issues

### Issue 1: Merge Conflicts

\`\`\`bash
# Problem: Conflicts in many files
git merge feature
# CONFLICT (content): Merge conflict in 10 files

# Solution 1: Use merge tool
git mergetool

# Solution 2: Accept one side
git merge -X theirs feature

# Solution 3: Abort and rebase
git merge --abort
git rebase feature
\`\`\`

### Issue 2: Lost Changes

\`\`\`bash
# Problem: Changes disappeared after merge

# Solution: Check reflog
git reflog

# Find commit before merge
git reset --hard HEAD@{1}

# Try merge again
git merge feature
\`\`\`

### Issue 3: Wrong Merge

\`\`\`bash
# Problem: Merged wrong branch

# Solution: Undo merge
git reset --hard HEAD~1

# Or revert merge commit
git revert -m 1 HEAD
\`\`\`

### Issue 4: Binary File Conflicts

\`\`\`bash
# Problem: Conflict in binary file (image, PDF, etc.)

# Solution: Choose one version
git checkout --ours image.png
# or
git checkout --theirs image.png

# Then commit
git add image.png
git commit
\`\`\`

## Best Practices

### 1. Test Before Merging

\`\`\`bash
# Run tests on feature branch
git checkout feature
npm test

# Run tests after merge
git merge main
npm test

# Only push if tests pass
git push origin feature
\`\`\`

### 2. Review Merge Result

\`\`\`bash
# After resolving conflicts, review entire merge
git diff HEAD

# Check specific files
git diff HEAD -- src/app.js

# Ensure no mistakes
\`\`\`

### 3. Document Merge Decisions

\`\`\`bash
# Good merge commit message
git commit -m "Merge feature/user-auth

Resolved conflicts in:
- src/auth.js: Kept new authentication method
- src/user.js: Combined both validation approaches
- tests/auth.test.js: Updated tests for new flow

All tests passing."
\`\`\`

### 4. Use Pull Requests

\`\`\`markdown
## Pull Request Workflow

1. Create PR from feature to main
2. Automated tests run
3. Team reviews changes
4. Discuss conflicts
5. Resolve conflicts collaboratively
6. Approve and merge
7. Delete feature branch
\`\`\`

## Conclusion

Successful merging requires:

1. **Understanding** - Know merge strategies and tools
2. **Prevention** - Frequent integration, small changes
3. **Resolution** - Use appropriate tools and techniques
4. **Testing** - Always test merged code
5. **Communication** - Coordinate with team

Master these skills to handle merges confidently and maintain code quality in collaborative environments.`,


  // CODE FORMATTER POSTS (IDs 11-15)
  11: `# Code Formatter vs Code Beautifier: What's the Difference?

Code formatting tools come in different flavors, and understanding the distinction between formatters and beautifiers helps you choose the right tool for your needs.

## Key Differences

### Code Formatter
- **Purpose**: Enforce consistent style
- **Approach**: Opinionated, minimal configuration
- **Output**: Consistent, predictable
- **Examples**: Prettier, Black, gofmt

### Code Beautifier
- **Purpose**: Make code readable
- **Approach**: Highly configurable
- **Output**: Varies based on settings
- **Examples**: JS Beautifier, HTML Tidy, Artistic Style

## Detailed Comparison

| Feature | Formatter | Beautifier |
|---------|-----------|------------|
| **Configuration** | Minimal | Extensive |
| **Consistency** | High | Varies |
| **Speed** | Fast | Moderate |
| **Opinionated** | Yes | No |
| **Team Use** | Excellent | Challenging |
| **Learning Curve** | Low | Moderate |

## Code Formatters Explained

### Philosophy

Formatters follow the "one true way" philosophy:
- Minimal configuration options
- Consistent output regardless of input
- No debates about style

### Example: Prettier

\\`\\`\\`javascript
// Before (any style)
function hello(name){return "Hello "+name}

const user={name:"John",age:30,email:"john@example.com"}

// After (Prettier's style)
function hello(name) {
  return "Hello " + name;
}

const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
};
\\`\\`\`

### Configuration

\`\`\`json
// .prettierrc (minimal options)
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
\`\`\`

### Benefits

1. **No Style Debates**
\`\`\`javascript
// Team doesn't argue about:
// - Semicolons or not?
// - Single or double quotes?
// - Tabs or spaces?
// Prettier decides!
\`\`\`

2. **Consistent Codebase**
\`\`\`javascript
// Everyone's code looks the same
// Easy to read
// Easy to review
// Easy to maintain
\`\`\`

3. **Fast Adoption**
\`\`\`bash
# Install and run
npm install --save-dev prettier
npx prettier --write .
# Done!
\`\`\`

## Code Beautifiers Explained

### Philosophy

Beautifiers follow the "your way" philosophy:
- Extensive configuration options
- Flexible output based on preferences
- Customizable to match any style guide

### Example: JS Beautifier

\`\`\`javascript
// Before
function hello(name){return "Hello "+name}

// After (with custom config)
function hello(name) {
    return "Hello " + name
}
// Note: 4 spaces, no semicolon (configurable)
\`\`\`

### Configuration

\`\`\`json
// .jsbeautifyrc (many options)
{
  "indent_size": 4,
  "indent_char": " ",
  "indent_with_tabs": false,
  "eol": "\n",
  "end_with_newline": true,
  "indent_level": 0,
  "preserve_newlines": true,
  "max_preserve_newlines": 2,
  "space_in_paren": false,
  "space_in_empty_paren": false,
  "jslint_happy": false,
  "space_after_anon_function": false,
  "brace_style": "collapse",
  "unindent_chained_methods": false,
  "break_chained_methods": false,
  "keep_array_indentation": false,
  "unescape_strings": false,
  "wrap_line_length": 0,
  "e4x": false,
  "comma_first": false,
  "operator_position": "before-newline"
}
\`\`\`

### Benefits

1. **Match Existing Style**
\`\`\`javascript
// Can match any company style guide
// Google style
// Airbnb style
// Your custom style
\`\`\`

2. **Gradual Adoption**
\`\`\`javascript
// Configure to match current code
// Gradually adjust settings
// No big-bang reformatting
\`\`\`

3. **Fine-Grained Control**
\`\`\`javascript
// Control every aspect:
// - Brace placement
// - Operator spacing
// - Line breaks
// - Indentation
// - And much more
\`\`\`

## When to Use Each

### Use a Formatter When:

1. **Starting New Project**
\`\`\`bash
# Fresh start, no legacy code
npm init
npm install --save-dev prettier
npx prettier --write .
\`\`\`

2. **Team Consistency is Priority**
\`\`\`javascript
// No time for style debates
// Want automatic consistency
// Trust opinionated defaults
\`\`\`

3. **Want Zero Configuration**
\`\`\`bash
# Just works out of the box
npx prettier --write .
# No config file needed
\`\`\`

4. **Using Modern Tools**
\`\`\`javascript
// Formatters integrate well with:
// - VS Code
// - ESLint
// - Git hooks
// - CI/CD
\`\`\`

### Use a Beautifier When:

1. **Working with Legacy Code**
\`\`\`javascript
// Existing codebase with specific style
// Can't change everything at once
// Need to match current formatting
\`\`\`

2. **Strict Style Guide Requirements**
\`\`\`javascript
// Company has detailed style guide
// Need exact control over formatting
// Formatter's opinions don't match
\`\`\`

3. **Gradual Migration**
\`\`\`javascript
// Migrating from one style to another
// Need intermediate configurations
// Want to control the pace
\`\`\`

4. **Multiple Languages**
\`\`\`html
<!-- Beautifiers often support more languages -->
<!-- HTML, CSS, XML, SQL, etc. -->
<!-- With consistent configuration -->
\`\`\`

## Practical Examples

### Example 1: New React Project

\`\`\`bash
# Use Prettier (formatter)
npx create-react-app my-app
cd my-app
npm install --save-dev prettier

# .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "es5"
}

# Format all files
npx prettier --write "src/**/*.{js,jsx,json,css}"
\`\`\`

### Example 2: Legacy jQuery Project

\`\`\`bash
# Use JS Beautifier (beautifier)
npm install --save-dev js-beautify

# Configure to match existing style
# .jsbeautifyrc
{
  "indent_size": 2,
  "brace_style": "collapse",
  "space_after_anon_function": true
}

# Beautify gradually
js-beautify -r src/new-feature.js
\`\`\`

### Example 3: Multi-Language Project

\`\`\`bash
# Use Prettier for JS/TS
npx prettier --write "**/*.{js,ts,json}"

# Use HTML Tidy for HTML
tidy -m -i -w 120 **/*.html

# Use specific tools for each language
\`\`\`

## Combining Both Approaches

### Hybrid Strategy

\`\`\`javascript
// Use formatter for new code
// Use beautifier for legacy code

// package.json
{
  "scripts": {
    "format:new": "prettier --write 'src/new/**/*.js'",
    "format:legacy": "js-beautify -r 'src/legacy/**/*.js'",
    "format": "npm run format:new && npm run format:legacy"
  }
}
\`\`\`

### Migration Path

\`\`\`bash
# Step 1: Use beautifier matching current style
js-beautify -r src/

# Step 2: Gradually adjust beautifier config toward Prettier style
# Update .jsbeautifyrc incrementally

# Step 3: Switch to Prettier when styles align
npm install --save-dev prettier
npx prettier --write src/

# Step 4: Remove beautifier
npm uninstall js-beautify
\`\`\`

## Tool Recommendations

### Formatters

**Prettier** (JavaScript, TypeScript, CSS, HTML, JSON, Markdown)
\`\`\`bash
npm install --save-dev prettier
npx prettier --write .
\`\`\`

**Black** (Python)
\`\`\`bash
pip install black
black .
\`\`\`

**gofmt** (Go)
\`\`\`bash
gofmt -w .
\`\`\`

**rustfmt** (Rust)
\`\`\`bash
cargo fmt
\`\`\`

### Beautifiers

**JS Beautifier** (JavaScript, HTML, CSS)
\`\`\`bash
npm install --save-dev js-beautify
js-beautify -r file.js
\`\`\`

**Artistic Style** (C, C++, C#, Java)
\`\`\`bash
astyle --style=google *.cpp
\`\`\`

**HTML Tidy** (HTML, XML)
\`\`\`bash
tidy -m -i file.html
\`\`\`

## Integration Examples

### VS Code with Prettier

\`\`\`json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
\`\`\`

### VS Code with Beautifier

\`\`\`json
// .vscode/settings.json
{
  "editor.defaultFormatter": "HookyQR.beautify",
  "editor.formatOnSave": true,
  "beautify.config": {
    "indent_size": 4,
    "indent_char": " "
  }
}
\`\`\`

### Git Hooks

\`\`\`bash
# .husky/pre-commit

# With Prettier
npx prettier --write --staged

# With Beautifier
js-beautify -r $(git diff --cached --name-only --diff-filter=ACM | grep '\.js$')
\`\`\`

## Conclusion

**Choose a Formatter if:**
- Starting fresh
- Want consistency without debate
- Prefer opinionated defaults
- Value simplicity

**Choose a Beautifier if:**
- Working with legacy code
- Need exact style control
- Have strict style guide
- Migrating gradually

**Best Practice:**
For new projects, use a formatter. For legacy projects, use a beautifier initially, then migrate to a formatter when possible.`,


  12: `# Top 5 Code Formatters for 2026: Comparison and Review

Choosing the right code formatter can significantly improve your workflow. This comprehensive review compares the top 5 code formatters available in 2026.

## The Contenders

1. **Prettier** - The opinionated formatter
2. **Black** - Python's uncompromising formatter
3. **gofmt** - Go's official formatter
4. **rustfmt** - Rust's formatting tool
5. **ClangFormat** - C/C++/Java formatter

## 1. Prettier

### Overview
- **Languages**: JavaScript, TypeScript, CSS, HTML, JSON, Markdown, YAML
- **Philosophy**: Opinionated, minimal config
- **First Release**: 2017
- **Popularity**: 45k+ GitHub stars

### Strengths

\\`\\`\\`javascript
// Handles complex formatting automatically
const user = { name: "John", age: 30, email: "john@example.com", address: { street: "123 Main St", city: "Boston", state: "MA", zip: "02101" } };

// Becomes:
const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "Boston",
    state: "MA",
    zip: "02101",
  },
};
\\`\\`\`

### Configuration

\`\`\`json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
\`\`\`

### Pros
- ✅ Multi-language support
- ✅ Excellent IDE integration
- ✅ Large community
- ✅ Consistent output
- ✅ Fast performance

### Cons
- ❌ Limited customization
- ❌ Opinionated (can't change much)
- ❌ May conflict with ESLint rules

### Rating: 9.5/10

**Best for**: JavaScript/TypeScript projects, teams wanting consistency

## 2. Black

### Overview
- **Languages**: Python
- **Philosophy**: "The uncompromising code formatter"
- **First Release**: 2018
- **Popularity**: 35k+ GitHub stars

### Strengths

\`\`\`python
# Before
def hello(name,age,email):
    return f"Hello {name}"

# After
def hello(name, age, email):
    return f"Hello {name}"
\`\`\`

### Configuration

\`\`\`toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py38', 'py39', 'py310']
include = '\\.pyi?$'
extend-exclude = '''
/(
  | migrations
  | .venv
)/
'''
\`\`\`

### Pros
- ✅ Zero configuration needed
- ✅ Fast (written in Python)
- ✅ Deterministic output
- ✅ PEP 8 compliant
- ✅ Great for teams

### Cons
- ❌ Python only
- ❌ Very opinionated
- ❌ 88-character line length (unusual)

### Rating: 9/10

**Best for**: Python projects, teams wanting no debates

## 3. gofmt

### Overview
- **Languages**: Go
- **Philosophy**: Official Go formatter
- **First Release**: 2009
- **Popularity**: Built into Go

### Strengths

\`\`\`go
// Before
func hello(name string)string{return "Hello "+name}

// After
func hello(name string) string {
    return "Hello " + name
}
\`\`\`

### Configuration

\`\`\`bash
# No configuration - uses Go's official style
gofmt -w .

# With simplification
gofmt -s -w .
\`\`\`

### Pros
- ✅ Official Go tool
- ✅ Zero configuration
- ✅ Universal Go style
- ✅ Built into toolchain
- ✅ Extremely fast

### Cons
- ❌ Go only
- ❌ No customization at all
- ❌ Can't match other styles

### Rating: 9/10

**Best for**: Go projects (no alternative needed)

## 4. rustfmt

### Overview
- **Languages**: Rust
- **Philosophy**: Official Rust formatter
- **First Release**: 2016
- **Popularity**: Built into Rust

### Strengths

\`\`\`rust
// Before
fn hello(name:&str)->String{format!("Hello {}",name)}

// After
fn hello(name: &str) -> String {
    format!("Hello {}", name)
}
\`\`\`

### Configuration

\`\`\`toml
# rustfmt.toml
max_width = 100
hard_tabs = false
tab_spaces = 4
newline_style = "Auto"
use_small_heuristics = "Default"
reorder_imports = true
reorder_modules = true
\`\`\`

### Pros
- ✅ Official Rust tool
- ✅ Some customization
- ✅ Fast and reliable
- ✅ Integrated with Cargo
- ✅ Stable and mature

### Cons
- ❌ Rust only
- ❌ Limited customization
- ❌ Some edge cases not handled

### Rating: 8.5/10

**Best for**: Rust projects (standard tool)

## 5. ClangFormat

### Overview
- **Languages**: C, C++, Java, JavaScript, Objective-C, Protobuf
- **Philosophy**: Highly configurable
- **First Release**: 2013
- **Popularity**: Part of LLVM project

### Strengths

\`\`\`cpp
// Before
int hello(string name){return "Hello "+name;}

// After (Google style)
int hello(string name) {
  return "Hello " + name;
}
\`\`\`

### Configuration

\`\`\`yaml
# .clang-format
BasedOnStyle: Google
IndentWidth: 4
ColumnLimit: 100
AllowShortFunctionsOnASingleLine: None
BreakBeforeBraces: Allman
\`\`\`

### Pros
- ✅ Multi-language support
- ✅ Highly customizable
- ✅ Predefined styles (Google, LLVM, Mozilla)
- ✅ Industry standard for C++
- ✅ Excellent documentation

### Cons
- ❌ Complex configuration
- ❌ Slower than others
- ❌ Requires LLVM installation

### Rating: 8/10

**Best for**: C/C++ projects, teams needing customization

## Feature Comparison Matrix

| Feature | Prettier | Black | gofmt | rustfmt | ClangFormat |
|---------|----------|-------|-------|---------|-------------|
| **Languages** | 7+ | 1 | 1 | 1 | 6+ |
| **Config Options** | ~20 | ~10 | 0 | ~50 | 100+ |
| **Speed** | Fast | Fast | Very Fast | Fast | Moderate |
| **IDE Support** | Excellent | Excellent | Excellent | Excellent | Good |
| **Learning Curve** | Easy | Easy | Easy | Easy | Moderate |
| **Customization** | Low | Very Low | None | Low | High |
| **Community** | Huge | Large | Large | Large | Large |

## Performance Benchmarks

\`\`\`bash
# Test: Format 1000 files

Prettier:  2.3 seconds
Black:     1.8 seconds
gofmt:     0.9 seconds
rustfmt:   1.5 seconds
ClangFormat: 3.2 seconds
\`\`\`

## Integration Comparison

### VS Code

\`\`\`json
// Prettier
{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}

// Black
{
  "python.formatting.provider": "black"
}

// gofmt (built-in)
{
  "[go]": {
    "editor.formatOnSave": true
  }
}

// rustfmt (built-in)
{
  "[rust]": {
    "editor.formatOnSave": true
  }
}

// ClangFormat
{
  "C_Cpp.clang_format_style": "Google"
}
\`\`\`

### CI/CD

\`\`\`yaml
# GitHub Actions

# Prettier
- name: Check formatting
  run: npx prettier --check .

# Black
- name: Check formatting
  run: black --check .

# gofmt
- name: Check formatting
  run: test -z $(gofmt -l .)

# rustfmt
- name: Check formatting
  run: cargo fmt -- --check

# ClangFormat
- name: Check formatting
  run: clang-format --dry-run --Werror **/*.cpp
\`\`\`

## Recommendation by Use Case

### JavaScript/TypeScript Project
**Winner: Prettier**
- Best multi-language support
- Excellent ecosystem
- Easy to adopt

### Python Project
**Winner: Black**
- Python-specific optimizations
- Community standard
- Zero config

### Go Project
**Winner: gofmt**
- Official tool
- No alternative needed
- Universal style

### Rust Project
**Winner: rustfmt**
- Official tool
- Good balance of opinion and config
- Cargo integration

### C/C++ Project
**Winner: ClangFormat**
- Industry standard
- Highly customizable
- Supports company style guides

### Multi-Language Project
**Winner: Prettier + Language-Specific Tools**
- Prettier for JS/TS/CSS/HTML
- Black for Python
- gofmt for Go
- rustfmt for Rust
- ClangFormat for C/C++

## Migration Guide

### From Manual Formatting to Prettier

\`\`\`bash
# 1. Install
npm install --save-dev prettier

# 2. Create config
echo '{"semi": true, "singleQuote": true}' > .prettierrc

# 3. Format all files
npx prettier --write .

# 4. Add to package.json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}

# 5. Add pre-commit hook
npx husky add .husky/pre-commit "npx prettier --write --staged"
\`\`\`

### From ESLint to Prettier

\`\`\`bash
# 1. Install
npm install --save-dev prettier eslint-config-prettier

# 2. Update .eslintrc
{
  "extends": [
    "eslint:recommended",
    "prettier" // Disables conflicting rules
  ]
}

# 3. Format
npx prettier --write .
\`\`\`

## Conclusion

**Overall Rankings:**

1. **Prettier** (9.5/10) - Best for JavaScript/TypeScript
2. **Black** (9/10) - Best for Python
3. **gofmt** (9/10) - Best for Go
4. **rustfmt** (8.5/10) - Best for Rust
5. **ClangFormat** (8/10) - Best for C/C++

**Key Takeaways:**
- Use language-specific formatters when available
- Prettier is best for multi-language web projects
- All top formatters are excellent - choose based on your language
- Consistency matters more than which tool you choose

**2026 Trend:**
Formatters are becoming more opinionated with less configuration. This trend reduces bikeshedding and improves team productivity.`,


  13: `# Prettier vs Black: Choosing the Right Code Formatter

Prettier and Black are two of the most popular code formatters, each dominating their respective ecosystems. This detailed comparison helps you understand their philosophies and choose the right one.

## Quick Comparison

| Aspect | Prettier | Black |
|--------|----------|-------|
| **Primary Language** | JavaScript/TypeScript | Python |
| **Other Languages** | CSS, HTML, JSON, Markdown, YAML | Python only |
| **Philosophy** | Opinionated with some flexibility | Uncompromising |
| **Config Options** | ~20 options | ~10 options |
| **Line Length** | 80 (configurable) | 88 (mostly fixed) |
| **Community** | 45k+ stars | 35k+ stars |
| **Speed** | Fast | Fast |

## Prettier Deep Dive

### Philosophy

"An opinionated code formatter" - Prettier makes formatting decisions for you, but allows some customization.

\\`\\`\\`javascript
// Prettier handles complex cases automatically
const config = { server: { host: "localhost", port: 3000, ssl: true }, database: { host: "db.example.com", port: 5432, name: "mydb" } };

// Becomes:
const config = {
  server: {
    host: "localhost",
    port: 3000,
    ssl: true,
  },
  database: {
    host: "db.example.com",
    port: 5432,
    name: "mydb",
  },
};
\\`\\`\`

### Configuration Options

\`\`\`json
// .prettierrc - Main options
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "endOfLine": "lf"
}
\`\`\`

### Use Cases

**Perfect for:**
- Multi-language web projects
- Teams with JavaScript/TypeScript
- Projects using React, Vue, Angular
- When you need CSS/HTML/JSON formatting too

**Example Project Structure:**
\`\`\`
project/
├── src/
│   ├── components/     # JSX formatted
│   ├── styles/         # CSS formatted
│   └── utils/          # JS formatted
├── public/
│   └── index.html      # HTML formatted
└── package.json        # JSON formatted
\`\`\`

## Black Deep Dive

### Philosophy

"The uncompromising code formatter" - Black makes all decisions, minimal configuration allowed.

\`\`\`python
# Black enforces consistent style
def calculate_total(items,tax_rate,discount):
    subtotal=sum([item.price*item.quantity for item in items])
    tax=subtotal*tax_rate
    total=subtotal+tax-discount
    return total

# Becomes:
def calculate_total(items, tax_rate, discount):
    subtotal = sum([item.price * item.quantity for item in items])
    tax = subtotal * tax_rate
    total = subtotal + tax - discount
    return total
\`\`\`

### Configuration Options

\`\`\`toml
# pyproject.toml - Limited options
[tool.black]
line-length = 88
target-version = ['py38', 'py39', 'py310', 'py311']
include = '\\.pyi?$'
extend-exclude = '''
/(
  | .git
  | .venv
  | build
  | dist
)/
'''
\`\`\`

### Use Cases

**Perfect for:**
- Python-only projects
- Teams wanting zero debates
- Django/Flask applications
- Data science projects

**Example Project Structure:**
\`\`\`
project/
├── src/
│   ├── models/         # Python formatted
│   ├── views/          # Python formatted
│   └── utils/          # Python formatted
├── tests/              # Python formatted
└── setup.py            # Python formatted
\`\`\`

## Key Differences

### 1. Line Length

**Prettier (80 characters):**
\`\`\`javascript
// Breaks at 80 characters
const message = "This is a long message that will be broken into multiple lines";
\`\`\`

**Black (88 characters):**
\`\`\`python
# Breaks at 88 characters (slightly longer)
message = "This is a long message that will be broken into multiple lines by Black"
\`\`\`

**Why 88?** Black's creator chose 88 because it's 10% more than 80, reducing line breaks while staying readable.

### 2. String Quotes

**Prettier:**
\`\`\`javascript
// Configurable: single or double quotes
const name = 'John';  // with singleQuote: true
const name = "John";  // with singleQuote: false
\`\`\`

**Black:**
\`\`\`python
# Always double quotes (unless string contains double quotes)
name = "John"
message = 'He said "Hello"'  # Single quotes to avoid escaping
\`\`\`

### 3. Trailing Commas

**Prettier:**
\`\`\`javascript
// Configurable
const arr = [
  1,
  2,
  3,  // Trailing comma with trailingComma: "es5"
];
\`\`\`

**Black:**
\`\`\`python
# Always adds trailing commas in multi-line structures
arr = [
    1,
    2,
    3,  # Always present
]
\`\`\`

### 4. Multi-Language Support

**Prettier:**
\`\`\`bash
# Formats many languages
npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,scss,md,html,yaml}"
\`\`\`

**Black:**
\`\`\`bash
# Python only
black .
\`\`\`

## Performance Comparison

\`\`\`bash
# Benchmark: Format 1000 files

Prettier (JavaScript):
- Small files (100 lines): 2.1s
- Large files (1000 lines): 3.8s

Black (Python):
- Small files (100 lines): 1.6s
- Large files (1000 lines): 2.9s

Winner: Black (slightly faster)
\`\`\`

## IDE Integration

### VS Code with Prettier

\`\`\`json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
\`\`\`

### VS Code with Black

\`\`\`json
// .vscode/settings.json
{
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length", "88"],
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnSave": true
  }
}
\`\`\`

## CI/CD Integration

### Prettier in GitHub Actions

\`\`\`yaml
name: Format Check
on: [push, pull_request]

jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx prettier --check .
\`\`\`

### Black in GitHub Actions

\`\`\`yaml
name: Format Check
on: [push, pull_request]

jobs:
  black:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install black
      - run: black --check .
\`\`\`

## Team Adoption

### Prettier Adoption

\`\`\`bash
# 1. Install
npm install --save-dev prettier

# 2. Create config
echo '{"singleQuote": true, "semi": true}' > .prettierrc

# 3. Format existing code
npx prettier --write .

# 4. Add to package.json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}

# 5. Add pre-commit hook
npm install --save-dev husky lint-staged
npx husky add .husky/pre-commit "npx lint-staged"

# package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,md}": "prettier --write"
  }
}
\`\`\`

### Black Adoption

\`\`\`bash
# 1. Install
pip install black

# 2. Create config (optional)
# pyproject.toml
[tool.black]
line-length = 88

# 3. Format existing code
black .

# 4. Add pre-commit hook
pip install pre-commit

# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black

# 5. Install hooks
pre-commit install
\`\`\`

## Common Issues and Solutions

### Prettier Issues

**Issue 1: Conflicts with ESLint**
\`\`\`bash
# Solution: Use eslint-config-prettier
npm install --save-dev eslint-config-prettier

# .eslintrc.json
{
  "extends": ["eslint:recommended", "prettier"]
}
\`\`\`

**Issue 2: Different formatting in CI vs local**
\`\`\`bash
# Solution: Lock Prettier version
npm install --save-dev --save-exact prettier
\`\`\`

### Black Issues

**Issue 1: Line too long errors**
\`\`\`python
# Solution: Use # fmt: skip
very_long_line = "This line is intentionally long and should not be formatted"  # fmt: skip
\`\`\`

**Issue 2: Conflicts with flake8**
\`\`\`ini
# Solution: Configure flake8
# .flake8
[flake8]
max-line-length = 88
extend-ignore = E203, W503
\`\`\`

## Decision Matrix

### Choose Prettier if:
- ✅ Working with JavaScript/TypeScript
- ✅ Need multi-language support
- ✅ Want some configuration options
- ✅ Building web applications
- ✅ Using React/Vue/Angular

### Choose Black if:
- ✅ Working with Python
- ✅ Want zero configuration
- ✅ Prefer uncompromising style
- ✅ Building Python applications
- ✅ Want fastest Python formatter

### Use Both if:
- ✅ Full-stack project (JS frontend + Python backend)
- ✅ Microservices with different languages
- ✅ Want best tool for each language

## Real-World Example: Full-Stack Project

\`\`\`
project/
├── frontend/              # Use Prettier
│   ├── src/
│   │   ├── components/   # JSX
│   │   └── styles/       # CSS
│   ├── .prettierrc
│   └── package.json
│
├── backend/               # Use Black
│   ├── api/
│   │   ├── views.py
│   │   └── models.py
│   ├── pyproject.toml
│   └── requirements.txt
│
└── .github/
    └── workflows/
        ├── frontend-format.yml  # Prettier check
        └── backend-format.yml   # Black check
\`\`\`

### Frontend (Prettier)

\`\`\`json
// frontend/.prettierrc
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
\`\`\`

### Backend (Black)

\`\`\`toml
# backend/pyproject.toml
[tool.black]
line-length = 88
target-version = ['py310']
\`\`\`

## Conclusion

**Prettier** and **Black** are both excellent formatters that have revolutionized code formatting in their respective ecosystems.

**Key Takeaways:**
- Both eliminate style debates
- Both integrate well with modern tools
- Both have strong communities
- Choose based on your primary language
- Use both in full-stack projects

**Winner:** Tie - each is best for its language

**Recommendation:**
- JavaScript/TypeScript project → Prettier
- Python project → Black
- Full-stack project → Both`,


  14: `# Automatic Code Formatting: Improving Code Quality

Automatic code formatting is a game-changer for development teams. This guide explores how automated formatting improves code quality, productivity, and team collaboration.

## The Problem with Manual Formatting

### Time Wasted

\\`\\`\\`javascript
// Developer spends time on:
// - Aligning code manually
// - Fixing indentation
// - Adjusting line breaks
// - Debating style in code reviews

// Time that could be spent on:
// - Writing features
// - Fixing bugs
// - Improving architecture
// - Learning new skills
\\`\\`\`

### Inconsistency

\`\`\`javascript
// Developer A's style
function getUserData(id){
    return database.query('SELECT * FROM users WHERE id=?',[id]);
}

// Developer B's style
function getUserData(id) {
  return database.query(
    'SELECT * FROM users WHERE id=?',
    [id]
  );
}

// Result: Inconsistent codebase, harder to read
\`\`\`

## Benefits of Automatic Formatting

### 1. Consistency

\`\`\`javascript
// Before: Mixed styles
const user={name:"John",age:30}
const product = { name: "Widget", price: 19.99 };

// After: Consistent style
const user = { name: "John", age: 30 };
const product = { name: "Widget", price: 19.99 };
\`\`\`

### 2. Time Savings

\`\`\`bash
# Manual formatting: 5-10 minutes per file
# Automatic formatting: < 1 second per file

# For 100 files:
# Manual: 8-16 hours
# Automatic: < 2 minutes

# Time saved: ~15 hours per project
\`\`\`

### 3. Reduced Code Review Friction

\`\`\`markdown
## Before Automatic Formatting

Code Review Comments:
- "Please add space after if"
- "Use consistent indentation"
- "Add trailing comma"
- "Break long line"
- ... 20 more style comments

## After Automatic Formatting

Code Review Comments:
- "Consider using async/await here"
- "This could be more efficient"
- "Add error handling"
- ... Focus on logic, not style
\`\`\`

### 4. Easier Onboarding

\`\`\`bash
# New developer joins team

# Without formatter:
# - Read 50-page style guide
# - Learn team conventions
# - Get style feedback in reviews
# - Takes weeks to match team style

# With formatter:
# - Install formatter
# - Run on save
# - Matches team style automatically
# - Productive from day one
\`\`\`

## Implementation Strategies

### Strategy 1: Format on Save

\`\`\`json
// VS Code settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.python"
  }
}
\`\`\`

**Pros:**
- Automatic, no thinking required
- Immediate feedback
- Always formatted

**Cons:**
- Can be jarring if formatting changes a lot
- May conflict with other tools

### Strategy 2: Pre-Commit Hooks

\`\`\`bash
# Install husky and lint-staged
npm install --save-dev husky lint-staged

# package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "prettier --write",
    "*.py": "black"
  }
}

# .husky/pre-commit
#!/bin/sh
npx lint-staged
\`\`\`

**Pros:**
- Ensures all committed code is formatted
- Doesn't interrupt workflow
- Works for all team members

**Cons:**
- Slightly slower commits
- Can be bypassed with --no-verify

### Strategy 3: CI/CD Checks

\`\`\`yaml
# .github/workflows/format-check.yml
name: Format Check

on: [push, pull_request]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx prettier --check .
      - name: Fail if not formatted
        if: failure()
        run: |
          echo "Code is not formatted. Run 'npm run format' locally."
          exit 1
\`\`\`

**Pros:**
- Catches unformatted code before merge
- Enforces standards
- Works with any workflow

**Cons:**
- Requires CI/CD setup
- Feedback is delayed
- Can block PRs

### Strategy 4: Combination Approach (Recommended)

\`\`\`bash
# 1. Format on save (developer convenience)
# VS Code: editor.formatOnSave = true

# 2. Pre-commit hook (safety net)
# .husky/pre-commit runs formatter

# 3. CI/CD check (enforcement)
# GitHub Actions checks formatting

# Result: Multiple layers of protection
\`\`\`

## Measuring Impact

### Code Quality Metrics

\`\`\`javascript
// Before Automatic Formatting
const metrics = {
  styleIssues: 150,        // per week
  reviewTime: 45,          // minutes per PR
  styleDebates: 12,        // per week
  onboardingTime: 14       // days
};

// After Automatic Formatting
const metrics = {
  styleIssues: 0,          // per week
  reviewTime: 20,          // minutes per PR
  styleDebates: 0,         // per week
  onboardingTime: 2        // days
};

// Improvements:
// - 100% reduction in style issues
// - 55% faster code reviews
// - 100% reduction in style debates
// - 85% faster onboarding
\`\`\`

### Team Productivity

\`\`\`bash
# Time saved per developer per week:
# - Manual formatting: 2 hours
# - Style debates: 1 hour
# - Code review friction: 2 hours
# Total: 5 hours per week

# For team of 10 developers:
# - 50 hours per week
# - 200 hours per month
# - 2,400 hours per year

# At $50/hour:
# Annual savings: $120,000
\`\`\`

## Best Practices

### 1. Start Early

\`\`\`bash
# Best: Add formatter at project start
git init
npm init
npm install --save-dev prettier
npx prettier --write .

# Good: Add formatter during refactor
# Okay: Add formatter anytime
# Never: Don't add formatter
\`\`\`

### 2. Format Entire Codebase at Once

\`\`\`bash
# Create dedicated commit
git checkout -b add-formatter
npm install --save-dev prettier
npx prettier --write .
git add .
git commit -m "Add Prettier formatting to entire codebase"
git push origin add-formatter

# Benefits:
# - Clean history
# - Easy to review
# - One-time disruption
\`\`\`

### 3. Document the Decision

\`\`\`markdown
# FORMATTING.md

## Code Formatting

This project uses Prettier for automatic code formatting.

### Setup

\`\`\`bash
npm install
\`\`\`

Prettier will run automatically on save if you use VS Code.

### Manual Formatting

\`\`\`bash
npm run format
\`\`\`

### CI/CD

All PRs must pass formatting checks. Run \`npm run format:check\` before pushing.

### Configuration

See .prettierrc for configuration. Changes require team discussion.
\`\`\`

### 4. Educate the Team

\`\`\`markdown
## Team Meeting Agenda

1. Why we're adding automatic formatting
   - Consistency
   - Time savings
   - Better code reviews

2. How it works
   - Format on save
   - Pre-commit hooks
   - CI/CD checks

3. What to expect
   - Initial large commit
   - Automatic formatting
   - Fewer style comments

4. How to use
   - Install extensions
   - Run formatter
   - Trust the tool
\`\`\`

## Common Objections and Responses

### "I don't like the formatter's style"

**Response:**
\`\`\`markdown
The goal isn't perfect style, it's consistent style.
Benefits of consistency outweigh personal preferences.
Team productivity > individual preferences.
\`\`\`

### "It changes too much code"

**Response:**
\`\`\`bash
# Do it in one commit
git commit -m "Add automatic formatting"

# Use git blame --ignore-rev
echo "commit-hash" >> .git-blame-ignore-revs

# Git will skip this commit in blame
git blame --ignore-revs-file .git-blame-ignore-revs file.js
\`\`\`

### "It slows down my workflow"

**Response:**
\`\`\`markdown
Initial adjustment period: 1-2 days
Long-term time savings: 2+ hours per week
Net benefit: Significant productivity gain

Tips:
- Use format on save
- Trust the formatter
- Stop manually formatting
\`\`\`

### "We already have a style guide"

**Response:**
\`\`\`markdown
Formatter enforces style guide automatically.
No need to remember rules.
No need to check manually.
No need to debate in reviews.

Configure formatter to match style guide.
\`\`\`

## Advanced Techniques

### Gradual Adoption

\`\`\`bash
# Format only new/changed files
git diff --name-only main | xargs prettier --write

# Format one directory at a time
prettier --write "src/components/**/*.js"
prettier --write "src/utils/**/*.js"
prettier --write "src/services/**/*.js"

# Gradually expand coverage
\`\`\`

### Custom Rules

\`\`\`javascript
// .prettierrc.js
module.exports = {
  // Standard rules
  semi: true,
  singleQuote: true,
  
  // Custom overrides for specific files
  overrides: [
    {
      files: "*.test.js",
      options: {
        printWidth: 120  // Longer lines in tests
      }
    },
    {
      files: "*.md",
      options: {
        proseWrap: "always"  // Wrap markdown
      }
    }
  ]
};
\`\`\`

### Integration with Linters

\`\`\`bash
# Install ESLint + Prettier integration
npm install --save-dev eslint-config-prettier eslint-plugin-prettier

# .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ]
}

# Now ESLint and Prettier work together
npm run lint  # Checks both code quality and formatting
\`\`\`

## Success Stories

### Case Study 1: Startup

\`\`\`markdown
**Company:** Tech startup, 5 developers
**Before:** Manual formatting, inconsistent code
**After:** Prettier + pre-commit hooks

**Results:**
- Code review time: -60%
- Style debates: -100%
- Developer satisfaction: +40%
- Onboarding time: -75%

**Quote:** "Best decision we made. Wish we'd done it sooner."
\`\`\`

### Case Study 2: Enterprise

\`\`\`markdown
**Company:** Enterprise, 100+ developers
**Before:** 50-page style guide, manual enforcement
**After:** Prettier + CI/CD checks

**Results:**
- Style guide violations: -95%
- Code review comments: -40%
- Time to first commit (new devs): -80%
- Annual time savings: 5,000+ hours

**Quote:** "Transformed our code quality and team productivity."
\`\`\`

## Conclusion

Automatic code formatting is one of the highest-ROI improvements you can make to your development workflow.

**Key Benefits:**
- Consistency across codebase
- Time savings (2+ hours per developer per week)
- Better code reviews (focus on logic, not style)
- Faster onboarding
- Reduced friction

**Implementation:**
1. Choose a formatter (Prettier, Black, etc.)
2. Configure for your project
3. Format entire codebase
4. Add pre-commit hooks
5. Add CI/CD checks
6. Educate team

**ROI:**
- Setup time: 2-4 hours
- Annual time savings: 100+ hours per developer
- Payback period: < 1 week

**Recommendation:** Implement automatic formatting in every project, no exceptions.`,


  15: `# Code Formatting Best Practices for Teams

Consistent code formatting is crucial for team collaboration. This guide establishes effective code formatting standards and practices for development teams.

## Establishing Team Standards

### 1. Choose One Formatter

\\`\\`\\`bash
# Bad: Multiple formatters
# Developer A uses Prettier
# Developer B uses Beautifier
# Developer C formats manually
# Result: Inconsistent code

# Good: One formatter for everyone
# Everyone uses Prettier
# Configured in package.json
# Enforced by CI/CD
\\`\\`\`

### 2. Document the Decision

\`\`\`markdown
# CODE_STYLE.md

## Formatting

We use Prettier for all JavaScript/TypeScript code.

### Installation
\`\`\`bash
npm install
\`\`\`

### Usage
- Automatic: Format on save (VS Code)
- Manual: \`npm run format\`
- Check: \`npm run format:check\`

### Configuration
See .prettierrc - changes require team approval.
\`\`\`

### 3. Automate Everything

\`\`\`json
// package.json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint . && prettier --check ."
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,md}": "prettier --write"
  }
}
\`\`\`

## Configuration Best Practices

### Keep It Simple

\`\`\`json
// .prettierrc - Minimal configuration
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}

// Avoid over-configuration
// Let Prettier make most decisions
\`\`\`

### Version Control Configuration

\`\`\`bash
# Commit configuration files
git add .prettierrc .eslintrc.json
git commit -m "Add code formatting configuration"

# Everyone gets same settings
# No local variations
# Consistent across team
\`\`\`

### Lock Tool Versions

\`\`\`json
// package.json
{
  "devDependencies": {
    "prettier": "3.0.0",  // Exact version
    "eslint": "8.45.0"    // Exact version
  }
}

// Use --save-exact
npm install --save-dev --save-exact prettier
\`\`\`

## Team Workflow

### For New Projects

\`\`\`bash
# 1. Initialize project
git init
npm init -y

# 2. Install formatter
npm install --save-dev --save-exact prettier

# 3. Create configuration
echo '{"semi": true, "singleQuote": true}' > .prettierrc

# 4. Add scripts
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.format:check="prettier --check ."

# 5. Format initial code
npm run format

# 6. Commit
git add .
git commit -m "Initial commit with Prettier"
\`\`\`

### For Existing Projects

\`\`\`bash
# 1. Create feature branch
git checkout -b add-prettier

# 2. Install formatter
npm install --save-dev --save-exact prettier

# 3. Configure
echo '{"semi": true, "singleQuote": true}' > .prettierrc

# 4. Format all code
npm run format

# 5. Create dedicated commit
git add .
git commit -m "Add Prettier formatting

- Installed Prettier 3.0.0
- Configured with team standards
- Formatted entire codebase
- Added format scripts to package.json"

# 6. Create PR
git push origin add-prettier

# 7. Team reviews and merges
\`\`\`

## Handling Disagreements

### Process for Style Decisions

\`\`\`markdown
## Style Decision Process

1. **Propose Change**
   - Create issue describing proposed change
   - Explain reasoning
   - Show examples

2. **Team Discussion**
   - Everyone reviews proposal
   - Discuss pros/cons
   - Consider impact

3. **Vote**
   - Simple majority wins
   - Or: Tech lead decides
   - Or: Default to formatter's opinion

4. **Implement**
   - Update configuration
   - Format codebase
   - Document decision

5. **Move On**
   - No revisiting without new information
   - Trust the process
   - Focus on building features
\`\`\`

### Common Disagreements

**Semicolons vs No Semicolons**
\`\`\`javascript
// Solution: Pick one, move on
// Most teams: Use semicolons (safer)
{ "semi": true }

// Some teams: No semicolons (cleaner)
{ "semi": false }

// Either is fine, consistency matters
\`\`\`

**Single vs Double Quotes**
\`\`\`javascript
// Solution: Pick one, move on
// Most teams: Single quotes
{ "singleQuote": true }

// Some teams: Double quotes
{ "singleQuote": false }

// Either is fine, consistency matters
\`\`\`

**Tabs vs Spaces**
\`\`\`javascript
// Solution: Spaces (industry standard)
{ "useTabs": false, "tabWidth": 2 }

// Rare: Tabs
{ "useTabs": true }

// Recommendation: Spaces
\`\`\`

## Code Review Guidelines

### Focus on Logic, Not Style

\`\`\`markdown
## Code Review Checklist

### ✅ Review These:
- [ ] Logic correctness
- [ ] Error handling
- [ ] Performance
- [ ] Security
- [ ] Tests
- [ ] Documentation

### ❌ Don't Review These:
- [ ] Indentation (formatter handles it)
- [ ] Line breaks (formatter handles it)
- [ ] Spacing (formatter handles it)
- [ ] Quote style (formatter handles it)

### If Style Issues Exist:
- Don't comment on them
- CI/CD will catch them
- Developer will fix automatically
\`\`\`

### Automated Checks

\`\`\`yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on: [pull_request]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run format:check
      - name: Comment on PR if formatting fails
        if: failure()
        uses: actions/github-script@v5
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Code is not formatted. Please run `npm run format` locally.'
            })
\`\`\`

## Onboarding New Team Members

### Onboarding Checklist

\`\`\`markdown
## New Developer Setup

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/company/project.git
cd project
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Install VS Code Extensions
- Prettier - Code formatter
- ESLint

### 4. Configure VS Code
\`\`\`json
// .vscode/settings.json (already in repo)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
\`\`\`

### 5. Test Formatting
\`\`\`bash
# Make a change
echo "const x=1" >> test.js

# Save file (should auto-format)
# Or run manually
npm run format

# Verify
npm run format:check
\`\`\`

### 6. Make First Commit
\`\`\`bash
git checkout -b my-first-feature
# Make changes
git commit -m "Add feature"
# Pre-commit hook runs formatter automatically
\`\`\`

### Done!
You're ready to contribute. Code will be formatted automatically.
\`\`\`

## Maintaining Standards

### Regular Audits

\`\`\`bash
# Monthly: Check formatting compliance
npm run format:check

# If issues found:
npm run format
git commit -m "Fix formatting"

# Update dependencies
npm update prettier
npm run format
git commit -m "Update Prettier and reformat"
\`\`\`

### Handling Exceptions

\`\`\`javascript
// Rare cases where formatter should be disabled
// Use sparingly!

// Prettier ignore
// prettier-ignore
const matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

// ESLint ignore
// eslint-disable-next-line
const result = eval(userInput);  // Necessary for specific use case
\`\`\`

### Updating Standards

\`\`\`markdown
## Process for Updating Formatting Rules

1. **Propose Update**
   - Create issue
   - Explain why change is needed
   - Show impact (run formatter with new config)

2. **Team Review**
   - Discuss in team meeting
   - Consider impact on existing code
   - Vote on change

3. **Implement**
   - Update .prettierrc
   - Run formatter on entire codebase
   - Create PR with changes
   - Document in CHANGELOG

4. **Communicate**
   - Announce in team chat
   - Update documentation
   - Help team members update their setup
\`\`\`

## Measuring Success

### Metrics to Track

\`\`\`javascript
const metrics = {
  // Before formatter
  before: {
    styleCommentsPerPR: 15,
    reviewTimeMinutes: 45,
    styleDebatesPerWeek: 8,
    onboardingDays: 14
  },
  
  // After formatter
  after: {
    styleCommentsPerPR: 0,
    reviewTimeMinutes: 25,
    styleDebatesPerWeek: 0,
    onboardingDays: 2
  },
  
  // Improvements
  improvements: {
    styleComments: '100% reduction',
    reviewTime: '44% faster',
    styleDebates: '100% reduction',
    onboarding: '85% faster'
  }
};
\`\`\`

### Team Satisfaction

\`\`\`markdown
## Quarterly Survey

1. How satisfied are you with our code formatting?
   - Very satisfied: 85%
   - Satisfied: 15%
   - Neutral: 0%
   - Dissatisfied: 0%

2. Does automatic formatting improve your productivity?
   - Significantly: 70%
   - Somewhat: 25%
   - Not really: 5%

3. Would you want to go back to manual formatting?
   - No: 100%
   - Yes: 0%
\`\`\`

## Conclusion

Effective code formatting for teams requires:

1. **Choose one formatter** - Prettier, Black, etc.
2. **Automate everything** - Format on save, pre-commit hooks, CI/CD
3. **Document standards** - Clear, accessible documentation
4. **Focus reviews on logic** - Not style
5. **Onboard effectively** - Make it easy for new developers
6. **Maintain standards** - Regular audits and updates
7. **Measure success** - Track metrics and satisfaction

**Result:** Consistent codebase, faster reviews, happier team.`,


  // COLOR TOOL POSTS (IDs 16-20)
  16: `# Complete Guide to Color Pickers: Tools and Techniques

Color selection is crucial in design and development. This comprehensive guide covers color pickers, formats, and techniques for effective color management.

## Understanding Color Formats

### RGB (Red, Green, Blue)

\\`\\`\\`css
/* RGB format */
color: rgb(255, 99, 71);  /* Tomato red */

/* RGBA with alpha (transparency) */
color: rgba(255, 99, 71, 0.5);  /* 50% transparent */

/* Values: 0-255 for each channel */
\\`\\`\`

### Hexadecimal

\`\`\`css
/* Hex format */
color: #FF6347;  /* Tomato red */

/* Short hex (when values repeat) */
color: #F00;  /* Same as #FF0000 */

/* Hex with alpha */
color: #FF634780;  /* 50% transparent */
\`\`\`

### HSL (Hue, Saturation, Lightness)

\`\`\`css
/* HSL format */
color: hsl(9, 100%, 64%);  /* Tomato red */

/* HSLA with alpha */
color: hsla(9, 100%, 64%, 0.5);  /* 50% transparent */

/* Hue: 0-360 degrees */
/* Saturation: 0-100% */
/* Lightness: 0-100% */
\`\`\`

## Color Picker Tools

### Browser DevTools

\`\`\`javascript
// Chrome/Firefox DevTools
// 1. Inspect element
// 2. Click color swatch
// 3. Use eyedropper to pick from screen
// 4. Adjust with sliders
// 5. Copy in any format
\`\`\`

### Online Color Pickers

- **Google Color Picker**: Simple, fast
- **Adobe Color**: Professional, palettes
- **Coolors.co**: Palette generator
- **ColorHexa**: Detailed color info
- **Our DevTools Color Picker**: Developer-focused

### Desktop Applications

- **ColorSlurp** (Mac): System-wide picker
- **Just Color Picker** (Windows): Lightweight
- **Gpick** (Linux): Advanced features

## Color Conversion

### RGB to Hex

\`\`\`javascript
function rgbToHex(r, g, b) {
  return "#" + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
}

// Usage
rgbToHex(255, 99, 71);  // "#ff6347"
\`\`\`

### Hex to RGB

\`\`\`javascript
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Usage
hexToRgb("#ff6347");  // {r: 255, g: 99, b: 71}
\`\`\`

### RGB to HSL

\`\`\`javascript
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
\`\`\`

## Color Theory Basics

### Color Wheel

\`\`\`
Primary Colors:
- Red (0°)
- Yellow (60°)
- Green (120°)
- Cyan (180°)
- Blue (240°)
- Magenta (300°)
\`\`\`

### Color Harmonies

**Complementary** (Opposite on wheel)
\`\`\`css
/* Blue and Orange */
--primary: hsl(210, 100%, 50%);
--complement: hsl(30, 100%, 50%);
\`\`\`

**Analogous** (Adjacent on wheel)
\`\`\`css
/* Blue, Blue-Green, Green */
--color-1: hsl(210, 100%, 50%);
--color-2: hsl(180, 100%, 50%);
--color-3: hsl(150, 100%, 50%);
\`\`\`

**Triadic** (Evenly spaced)
\`\`\`css
/* Red, Yellow, Blue */
--color-1: hsl(0, 100%, 50%);
--color-2: hsl(120, 100%, 50%);
--color-3: hsl(240, 100%, 50%);
\`\`\`

## Practical Techniques

### Creating Color Palettes

\`\`\`javascript
// Generate shades of a color
function generateShades(baseHsl, steps = 5) {
  const shades = [];
  const { h, s } = baseHsl;
  
  for (let i = 0; i < steps; i++) {
    const l = 90 - (i * 20);  // 90%, 70%, 50%, 30%, 10%
    shades.push(\`hsl(\${h}, \${s}%, \${l}%)\`);
  }
  
  return shades;
}

// Usage
const blue = { h: 210, s: 100 };
const blueShades = generateShades(blue);
// ['hsl(210, 100%, 90%)', 'hsl(210, 100%, 70%)', ...]
\`\`\`

### Accessibility Checking

\`\`\`javascript
// Check contrast ratio (WCAG)
function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance({r, g, b}) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Usage
const white = {r: 255, g: 255, b: 255};
const blue = {r: 0, g: 0, b: 255};
const ratio = getContrastRatio(white, blue);  // 8.59

// WCAG Requirements:
// AA Normal Text: 4.5:1
// AA Large Text: 3:1
// AAA Normal Text: 7:1
// AAA Large Text: 4.5:1
\`\`\`

## Best Practices

### 1. Use CSS Custom Properties

\`\`\`css
:root {
  /* Define colors once */
  --primary: #3498db;
  --secondary: #2ecc71;
  --accent: #e74c3c;
  
  /* Use throughout */
  --text-primary: var(--primary);
  --bg-primary: color-mix(in srgb, var(--primary) 10%, white);
}

button {
  background: var(--primary);
  color: white;
}
\`\`\`

### 2. Name Colors Semantically

\`\`\`css
/* Bad: Color names */
--blue: #3498db;
--red: #e74c3c;

/* Good: Semantic names */
--color-primary: #3498db;
--color-danger: #e74c3c;
--color-success: #2ecc71;
\`\`\`

### 3. Create Color Systems

\`\`\`css
:root {
  /* Base colors */
  --blue-50: #e3f2fd;
  --blue-100: #bbdefb;
  --blue-200: #90caf9;
  --blue-300: #64b5f6;
  --blue-400: #42a5f5;
  --blue-500: #2196f3;  /* Base */
  --blue-600: #1e88e5;
  --blue-700: #1976d2;
  --blue-800: #1565c0;
  --blue-900: #0d47a1;
  
  /* Semantic mapping */
  --primary: var(--blue-500);
  --primary-light: var(--blue-300);
  --primary-dark: var(--blue-700);
}
\`\`\`

## Conclusion

Effective color management requires:
- Understanding color formats
- Using appropriate tools
- Following color theory
- Ensuring accessibility
- Creating systematic palettes

Master these techniques for professional, accessible designs.`,


  17: `# RGB vs Hex vs HSL: Understanding Color Formats

Color formats can be confusing for developers and designers. This guide explains the differences between RGB, Hex, and HSL, and when to use each one.

## Format Comparison

| Format | Example | Use Case | Readability |
|--------|---------|----------|-------------|
| RGB | rgb(255, 99, 71) | Programmatic | Medium |
| Hex | #FF6347 | CSS, Design | Low |
| HSL | hsl(9, 100%, 64%) | Adjustments | High |

## RGB (Red, Green, Blue)

### How It Works

\\`\\`\\`css
/* RGB: Additive color model */
rgb(red, green, blue)

/* Values: 0-255 for each channel */
rgb(255, 0, 0)    /* Pure red */
rgb(0, 255, 0)    /* Pure green */
rgb(0, 0, 255)    /* Pure blue */
rgb(255, 255, 255) /* White */
rgb(0, 0, 0)       /* Black */

/* RGBA: With transparency */
rgba(255, 99, 71, 0.5)  /* 50% transparent */
\\`\\`\`

### When to Use RGB

**Best for:**
- JavaScript color manipulation
- Canvas/WebGL graphics
- Image processing
- Programmatic color generation

\`\`\`javascript
// Easy to manipulate programmatically
function lighten(r, g, b, amount) {
  return {
    r: Math.min(255, r + amount),
    g: Math.min(255, g + amount),
    b: Math.min(255, b + amount)
  };
}

const color = {r: 100, g: 150, b: 200};
const lighter = lighten(color.r, color.g, color.b, 50);
\`\`\`

## Hexadecimal

### How It Works

\`\`\`css
/* Hex: RGB in hexadecimal */
#RRGGBB

/* Each pair: 00-FF (0-255 in decimal) */
#FF0000  /* Red: FF=255, 00=0, 00=0 */
#00FF00  /* Green */
#0000FF  /* Blue */
#FFFFFF  /* White */
#000000  /* Black */

/* Short form (when values repeat) */
#F00  /* Same as #FF0000 */
#0F0  /* Same as #00FF00 */

/* With alpha (8 digits) */
#FF634780  /* 50% transparent */
\`\`\`

### When to Use Hex

**Best for:**
- CSS stylesheets
- Design tools (Figma, Sketch)
- Compact representation
- Sharing colors

\`\`\`css
/* Most common in CSS */
.button {
  background: #3498db;
  color: #ffffff;
  border: 1px solid #2980b9;
}

/* Compact and widely supported */
\`\`\`

## HSL (Hue, Saturation, Lightness)

### How It Works

\`\`\`css
/* HSL: Intuitive color model */
hsl(hue, saturation%, lightness%)

/* Hue: 0-360 degrees (color wheel) */
hsl(0, 100%, 50%)    /* Red */
hsl(120, 100%, 50%)  /* Green */
hsl(240, 100%, 50%)  /* Blue */

/* Saturation: 0-100% (color intensity) */
hsl(0, 0%, 50%)      /* Gray */
hsl(0, 50%, 50%)     /* Muted red */
hsl(0, 100%, 50%)    /* Vivid red */

/* Lightness: 0-100% (brightness) */
hsl(0, 100%, 0%)     /* Black */
hsl(0, 100%, 50%)    /* Pure red */
hsl(0, 100%, 100%)   /* White */

/* HSLA: With transparency */
hsla(9, 100%, 64%, 0.5)
\`\`\`

### When to Use HSL

**Best for:**
- Creating color variations
- Adjusting brightness/saturation
- Color theory applications
- Intuitive color manipulation

\`\`\`css
/* Easy to create variations */
:root {
  --primary-hue: 210;
  
  /* Same hue, different lightness */
  --primary-light: hsl(var(--primary-hue), 100%, 70%);
  --primary: hsl(var(--primary-hue), 100%, 50%);
  --primary-dark: hsl(var(--primary-hue), 100%, 30%);
}
\`\`\`

## Conversion Between Formats

### RGB to Hex

\`\`\`javascript
function rgbToHex(r, g, b) {
  return "#" + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join("");
}

rgbToHex(255, 99, 71);  // "#ff6347"
\`\`\`

### Hex to RGB

\`\`\`javascript
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

hexToRgb("#ff6347");  // {r: 255, g: 99, b: 71}
\`\`\`

### RGB to HSL

\`\`\`javascript
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
\`\`\`

### HSL to RGB

\`\`\`javascript
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
\`\`\`

## Practical Use Cases

### Use RGB for Canvas

\`\`\`javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// RGB is natural for canvas
ctx.fillStyle = 'rgb(255, 99, 71)';
ctx.fillRect(0, 0, 100, 100);

// Easy to manipulate
const imageData = ctx.getImageData(0, 0, 100, 100);
for (let i = 0; i < imageData.data.length; i += 4) {
  imageData.data[i] += 50;     // Increase red
  imageData.data[i + 1] += 50; // Increase green
  imageData.data[i + 2] += 50; // Increase blue
}
ctx.putImageData(imageData, 0, 0);
\`\`\`

### Use Hex for CSS

\`\`\`css
/* Hex is standard in CSS */
:root {
  --primary: #3498db;
  --secondary: #2ecc71;
  --accent: #e74c3c;
}

.button {
  background: var(--primary);
  color: #ffffff;
}
\`\`\`

### Use HSL for Theming

\`\`\`css
/* HSL makes theming easy */
:root {
  --hue: 210;  /* Blue */
  
  /* Light theme */
  --bg: hsl(var(--hue), 20%, 95%);
  --text: hsl(var(--hue), 20%, 20%);
  --primary: hsl(var(--hue), 70%, 50%);
}

[data-theme="dark"] {
  /* Dark theme: just adjust lightness */
  --bg: hsl(var(--hue), 20%, 10%);
  --text: hsl(var(--hue), 20%, 90%);
  --primary: hsl(var(--hue), 70%, 60%);
}
\`\`\`

## Performance Considerations

\`\`\`javascript
// Benchmark: 1 million color operations

// RGB: Fastest (native format)
// Time: 50ms

// Hex: Fast (simple conversion)
// Time: 75ms

// HSL: Slower (complex conversion)
// Time: 150ms

// Recommendation: Use RGB for heavy computation
\`\`\`

## Browser Support

\`\`\`css
/* All formats widely supported */

/* RGB: Since CSS1 (1996) */
color: rgb(255, 99, 71);

/* Hex: Since CSS1 (1996) */
color: #FF6347;

/* HSL: Since CSS3 (2011) */
color: hsl(9, 100%, 64%);

/* Modern: All browsers support all formats */
\`\`\`

## Conclusion

**Choose RGB when:**
- Working with canvas/WebGL
- Processing images
- Need programmatic manipulation
- Performance is critical

**Choose Hex when:**
- Writing CSS
- Sharing colors with designers
- Need compact representation
- Following conventions

**Choose HSL when:**
- Creating color variations
- Building themes
- Need intuitive adjustments
- Working with color theory

**Best Practice:** Use HSL for design systems, convert to Hex for CSS output.`,


  18: `# Creating Harmonious Color Palettes: A Designer's Guide

Color harmony is the foundation of great design. This guide teaches you color theory and practical techniques for creating beautiful, harmonious color palettes.

## Color Theory Fundamentals

### The Color Wheel

\\`\\`\`
Primary Colors (120° apart):
- Red (0°)
- Yellow (120°)
- Blue (240°)

Secondary Colors (mix of primaries):
- Orange (60°): Red + Yellow
- Green (180°): Yellow + Blue
- Purple (300°): Blue + Red

Tertiary Colors (mix of primary + secondary):
- Red-Orange, Yellow-Orange, Yellow-Green, etc.
\`\`\`

### Color Harmonies

**Monochromatic** (One hue, multiple shades)
\`\`\`css
:root {
  --base-hue: 210;
  --color-1: hsl(var(--base-hue), 100%, 90%);
  --color-2: hsl(var(--base-hue), 100%, 70%);
  --color-3: hsl(var(--base-hue), 100%, 50%);
  --color-4: hsl(var(--base-hue), 100%, 30%);
  --color-5: hsl(var(--base-hue), 100%, 10%);
}
\`\`\`

**Analogous** (Adjacent colors, 30° apart)
\`\`\`css
:root {
  --color-1: hsl(210, 100%, 50%);  /* Blue */
  --color-2: hsl(180, 100%, 50%);  /* Cyan */
  --color-3: hsl(150, 100%, 50%);  /* Green */
}
\`\`\`

**Complementary** (Opposite colors, 180° apart)
\`\`\`css
:root {
  --primary: hsl(210, 100%, 50%);    /* Blue */
  --complement: hsl(30, 100%, 50%);  /* Orange */
}
\`\`\`

**Triadic** (Evenly spaced, 120° apart)
\`\`\`css
:root {
  --color-1: hsl(0, 100%, 50%);    /* Red */
  --color-2: hsl(120, 100%, 50%);  /* Green */
  --color-3: hsl(240, 100%, 50%);  /* Blue */
}
\`\`\`

**Split-Complementary** (Base + two adjacent to complement)
\`\`\`css
:root {
  --base: hsl(210, 100%, 50%);      /* Blue */
  --split-1: hsl(0, 100%, 50%);     /* Red */
  --split-2: hsl(60, 100%, 50%);    /* Yellow */
}
\`\`\`

**Tetradic** (Two complementary pairs)
\`\`\`css
:root {
  --color-1: hsl(0, 100%, 50%);     /* Red */
  --color-2: hsl(90, 100%, 50%);    /* Yellow-Green */
  --color-3: hsl(180, 100%, 50%);   /* Cyan */
  --color-4: hsl(270, 100%, 50%);   /* Purple */
}
\`\`\`

## Practical Palette Generation

### Method 1: 60-30-10 Rule

\`\`\`css
/* 60% Dominant color */
--dominant: hsl(210, 50%, 50%);

/* 30% Secondary color */
--secondary: hsl(210, 30%, 70%);

/* 10% Accent color */
--accent: hsl(30, 100%, 50%);

/* Application */
body {
  background: var(--dominant);      /* 60% */
}

.sidebar {
  background: var(--secondary);     /* 30% */
}

.button {
  background: var(--accent);        /* 10% */
}
\`\`\`

### Method 2: Tints, Shades, and Tones

\`\`\`javascript
// Generate palette from base color
function generatePalette(baseHsl) {
  const { h, s, l } = baseHsl;
  
  return {
    // Tints (add white, increase lightness)
    tint1: \`hsl(\${h}, \${s}%, \${Math.min(100, l + 30)}%)\`,
    tint2: \`hsl(\${h}, \${s}%, \${Math.min(100, l + 15)}%)\`,
    
    // Base color
    base: \`hsl(\${h}, \${s}%, \${l}%)\`,
    
    // Shades (add black, decrease lightness)
    shade1: \`hsl(\${h}, \${s}%, \${Math.max(0, l - 15)}%)\`,
    shade2: \`hsl(\${h}, \${s}%, \${Math.max(0, l - 30)}%)\`,
    
    // Tones (add gray, decrease saturation)
    tone1: \`hsl(\${h}, \${Math.max(0, s - 20)}%, \${l}%)\`,
    tone2: \`hsl(\${h}, \${Math.max(0, s - 40)}%, \${l}%)\`
  };
}

// Usage
const blue = { h: 210, s: 100, l: 50 };
const palette = generatePalette(blue);
\`\`\`

### Method 3: Material Design Approach

\`\`\`css
:root {
  /* Generate 10 shades */
  --blue-50: #e3f2fd;
  --blue-100: #bbdefb;
  --blue-200: #90caf9;
  --blue-300: #64b5f6;
  --blue-400: #42a5f5;
  --blue-500: #2196f3;  /* Base */
  --blue-600: #1e88e5;
  --blue-700: #1976d2;
  --blue-800: #1565c0;
  --blue-900: #0d47a1;
  
  /* Semantic mapping */
  --primary: var(--blue-500);
  --primary-light: var(--blue-300);
  --primary-dark: var(--blue-700);
}
\`\`\`

## Tools for Palette Creation

### JavaScript Palette Generator

\`\`\`javascript
class PaletteGenerator {
  // Generate complementary palette
  static complementary(hue) {
    return [
      \`hsl(\${hue}, 70%, 50%)\`,
      \`hsl(\${(hue + 180) % 360}, 70%, 50%)\`
    ];
  }
  
  // Generate analogous palette
  static analogous(hue, count = 3) {
    const palette = [];
    const step = 30;
    
    for (let i = 0; i < count; i++) {
      const h = (hue + (i * step)) % 360;
      palette.push(\`hsl(\${h}, 70%, 50%)\`);
    }
    
    return palette;
  }
  
  // Generate triadic palette
  static triadic(hue) {
    return [
      \`hsl(\${hue}, 70%, 50%)\`,
      \`hsl(\${(hue + 120) % 360}, 70%, 50%)\`,
      \`hsl(\${(hue + 240) % 360}, 70%, 50%)\`
    ];
  }
  
  // Generate monochromatic palette
  static monochromatic(hue, count = 5) {
    const palette = [];
    const lightness = [90, 70, 50, 30, 10];
    
    for (let i = 0; i < count; i++) {
      palette.push(\`hsl(\${hue}, 70%, \${lightness[i]}%)\`);
    }
    
    return palette;
  }
}

// Usage
const complementary = PaletteGenerator.complementary(210);
const analogous = PaletteGenerator.analogous(210);
const triadic = PaletteGenerator.triadic(210);
const monochromatic = PaletteGenerator.monochromatic(210);
\`\`\`

## Real-World Examples

### Example 1: Corporate Website

\`\`\`css
:root {
  /* Primary: Professional blue */
  --primary: hsl(210, 70%, 45%);
  --primary-light: hsl(210, 70%, 65%);
  --primary-dark: hsl(210, 70%, 25%);
  
  /* Secondary: Trustworthy gray */
  --secondary: hsl(210, 10%, 50%);
  --secondary-light: hsl(210, 10%, 70%);
  --secondary-dark: hsl(210, 10%, 30%);
  
  /* Accent: Call-to-action orange */
  --accent: hsl(25, 90%, 55%);
  
  /* Neutrals */
  --white: hsl(0, 0%, 100%);
  --gray-light: hsl(0, 0%, 95%);
  --gray: hsl(0, 0%, 70%);
  --gray-dark: hsl(0, 0%, 30%);
  --black: hsl(0, 0%, 10%);
}
\`\`\`

### Example 2: E-commerce Site

\`\`\`css
:root {
  /* Primary: Energetic red */
  --primary: hsl(355, 75%, 50%);
  --primary-light: hsl(355, 75%, 70%);
  --primary-dark: hsl(355, 75%, 30%);
  
  /* Success: Purchase green */
  --success: hsl(145, 65%, 45%);
  
  /* Warning: Alert yellow */
  --warning: hsl(45, 100%, 55%);
  
  /* Info: Informative blue */
  --info: hsl(200, 70%, 50%);
  
  /* Danger: Error red */
  --danger: hsl(0, 75%, 50%);
}
\`\`\`

### Example 3: Creative Portfolio

\`\`\`css
:root {
  /* Vibrant, creative palette */
  --color-1: hsl(330, 85%, 55%);  /* Magenta */
  --color-2: hsl(45, 95%, 60%);   /* Yellow */
  --color-3: hsl(195, 85%, 50%);  /* Cyan */
  --color-4: hsl(280, 75%, 55%);  /* Purple */
  
  /* Neutral background */
  --bg: hsl(0, 0%, 98%);
  --text: hsl(0, 0%, 15%);
}
\`\`\`

## Testing Your Palette

### Accessibility Check

\`\`\`javascript
function checkAccessibility(palette) {
  const results = [];
  
  // Check each color against white and black
  palette.forEach(color => {
    const rgbColor = hslToRgb(color);
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    
    const contrastWhite = getContrastRatio(rgbColor, white);
    const contrastBlack = getContrastRatio(rgbColor, black);
    
    results.push({
      color,
      contrastWhite: contrastWhite.toFixed(2),
      contrastBlack: contrastBlack.toFixed(2),
      passesAA: contrastWhite >= 4.5 || contrastBlack >= 4.5,
      passesAAA: contrastWhite >= 7 || contrastBlack >= 7
    });
  });
  
  return results;
}
\`\`\`

### Visual Harmony Test

\`\`\`javascript
// Check if palette is harmonious
function isHarmonious(palette) {
  const hues = palette.map(color => extractHue(color));
  
  // Check for common harmony patterns
  const isMonochromatic = hues.every(h => Math.abs(h - hues[0]) < 10);
  const isComplementary = Math.abs(hues[0] - hues[1]) > 170;
  const isAnalogous = hues.every((h, i) => 
    i === 0 || Math.abs(h - hues[i-1]) < 40
  );
  
  return {
    isMonochromatic,
    isComplementary,
    isAnalogous,
    isHarmonious: isMonochromatic || isComplementary || isAnalogous
  };
}
\`\`\`

## Best Practices

### 1. Start with One Color

\`\`\`css
/* Choose one primary color */
--primary: hsl(210, 70%, 50%);

/* Generate variations */
--primary-lighter: hsl(210, 70%, 70%);
--primary-light: hsl(210, 70%, 60%);
--primary-dark: hsl(210, 70%, 40%);
--primary-darker: hsl(210, 70%, 30%);

/* Add complementary accent */
--accent: hsl(30, 70%, 50%);
\`\`\`

### 2. Limit Your Palette

\`\`\`css
/* Good: 3-5 main colors */
--primary: hsl(210, 70%, 50%);
--secondary: hsl(210, 30%, 70%);
--accent: hsl(30, 90%, 55%);

/* Bad: Too many colors */
/* 10+ different colors = visual chaos */
\`\`\`

### 3. Use Neutrals

\`\`\`css
/* Always include neutrals */
--white: hsl(0, 0%, 100%);
--gray-100: hsl(0, 0%, 95%);
--gray-200: hsl(0, 0%, 85%);
--gray-300: hsl(0, 0%, 70%);
--gray-400: hsl(0, 0%, 50%);
--gray-500: hsl(0, 0%, 30%);
--black: hsl(0, 0%, 10%);
\`\`\`

### 4. Test in Context

\`\`\`html
<!-- Create a style guide page -->
<div class="palette-test">
  <div class="color-swatch" style="background: var(--primary)">
    <h3>Primary</h3>
    <p>Text on primary</p>
    <button>Button</button>
  </div>
  
  <div class="color-swatch" style="background: var(--secondary)">
    <h3>Secondary</h3>
    <p>Text on secondary</p>
    <button>Button</button>
  </div>
  
  <!-- Test all combinations -->
</div>
\`\`\`

## Conclusion

Creating harmonious color palettes requires:
- Understanding color theory
- Using proven harmony patterns
- Generating systematic variations
- Testing for accessibility
- Limiting your palette
- Including neutrals

Master these techniques to create professional, beautiful color schemes for any project.`,


  19: `# Color Psychology in Web Design: Choosing the Right Palette

Colors have a profound psychological impact on users. This guide explores color psychology and how to choose effective color palettes for web design.

## Color Meanings and Associations

### Red
**Emotions:** Energy, passion, urgency, danger
**Use for:** Call-to-action buttons, sales, alerts
**Brands:** Coca-Cola, YouTube, Netflix

\\`\\`\\`css
/* Red for urgency */
.sale-banner {
  background: hsl(0, 85%, 55%);
  color: white;
}

.error-message {
  color: hsl(0, 70%, 50%);
}
\\`\\`\`

### Blue
**Emotions:** Trust, calm, professionalism, security
**Use for:** Corporate sites, finance, healthcare
**Brands:** Facebook, Twitter, PayPal

\`\`\`css
/* Blue for trust */
.corporate-header {
  background: hsl(210, 70%, 45%);
  color: white;
}
\`\`\`

### Green
**Emotions:** Growth, health, nature, success
**Use for:** Environmental, health, finance
**Brands:** Spotify, Whole Foods, Starbucks

\`\`\`css
/* Green for success */
.success-message {
  background: hsl(145, 65%, 45%);
  color: white;
}
\`\`\`

### Yellow
**Emotions:** Optimism, happiness, caution
**Use for:** Highlights, warnings, cheerful brands
**Brands:** McDonald's, IKEA, Snapchat

\`\`\`css
/* Yellow for attention */
.highlight {
  background: hsl(45, 100%, 85%);
  border-left: 4px solid hsl(45, 100%, 50%);
}
\`\`\`

### Purple
**Emotions:** Luxury, creativity, wisdom
**Use for:** Beauty, luxury, creative industries
**Brands:** Twitch, Yahoo, Hallmark

\`\`\`css
/* Purple for luxury */
.premium-badge {
  background: hsl(280, 60%, 50%);
  color: white;
}
\`\`\`

### Orange
**Emotions:** Enthusiasm, creativity, affordability
**Use for:** E-commerce, entertainment, food
**Brands:** Amazon, Nickelodeon, Fanta

\`\`\`css
/* Orange for action */
.cta-button {
  background: hsl(25, 90%, 55%);
  color: white;
}
\`\`\`

## Industry-Specific Palettes

### Technology/SaaS

\`\`\`css
:root {
  /* Modern, professional */
  --primary: hsl(210, 70%, 50%);    /* Blue */
  --secondary: hsl(210, 15%, 30%);  /* Gray-blue */
  --accent: hsl(170, 70%, 45%);     /* Teal */
  --success: hsl(145, 65%, 45%);    /* Green */
}
\`\`\`

### E-commerce

\`\`\`css
:root {
  /* Energetic, action-oriented */
  --primary: hsl(355, 75%, 50%);    /* Red */
  --secondary: hsl(210, 70%, 50%);  /* Blue */
  --accent: hsl(45, 100%, 55%);     /* Yellow */
  --success: hsl(145, 65%, 45%);    /* Green */
}
\`\`\`

### Healthcare

\`\`\`css
:root {
  /* Trustworthy, calming */
  --primary: hsl(200, 70%, 50%);    /* Blue */
  --secondary: hsl(145, 50%, 45%);  /* Green */
  --accent: hsl(200, 70%, 70%);     /* Light blue */
  --neutral: hsl(200, 10%, 50%);    /* Gray */
}
\`\`\`

### Food/Restaurant

\`\`\`css
:root {
  /* Appetizing, warm */
  --primary: hsl(15, 85%, 55%);     /* Orange-red */
  --secondary: hsl(45, 90%, 55%);   /* Yellow */
  --accent: hsl(145, 50%, 40%);     /* Green */
  --neutral: hsl(30, 20%, 30%);     /* Brown */
}
\`\`\`

### Finance/Banking

\`\`\`css
:root {
  /* Professional, secure */
  --primary: hsl(210, 60%, 35%);    /* Dark blue */
  --secondary: hsl(145, 40%, 40%);  /* Green */
  --accent: hsl(210, 60%, 55%);     /* Light blue */
  --neutral: hsl(210, 10%, 50%);    /* Gray */
}
\`\`\`

## Emotional Impact Strategies

### Creating Urgency

\`\`\`css
/* Use warm colors and high saturation */
.urgent {
  background: hsl(0, 85%, 55%);     /* Bright red */
  color: white;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
\`\`\`

### Building Trust

\`\`\`css
/* Use cool colors and moderate saturation */
.trustworthy {
  background: hsl(210, 50%, 45%);   /* Professional blue */
  color: white;
}
\`\`\`

### Encouraging Action

\`\`\`css
/* Use contrasting, vibrant colors */
.cta {
  background: hsl(25, 90%, 55%);    /* Orange */
  color: white;
  box-shadow: 0 4px 12px hsla(25, 90%, 55%, 0.3);
}

.cta:hover {
  background: hsl(25, 90%, 45%);    /* Darker on hover */
}
\`\`\`

### Promoting Calm

\`\`\`css
/* Use cool colors and low saturation */
.calming {
  background: hsl(200, 30%, 85%);   /* Soft blue */
  color: hsl(200, 30%, 25%);
}
\`\`\`

## Cultural Considerations

### Western Cultures

\`\`\`javascript
const westernMeanings = {
  red: 'Danger, passion, excitement',
  white: 'Purity, cleanliness, peace',
  black: 'Elegance, power, death',
  green: 'Nature, growth, money'
};
\`\`\`

### Eastern Cultures

\`\`\`javascript
const easternMeanings = {
  red: 'Luck, prosperity, celebration',
  white: 'Death, mourning',
  black: 'Mystery, knowledge',
  green: 'New life, growth'
};
\`\`\`

### Designing for Global Audiences

\`\`\`css
/* Use universally positive colors */
:root {
  --primary: hsl(210, 70%, 50%);    /* Blue (trust worldwide) */
  --success: hsl(145, 65%, 45%);    /* Green (positive worldwide) */
  --warning: hsl(45, 100%, 55%);    /* Yellow (caution worldwide) */
}

/* Avoid culturally sensitive colors for critical actions */
\`\`\`

## A/B Testing Color Choices

### Test Button Colors

\`\`\`html
<!-- Variant A: Blue button -->
<button class="cta-blue">Sign Up</button>

<!-- Variant B: Orange button -->
<button class="cta-orange">Sign Up</button>

<!-- Track conversion rates -->
<script>
  function trackConversion(variant) {
    analytics.track('button_click', { variant });
  }
</script>
\`\`\`

### Test Color Schemes

\`\`\`javascript
// Dynamically test different palettes
const palettes = {
  professional: {
    primary: 'hsl(210, 70%, 50%)',
    accent: 'hsl(210, 70%, 70%)'
  },
  energetic: {
    primary: 'hsl(355, 75%, 50%)',
    accent: 'hsl(45, 100%, 55%)'
  }
};

// Apply based on A/B test
const variant = getABTestVariant();
applyPalette(palettes[variant]);
\`\`\`

## Accessibility and Psychology

### Ensure Sufficient Contrast

\`\`\`css
/* Good: High contrast for readability */
.readable {
  background: hsl(210, 70%, 50%);   /* Blue */
  color: white;                      /* Contrast ratio: 4.6:1 */
}

/* Bad: Low contrast */
.hard-to-read {
  background: hsl(210, 70%, 50%);   /* Blue */
  color: hsl(210, 70%, 70%);        /* Light blue - poor contrast */
}
\`\`\`

### Don't Rely on Color Alone

\`\`\`html
<!-- Good: Color + icon + text -->
<div class="alert alert-success">
  <svg class="icon-check">...</svg>
  <span>Success!</span> Your changes have been saved.
</div>

<!-- Bad: Color only -->
<div class="alert-success">
  Your changes have been saved.
</div>
\`\`\`

## Practical Implementation

### Dynamic Theme Based on Content

\`\`\`javascript
function getThemeForContent(contentType) {
  const themes = {
    urgent: {
      primary: 'hsl(0, 85%, 55%)',
      emotion: 'urgency'
    },
    calm: {
      primary: 'hsl(200, 30%, 50%)',
      emotion: 'trust'
    },
    exciting: {
      primary: 'hsl(25, 90%, 55%)',
      emotion: 'energy'
    }
  };
  
  return themes[contentType] || themes.calm;
}

// Apply theme
const theme = getThemeForContent('urgent');
document.documentElement.style.setProperty('--primary', theme.primary);
\`\`\`

### Seasonal Color Adjustments

\`\`\`css
/* Spring: Fresh, growing */
[data-season="spring"] {
  --primary: hsl(145, 60%, 50%);    /* Green */
  --accent: hsl(300, 60%, 70%);     /* Pink */
}

/* Summer: Warm, energetic */
[data-season="summer"] {
  --primary: hsl(45, 100%, 55%);    /* Yellow */
  --accent: hsl(200, 80%, 50%);     /* Blue */
}

/* Fall: Warm, cozy */
[data-season="fall"] {
  --primary: hsl(25, 80%, 50%);     /* Orange */
  --accent: hsl(30, 60%, 40%);      /* Brown */
}

/* Winter: Cool, calm */
[data-season="winter"] {
  --primary: hsl(200, 60%, 45%);    /* Blue */
  --accent: hsl(0, 0%, 90%);        /* White */
}
\`\`\`

## Conclusion

Effective color psychology in web design requires:
- Understanding color meanings
- Considering cultural context
- Matching colors to industry
- Testing with real users
- Ensuring accessibility
- Adapting to content and season

Use color strategically to evoke the right emotions and drive desired actions.`,

  20: `# Accessibility in Color Selection: WCAG Guidelines

Accessible color selection is crucial for inclusive web design. This guide covers WCAG guidelines and practical techniques for choosing accessible colors.

## WCAG Color Contrast Requirements

### Contrast Ratios

\\`\\`\`
WCAG 2.1 Levels:

Level AA (Minimum):
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

Level AAA (Enhanced):
- Normal text: 7:1
- Large text (18pt+): 4.5:1
- UI components: 3:1
\`\`\`

### Calculating Contrast Ratio

\`\`\`javascript
function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance({r, g, b}) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 
      ? c / 12.92 
      : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Usage
const white = {r: 255, g: 255, b: 255};
const blue = {r: 0, g: 0, b: 255};
const ratio = getContrastRatio(white, blue);  // 8.59:1 (Passes AAA)
\`\`\`

## Accessible Color Palettes

### High Contrast Palette

\`\`\`css
:root {
  /* Backgrounds */
  --bg-primary: hsl(0, 0%, 100%);     /* White */
  --bg-secondary: hsl(0, 0%, 95%);    /* Light gray */
  
  /* Text */
  --text-primary: hsl(0, 0%, 10%);    /* Near black */
  --text-secondary: hsl(0, 0%, 30%);  /* Dark gray */
  
  /* Interactive */
  --link: hsl(210, 100%, 35%);        /* Dark blue */
  --link-visited: hsl(280, 60%, 35%); /* Dark purple */
  
  /* Status */
  --success: hsl(145, 60%, 35%);      /* Dark green */
  --error: hsl(0, 70%, 40%);          /* Dark red */
  --warning: hsl(45, 100%, 35%);      /* Dark yellow */
}

/* All combinations pass WCAG AA */
\`\`\`

### Dark Mode Accessible Palette

\`\`\`css
[data-theme="dark"] {
  /* Backgrounds */
  --bg-primary: hsl(0, 0%, 10%);      /* Near black */
  --bg-secondary: hsl(0, 0%, 15%);    /* Dark gray */
  
  /* Text */
  --text-primary: hsl(0, 0%, 95%);    /* Near white */
  --text-secondary: hsl(0, 0%, 75%);  /* Light gray */
  
  /* Interactive */
  --link: hsl(210, 100%, 70%);        /* Light blue */
  --link-visited: hsl(280, 60%, 70%); /* Light purple */
  
  /* Status */
  --success: hsl(145, 60%, 60%);      /* Light green */
  --error: hsl(0, 70%, 65%);          /* Light red */
  --warning: hsl(45, 100%, 65%);      /* Light yellow */
}
\`\`\`

## Testing for Accessibility

### Automated Testing

\`\`\`javascript
class AccessibilityChecker {
  static checkContrast(foreground, background) {
    const ratio = getContrastRatio(foreground, background);
    
    return {
      ratio: ratio.toFixed(2),
      passesAA: ratio >= 4.5,
      passesAAA: ratio >= 7,
      passesAALarge: ratio >= 3,
      passesAAALarge: ratio >= 4.5
    };
  }
  
  static checkPalette(palette) {
    const results = [];
    
    // Check all text/background combinations
    palette.backgrounds.forEach(bg => {
      palette.textColors.forEach(text => {
        const result = this.checkContrast(text, bg);
        results.push({
          foreground: text,
          background: bg,
          ...result
        });
      });
    });
    
    return results;
  }
}

// Usage
const palette = {
  backgrounds: [
    {r: 255, g: 255, b: 255},  // White
    {r: 240, g: 240, b: 240}   // Light gray
  ],
  textColors: [
    {r: 0, g: 0, b: 0},        // Black
    {r: 51, g: 51, b: 51}      // Dark gray
  ]
};

const results = AccessibilityChecker.checkPalette(palette);
\`\`\`

### Manual Testing

\`\`\`markdown
## Accessibility Testing Checklist

1. **Contrast Ratio**
   - [ ] Text vs background: 4.5:1 minimum
   - [ ] Large text vs background: 3:1 minimum
   - [ ] UI components vs background: 3:1 minimum

2. **Color Blindness**
   - [ ] Test with Deuteranopia filter
   - [ ] Test with Protanopia filter
   - [ ] Test with Tritanopia filter
   - [ ] Test with grayscale

3. **Don't Rely on Color Alone**
   - [ ] Links have underline or other indicator
   - [ ] Errors have icons and text
   - [ ] Status uses icons, not just color

4. **Focus Indicators**
   - [ ] Visible focus outline
   - [ ] High contrast focus state
   - [ ] Consistent across site
\`\`\`

## Color Blindness Considerations

### Types of Color Blindness

\`\`\`javascript
const colorBlindness = {
  deuteranopia: {
    affected: 'Red-green (most common)',
    percentage: '5% of males, 0.4% of females',
    difficulty: 'Distinguishing red and green'
  },
  protanopia: {
    affected: 'Red-green',
    percentage: '1% of males',
    difficulty: 'Distinguishing red and green'
  },
  tritanopia: {
    affected: 'Blue-yellow',
    percentage: '0.001% of population',
    difficulty: 'Distinguishing blue and yellow'
  }
};
\`\`\`

### Safe Color Combinations

\`\`\`css
/* Good: High contrast, distinguishable */
.safe-combo-1 {
  background: hsl(210, 70%, 50%);   /* Blue */
  color: white;
}

.safe-combo-2 {
  background: hsl(0, 0%, 10%);      /* Black */
  color: hsl(45, 100%, 70%);        /* Yellow */
}

/* Avoid: Red-green combinations */
.avoid {
  background: hsl(0, 70%, 50%);     /* Red */
  color: hsl(145, 70%, 50%);        /* Green */
}
\`\`\`

## Practical Implementation

### Accessible Button States

\`\`\`css
.button {
  /* Default state */
  background: hsl(210, 70%, 50%);
  color: white;
  border: 2px solid transparent;
  
  /* Contrast ratio: 4.6:1 (Passes AA) */
}

.button:hover {
  /* Hover: Darker background */
  background: hsl(210, 70%, 40%);
  /* Contrast ratio: 6.3:1 (Passes AAA) */
}

.button:focus {
  /* Focus: Visible outline */
  outline: 3px solid hsl(45, 100%, 50%);
  outline-offset: 2px;
  /* High contrast focus indicator */
}

.button:disabled {
  /* Disabled: Lower opacity but still readable */
  background: hsl(210, 20%, 70%);
  color: hsl(210, 20%, 30%);
  /* Contrast ratio: 4.5:1 (Passes AA) */
}
\`\`\`

### Accessible Form Validation

\`\`\`html
<!-- Good: Color + icon + text -->
<div class="form-group">
  <label for="email">Email</label>
  <input 
    type="email" 
    id="email" 
    class="input-error"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <div id="email-error" class="error-message">
    <svg class="icon-error" aria-hidden="true">
      <use href="#icon-alert"></use>
    </svg>
    <span>Please enter a valid email address</span>
  </div>
</div>

<style>
.input-error {
  border: 2px solid hsl(0, 70%, 50%);  /* Red border */
  background: hsl(0, 70%, 98%);        /* Light red background */
}

.error-message {
  color: hsl(0, 70%, 35%);             /* Dark red text */
  /* Contrast ratio: 7.2:1 (Passes AAA) */
}
</style>
\`\`\`

### Accessible Link Styles

\`\`\`css
a {
  color: hsl(210, 100%, 35%);          /* Dark blue */
  text-decoration: underline;          /* Always underline */
  /* Contrast ratio: 7.5:1 (Passes AAA) */
}

a:visited {
  color: hsl(280, 60%, 35%);           /* Dark purple */
  /* Contrast ratio: 7.1:1 (Passes AAA) */
}

a:hover {
  color: hsl(210, 100%, 25%);          /* Darker blue */
  text-decoration-thickness: 2px;      /* Thicker underline */
}

a:focus {
  outline: 3px solid hsl(45, 100%, 50%);
  outline-offset: 2px;
  border-radius: 2px;
}
\`\`\`

## Tools and Resources

### Browser Extensions

\`\`\`markdown
- **WAVE**: Web accessibility evaluation tool
- **axe DevTools**: Automated accessibility testing
- **Color Contrast Analyzer**: Check contrast ratios
- **NoCoffee**: Simulate vision impairments
\`\`\`

### Online Tools

\`\`\`markdown
- **WebAIM Contrast Checker**: Test color combinations
- **Colorable**: Generate accessible palettes
- **Contrast Ratio**: Simple contrast calculator
- **Who Can Use**: See how many people can use your colors
\`\`\`

## Conclusion

Accessible color selection requires:
- Meeting WCAG contrast requirements (4.5:1 minimum)
- Testing with color blindness simulators
- Not relying on color alone
- Providing visible focus indicators
- Using semantic color meanings
- Testing with real users

Prioritize accessibility to create inclusive experiences for all users.`,


  // JWT TOOL POSTS (IDs 21-25)
  21: `# JWT Decoder: How to Debug JSON Web Tokens

JSON Web Tokens (JWT) are widely used for authentication and authorization. This guide teaches you how to decode and debug JWT tokens effectively.

## Understanding JWT Structure

### Three Parts

\\`\\`\`
JWT Format: header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Part 1: Header (algorithm and type)
Part 2: Payload (claims/data)
Part 3: Signature (verification)
\`\`\`

### Decoding JWT

\`\`\`javascript
function decodeJWT(token) {
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }
  
  const [headerB64, payloadB64, signature] = parts;
  
  // Decode header and payload (Base64URL)
  const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
  const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
  
  return {
    header,
    payload,
    signature
  };
}

// Usage
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const decoded = decodeJWT(token);

console.log('Header:', decoded.header);
// { alg: "HS256", typ: "JWT" }

console.log('Payload:', decoded.payload);
// { sub: "1234567890", name: "John Doe", iat: 1516239022 }
\`\`\`

## Common JWT Claims

### Standard Claims

\`\`\`javascript
const standardClaims = {
  iss: 'Issuer - who created the token',
  sub: 'Subject - user ID',
  aud: 'Audience - intended recipient',
  exp: 'Expiration time (Unix timestamp)',
  nbf: 'Not before (Unix timestamp)',
  iat: 'Issued at (Unix timestamp)',
  jti: 'JWT ID - unique identifier'
};

// Example payload
const payload = {
  iss: 'https://auth.example.com',
  sub: 'user123',
  aud: 'https://api.example.com',
  exp: 1735689600,  // 2025-01-01
  iat: 1704067200,  // 2024-01-01
  name: 'John Doe',
  role: 'admin'
};
\`\`\`

### Checking Expiration

\`\`\`javascript
function isTokenExpired(token) {
  const { payload } = decodeJWT(token);
  
  if (!payload.exp) {
    return false;  // No expiration
  }
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

// Usage
if (isTokenExpired(token)) {
  console.log('Token expired, please login again');
}
\`\`\`

## Debugging JWT Issues

### Issue 1: Token Expired

\`\`\`javascript
function debugExpiration(token) {
  const { payload } = decodeJWT(token);
  
  if (!payload.exp) {
    return 'No expiration set';
  }
  
  const now = Math.floor(Date.now() / 1000);
  const exp = payload.exp;
  const diff = exp - now;
  
  if (diff < 0) {
    return \`Token expired \${Math.abs(diff)} seconds ago\`;
  } else {
    return \`Token expires in \${diff} seconds\`;
  }
}
\`\`\`

### Issue 2: Invalid Signature

\`\`\`javascript
// Verify JWT signature (Node.js)
const jwt = require('jsonwebtoken');

function verifyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expired' };
    } else if (error.name === 'JsonWebTokenError') {
      return { valid: false, error: 'Invalid signature' };
    } else {
      return { valid: false, error: error.message };
    }
  }
}
\`\`\`

### Issue 3: Wrong Algorithm

\`\`\`javascript
function checkAlgorithm(token, expectedAlg = 'HS256') {
  const { header } = decodeJWT(token);
  
  if (header.alg !== expectedAlg) {
    console.warn(\`Warning: Expected \${expectedAlg}, got \${header.alg}\`);
    return false;
  }
  
  return true;
}
\`\`\`

## JWT Debugging Tools

### Browser Console Decoder

\`\`\`javascript
// Paste in browser console
function debugJWT(token) {
  try {
    const decoded = decodeJWT(token);
    
    console.group('JWT Debug Info');
    console.log('Header:', decoded.header);
    console.log('Payload:', decoded.payload);
    console.log('Signature:', decoded.signature);
    
    // Check expiration
    if (decoded.payload.exp) {
      const exp = new Date(decoded.payload.exp * 1000);
      const now = new Date();
      console.log('Expires:', exp.toLocaleString());
      console.log('Expired:', exp < now);
    }
    
    // Check issued at
    if (decoded.payload.iat) {
      const iat = new Date(decoded.payload.iat * 1000);
      console.log('Issued:', iat.toLocaleString());
    }
    
    console.groupEnd();
    
    return decoded;
  } catch (error) {
    console.error('Invalid JWT:', error.message);
  }
}

// Usage
debugJWT('your-token-here');
\`\`\`

### Node.js Debugging Script

\`\`\`javascript
// debug-jwt.js
const jwt = require('jsonwebtoken');

function debugJWT(token, secret) {
  console.log('=== JWT Debug ===\n');
  
  // Decode without verification
  const decoded = jwt.decode(token, { complete: true });
  
  if (!decoded) {
    console.error('Invalid JWT format');
    return;
  }
  
  console.log('Header:');
  console.log(JSON.stringify(decoded.header, null, 2));
  
  console.log('\nPayload:');
  console.log(JSON.stringify(decoded.payload, null, 2));
  
  // Verify if secret provided
  if (secret) {
    try {
      jwt.verify(token, secret);
      console.log('\n✓ Signature valid');
    } catch (error) {
      console.log(\`\n✗ Signature invalid: \${error.message}\`);
    }
  }
  
  // Check expiration
  if (decoded.payload.exp) {
    const exp = new Date(decoded.payload.exp * 1000);
    const now = new Date();
    const expired = exp < now;
    
    console.log(\`\nExpiration: \${exp.toLocaleString()}\`);
    console.log(expired ? '✗ Token expired' : '✓ Token valid');
  }
}

// Usage
const token = process.argv[2];
const secret = process.argv[3];

if (!token) {
  console.log('Usage: node debug-jwt.js <token> [secret]');
  process.exit(1);
}

debugJWT(token, secret);
\`\`\`

## Security Considerations

### Never Trust Client-Side Decoding

\`\`\`javascript
// ❌ Bad: Trusting decoded data without verification
const { payload } = decodeJWT(token);
if (payload.role === 'admin') {
  // Grant admin access - INSECURE!
}

// ✓ Good: Always verify on server
const verified = jwt.verify(token, SECRET_KEY);
if (verified.role === 'admin') {
  // Grant admin access - SECURE
}
\`\`\`

### Check Token Source

\`\`\`javascript
// Verify token came from trusted issuer
function verifyIssuer(token, trustedIssuers) {
  const { payload } = decodeJWT(token);
  
  if (!trustedIssuers.includes(payload.iss)) {
    throw new Error('Untrusted issuer');
  }
  
  return true;
}
\`\`\`

## Best Practices

### 1. Always Verify Signature

\`\`\`javascript
// Server-side verification
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});
\`\`\`

### 2. Use Short Expiration Times

\`\`\`javascript
// Create token with 15-minute expiration
const token = jwt.sign(
  { userId: 123, role: 'user' },
  SECRET_KEY,
  { expiresIn: '15m' }
);

// Use refresh tokens for longer sessions
const refreshToken = jwt.sign(
  { userId: 123 },
  REFRESH_SECRET,
  { expiresIn: '7d' }
);
\`\`\`

### 3. Include Necessary Claims Only

\`\`\`javascript
// ❌ Bad: Too much data
const token = jwt.sign({
  userId: 123,
  email: 'user@example.com',
  password: 'hashed',  // Never include!
  creditCard: '1234',  // Never include!
  fullProfile: {...}   // Too much data
}, SECRET_KEY);

// ✓ Good: Minimal necessary data
const token = jwt.sign({
  sub: '123',
  role: 'user',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (15 * 60)
}, SECRET_KEY);
\`\`\`

## Conclusion

Effective JWT debugging requires:
- Understanding JWT structure
- Decoding tokens safely
- Checking expiration and claims
- Verifying signatures server-side
- Using appropriate debugging tools
- Following security best practices

Never trust client-side decoded JWTs - always verify on the server.`,


  22: `# Understanding JWT: A Complete Guide for Developers

JSON Web Tokens have become the standard for modern authentication. This comprehensive guide covers everything you need to know about JWT.

## What is JWT?

JWT (JSON Web Token) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object.

### Structure

\\`\\`\`
header.payload.signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  ← Header
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.  ← Payload
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
\`\`\`

### Header

\`\`\`json
{
  "alg": "HS256",  // Algorithm
  "typ": "JWT"     // Type
}
\`\`\`

### Payload

\`\`\`json
{
  "sub": "1234567890",  // Subject (user ID)
  "name": "John Doe",   // Custom claim
  "iat": 1516239022,    // Issued at
  "exp": 1516242622     // Expiration
}
\`\`\`

### Signature

\`\`\`javascript
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
\`\`\`

## Creating JWTs

### Node.js

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  'your-secret-key',
  { expiresIn: '1h' }
);

console.log(token);
\`\`\`

### Python

\`\`\`python
import jwt
import datetime

# Create token
payload = {
    'user_id': 123,
    'role': 'admin',
    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
}

token = jwt.encode(payload, 'your-secret-key', algorithm='HS256')
print(token)
\`\`\`

### PHP

\`\`\`php
<?php
use Firebase\JWT\JWT;

$payload = [
    'user_id' => 123,
    'role' => 'admin',
    'exp' => time() + 3600
];

$token = JWT::encode($payload, 'your-secret-key', 'HS256');
echo $token;
?>
\`\`\`

## Verifying JWTs

### Node.js

\`\`\`javascript
const jwt = require('jsonwebtoken');

try {
  const decoded = jwt.verify(token, 'your-secret-key');
  console.log('Valid token:', decoded);
} catch (error) {
  console.error('Invalid token:', error.message);
}
\`\`\`

### Express Middleware

\`\`\`javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
}

// Usage
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
\`\`\`

## Common Use Cases

### Authentication Flow

\`\`\`javascript
// 1. User logs in
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Verify credentials
  const user = await verifyCredentials(username, password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});

// 2. Client stores token
localStorage.setItem('token', token);

// 3. Client sends token with requests
fetch('/api/data', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

// 4. Server verifies token
app.get('/api/data', authenticateToken, (req, res) => {
  res.json({ data: 'Protected data' });
});
\`\`\`

### Refresh Tokens

\`\`\`javascript
// Create access and refresh tokens
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Store refresh token in database
  await saveRefreshToken(user.id, refreshToken);
  
  res.json({ accessToken, refreshToken });
});

// Refresh access token
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    // Check if refresh token exists in database
    const valid = await checkRefreshToken(decoded.userId, refreshToken);
    
    if (!valid) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    // Create new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});
\`\`\`

## Best Practices

### 1. Use Strong Secrets

\`\`\`javascript
// ❌ Bad: Weak secret
const secret = 'secret';

// ✓ Good: Strong secret
const secret = crypto.randomBytes(64).toString('hex');
// Store in environment variable
\`\`\`

### 2. Set Appropriate Expiration

\`\`\`javascript
// Access tokens: Short expiration
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

// Refresh tokens: Longer expiration
const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
\`\`\`

### 3. Use HTTPS

\`\`\`javascript
// Always use HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}
\`\`\`

### 4. Validate All Claims

\`\`\`javascript
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    
    // Check required claims
    if (!decoded.userId || !decoded.role) {
      throw new Error('Missing required claims');
    }
    
    // Check expiration
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
\`\`\`

## Security Considerations

### Don't Store Sensitive Data

\`\`\`javascript
// ❌ Bad: Sensitive data in JWT
const token = jwt.sign({
  userId: 123,
  password: 'hashed',
  creditCard: '1234'
}, secret);

// ✓ Good: Minimal data
const token = jwt.sign({
  userId: 123,
  role: 'user'
}, secret);
\`\`\`

### Implement Token Revocation

\`\`\`javascript
// Store active tokens in Redis
const redis = require('redis');
const client = redis.createClient();

// On login
const token = jwt.sign(payload, secret);
await client.set(\`token:\${token}\`, 'valid', 'EX', 3600);

// On logout
await client.del(\`token:\${token}\`);

// Verify token is not revoked
async function isTokenRevoked(token) {
  const exists = await client.exists(\`token:\${token}\`);
  return !exists;
}
\`\`\`

## Conclusion

JWT is powerful for authentication when used correctly:
- Understand the structure
- Use strong secrets
- Set appropriate expiration
- Validate all claims
- Don't store sensitive data
- Implement token revocation
- Always use HTTPS

Follow these practices for secure JWT implementation.`,


  23: `# JWT Authentication: Security Best Practices

Secure JWT implementation is crucial for application security. This guide covers essential security practices for JWT authentication.

## Core Security Principles

### 1. Use Strong Secrets

\\`\\`\\`javascript
// Generate strong secret
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

// Store in environment variable
// .env
JWT_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=another-generated-secret-here

// Use in application
const jwt = require('jsonwebtoken');
const token = jwt.sign(payload, process.env.JWT_SECRET);
\\`\\`\`

### 2. Use Appropriate Algorithms

\`\`\`javascript
// ✓ Good: HS256 (HMAC with SHA-256)
const token = jwt.sign(payload, secret, { algorithm: 'HS256' });

// ✓ Good: RS256 (RSA with SHA-256) for public/private key
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

// ❌ Bad: None algorithm (no signature)
// Never allow 'none' algorithm
\`\`\`

### 3. Set Short Expiration Times

\`\`\`javascript
// Access token: 15 minutes
const accessToken = jwt.sign(
  payload,
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Refresh token: 7 days
const refreshToken = jwt.sign(
  payload,
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
\`\`\`

## Secure Token Storage

### Client-Side Storage

\`\`\`javascript
// ❌ Bad: localStorage (vulnerable to XSS)
localStorage.setItem('token', token);

// ✓ Better: httpOnly cookie (not accessible to JavaScript)
res.cookie('token', token, {
  httpOnly: true,
  secure: true,  // HTTPS only
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000  // 15 minutes
});

// ✓ Best: httpOnly cookie + CSRF protection
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000
});
res.cookie('csrf', csrfToken, {
  secure: true,
  sameSite: 'strict'
});
\`\`\`

### Server-Side Validation

\`\`\`javascript
function validateToken(req, res, next) {
  // Get token from cookie
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check token is not blacklisted
    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token revoked' });
    }
    
    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
\`\`\`

## Token Revocation

### Blacklist Approach

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

// Blacklist token on logout
async function blacklistToken(token) {
  const decoded = jwt.decode(token);
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  
  if (ttl > 0) {
    await client.set(\`blacklist:\${token}\`, '1', 'EX', ttl);
  }
}

// Check if token is blacklisted
async function isTokenBlacklisted(token) {
  const result = await client.get(\`blacklist:\${token}\`);
  return result !== null;
}

// Logout endpoint
app.post('/logout', authenticateToken, async (req, res) => {
  const token = req.cookies.token;
  await blacklistToken(token);
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});
\`\`\`

### Whitelist Approach

\`\`\`javascript
// Store active tokens
async function storeActiveToken(userId, token) {
  const decoded = jwt.decode(token);
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  
  await client.set(\`token:\${userId}:\${token}\`, '1', 'EX', ttl);
}

// Check if token is active
async function isTokenActive(userId, token) {
  const result = await client.get(\`token:\${userId}:\${token}\`);
  return result !== null;
}

// Revoke all user tokens
async function revokeAllUserTokens(userId) {
  const keys = await client.keys(\`token:\${userId}:*\`);
  if (keys.length > 0) {
    await client.del(...keys);
  }
}
\`\`\`

## Preventing Common Attacks

### 1. XSS Protection

\`\`\`javascript
// Use httpOnly cookies
res.cookie('token', token, {
  httpOnly: true,  // Not accessible to JavaScript
  secure: true,
  sameSite: 'strict'
});

// Sanitize user input
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userInput);

// Set Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'"
  );
  next();
});
\`\`\`

### 2. CSRF Protection

\`\`\`javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Apply CSRF protection
app.use(csrfProtection);

// Send CSRF token to client
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Validate CSRF token on state-changing requests
app.post('/api/data', csrfProtection, (req, res) => {
  // Process request
});
\`\`\`

### 3. Replay Attack Prevention

\`\`\`javascript
// Add jti (JWT ID) claim
const token = jwt.sign(
  {
    userId: 123,
    jti: crypto.randomBytes(16).toString('hex')
  },
  secret,
  { expiresIn: '15m' }
);

// Track used JTIs
async function isJtiUsed(jti) {
  const result = await client.get(\`jti:\${jti}\`);
  return result !== null;
}

async function markJtiUsed(jti, ttl) {
  await client.set(\`jti:\${jti}\`, '1', 'EX', ttl);
}

// Validate JTI
function validateJti(req, res, next) {
  const { jti } = req.user;
  
  if (await isJtiUsed(jti)) {
    return res.status(401).json({ error: 'Token already used' });
  }
  
  await markJtiUsed(jti, 900);  // 15 minutes
  next();
}
\`\`\`

## Rate Limiting

\`\`\`javascript
const rateLimit = require('express-rate-limit');

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/login', loginLimiter, async (req, res) => {
  // Login logic
});

// Token refresh rate limiting
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many refresh attempts'
});

app.post('/refresh', refreshLimiter, async (req, res) => {
  // Refresh logic
});
\`\`\`

## Monitoring and Logging

\`\`\`javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'auth.log' })
  ]
});

// Log authentication events
function logAuthEvent(event, userId, success, details = {}) {
  logger.info({
    event,
    userId,
    success,
    timestamp: new Date().toISOString(),
    ip: details.ip,
    userAgent: details.userAgent
  });
}

// Login
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  
  if (user) {
    logAuthEvent('login', user.id, true, {
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    // Create token
  } else {
    logAuthEvent('login', null, false, {
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Monitor for suspicious activity
async function detectSuspiciousActivity(userId) {
  const recentLogins = await getRecentLogins(userId, 24);  // Last 24 hours
  
  // Multiple failed attempts
  const failedAttempts = recentLogins.filter(l => !l.success).length;
  if (failedAttempts > 10) {
    await lockAccount(userId);
    await notifyUser(userId, 'Account locked due to suspicious activity');
  }
  
  // Logins from different locations
  const uniqueIPs = new Set(recentLogins.map(l => l.ip)).size;
  if (uniqueIPs > 5) {
    await notifyUser(userId, 'Unusual login activity detected');
  }
}
\`\`\`

## Complete Secure Implementation

\`\`\`javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });

// Login with rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

app.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  
  // Verify credentials
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create tokens
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Store refresh token
  await storeRefreshToken(user.id, refreshToken);
  
  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.json({ message: 'Login successful' });
});

// Protected route
app.get('/api/data', authenticateToken, csrfProtection, (req, res) => {
  res.json({ data: 'Protected data', user: req.user });
});

// Logout
app.post('/logout', authenticateToken, async (req, res) => {
  const token = req.cookies.accessToken;
  await blacklistToken(token);
  
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
\`\`\`

## Conclusion

Secure JWT authentication requires:
- Strong secrets and algorithms
- Short expiration times
- Secure token storage (httpOnly cookies)
- Token revocation mechanism
- Protection against XSS, CSRF, replay attacks
- Rate limiting
- Monitoring and logging

Implement all these practices for production-ready JWT authentication.`,


  24: `# Decoding JWT Claims: What Each Part Means

JWT tokens contain three parts, each with specific purposes. This guide explains what each claim means for effective token management.

## Standard Claims (Registered)

### iss (Issuer)

\\`\\`\\`javascript
{
  "iss": "https://auth.example.com"
}

// Who created and signed the token
// Use to verify token source
\\`\\`\`

### sub (Subject)

\`\`\`javascript
{
  "sub": "user123"
}

// The subject of the token (usually user ID)
// Should be unique and immutable
\`\`\`

### aud (Audience)

\`\`\`javascript
{
  "aud": "https://api.example.com"
}

// Intended recipient of the token
// Reject tokens not meant for your service
\`\`\`

### exp (Expiration Time)

\`\`\`javascript
{
  "exp": 1735689600  // Unix timestamp
}

// When the token expires
// Always check this claim
const isExpired = Date.now() / 1000 > payload.exp;
\`\`\`

### nbf (Not Before)

\`\`\`javascript
{
  "nbf": 1704067200  // Unix timestamp
}

// Token not valid before this time
// Useful for scheduled access
const isValid = Date.now() / 1000 >= payload.nbf;
\`\`\`

### iat (Issued At)

\`\`\`javascript
{
  "iat": 1704067200  // Unix timestamp
}

// When token was created
// Use for token age checks
const age = Date.now() / 1000 - payload.iat;
\`\`\`

### jti (JWT ID)

\`\`\`javascript
{
  "jti": "unique-token-id-123"
}

// Unique identifier for the token
// Use for token revocation and replay prevention
\`\`\`

## Custom Claims (Private)

### User Information

\`\`\`javascript
{
  "userId": "123",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "admin",
  "permissions": ["read", "write", "delete"]
}

// Application-specific user data
// Keep minimal - JWT is not encrypted
\`\`\`

### Session Information

\`\`\`javascript
{
  "sessionId": "sess_abc123",
  "deviceId": "device_xyz789",
  "ipAddress": "192.168.1.1"
}

// Track user sessions
// Useful for multi-device management
\`\`\`

## Claim Validation

### Complete Validation Function

\`\`\`javascript
function validateClaims(payload) {
  const now = Math.floor(Date.now() / 1000);
  
  // Check expiration
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }
  
  // Check not before
  if (payload.nbf && payload.nbf > now) {
    throw new Error('Token not yet valid');
  }
  
  // Check issuer
  const trustedIssuers = ['https://auth.example.com'];
  if (payload.iss && !trustedIssuers.includes(payload.iss)) {
    throw new Error('Untrusted issuer');
  }
  
  // Check audience
  const expectedAudience = 'https://api.example.com';
  if (payload.aud && payload.aud !== expectedAudience) {
    throw new Error('Invalid audience');
  }
  
  // Check required custom claims
  if (!payload.userId || !payload.role) {
    throw new Error('Missing required claims');
  }
  
  return true;
}
\`\`\`

## Best Practices

### 1. Use Standard Claims

\`\`\`javascript
// ✓ Good: Use standard claims
const token = jwt.sign({
  iss: 'https://auth.example.com',
  sub: 'user123',
  aud: 'https://api.example.com',
  exp: Math.floor(Date.now() / 1000) + (60 * 15),
  iat: Math.floor(Date.now() / 1000),
  role: 'admin'
}, secret);

// ❌ Bad: Custom names for standard concepts
const token = jwt.sign({
  creator: 'auth.example.com',  // Use 'iss'
  user: 'user123',              // Use 'sub'
  expires: Date.now() + 900000  // Use 'exp' with Unix timestamp
}, secret);
\`\`\`

### 2. Keep Payload Small

\`\`\`javascript
// ❌ Bad: Too much data
const token = jwt.sign({
  userId: 123,
  username: 'john_doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  address: {...},
  preferences: {...},
  history: [...]  // Large array
}, secret);

// ✓ Good: Minimal data
const token = jwt.sign({
  sub: '123',
  role: 'user'
}, secret);
\`\`\`

### 3. Don't Store Sensitive Data

\`\`\`javascript
// ❌ Bad: Sensitive data
const token = jwt.sign({
  userId: 123,
  password: 'hashed',
  ssn: '123-45-6789',
  creditCard: '1234-5678-9012-3456'
}, secret);

// ✓ Good: Non-sensitive data only
const token = jwt.sign({
  sub: '123',
  role: 'user',
  permissions: ['read', 'write']
}, secret);
\`\`\`

## Conclusion

Understanding JWT claims is essential for:
- Proper token validation
- Secure authentication
- Effective authorization
- Token management

Always validate all claims and keep payloads minimal.`,

  25: `# JWT vs Session Tokens: Which Should You Use?

Choosing between JWT and session-based authentication depends on your application's needs. This guide compares both approaches.

## Quick Comparison

| Aspect | JWT | Session Tokens |
|--------|-----|----------------|
| **Storage** | Client-side | Server-side |
| **Scalability** | Excellent | Challenging |
| **Revocation** | Difficult | Easy |
| **Size** | Larger | Smaller |
| **Stateless** | Yes | No |
| **Security** | Good | Excellent |

## JWT Authentication

### How It Works

\\`\\`\\`javascript
// 1. User logs in
const token = jwt.sign({ userId: 123 }, secret);
res.json({ token });

// 2. Client stores token
localStorage.setItem('token', token);

// 3. Client sends token with requests
fetch('/api/data', {
  headers: { 'Authorization': \\`Bearer \\${token}\\` }
});

// 4. Server verifies token
const decoded = jwt.verify(token, secret);
\\`\\`\`

### Pros

- **Stateless**: No server-side storage needed
- **Scalable**: Works across multiple servers
- **Cross-domain**: Easy to use with different domains
- **Mobile-friendly**: Simple token-based auth

### Cons

- **Cannot revoke**: Tokens valid until expiration
- **Larger size**: More data in each request
- **Security risks**: XSS if stored in localStorage

## Session-Based Authentication

### How It Works

\`\`\`javascript
// 1. User logs in
const sessionId = generateSessionId();
await saveSession(sessionId, { userId: 123 });
res.cookie('sessionId', sessionId, { httpOnly: true });

// 2. Client automatically sends cookie
// (browser handles this)

// 3. Server validates session
const session = await getSession(req.cookies.sessionId);
if (!session) {
  return res.status(401).json({ error: 'Invalid session' });
}
\`\`\`

### Pros

- **Easy revocation**: Delete session from database
- **Smaller size**: Just session ID in cookie
- **More secure**: httpOnly cookies prevent XSS
- **Server control**: Full control over sessions

### Cons

- **Stateful**: Requires server-side storage
- **Scaling challenges**: Need shared session store
- **Cross-domain issues**: Cookies don't work across domains

## When to Use JWT

### Use Case 1: Microservices

\`\`\`javascript
// JWT works well with multiple services
// Each service can verify tokens independently

// Auth Service
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: 123 }, secret);
  res.json({ token });
});

// User Service
app.get('/users/:id', authenticateJWT, (req, res) => {
  // No need to call auth service
  res.json({ user: req.user });
});

// Order Service
app.get('/orders', authenticateJWT, (req, res) => {
  // Same token works here
  res.json({ orders: [] });
});
\`\`\`

### Use Case 2: Mobile Apps

\`\`\`javascript
// Mobile apps prefer token-based auth
// Easy to store and send with requests

// React Native
const login = async (username, password) => {
  const response = await fetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  
  const { token } = await response.json();
  await AsyncStorage.setItem('token', token);
};

const fetchData = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch('/api/data', {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
};
\`\`\`

### Use Case 3: Third-Party APIs

\`\`\`javascript
// JWT good for API authentication
// Clients can use tokens without sessions

// Issue API token
app.post('/api/tokens', authenticateUser, (req, res) => {
  const apiToken = jwt.sign(
    { userId: req.user.id, scope: 'api' },
    secret,
    { expiresIn: '30d' }
  );
  
  res.json({ apiToken });
});

// Use API token
fetch('https://api.example.com/data', {
  headers: { 'Authorization': \`Bearer \${apiToken}\` }
});
\`\`\`

## When to Use Sessions

### Use Case 1: Traditional Web Apps

\`\`\`javascript
// Sessions work great for server-rendered apps
// Cookies handled automatically by browser

app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  
  req.session.userId = user.id;
  req.session.role = user.role;
  
  res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, (req, res) => {
  // Session data available in req.session
  res.render('dashboard', { user: req.session });
});
\`\`\`

### Use Case 2: High Security Requirements

\`\`\`javascript
// Sessions provide better security control
// Can revoke immediately

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Revoke all user sessions
app.post('/revoke-all', async (req, res) => {
  await deleteAllUserSessions(req.user.id);
  res.json({ message: 'All sessions revoked' });
});
\`\`\`

### Use Case 3: Single Server Application

\`\`\`javascript
// Sessions simple for single-server apps
// No need for distributed token verification

const session = require('express-session');

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));
\`\`\`

## Hybrid Approach

### Best of Both Worlds

\`\`\`javascript
// Use sessions for web app
// Use JWT for API

// Web login (session)
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  req.session.userId = user.id;
  res.redirect('/dashboard');
});

// API token generation (JWT)
app.post('/api/token', requireSession, (req, res) => {
  const token = jwt.sign(
    { userId: req.session.userId },
    secret,
    { expiresIn: '1h' }
  );
  res.json({ token });
});

// API endpoint (JWT)
app.get('/api/data', authenticateJWT, (req, res) => {
  res.json({ data: [] });
});
\`\`\`

## Migration Strategies

### From Sessions to JWT

\`\`\`javascript
// Support both during migration
function authenticate(req, res, next) {
  // Try JWT first
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, secret);
      return next();
    } catch (error) {
      // Fall through to session check
    }
  }
  
  // Try session
  if (req.session.userId) {
    req.user = { userId: req.session.userId };
    return next();
  }
  
  res.status(401).json({ error: 'Unauthorized' });
}
\`\`\`

### From JWT to Sessions

\`\`\`javascript
// Gradually migrate users
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  
  // Create session (new way)
  req.session.userId = user.id;
  
  // Also create JWT (old way, for compatibility)
  const token = jwt.sign({ userId: user.id }, secret);
  
  res.json({
    token,  // For old clients
    message: 'Please update to use session-based auth'
  });
});
\`\`\`

## Conclusion

**Choose JWT when:**
- Building microservices
- Need stateless authentication
- Developing mobile apps
- Scaling horizontally
- Working with third-party APIs

**Choose Sessions when:**
- Building traditional web apps
- Need immediate revocation
- High security requirements
- Single server deployment
- Want simpler implementation

**Consider Hybrid when:**
- Supporting both web and API
- Migrating between approaches
- Need flexibility

Both approaches are valid - choose based on your specific requirements.`,


  // REGEX TOOL POSTS (IDs 26-30)
  26: `# Regex Tester Tutorial: Master Regular Expressions

Regular expressions are powerful tools for pattern matching and text processing. This tutorial teaches you how to test and debug regex effectively.

## Regex Basics

### Simple Patterns

\\`\\`\\`javascript
// Literal match
const regex = /hello/;
regex.test('hello world');  // true

// Case-insensitive
const regex = /hello/i;
regex.test('HELLO world');  // true

// Global match
const regex = /o/g;
'hello world'.match(regex);  // ['o', 'o']
\\`\\`\`

### Character Classes

\`\`\`javascript
// Digit
/\d/  // Matches any digit (0-9)
/\d+/  // Matches one or more digits

// Word character
/\w/  // Matches [a-zA-Z0-9_]
/\w+/  // Matches one or more word characters

// Whitespace
/\s/  // Matches space, tab, newline
/\s+/  // Matches one or more whitespace

// Negations
/\D/  // Not a digit
/\W/  // Not a word character
/\S/  // Not whitespace
\`\`\`

### Quantifiers

\`\`\`javascript
// Zero or more
/a*/  // '', 'a', 'aa', 'aaa'

// One or more
/a+/  // 'a', 'aa', 'aaa'

// Zero or one
/a?/  // '', 'a'

// Exact count
/a{3}/  // 'aaa'

// Range
/a{2,4}/  // 'aa', 'aaa', 'aaaa'

// At least
/a{2,}/  // 'aa', 'aaa', 'aaaa', ...
\`\`\`

## Testing Regex

### JavaScript

\`\`\`javascript
// test() - returns boolean
const regex = /\d+/;
regex.test('123');  // true
regex.test('abc');  // false

// match() - returns matches
const text = 'Phone: 123-456-7890';
text.match(/\d+/g);  // ['123', '456', '7890']

// replace() - replace matches
text.replace(/\d/g, 'X');  // 'Phone: XXX-XXX-XXXX'

// exec() - detailed match info
const regex = /(\d+)-(\d+)/;
const result = regex.exec('123-456');
// result[0]: '123-456' (full match)
// result[1]: '123' (first group)
// result[2]: '456' (second group)
\`\`\`

### Python

\`\`\`python
import re

# search() - find first match
match = re.search(r'\d+', 'Phone: 123-456')
if match:
    print(match.group())  # '123'

# findall() - find all matches
matches = re.findall(r'\d+', 'Phone: 123-456-7890')
print(matches)  # ['123', '456', '7890']

# sub() - replace matches
result = re.sub(r'\d', 'X', 'Phone: 123-456')
print(result)  # 'Phone: XXX-XXX'

# match() - match from start
match = re.match(r'\d+', '123abc')
print(match.group())  // '123'
\`\`\`

## Common Patterns

### Email Validation

\`\`\`javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

emailRegex.test('user@example.com');  // true
emailRegex.test('invalid.email');     // false

// Breakdown:
// ^                  Start of string
// [a-zA-Z0-9._%+-]+  Username part
// @                  Literal @
// [a-zA-Z0-9.-]+     Domain name
// \.                 Literal dot
// [a-zA-Z]{2,}       TLD (2+ letters)
// $                  End of string
\`\`\`

### Phone Number

\`\`\`javascript
const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;

phoneRegex.test('(123) 456-7890');  // true
phoneRegex.test('123-456-7890');    // true
phoneRegex.test('123.456.7890');    // true
phoneRegex.test('1234567890');      // true

// Extract parts
const match = phoneRegex.exec('(123) 456-7890');
const areaCode = match[1];  // '123'
const prefix = match[2];    // '456'
const lineNumber = match[3];  // '7890'
\`\`\`

### URL Validation

\`\`\`javascript
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

urlRegex.test('https://example.com');  // true
urlRegex.test('http://www.example.com/path');  // true
urlRegex.test('not-a-url');  // false
\`\`\`

### Password Strength

\`\`\`javascript
// At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

passwordRegex.test('Password123!');  // true
passwordRegex.test('weak');          // false

// Breakdown:
// ^                  Start
// (?=.*[a-z])        At least one lowercase
// (?=.*[A-Z])        At least one uppercase
// (?=.*\d)           At least one digit
// (?=.*[@$!%*?&])    At least one special char
// [A-Za-z\d@$!%*?&]{8,}  8+ allowed characters
// $                  End
\`\`\`

## Debugging Regex

### Common Mistakes

\`\`\`javascript
// Mistake 1: Forgetting to escape special characters
const wrong = /example.com/;  // . matches any character
const right = /example\.com/;  // \. matches literal dot

// Mistake 2: Greedy vs non-greedy
const greedy = /<.*>/;  // Matches '<div>text</div>' entirely
const nonGreedy = /<.*?>/;  // Matches '<div>' only

// Mistake 3: Not anchoring
const wrong = /\d{3}/;  // Matches '123' in '12345'
const right = /^\d{3}$/;  // Matches only '123'

// Mistake 4: Case sensitivity
const wrong = /hello/;  // Doesn't match 'HELLO'
const right = /hello/i;  // Matches 'HELLO'
\`\`\`

### Testing Tools

\`\`\`javascript
// Create comprehensive test suite
function testRegex(regex, testCases) {
  console.log(\`Testing: \${regex}\n\`);
  
  testCases.forEach(({ input, expected }) => {
    const result = regex.test(input);
    const status = result === expected ? '✓' : '✗';
    console.log(\`\${status} "\${input}" - Expected: \${expected}, Got: \${result}\`);
  });
}

// Usage
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

testRegex(emailRegex, [
  { input: 'user@example.com', expected: true },
  { input: 'invalid.email', expected: false },
  { input: 'user+tag@example.co.uk', expected: true },
  { input: '@example.com', expected: false }
]);
\`\`\`

## Performance Tips

### 1. Use Non-Capturing Groups

\`\`\`javascript
// Slower: Capturing group
const regex = /(\d+)-(\d+)-(\d+)/;

// Faster: Non-capturing group (when you don't need captures)
const regex = /(?:\d+)-(?:\d+)-(?:\d+)/;
\`\`\`

### 2. Be Specific

\`\`\`javascript
// Slower: Too general
const regex = /.*/;

// Faster: Specific character class
const regex = /[a-zA-Z0-9]*/;
\`\`\`

### 3. Anchor When Possible

\`\`\`javascript
// Slower: Searches entire string
const regex = /\d{3}/;

// Faster: Anchored to start
const regex = /^\d{3}/;
\`\`\`

## Conclusion

Master regex by:
- Understanding basic patterns
- Testing thoroughly
- Using online tools (regex101.com)
- Learning common patterns
- Debugging systematically
- Optimizing for performance

Practice regularly to become proficient with regular expressions.`,


  27: `# Common Regex Patterns: Email, Phone, URL Validation

Validation is a crucial part of web development. This guide provides battle-tested regex patterns for common validation tasks.

## Email Validation

### Basic Email Pattern

\\`\\`\\`javascript
const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Matches:
// user@example.com ✓
// test.user@example.co.uk ✓

// Doesn't match:
// invalid.email ✗
// @example.com ✗
// user@.com ✗
\\`\\`\`

### Comprehensive Email Pattern

\`\`\`javascript
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function validateEmail(email) {
  return emailRegex.test(email);
}

// Test cases
console.log(validateEmail('user@example.com'));  // true
console.log(validateEmail('user+tag@example.com'));  // true
console.log(validateEmail('user@subdomain.example.com'));  // true
console.log(validateEmail('invalid@'));  // false
\`\`\`

## Phone Number Validation

### US Phone Numbers

\`\`\`javascript
// Flexible US phone format
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

// Matches:
// (123) 456-7890 ✓
// 123-456-7890 ✓
// 123.456.7890 ✓
// 1234567890 ✓
// +1 (123) 456-7890 ✓

function validatePhone(phone) {
  return phoneRegex.test(phone);
}

// Extract digits only
function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}

console.log(normalizePhone('(123) 456-7890'));  // '1234567890'
\`\`\`

### International Phone Numbers

\`\`\`javascript
// International format with country code
const intlPhoneRegex = /^\+?[1-9]\d{1,14}$/;

// Matches E.164 format:
// +1234567890 ✓
// +441234567890 ✓
// +861234567890 ✓

function validateInternationalPhone(phone) {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  return intlPhoneRegex.test(cleaned);
}
\`\`\`

## URL Validation

### Basic URL Pattern

\`\`\`javascript
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Matches:
// https://example.com ✓
// http://www.example.com ✓
// https://example.com/path?query=value ✓

function validateURL(url) {
  return urlRegex.test(url);
}
\`\`\`

### Comprehensive URL Pattern

\`\`\`javascript
const fullURLRegex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
\`\`\`

## Password Validation

### Strong Password

\`\`\`javascript
// At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function validatePassword(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };
  
  return {
    valid: Object.values(checks).every(Boolean),
    checks
  };
}

// Usage
const result = validatePassword('MyPass123!');
console.log(result);
// { valid: true, checks: { length: true, lowercase: true, ... } }
\`\`\`

## Credit Card Validation

### Card Number Pattern

\`\`\`javascript
const cardPatterns = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
};

function detectCardType(number) {
  const cleaned = number.replace(/\s/g, '');
  
  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cleaned)) {
      return type;
    }
  }
  
  return null;
}

// Luhn algorithm for validation
function validateCardNumber(number) {
  const cleaned = number.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}
\`\`\`

## Date Validation

### Date Formats

\`\`\`javascript
const datePatterns = {
  'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
  'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
  'DD-MM-YYYY': /^\d{2}-\d{2}-\d{4}$/
};

function validateDate(dateString, format = 'YYYY-MM-DD') {
  const pattern = datePatterns[format];
  
  if (!pattern.test(dateString)) {
    return false;
  }
  
  // Parse and validate actual date
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
\`\`\`

## Username Validation

\`\`\`javascript
// 3-16 characters, alphanumeric and underscore
const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

function validateUsername(username) {
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      error: 'Username must be 3-16 characters, alphanumeric and underscore only'
    };
  }
  
  return { valid: true };
}
\`\`\`

## IP Address Validation

### IPv4

\`\`\`javascript
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function validateIPv4(ip) {
  return ipv4Regex.test(ip);
}

// Matches:
// 192.168.1.1 ✓
// 255.255.255.255 ✓
// 0.0.0.0 ✓

// Doesn't match:
// 256.1.1.1 ✗
// 192.168.1 ✗
\`\`\`

### IPv6

\`\`\`javascript
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

function validateIPv6(ip) {
  return ipv6Regex.test(ip);
}
\`\`\`

## Complete Validation Library

\`\`\`javascript
const Validator = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  
  phone: (value) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value),
  
  url: (value) => /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(value),
  
  password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
  
  username: (value) => /^[a-zA-Z0-9_]{3,16}$/.test(value),
  
  ipv4: (value) => /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value),
  
  creditCard: (value) => {
    const cleaned = value.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  }
};

// Usage
console.log(Validator.email('user@example.com'));  // true
console.log(Validator.phone('123-456-7890'));  // true
console.log(Validator.url('https://example.com'));  // true
\`\`\`

## Conclusion

These regex patterns cover most common validation needs:
- Email addresses
- Phone numbers
- URLs
- Passwords
- Credit cards
- Dates
- Usernames
- IP addresses

Always test thoroughly and consider using validation libraries for production applications.`,


  28: `# Regex Performance: Optimization Tips and Tricks

Regex performance can make or break your application. This guide teaches you how to optimize regex patterns for better performance.

## Understanding Regex Performance

### Catastrophic Backtracking

\\`\\`\\`javascript
// ❌ Bad: Catastrophic backtracking
const bad = /(a+)+b/;
bad.test('aaaaaaaaaaaaaaaaaaaaaaaac');  // Takes forever!

// ✓ Good: No backtracking
const good = /a+b/;
good.test('aaaaaaaaaaaaaaaaaaaaaaaac');  // Fast
\\`\\`\`

### Benchmark Example

\`\`\`javascript
function benchmark(regex, text, iterations = 10000) {
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    regex.test(text);
  }
  
  const end = performance.now();
  return \`\${(end - start).toFixed(2)}ms\`;
}

// Test
const slow = /(a+)+b/;
const fast = /a+b/;
const text = 'a'.repeat(20) + 'c';

console.log('Slow:', benchmark(slow, text, 100));  // 5000ms+
console.log('Fast:', benchmark(fast, text));  // 2ms
\`\`\`

## Optimization Techniques

### 1. Use Non-Capturing Groups

\`\`\`javascript
// Slower: Capturing groups
const slow = /(\d+)-(\d+)-(\d+)/;

// Faster: Non-capturing groups
const fast = /(?:\d+)-(?:\d+)-(?:\d+)/;

// Benchmark
const text = '123-456-789';
console.log('Capturing:', benchmark(slow, text));  // 15ms
console.log('Non-capturing:', benchmark(fast, text));  // 10ms
\`\`\`

### 2. Be Specific with Character Classes

\`\`\`javascript
// Slower: Too general
const slow = /.*/;

// Faster: Specific character class
const fast = /[a-zA-Z0-9]*/;

// Even faster: More specific
const fastest = /[a-z]*/;
\`\`\`

### 3. Anchor When Possible

\`\`\`javascript
// Slower: Searches entire string
const slow = /\d{3}/;

// Faster: Anchored to start
const fast = /^\d{3}/;

// Fastest: Anchored to both ends
const fastest = /^\d{3}$/;
\`\`\`

### 4. Use Atomic Groups

\`\`\`javascript
// Slower: Backtracking possible
const slow = /\d+\w+/;

// Faster: Atomic group (no backtracking)
const fast = /(?>\d+)\w+/;  // Not supported in JavaScript

// JavaScript alternative: Be more specific
const jsfast = /\d+[a-zA-Z]+/;
\`\`\`

### 5. Avoid Nested Quantifiers

\`\`\`javascript
// ❌ Bad: Nested quantifiers
const bad = /(a+)+/;
const bad2 = /(a*)*/;
const bad3 = /(a+)*/;

// ✓ Good: Single quantifier
const good = /a+/;
\`\`\`

## Real-World Optimizations

### Email Validation

\`\`\`javascript
// Slow: Complex pattern
const slow = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Fast: Simplified pattern
const fast = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Benchmark
const email = 'user@example.com';
console.log('Complex:', benchmark(slow, email));  // 25ms
console.log('Simple:', benchmark(fast, email));  // 8ms
\`\`\`

### URL Parsing

\`\`\`javascript
// Slow: One complex regex
const slow = /^(https?):\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/;

// Fast: Multiple simple checks
function parseURL(url) {
  // Quick validation
  if (!/^https?:\/\//.test(url)) return null;
  
  try {
    return new URL(url);  // Use built-in parser
  } catch {
    return null;
  }
}
\`\`\`

## Avoiding Common Pitfalls

### Pitfall 1: Greedy Quantifiers

\`\`\`javascript
// Slow: Greedy quantifier
const slow = /<.*>/;
const html = '<div>text</div><span>more</span>';
slow.exec(html);  // Matches entire string

// Fast: Non-greedy quantifier
const fast = /<.*?>/;
fast.exec(html);  // Matches '<div>' only
\`\`\`

### Pitfall 2: Alternation Order

\`\`\`javascript
// Slower: Common pattern last
const slow = /uncommon|rare|common/;

// Faster: Common pattern first
const fast = /common|uncommon|rare/;

// Test with mostly 'common' matches
const text = 'common common common uncommon';
console.log('Slow:', benchmark(slow, text));  // 15ms
console.log('Fast:', benchmark(fast, text));  // 8ms
\`\`\`

### Pitfall 3: Unnecessary Captures

\`\`\`javascript
// Slower: Captures everything
const slow = /(\w+)\s+(\w+)\s+(\w+)/;

// Faster: Only capture what you need
const fast = /\w+\s+(\w+)\s+\w+/;

// Fastest: No captures if not needed
const fastest = /\w+\s+\w+\s+\w+/;
\`\`\`

## Performance Testing

### Create Test Suite

\`\`\`javascript
class RegexBenchmark {
  constructor(name) {
    this.name = name;
    this.tests = [];
  }
  
  add(description, regex, text) {
    this.tests.push({ description, regex, text });
  }
  
  run(iterations = 10000) {
    console.log(\`\n=== \${this.name} ===\n\`);
    
    this.tests.forEach(({ description, regex, text }) => {
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        regex.test(text);
      }
      
      const end = performance.now();
      const time = (end - start).toFixed(2);
      
      console.log(\`\${description}: \${time}ms\`);
    });
  }
}

// Usage
const suite = new RegexBenchmark('Email Validation');

suite.add('Complex pattern', 
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  'user@example.com'
);

suite.add('Simple pattern',
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  'user@example.com'
);

suite.run();
\`\`\`

## Best Practices

### 1. Profile Before Optimizing

\`\`\`javascript
// Measure actual performance
console.time('regex');
for (let i = 0; i < 10000; i++) {
  regex.test(text);
}
console.timeEnd('regex');
\`\`\`

### 2. Use Built-in Methods When Possible

\`\`\`javascript
// Slower: Regex for simple checks
const slow = /^https/.test(url);

// Faster: String method
const fast = url.startsWith('https');

// Slower: Regex for contains
const slow2 = /example/.test(text);

// Faster: String method
const fast2 = text.includes('example');
\`\`\`

### 3. Compile Regex Once

\`\`\`javascript
// ❌ Bad: Compile in loop
for (let i = 0; i < 1000; i++) {
  const regex = /\d+/;  // Compiled 1000 times
  regex.test(data[i]);
}

// ✓ Good: Compile once
const regex = /\d+/;
for (let i = 0; i < 1000; i++) {
  regex.test(data[i]);
}
\`\`\`

### 4. Consider Alternatives

\`\`\`javascript
// Sometimes regex isn't the best solution

// Regex for simple split
const parts = text.split(/\s+/);

// Faster: String split
const parts = text.split(' ');

// Regex for number check
const isNumber = /^\d+$/.test(value);

// Faster: Type check
const isNumber = !isNaN(value) && !isNaN(parseFloat(value));
\`\`\`

## Conclusion

Optimize regex performance by:
- Avoiding catastrophic backtracking
- Using non-capturing groups
- Being specific with character classes
- Anchoring patterns
- Avoiding nested quantifiers
- Testing and profiling
- Using built-in methods when possible

Always measure performance before and after optimization.`,

  29: `# Regex in Different Languages: JavaScript, Python, PHP

Regex syntax varies slightly between programming languages. This guide helps you write portable patterns and understand language-specific differences.

## Syntax Differences

### Basic Patterns

\\`\\`\\`javascript
// JavaScript
const regex = /\d+/g;
regex.test('123');

// Python
import re
regex = r'\d+'
re.search(regex, '123')

// PHP
$regex = '/\d+/';
preg_match($regex, '123');
\\`\\`\`

### Flags

| Flag | JavaScript | Python | PHP |
|------|------------|--------|-----|
| Case-insensitive | i | re.I or re.IGNORECASE | i |
| Global | g | N/A (use findall) | g |
| Multiline | m | re.M or re.MULTILINE | m |
| Dotall | s | re.S or re.DOTALL | s |
| Unicode | u | Default in Python 3 | u |

## JavaScript Regex

### Creating Patterns

\`\`\`javascript
// Literal notation
const regex1 = /pattern/flags;

// Constructor
const regex2 = new RegExp('pattern', 'flags');

// Dynamic pattern
const search = 'hello';
const regex3 = new RegExp(search, 'i');
\`\`\`

### Methods

\`\`\`javascript
// test() - returns boolean
/\d+/.test('123');  // true

// exec() - returns match details
const match = /(\d+)/.exec('abc123');
// match[0]: '123' (full match)
// match[1]: '123' (first group)

// match() - returns all matches
'123 456'.match(/\d+/g);  // ['123', '456']

// replace() - replace matches
'hello world'.replace(/world/, 'there');  // 'hello there'

// split() - split by pattern
'a,b;c'.split(/[,;]/);  // ['a', 'b', 'c']
\`\`\`

### JavaScript-Specific Features

\`\`\`javascript
// Lookahead
/\d+(?=px)/.exec('100px');  // '100'

// Lookbehind (ES2018+)
/(?<=\$)\d+/.exec('$100');  // '100'

// Named groups (ES2018+)
const regex = /(?<year>\d{4})-(?<month>\d{2})/;
const match = regex.exec('2024-01');
console.log(match.groups.year);  // '2024'
console.log(match.groups.month);  // '01'
\`\`\`

## Python Regex

### Creating Patterns

\`\`\`python
import re

# Compile pattern
regex = re.compile(r'\d+')

# Or use directly
re.search(r'\d+', '123')
\`\`\`

### Methods

\`\`\`python
# search() - find first match
match = re.search(r'\d+', 'abc123')
if match:
    print(match.group())  # '123'

# findall() - find all matches
matches = re.findall(r'\d+', '123 456')
print(matches)  # ['123', '456']

# sub() - replace matches
result = re.sub(r'\d+', 'X', '123 456')
print(result)  # 'X X'

# split() - split by pattern
parts = re.split(r'[,;]', 'a,b;c')
print(parts)  // ['a', 'b', 'c']
\`\`\`

### Python-Specific Features

\`\`\`python
# Verbose mode (comments in regex)
regex = re.compile(r'''
    \d+      # One or more digits
    -        # Literal dash
    \d+      # One or more digits
''', re.VERBOSE)

# Named groups
regex = re.compile(r'(?P<year>\d{4})-(?P<month>\d{2})')
match = regex.search('2024-01')
print(match.group('year'))  # '2024'
print(match.group('month'))  # '01'

# Conditional patterns
regex = re.compile(r'(a)?(?(1)b|c)')
# Matches 'ab' or 'c', but not 'b' or 'ac'
\`\`\`

## PHP Regex

### Creating Patterns

\`\`\`php
<?php
// PCRE pattern (most common)
$regex = '/\d+/';

// With delimiters
$regex = '#\d+#';  // Can use different delimiters
$regex = '~\d+~';
?>
\`\`\`

### Methods

\`\`\`php
<?php
// preg_match() - find first match
if (preg_match('/\d+/', 'abc123', $matches)) {
    echo $matches[0];  // '123'
}

// preg_match_all() - find all matches
preg_match_all('/\d+/', '123 456', $matches);
print_r($matches[0]);  // ['123', '456']

// preg_replace() - replace matches
$result = preg_replace('/\d+/', 'X', '123 456');
echo $result;  // 'X X'

// preg_split() - split by pattern
$parts = preg_split('/[,;]/', 'a,b;c');
print_r($parts);  // ['a', 'b', 'c']
?>
\`\`\`

### PHP-Specific Features

\`\`\`php
<?php
// Named groups
$regex = '/(?P<year>\d{4})-(?P<month>\d{2})/';
preg_match($regex, '2024-01', $matches);
echo $matches['year'];  // '2024'
echo $matches['month'];  // '01'

// Modifiers
$regex = '/pattern/ims';
// i: case-insensitive
// m: multiline
// s: dotall

// Recursive patterns
$regex = '/\((?:[^()]|(?R))*\)/';
// Matches nested parentheses
?>
\`\`\`

## Cross-Language Patterns

### Email Validation

\`\`\`javascript
// JavaScript
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Python
email = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'

// PHP
$email = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
\`\`\`

### Phone Number

\`\`\`javascript
// JavaScript
const phone = /^\d{3}-\d{3}-\d{4}$/;

// Python
phone = r'^\d{3}-\d{3}-\d{4}$'

// PHP
$phone = '/^\d{3}-\d{3}-\d{4}$/';
\`\`\`

### URL

\`\`\`javascript
// JavaScript
const url = /^https?:\/\/[^\s]+$/;

// Python
url = r'^https?://[^\s]+$'

// PHP
$url = '/^https?:\/\/[^\s]+$/';
\`\`\`

## Portable Patterns

### Write Once, Use Everywhere

\`\`\`javascript
// Define patterns as strings
const patterns = {
  email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
  phone: '^\\d{3}-\\d{3}-\\d{4}$',
  url: '^https?://[^\\s]+$'
};

// JavaScript
const emailRegex = new RegExp(patterns.email);

// Python
email_regex = re.compile(patterns['email'])

// PHP
$email_regex = '/' . $patterns['email'] . '/';
\`\`\`

## Conclusion

Key differences:
- **Delimiters**: JS uses //, Python uses r'', PHP uses //
- **Flags**: Similar but different syntax
- **Methods**: Different names but similar functionality
- **Features**: Each language has unique features

Write portable patterns by:
- Using common syntax
- Avoiding language-specific features
- Testing in all target languages
- Documenting differences`,


  30: `# Debugging Regex Patterns: Common Mistakes and Solutions

Regex debugging can be challenging, but with the right approach, you can identify and fix issues quickly. This guide covers common mistakes and debugging techniques.

## Common Mistakes

### 1. Forgetting to Escape Special Characters

\\`\\`\\`javascript
// ❌ Wrong: . matches any character
const wrong = /example.com/;
wrong.test('exampleXcom');  // true (unexpected!)

// ✓ Right: \. matches literal dot
const right = /example\.com/;
right.test('exampleXcom');  // false
right.test('example.com');  // true

// Special characters that need escaping:
// . ^ $ * + ? { } [ ] \ | ( )
\\`\\`\`

### 2. Greedy vs Non-Greedy

\`\`\`javascript
// ❌ Wrong: Greedy matching
const greedy = /<.*>/;
greedy.exec('<div>text</div>');  // Matches entire string

// ✓ Right: Non-greedy matching
const nonGreedy = /<.*?>/;
nonGreedy.exec('<div>text</div>');  // Matches '<div>' only
\`\`\`

### 3. Not Anchoring

\`\`\`javascript
// ❌ Wrong: Matches anywhere
const wrong = /\d{3}/;
wrong.test('12345');  // true (matches '123' in '12345')

// ✓ Right: Anchored to match exactly
const right = /^\d{3}$/;
right.test('12345');  // false
right.test('123');    // true
\`\`\`

### 4. Case Sensitivity

\`\`\`javascript
// ❌ Wrong: Case-sensitive
const wrong = /hello/;
wrong.test('HELLO');  // false

// ✓ Right: Case-insensitive flag
const right = /hello/i;
right.test('HELLO');  // true
\`\`\`

### 5. Catastrophic Backtracking

\`\`\`javascript
// ❌ Wrong: Nested quantifiers
const wrong = /(a+)+b/;
wrong.test('a'.repeat(20) + 'c');  // Hangs!

// ✓ Right: Single quantifier
const right = /a+b/;
right.test('a'.repeat(20) + 'c');  // Fast
\`\`\`

## Debugging Techniques

### 1. Test Incrementally

\`\`\`javascript
// Build pattern step by step
const tests = [
  /\d/,           // Match digit
  /\d{3}/,        // Match 3 digits
  /\d{3}-/,       // Match 3 digits and dash
  /\d{3}-\d{3}/,  // Match 3-3 pattern
  /^\d{3}-\d{3}-\d{4}$/  // Complete phone pattern
];

const input = '123-456-7890';
tests.forEach((regex, i) => {
  console.log(\`Step \${i + 1}:\`, regex.test(input));
});
\`\`\`

### 2. Use Online Tools

\`\`\`markdown
Recommended tools:
- regex101.com - Best for learning
- regexr.com - Visual explanation
- regexpal.com - Simple testing
- Our DevTools Regex Tester - Developer-focused
\`\`\`

### 3. Add Test Cases

\`\`\`javascript
function testRegex(regex, testCases) {
  console.log(\`Testing: \${regex}\n\`);
  
  testCases.forEach(({ input, expected, description }) => {
    const result = regex.test(input);
    const status = result === expected ? '✓' : '✗';
    console.log(\`\${status} \${description}\`);
    console.log(\`  Input: "\${input}"\`);
    console.log(\`  Expected: \${expected}, Got: \${result}\n\`);
  });
}

// Usage
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

testRegex(emailRegex, [
  { input: 'user@example.com', expected: true, description: 'Valid email' },
  { input: 'invalid.email', expected: false, description: 'Missing @' },
  { input: '@example.com', expected: false, description: 'Missing username' },
  { input: 'user@', expected: false, description: 'Missing domain' }
]);
\`\`\`

### 4. Visualize the Pattern

\`\`\`javascript
// Break down complex patterns
const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;

/*
Breakdown:
^           Start of string
\(?         Optional opening parenthesis
(\d{3})     3 digits (area code)
\)?         Optional closing parenthesis
[-.\s]?     Optional separator (dash, dot, or space)
(\d{3})     3 digits (prefix)
[-.\s]?     Optional separator
(\d{4})     4 digits (line number)
$           End of string
*/
\`\`\`

## Debugging Tools

### Custom Debugger

\`\`\`javascript
class RegexDebugger {
  constructor(pattern, flags = '') {
    this.regex = new RegExp(pattern, flags);
    this.pattern = pattern;
  }
  
  test(input) {
    console.log('=== Regex Debug ===');
    console.log('Pattern:', this.pattern);
    console.log('Input:', input);
    console.log('Flags:', this.regex.flags);
    
    const result = this.regex.test(input);
    console.log('Match:', result);
    
    if (result) {
      const match = this.regex.exec(input);
      console.log('Full match:', match[0]);
      
      if (match.length > 1) {
        console.log('Groups:');
        for (let i = 1; i < match.length; i++) {
          console.log(\`  Group \${i}:\`, match[i]);
        }
      }
    }
    
    return result;
  }
  
  explain() {
    const explanations = {
      '\\d': 'digit (0-9)',
      '\\w': 'word character (a-z, A-Z, 0-9, _)',
      '\\s': 'whitespace',
      '.': 'any character',
      '*': 'zero or more',
      '+': 'one or more',
      '?': 'zero or one',
      '^': 'start of string',
      '$': 'end of string'
    };
    
    console.log('Pattern explanation:');
    for (const [symbol, meaning] of Object.entries(explanations)) {
      if (this.pattern.includes(symbol)) {
        console.log(\`  \${symbol} = \${meaning}\`);
      }
    }
  }
}

// Usage
const debugger = new RegexDebugger('^\\d{3}-\\d{3}-\\d{4}$');
debugger.explain();
debugger.test('123-456-7890');
\`\`\`

## Fixing Common Issues

### Issue 1: Pattern Not Matching

\`\`\`javascript
// Problem
const regex = /\d{3}-\d{3}-\d{4}/;
regex.test('(123) 456-7890');  // false

// Debug: Test parts
/\d{3}/.test('(123) 456-7890');  // true
/-/.test('(123) 456-7890');      // false (no dash!)

// Solution: Make pattern flexible
const fixed = /\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/;
fixed.test('(123) 456-7890');  // true
\`\`\`

### Issue 2: Matching Too Much

\`\`\`javascript
// Problem
const regex = /<.*>/;
regex.exec('<div>text</div>');  // Matches entire string

// Debug: Use non-greedy
const fixed = /<.*?>/;
fixed.exec('<div>text</div>');  // Matches '<div>' only
\`\`\`

### Issue 3: Performance Issues

\`\`\`javascript
// Problem
const slow = /(a+)+b/;

// Debug: Check for nested quantifiers
// Solution: Simplify
const fast = /a+b/;

// Benchmark
console.time('slow');
slow.test('a'.repeat(20) + 'c');
console.timeEnd('slow');  // Very slow

console.time('fast');
fast.test('a'.repeat(20) + 'c');
console.timeEnd('fast');  // Fast
\`\`\`

## Best Practices

### 1. Start Simple

\`\`\`javascript
// Start with basic pattern
let regex = /\d+/;

// Add complexity gradually
regex = /\d{3}/;
regex = /\d{3}-\d{3}/;
regex = /^\d{3}-\d{3}-\d{4}$/;

// Test at each step
\`\`\`

### 2. Use Comments

\`\`\`javascript
// Document complex patterns
const phoneRegex = new RegExp(
  '^' +              // Start
  '\\(?(\\d{3})\\)?' +  // Area code with optional parens
  '[-\.\\s]?' +      // Optional separator
  '(\\d{3})' +       // Prefix
  '[-\.\\s]?' +      // Optional separator
  '(\\d{4})' +       // Line number
  '$'                // End
);
\`\`\`

### 3. Test Edge Cases

\`\`\`javascript
const testCases = [
  // Valid cases
  '123-456-7890',
  '(123) 456-7890',
  '123.456.7890',
  
  // Invalid cases
  '12-456-7890',    // Too few digits
  '123-456-78901',  // Too many digits
  'abc-def-ghij',   // Not digits
  '',               // Empty
  '123456789'       // No separators
];

testCases.forEach(test => {
  console.log(\`"\${test}": \${phoneRegex.test(test)}\`);
});
\`\`\`

### 4. Use Regex Linters

\`\`\`javascript
// ESLint plugin for regex
// npm install eslint-plugin-regexp

// .eslintrc.js
module.exports = {
  plugins: ['regexp'],
  rules: {
    'regexp/no-super-linear-backtracking': 'error',
    'regexp/no-useless-quantifier': 'error',
    'regexp/optimal-quantifier-concatenation': 'error'
  }
};
\`\`\`

## Conclusion

Debug regex effectively by:
- Testing incrementally
- Using online tools
- Adding comprehensive test cases
- Visualizing patterns
- Fixing common mistakes
- Following best practices

Remember: Simple patterns are easier to debug and maintain.`,

  // URL TOOL POSTS (IDs 31-35)
  31: `# URL Encoding Explained: Why and How It Works

URL encoding is essential for web development and data transmission. This guide explains why URL encoding exists and how to properly encode URLs.

## Why URL Encoding?

URLs can only contain certain characters from the ASCII character set. URL encoding converts characters into a format that can be transmitted over the Internet.

### Reserved Characters

\\`\\`\\`javascript
// Reserved characters in URLs
const reserved = {
  ':': '%3A',
  '/': '%2F',
  '?': '%3F',
  '#': '%23',
  '[': '%5B',
  ']': '%5D',
  '@': '%40',
  '!': '%21',
  '$': '%24',
  '&': '%26',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '*': '%2A',
  '+': '%2B',
  ',': '%2C',
  ';': '%3B',
  '=': '%3D',
  '%': '%25',
  ' ': '%20' or '+'
};
\\`\\`\`

## How URL Encoding Works

### Percent Encoding

\`\`\`javascript
// Character → UTF-8 bytes → Percent encoding

// Example: 'Hello World'
'Hello World'
// Space (0x20) → %20
'Hello%20World'

// Example: '你好' (Chinese)
'你好'
// 你 (0xE4 0xBD 0xA0) → %E4%BD%A0
// 好 (0xE5 0xA5 0xBD) → %E5%A5%BD
'%E4%BD%A0%E5%A5%BD'
\`\`\`

### Encoding in JavaScript

\`\`\`javascript
// encodeURI() - Encode entire URL
const url = 'https://example.com/search?q=hello world';
encodeURI(url);
// 'https://example.com/search?q=hello%20world'

// encodeURIComponent() - Encode URL component
const param = 'hello world & goodbye';
encodeURIComponent(param);
// 'hello%20world%20%26%20goodbye'

// Difference:
encodeURI('https://example.com?q=a&b');
// 'https://example.com?q=a&b' (& not encoded)

encodeURIComponent('https://example.com?q=a&b');
// 'https%3A%2F%2Fexample.com%3Fq%3Da%26b' (everything encoded)
\`\`\`

### Decoding in JavaScript

\`\`\`javascript
// decodeURI() - Decode entire URL
const encoded = 'https://example.com/search?q=hello%20world';
decodeURI(encoded);
// 'https://example.com/search?q=hello world'

// decodeURIComponent() - Decode URL component
const encodedParam = 'hello%20world%20%26%20goodbye';
decodeURIComponent(encodedParam);
// 'hello world & goodbye'
\`\`\`

## Common Use Cases

### 1. Query Parameters

\`\`\`javascript
// Building URL with parameters
const baseUrl = 'https://api.example.com/search';
const params = {
  q: 'hello world',
  category: 'books & magazines',
  page: 1
};

// Encode parameters
const queryString = Object.entries(params)
  .map(([key, value]) => 
    \`\${encodeURIComponent(key)}=\${encodeURIComponent(value)}\`
  )
  .join('&');

const fullUrl = \`\${baseUrl}?\${queryString}\`;
// 'https://api.example.com/search?q=hello%20world&category=books%20%26%20magazines&page=1'
\`\`\`

### 2. Path Parameters

\`\`\`javascript
// Encoding path segments
const username = 'user@example.com';
const url = \`https://api.example.com/users/\${encodeURIComponent(username)}\`;
// 'https://api.example.com/users/user%40example.com'
\`\`\`

### 3. Form Data

\`\`\`javascript
// application/x-www-form-urlencoded
const formData = {
  username: 'john doe',
  email: 'john@example.com',
  message: 'Hello & welcome!'
};

const encoded = Object.entries(formData)
  .map(([key, value]) => 
    \`\${encodeURIComponent(key)}=\${encodeURIComponent(value)}\`
  )
  .join('&');

// 'username=john%20doe&email=john%40example.com&message=Hello%20%26%20welcome!'
\`\`\`

## URL Encoding in Different Languages

### Python

\`\`\`python
from urllib.parse import quote, unquote, urlencode

# Encode
encoded = quote('hello world')
print(encoded)  # 'hello%20world'

# Decode
decoded = unquote('hello%20world')
print(decoded)  # 'hello world'

# Encode parameters
params = {'q': 'hello world', 'page': 1}
query_string = urlencode(params)
print(query_string)  # 'q=hello+world&page=1'
\`\`\`

### PHP

\`\`\`php
<?php
// Encode
$encoded = urlencode('hello world');
echo $encoded;  // 'hello+world'

// Decode
$decoded = urldecode('hello+world');
echo $decoded;  // 'hello world'

// Raw encode (uses %20 instead of +)
$encoded = rawurlencode('hello world');
echo $encoded;  // 'hello%20world'

// Build query string
$params = ['q' => 'hello world', 'page' => 1];
$query = http_build_query($params);
echo $query;  // 'q=hello+world&page=1'
?>
\`\`\`

### Java

\`\`\`java
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

// Encode
String encoded = URLEncoder.encode("hello world", StandardCharsets.UTF_8);
System.out.println(encoded);  // "hello+world"

// Decode
String decoded = URLDecoder.decode("hello+world", StandardCharsets.UTF_8);
System.out.println(decoded);  // "hello world"
\`\`\`

## Special Cases

### Space Character

\`\`\`javascript
// Space can be encoded two ways:
// %20 (percent encoding)
// + (plus sign, in query strings)

'hello world'.replace(/ /g, '%20');  // 'hello%20world'
'hello world'.replace(/ /g, '+');    // 'hello+world'

// Both are valid in query strings
// %20 is more universal
\`\`\`

### Plus Sign

\`\`\`javascript
// Plus sign needs encoding in query strings
const search = '1+1=2';
encodeURIComponent(search);  // '1%2B1%3D2'

// Decoding
decodeURIComponent('1%2B1%3D2');  // '1+1=2'
\`\`\`

### Unicode Characters

\`\`\`javascript
// Unicode characters are encoded as UTF-8 bytes
const chinese = '你好';
encodeURIComponent(chinese);  // '%E4%BD%A0%E5%A5%BD'

const emoji = '😀';
encodeURIComponent(emoji);  // '%F0%9F%98%80'
\`\`\`

## Best Practices

### 1. Always Encode User Input

\`\`\`javascript
// ❌ Bad: No encoding
const search = userInput;
const url = \`/search?q=\${search}\`;  // Unsafe!

// ✓ Good: Encode user input
const search = encodeURIComponent(userInput);
const url = \`/search?q=\${search}\`;  // Safe
\`\`\`

### 2. Use Correct Encoding Function

\`\`\`javascript
// For entire URLs
const fullUrl = encodeURI('https://example.com/path with spaces');

// For URL components (parameters, path segments)
const param = encodeURIComponent('value with & special chars');
const url = \`https://example.com?param=\${param}\`;
\`\`\`

### 3. Don't Double-Encode

\`\`\`javascript
// ❌ Bad: Double encoding
const value = 'hello world';
const encoded1 = encodeURIComponent(value);  // 'hello%20world'
const encoded2 = encodeURIComponent(encoded1);  // 'hello%2520world' (wrong!)

// ✓ Good: Encode once
const encoded = encodeURIComponent(value);  // 'hello%20world'
\`\`\`

### 4. Handle Decoding Errors

\`\`\`javascript
function safeDecodeURIComponent(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    // Invalid encoding, return original
    return str;
  }
}

// Usage
safeDecodeURIComponent('hello%20world');  // 'hello world'
safeDecodeURIComponent('invalid%');  // 'invalid%' (doesn't throw)
\`\`\`

## Common Pitfalls

### Pitfall 1: Encoding Entire URL

\`\`\`javascript
// ❌ Wrong: Encoding entire URL
const url = 'https://example.com?q=hello';
encodeURIComponent(url);
// 'https%3A%2F%2Fexample.com%3Fq%3Dhello' (broken URL!)

// ✓ Right: Encode only parameters
const base = 'https://example.com';
const param = encodeURIComponent('hello');
const url = \`\${base}?q=\${param}\`;
\`\`\`

### Pitfall 2: Forgetting to Decode

\`\`\`javascript
// Server receives encoded parameter
const encoded = req.query.q;  // 'hello%20world'

// ❌ Wrong: Using encoded value
console.log(encoded);  // 'hello%20world'

// ✓ Right: Decode before use
const decoded = decodeURIComponent(encoded);
console.log(decoded);  // 'hello world'
\`\`\`

## Conclusion

URL encoding is essential for:
- Transmitting special characters
- Handling user input safely
- Building valid URLs
- Preventing injection attacks

Always encode user input and use the appropriate encoding function for your use case.`,


  32: `# URL Encoder vs URL Decoder: When to Use Each

URL encoding and decoding are fundamental web development concepts. This guide explains when to use each technique and how they work together.

## Understanding the Difference

### URL Encoder
Converts special characters to percent-encoded format for safe transmission.

\\`\\`\\`javascript
// Input: hello world
// Output: hello%20world
encodeURIComponent('hello world');
\\`\\`\`

### URL Decoder
Converts percent-encoded characters back to their original form.

\`\`\`javascript
// Input: hello%20world
// Output: hello world
decodeURIComponent('hello%20world');
\`\`\`

## When to Encode

### 1. Building URLs

\`\`\`javascript
// Encode when building URLs with user input
const searchTerm = 'hello & goodbye';
const url = \`/search?q=\${encodeURIComponent(searchTerm)}\`;
// '/search?q=hello%20%26%20goodbye'
\`\`\`

### 2. Sending Data to Server

\`\`\`javascript
// Encode form data
const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello & welcome!'
};

const encoded = Object.entries(formData)
  .map(([key, val]) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(val)}\`)
  .join('&');

fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: encoded
});
\`\`\`

### 3. Storing URLs

\`\`\`javascript
// Encode before storing in database
const userUrl = 'https://example.com/path?param=value with spaces';
const encoded = encodeURI(userUrl);
await db.saveUrl(encoded);
\`\`\`

## When to Decode

### 1. Reading URL Parameters

\`\`\`javascript
// Server-side: Decode query parameters
const url = new URL(req.url, 'http://localhost');
const searchTerm = decodeURIComponent(url.searchParams.get('q'));
// 'hello & goodbye'
\`\`\`

### 2. Processing Form Data

\`\`\`javascript
// Decode form data
const body = 'name=John%20Doe&email=john%40example.com';
const params = new URLSearchParams(body);

// URLSearchParams automatically decodes
const name = params.get('name');  // 'John Doe'
const email = params.get('email');  // 'john@example.com'
\`\`\`

### 3. Displaying URLs

\`\`\`javascript
// Decode for display
const encodedUrl = 'https://example.com/search?q=hello%20world';
const displayUrl = decodeURI(encodedUrl);
// 'https://example.com/search?q=hello world'
\`\`\`

## Complete Workflow Examples

### Example 1: Search Feature

\`\`\`javascript
// Client-side: Encode search term
function performSearch(term) {
  const encoded = encodeURIComponent(term);
  window.location.href = \`/search?q=\${encoded}\`;
}

// Server-side: Decode and use
app.get('/search', (req, res) => {
  const searchTerm = decodeURIComponent(req.query.q);
  const results = searchDatabase(searchTerm);
  res.json(results);
});

// Usage
performSearch('hello & goodbye');
// URL: /search?q=hello%20%26%20goodbye
// Server receives: 'hello & goodbye'
\`\`\`

### Example 2: File Download

\`\`\`javascript
// Client-side: Encode filename
function downloadFile(filename) {
  const encoded = encodeURIComponent(filename);
  window.location.href = \`/download?file=\${encoded}\`;
}

// Server-side: Decode filename
app.get('/download', (req, res) => {
  const filename = decodeURIComponent(req.query.file);
  res.download(\`./files/\${filename}\`);
});

// Usage
downloadFile('report 2024.pdf');
// URL: /download?file=report%202024.pdf
// Server receives: 'report 2024.pdf'
\`\`\`

### Example 3: API Integration

\`\`\`javascript
// Encode for API request
async function fetchUserData(email) {
  const encoded = encodeURIComponent(email);
  const response = await fetch(\`/api/users?email=\${encoded}\`);
  return response.json();
}

// Decode in API handler
app.get('/api/users', (req, res) => {
  const email = decodeURIComponent(req.query.email);
  const user = findUserByEmail(email);
  res.json(user);
});

// Usage
await fetchUserData('user+tag@example.com');
// URL: /api/users?email=user%2Btag%40example.com
// Server receives: 'user+tag@example.com'
\`\`\`

## Best Practices

### 1. Encode on Client, Decode on Server

\`\`\`javascript
// Client
const data = { message: 'Hello & goodbye' };
const encoded = encodeURIComponent(data.message);
fetch(\`/api/message?text=\${encoded}\`);

// Server
app.get('/api/message', (req, res) => {
  const message = decodeURIComponent(req.query.text);
  // Use decoded message
});
\`\`\`

### 2. Don't Double-Encode

\`\`\`javascript
// ❌ Bad
const value = 'hello world';
const encoded1 = encodeURIComponent(value);
const encoded2 = encodeURIComponent(encoded1);  // Wrong!

// ✓ Good
const value = 'hello world';
const encoded = encodeURIComponent(value);
\`\`\`

### 3. Handle Errors

\`\`\`javascript
function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    console.error('Decode error:', e);
    return str;  // Return original if decode fails
  }
}
\`\`\`

## Common Scenarios

### Scenario 1: Redirect with Parameters

\`\`\`javascript
// Encode redirect URL
const returnUrl = '/dashboard?tab=settings';
const encoded = encodeURIComponent(returnUrl);
window.location.href = \`/login?return=\${encoded}\`;

// Decode after login
const params = new URLSearchParams(window.location.search);
const returnUrl = decodeURIComponent(params.get('return'));
window.location.href = returnUrl;
\`\`\`

### Scenario 2: Sharing URLs

\`\`\`javascript
// Encode for sharing
const shareUrl = 'https://example.com/article?title=Hello World';
const encoded = encodeURIComponent(shareUrl);
const twitterUrl = \`https://twitter.com/share?url=\${encoded}\`;

// Decode when processing
const params = new URLSearchParams(window.location.search);
const originalUrl = decodeURIComponent(params.get('url'));
\`\`\`

### Scenario 3: Deep Linking

\`\`\`javascript
// Encode deep link data
const deepLinkData = {
  screen: 'product',
  id: '123',
  ref: 'email campaign'
};

const encoded = encodeURIComponent(JSON.stringify(deepLinkData));
const deepLink = \`myapp://open?data=\${encoded}\`;

// Decode in app
const params = new URLSearchParams(location.search);
const data = JSON.parse(decodeURIComponent(params.get('data')));
\`\`\`

## Conclusion

**Use Encoder when:**
- Building URLs with user input
- Sending data to server
- Storing URLs
- Creating shareable links

**Use Decoder when:**
- Reading URL parameters
- Processing form data
- Displaying URLs to users
- Handling API responses

Always encode on the client side and decode on the server side for proper data handling.`,

  33: `# Percent Encoding in URLs: A Complete Guide

Percent encoding is the standard method for encoding URLs. This comprehensive guide covers rules, examples, and best practices.

## What is Percent Encoding?

Percent encoding (also called URL encoding) represents characters as a percent sign (%) followed by two hexadecimal digits.

\\`\\`\`
Character → UTF-8 bytes → Percent encoding

Space (0x20) → %20
@ (0x40) → %40
你 (0xE4 0xBD 0xA0) → %E4%BD%A0
\`\`\`

## Encoding Rules

### Characters That Must Be Encoded

\`\`\`javascript
const mustEncode = {
  // Control characters (0x00-0x1F, 0x7F)
  '\x00': '%00',
  '\x1F': '%1F',
  '\x7F': '%7F',
  
  // Special characters
  ' ': '%20',
  '"': '%22',
  '#': '%23',
  '%': '%25',
  '<': '%3C',
  '>': '%3E',
  '[': '%5B',
  '\\': '%5C',
  ']': '%5D',
  '^': '%5E',
  '\`': '%60',
  '{': '%7B',
  '|': '%7C',
  '}': '%7D',
  
  // Non-ASCII characters (0x80-0xFF)
  '€': '%E2%82%AC',
  '你': '%E4%BD%A0'
};
\`\`\`

### Reserved Characters

\`\`\`javascript
// Reserved in URLs, encode when used as data
const reserved = {
  '!': '%21',
  '#': '%23',
  '$': '%24',
  '&': '%26',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '*': '%2A',
  '+': '%2B',
  ',': '%2C',
  '/': '%2F',
  ':': '%3A',
  ';': '%3B',
  '=': '%3D',
  '?': '%3F',
  '@': '%40'
};
\`\`\`

### Unreserved Characters (Never Encode)

\`\`\`javascript
// Safe characters that don't need encoding
const unreserved = {
  letters: 'A-Z a-z',
  digits: '0-9',
  special: '- _ . ~'
};

// Example
'Hello-World_123.test~' // No encoding needed
\`\`\`

## Encoding Process

### Step-by-Step

\`\`\`javascript
function percentEncode(char) {
  // 1. Get UTF-8 bytes
  const bytes = new TextEncoder().encode(char);
  
  // 2. Convert each byte to hex
  const hex = Array.from(bytes)
    .map(byte => byte.toString(16).toUpperCase().padStart(2, '0'))
    .map(h => '%' + h)
    .join('');
  
  return hex;
}

// Examples
percentEncode(' ');   // '%20'
percentEncode('@');   // '%40'
percentEncode('你');  // '%E4%BD%A0'
percentEncode('😀');  // '%F0%9F%98%80'
\`\`\`

### Complete Implementation

\`\`\`javascript
function customPercentEncode(str) {
  return str.split('').map(char => {
    const code = char.charCodeAt(0);
    
    // Unreserved characters
    if (
      (code >= 65 && code <= 90) ||   // A-Z
      (code >= 97 && code <= 122) ||  // a-z
      (code >= 48 && code <= 57) ||   // 0-9
      code === 45 || code === 46 ||   // - .
      code === 95 || code === 126     // _ ~
    ) {
      return char;
    }
    
    // Everything else gets encoded
    return percentEncode(char);
  }).join('');
}

// Usage
customPercentEncode('Hello World!');
// 'Hello%20World%21'
\`\`\`

## Decoding Process

### Step-by-Step

\`\`\`javascript
function percentDecode(encoded) {
  // 1. Find percent-encoded sequences
  const regex = /%([0-9A-F]{2})/gi;
  
  // 2. Convert hex to bytes
  const bytes = [];
  let match;
  let lastIndex = 0;
  
  while ((match = regex.exec(encoded)) !== null) {
    // Add unencoded characters
    if (match.index > lastIndex) {
      const unencoded = encoded.slice(lastIndex, match.index);
      bytes.push(...new TextEncoder().encode(unencoded));
    }
    
    // Add decoded byte
    bytes.push(parseInt(match[1], 16));
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining unencoded characters
  if (lastIndex < encoded.length) {
    const unencoded = encoded.slice(lastIndex);
    bytes.push(...new TextEncoder().encode(unencoded));
  }
  
  // 3. Decode UTF-8 bytes to string
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Usage
percentDecode('Hello%20World%21');  // 'Hello World!'
percentDecode('%E4%BD%A0%E5%A5%BD');  // '你好'
\`\`\`

## Special Cases

### Space Character

\`\`\`javascript
// Two ways to encode space
'hello world'.replace(/ /g, '%20');  // Percent encoding
'hello world'.replace(/ /g, '+');    // Plus encoding (query strings)

// Both are valid in query strings
'?q=hello%20world'  // Valid
'?q=hello+world'    // Valid

// Only %20 is valid in paths
'/path/hello%20world'  // Valid
'/path/hello+world'    // Invalid (+ is literal)
\`\`\`

### Plus Sign

\`\`\`javascript
// Plus sign in query strings
'1+1=2'
// Must encode as %2B
'1%2B1%3D2'

// Decoding
decodeURIComponent('1%2B1%3D2');  // '1+1=2'
\`\`\`

### Unicode Characters

\`\`\`javascript
// Multi-byte UTF-8 encoding
'你好'
// 你: E4 BD A0 → %E4%BD%A0
// 好: E5 A5 BD → %E5%A5%BD
'%E4%BD%A0%E5%A5%BD'

// Emoji (4 bytes)
'😀'
// F0 9F 98 80 → %F0%9F%98%80
\`\`\`

## URL Component Encoding

### Different Rules for Different Parts

\`\`\`javascript
const url = 'https://user:pass@example.com:8080/path/to/resource?key=value#fragment';

// Scheme: No encoding
'https'

// User info: Encode special chars except :
'user:pass' → 'user:pass' (: is allowed)
'user@domain:pass' → 'user%40domain:pass' (@ must be encoded)

// Host: Punycode for internationalized domains
'例え.jp' → 'xn--r8jz45g.jp'

// Port: No encoding
'8080'

// Path: Encode except / : @ ! $ & ' ( ) * + , ; =
'/path/to/resource' → '/path/to/resource'
'/path with spaces' → '/path%20with%20spaces'

// Query: Encode except allowed chars
'key=value&other=data' → 'key=value&other=data'
'key=hello world' → 'key=hello%20world'

// Fragment: Same as query
'section' → 'section'
'section with spaces' → 'section%20with%20spaces'
\`\`\`

## Best Practices

### 1. Use Built-in Functions

\`\`\`javascript
// ✓ Good: Use built-in functions
encodeURIComponent('hello world');  // 'hello%20world'

// ❌ Bad: Manual encoding
'hello world'.replace(/ /g, '%20');  // Incomplete
\`\`\`

### 2. Encode at the Right Level

\`\`\`javascript
// For entire URLs
encodeURI('https://example.com/path with spaces');
// 'https://example.com/path%20with%20spaces'

// For URL components
const param = encodeURIComponent('value with & special');
const url = \`https://example.com?param=\${param}\`;
\`\`\`

### 3. Handle Edge Cases

\`\`\`javascript
function safeEncode(str) {
  if (!str) return '';
  
  try {
    return encodeURIComponent(str);
  } catch (e) {
    // Handle invalid characters
    console.error('Encoding error:', e);
    return '';
  }
}
\`\`\`

## Conclusion

Percent encoding is essential for:
- Safe URL transmission
- Handling special characters
- Supporting international characters
- Preventing URL injection

Always use proper encoding functions and understand the rules for different URL components.`,


  34: `# URL Encoding Special Characters: Best Practices

Special characters in URLs require careful handling. This guide covers best practices for encoding special characters safely and correctly.

## Common Special Characters

### Reserved Characters

\\`\\`\\`javascript
const reserved = {
  '!': '%21',  // Exclamation
  '#': '%23',  // Hash
  '$': '%24',  // Dollar
  '&': '%26',  // Ampersand
  "'": '%27',  // Apostrophe
  '(': '%28',  // Left parenthesis
  ')': '%29',  // Right parenthesis
  '*': '%2A',  // Asterisk
  '+': '%2B',  // Plus
  ',': '%2C',  // Comma
  '/': '%2F',  // Forward slash
  ':': '%3A',  // Colon
  ';': '%3B',  // Semicolon
  '=': '%3D',  // Equals
  '?': '%3F',  // Question mark
  '@': '%40',  // At sign
  '[': '%5B',  // Left bracket
  ']': '%5D'   // Right bracket
};
\\`\\`\`

### Unsafe Characters

\`\`\`javascript
const unsafe = {
  ' ': '%20',  // Space
  '"': '%22',  // Quote
  '<': '%3C',  // Less than
  '>': '%3E',  // Greater than
  '\\': '%5C',  // Backslash
  '^': '%5E',  // Caret
  '\`': '%60',  // Backtick
  '{': '%7B',  // Left brace
  '|': '%7C',  // Pipe
  '}': '%7D'   // Right brace
};
\`\`\`

## Encoding Strategies

### Strategy 1: Encode Everything

\`\`\`javascript
// Most conservative approach
function encodeAll(str) {
  return encodeURIComponent(str);
}

// Example
encodeAll('hello & goodbye!');
// 'hello%20%26%20goodbye%21'

// Pros: Safe, no ambiguity
// Cons: Longer URLs, less readable
\`\`\`

### Strategy 2: Selective Encoding

\`\`\`javascript
// Encode only when necessary
function encodeSelective(str, context) {
  if (context === 'path') {
    // Encode everything except / : @ ! $ & ' ( ) * + , ; =
    return str.split('/').map(encodeURIComponent).join('/');
  } else if (context === 'query') {
    // Encode everything except allowed query chars
    return encodeURIComponent(str);
  }
  return encodeURIComponent(str);
}

// Example
encodeSelective('/path/to/file', 'path');
// '/path/to/file' (/ preserved)

encodeSelective('hello & goodbye', 'query');
// 'hello%20%26%20goodbye'
\`\`\`

### Strategy 3: Context-Aware Encoding

\`\`\`javascript
class URLEncoder {
  static encodePath(path) {
    return path.split('/').map(segment => 
      encodeURIComponent(segment)
    ).join('/');
  }
  
  static encodeQuery(params) {
    return Object.entries(params)
      .map(([key, value]) => 
        \`\${encodeURIComponent(key)}=\${encodeURIComponent(value)}\`
      )
      .join('&');
  }
  
  static encodeFragment(fragment) {
    return encodeURIComponent(fragment);
  }
}

// Usage
const path = URLEncoder.encodePath('/path/with spaces/file.txt');
// '/path/with%20spaces/file.txt'

const query = URLEncoder.encodeQuery({
  search: 'hello & goodbye',
  page: 1
});
// 'search=hello%20%26%20goodbye&page=1'
\`\`\`

## Handling Specific Characters

### Ampersand (&)

\`\`\`javascript
// Problem: & separates query parameters
const wrong = \`/search?q=Tom & Jerry\`;
// Interpreted as two parameters: q=Tom and Jerry

// Solution: Encode &
const right = \`/search?q=\${encodeURIComponent('Tom & Jerry')}\`;
// '/search?q=Tom%20%26%20Jerry'
\`\`\`

### Plus Sign (+)

\`\`\`javascript
// Problem: + can mean space in query strings
const search = '1+1=2';

// Solution: Encode +
const encoded = encodeURIComponent(search);
// '1%2B1%3D2'

// Decoding
decodeURIComponent('1%2B1%3D2');  // '1+1=2'
\`\`\`

### Hash (#)

\`\`\`javascript
// Problem: # starts fragment identifier
const wrong = \`/article?title=C# Programming\`;
// Browser interprets as: /article?title=C with fragment " Programming"

// Solution: Encode #
const right = \`/article?title=\${encodeURIComponent('C# Programming')}\`;
// '/article?title=C%23%20Programming'
\`\`\`

### Slash (/)

\`\`\`javascript
// In path: Don't encode (path separator)
const path = '/path/to/file';  // Keep /

// In query: Encode
const param = encodeURIComponent('path/to/file');
const url = \`/api?path=\${param}\`;
// '/api?path=path%2Fto%2Ffile'
\`\`\`

### Space

\`\`\`javascript
// Two encoding options
const space1 = encodeURIComponent(' ');  // '%20'
const space2 = '+';  // In query strings only

// In paths: Always %20
'/path/with%20spaces'  // Correct
'/path/with+spaces'    // Incorrect

// In queries: Both work
'?q=hello%20world'  // Correct
'?q=hello+world'    // Correct (legacy)
\`\`\`

## Real-World Examples

### Example 1: Search Query

\`\`\`javascript
function buildSearchURL(query) {
  const encoded = encodeURIComponent(query);
  return \`/search?q=\${encoded}\`;
}

// Test cases
buildSearchURL('hello world');
// '/search?q=hello%20world'

buildSearchURL('C++ programming');
// '/search?q=C%2B%2B%20programming'

buildSearchURL('Tom & Jerry');
// '/search?q=Tom%20%26%20Jerry'

buildSearchURL('price < $100');
// '/search?q=price%20%3C%20%24100'
\`\`\`

### Example 2: File Path

\`\`\`javascript
function buildFileURL(path) {
  const segments = path.split('/');
  const encoded = segments.map(encodeURIComponent).join('/');
  return \`/files/\${encoded}\`;
}

// Test cases
buildFileURL('documents/report 2024.pdf');
// '/files/documents/report%202024.pdf'

buildFileURL('photos/vacation (2024)/beach.jpg');
// '/files/photos/vacation%20(2024)/beach.jpg'
\`\`\`

### Example 3: Email Link

\`\`\`javascript
function buildEmailLink(email, subject, body) {
  const params = new URLSearchParams({
    subject: subject,
    body: body
  });
  
  return \`mailto:\${email}?\${params.toString()}\`;
}

// Usage
buildEmailLink(
  'user@example.com',
  'Hello & Welcome',
  'This is a test message with special chars: <>&'
);
// 'mailto:user@example.com?subject=Hello+%26+Welcome&body=This+is+a+test+message+with+special+chars%3A+%3C%3E%26'
\`\`\`

## Validation

### Validate Before Encoding

\`\`\`javascript
function validateAndEncode(str) {
  // Check for null/undefined
  if (str == null) {
    throw new Error('Cannot encode null or undefined');
  }
  
  // Convert to string
  str = String(str);
  
  // Check length
  if (str.length > 2000) {
    throw new Error('String too long for URL');
  }
  
  // Encode
  return encodeURIComponent(str);
}
\`\`\`

### Validate After Decoding

\`\`\`javascript
function validateAndDecode(str) {
  try {
    const decoded = decodeURIComponent(str);
    
    // Check for suspicious patterns
    if (decoded.includes('<script>')) {
      throw new Error('Potential XSS attack');
    }
    
    return decoded;
  } catch (e) {
    throw new Error('Invalid encoded string');
  }
}
\`\`\`

## Security Considerations

### Prevent XSS

\`\`\`javascript
// Always encode user input
function safeURL(userInput) {
  // Encode to prevent XSS
  const encoded = encodeURIComponent(userInput);
  return \`/search?q=\${encoded}\`;
}

// ❌ Dangerous
const dangerous = \`/search?q=\${userInput}\`;

// ✓ Safe
const safe = safeURL(userInput);
\`\`\`

### Prevent SQL Injection

\`\`\`javascript
// Encode before using in queries
app.get('/search', (req, res) => {
  // Decode and sanitize
  const query = decodeURIComponent(req.query.q);
  
  // Use parameterized queries
  db.query('SELECT * FROM products WHERE name LIKE ?', [\`%\${query}%\`]);
});
\`\`\`

## Best Practices Checklist

\`\`\`markdown
- [ ] Always encode user input
- [ ] Use encodeURIComponent for query parameters
- [ ] Use encodeURI for full URLs
- [ ] Don't double-encode
- [ ] Validate before encoding
- [ ] Handle decoding errors
- [ ] Test with special characters
- [ ] Consider URL length limits
- [ ] Document encoding decisions
- [ ] Use built-in functions
\`\`\`

## Conclusion

Proper handling of special characters requires:
- Understanding which characters need encoding
- Using appropriate encoding functions
- Context-aware encoding strategies
- Validation and error handling
- Security considerations

Always encode user input and test with various special characters to ensure robust URL handling.`,

  35: `# URL Encoding in Different Programming Languages

URL encoding implementation varies across programming languages. This guide compares implementations and provides examples for JavaScript, Python, PHP, Java, and C#.

## JavaScript

### Built-in Functions

\\`\\`\\`javascript
// encodeURI() - Encode entire URL
const url = 'https://example.com/path with spaces?q=hello world';
encodeURI(url);
// 'https://example.com/path%20with%20spaces?q=hello%20world'

// encodeURIComponent() - Encode URL component
const param = 'hello & goodbye';
encodeURIComponent(param);
// 'hello%20%26%20goodbye'

// decodeURI() - Decode entire URL
decodeURI('https://example.com/path%20with%20spaces');
// 'https://example.com/path with spaces'

// decodeURIComponent() - Decode URL component
decodeURIComponent('hello%20%26%20goodbye');
// 'hello & goodbye'
\\`\\`\`

### URLSearchParams

\`\`\`javascript
// Modern way to handle query parameters
const params = new URLSearchParams({
  search: 'hello world',
  category: 'books & magazines',
  page: 1
});

params.toString();
// 'search=hello+world&category=books+%26+magazines&page=1'

// Automatic encoding/decoding
params.get('search');  // 'hello world' (decoded)
\`\`\`

## Python

### urllib.parse

\`\`\`python
from urllib.parse import quote, unquote, urlencode, parse_qs

# quote() - Encode string
encoded = quote('hello world')
print(encoded)  # 'hello%20world'

# quote_plus() - Encode with + for spaces
encoded = quote_plus('hello world')
print(encoded)  # 'hello+world'

# unquote() - Decode string
decoded = unquote('hello%20world')
print(decoded)  # 'hello world'

# urlencode() - Encode dictionary to query string
params = {'search': 'hello world', 'page': 1}
query = urlencode(params)
print(query)  # 'search=hello+world&page=1'

# parse_qs() - Parse query string
parsed = parse_qs('search=hello+world&page=1')
print(parsed)  # {'search': ['hello world'], 'page': ['1']}
\`\`\`

### requests Library

\`\`\`python
import requests

# Automatic encoding
params = {'search': 'hello world', 'category': 'books & magazines'}
response = requests.get('https://api.example.com/search', params=params)
# URL: https://api.example.com/search?search=hello+world&category=books+%26+magazines
\`\`\`

## PHP

### Built-in Functions

\`\`\`php
<?php
// urlencode() - Encode with + for spaces
$encoded = urlencode('hello world');
echo $encoded;  // 'hello+world'

// rawurlencode() - Encode with %20 for spaces
$encoded = rawurlencode('hello world');
echo $encoded;  // 'hello%20world'

// urldecode() - Decode
$decoded = urldecode('hello+world');
echo $decoded;  // 'hello world'

// rawurldecode() - Decode
$decoded = rawurldecode('hello%20world');
echo $decoded;  // 'hello world'

// http_build_query() - Build query string
$params = ['search' => 'hello world', 'page' => 1];
$query = http_build_query($params);
echo $query;  // 'search=hello+world&page=1'

// parse_str() - Parse query string
parse_str('search=hello+world&page=1', $result);
print_r($result);  // ['search' => 'hello world', 'page' => '1']
?>
\`\`\`

## Java

### URLEncoder/URLDecoder

\`\`\`java
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

// Encode
String encoded = URLEncoder.encode("hello world", StandardCharsets.UTF_8);
System.out.println(encoded);  // "hello+world"

// Decode
String decoded = URLDecoder.decode("hello+world", StandardCharsets.UTF_8);
System.out.println(decoded);  // "hello world"

// Build query string
String query = "search=" + URLEncoder.encode("hello world", StandardCharsets.UTF_8) +
               "&page=" + URLEncoder.encode("1", StandardCharsets.UTF_8);
System.out.println(query);  // "search=hello+world&page=1"
\`\`\`

### URI Class

\`\`\`java
import java.net.URI;
import java.net.URISyntaxException;

try {
    // Build URI with automatic encoding
    URI uri = new URI(
        "https",           // scheme
        "example.com",     // host
        "/path with spaces",  // path
        "q=hello world",   // query
        null               // fragment
    );
    
    System.out.println(uri.toString());
    // "https://example.com/path%20with%20spaces?q=hello%20world"
} catch (URISyntaxException e) {
    e.printStackTrace();
}
\`\`\`

## C#

### Uri Class

\`\`\`csharp
using System;
using System.Web;

// Uri.EscapeDataString() - Encode string
string encoded = Uri.EscapeDataString("hello world");
Console.WriteLine(encoded);  // "hello%20world"

// Uri.UnescapeDataString() - Decode string
string decoded = Uri.UnescapeDataString("hello%20world");
Console.WriteLine(decoded);  // "hello world"

// HttpUtility.UrlEncode() - Encode with + for spaces
string encoded2 = HttpUtility.UrlEncode("hello world");
Console.WriteLine(encoded2);  // "hello+world"

// HttpUtility.UrlDecode() - Decode
string decoded2 = HttpUtility.UrlDecode("hello+world");
Console.WriteLine(decoded2);  // "hello world"

// Build query string
var parameters = new Dictionary<string, string>
{
    { "search", "hello world" },
    { "page", "1" }
};

string query = string.Join("&", parameters.Select(p => 
    $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value)}"
));
Console.WriteLine(query);  // "search=hello%20world&page=1"
\`\`\`

## Comparison Table

| Feature | JavaScript | Python | PHP | Java | C# |
|---------|------------|--------|-----|------|-----|
| **Encode String** | encodeURIComponent() | quote() | rawurlencode() | URLEncoder.encode() | Uri.EscapeDataString() |
| **Decode String** | decodeURIComponent() | unquote() | rawurldecode() | URLDecoder.decode() | Uri.UnescapeDataString() |
| **Space as +** | No | quote_plus() | urlencode() | Yes (default) | HttpUtility.UrlEncode() |
| **Space as %20** | Yes | quote() | rawurlencode() | No | Uri.EscapeDataString() |
| **Query Builder** | URLSearchParams | urlencode() | http_build_query() | Manual | Manual |
| **Auto Encoding** | fetch() | requests | cURL | HttpClient | HttpClient |

## Cross-Language Example

### Same Task in All Languages

**Task:** Build URL with search parameter "hello & goodbye"

\`\`\`javascript
// JavaScript
const param = encodeURIComponent('hello & goodbye');
const url = \`https://api.example.com/search?q=\${param}\`;
// 'https://api.example.com/search?q=hello%20%26%20goodbye'
\`\`\`

\`\`\`python
# Python
from urllib.parse import quote
param = quote('hello & goodbye')
url = f'https://api.example.com/search?q={param}'
# 'https://api.example.com/search?q=hello%20%26%20goodbye'
\`\`\`

\`\`\`php
<?php
// PHP
$param = rawurlencode('hello & goodbye');
$url = "https://api.example.com/search?q=$param";
// 'https://api.example.com/search?q=hello%20%26%20goodbye'
?>
\`\`\`

\`\`\`java
// Java
String param = URLEncoder.encode("hello & goodbye", StandardCharsets.UTF_8);
String url = "https://api.example.com/search?q=" + param;
// "https://api.example.com/search?q=hello+%26+goodbye"
\`\`\`

\`\`\`csharp
// C#
string param = Uri.EscapeDataString("hello & goodbye");
string url = $"https://api.example.com/search?q={param}";
// "https://api.example.com/search?q=hello%20%26%20goodbye"
\`\`\`

## Best Practices

### 1. Use Language-Specific Functions

\`\`\`javascript
// ✓ Good: Use built-in functions
encodeURIComponent(value);

// ❌ Bad: Manual encoding
value.replace(/ /g, '%20').replace(/&/g, '%26');
\`\`\`

### 2. Handle Character Encoding

\`\`\`python
# Python: Always specify UTF-8
quote('你好', encoding='utf-8')

# Java: Always specify charset
URLEncoder.encode("你好", StandardCharsets.UTF_8)
\`\`\`

### 3. Use HTTP Libraries

\`\`\`javascript
// JavaScript: fetch handles encoding
fetch('https://api.example.com/search', {
  method: 'POST',
  body: new URLSearchParams({ q: 'hello world' })
});

// Python: requests handles encoding
requests.get('https://api.example.com/search', params={'q': 'hello world'})
\`\`\`

## Conclusion

Each language provides URL encoding functions:
- **JavaScript**: encodeURIComponent/decodeURIComponent
- **Python**: quote/unquote from urllib.parse
- **PHP**: rawurlencode/rawurldecode
- **Java**: URLEncoder/URLDecoder
- **C#**: Uri.EscapeDataString/UnescapeDataString

Always use built-in functions and specify character encoding (UTF-8) for consistent results across languages.`
};
