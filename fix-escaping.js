const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/blogPosts.js', 'utf8');

// Function to properly escape content inside template literals
function escapeTemplateContent(match, postNum, postContent, ending) {
  // Escape backticks: ` becomes \`
  let escaped = postContent.replace(/`/g, '\\`');
  
  // Escape template literal syntax: ${ becomes \${
  escaped = escaped.replace(/\$\{/g, '\\${');
  
  return postNum + escaped + ending;
}

// Match each blog post: number: `content`,
// We need to be careful to match the entire content between backticks
const regex = /(\d+:\s*)`([^]*?)`,(\s*\n)/g;

let fixed = content.replace(regex, escapeTemplateContent);

// Write back
fs.writeFileSync('src/blogPosts.js', fixed);
console.log('Successfully escaped all template literals');
