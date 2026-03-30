const fs = require('fs');

// Read the original file
const content = fs.readFileSync('src/blogPosts.js', 'utf8');

// Extract each blog post content
const posts = {};
const regex = /(\d+):\s*`([^]*?)`,?\s*\n/g;
let match;

while ((match = regex.exec(content)) !== null) {
  const postId = match[1];
  const postContent = match[2];
  posts[postId] = postContent;
}

// Generate new file with String.raw
let output = `// Full blog content for all 35 blog posts
// Each post contains comprehensive markdown content (800-1500 words)

export const fullBlogContent = {\n`;

for (let i = 1; i <= 35; i++) {
  if (posts[i]) {
    // Use JSON.stringify to properly escape the content
    output += `  ${i}: ${JSON.stringify(posts[i])},\n\n`;
  }
}

output += `};\n`;

fs.writeFileSync('src/blogPosts.js', output);
console.log('Converted to JSON strings');
