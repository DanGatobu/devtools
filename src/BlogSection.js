import React, { useState } from 'react';

const BlogSection = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);

  // Blog posts data - 35 total posts (5 per tool × 7 tools)
  const blogPosts = [
    // Base64 Tool Posts (5 posts)
    {
      id: 1,
      title: "How to Encode and Decode Base64: A Complete Developer's Guide",
      category: "base64",
      excerpt: "Learn everything about Base64 encoding and decoding with practical examples in JavaScript, Python, PHP, and Java.",
      keywords: ["base64 encode", "base64 decode", "base64 encoder online"],
      readTime: "8 min read",
      date: "2026-01-15",
      content: "# How to Encode and Decode Base64: A Complete Developer's Guide\n\nBase64 encoding is a fundamental concept every developer should understand..."
    },
    {
      id: 2,
      title: "Base64 Encoding Explained: When and Why to Use It",
      category: "base64",
      excerpt: "Understand the practical applications of Base64 encoding in modern web development and when to use it effectively.",
      keywords: ["base64 encoding", "base64 string converter", "encode to base64"],
      readTime: "6 min read",
      date: "2026-01-12",
      content: "# Base64 Encoding Explained: When and Why to Use It\n\nBase64 encoding serves specific purposes in web development..."
    },
    {
      id: 3,
      title: "Base64 vs Other Encoding Methods: Comparison Guide",
      category: "base64",
      excerpt: "Compare Base64 with other encoding methods to choose the right one for your project needs.",
      keywords: ["base64 encode decode", "base64 encoder online"],
      readTime: "7 min read",
      date: "2026-01-10",
      content: "# Base64 vs Other Encoding Methods: Comparison Guide\n\nChoosing the right encoding method is crucial for your project..."
    },
    {
      id: 4,
      title: "Common Base64 Encoding Errors and How to Fix Them",
      category: "base64",
      excerpt: "Troubleshoot and fix common Base64 encoding and decoding errors with practical solutions.",
      keywords: ["base64 decode online", "base64 encoding example"],
      readTime: "8 min read",
      date: "2026-01-08",
      content: "# Common Base64 Encoding Errors and How to Fix Them\n\nBase64 encoding can be tricky. This guide helps you identify and fix common errors..."
    },
    {
      id: 5,
      title: "Base64 in API Development: Best Practices",
      category: "base64",
      excerpt: "Learn how to effectively use Base64 encoding in API development with security and performance best practices.",
      keywords: ["base64 encoding", "encode to base64", "base64 decode online"],
      readTime: "10 min read",
      date: "2026-01-06",
      content: "# Base64 in API Development: Best Practices\n\nBase64 encoding is essential in API development for handling binary data..."
    },
    // Code Diff Tool Posts (5 posts)
    {
      id: 6,
      title: "Code Diff Tools: The Ultimate Guide for Developers",
      category: "diff",
      excerpt: "Master code comparison with this comprehensive guide to diff tools, from basic usage to advanced techniques.",
      keywords: ["code diff tool", "compare code online", "text diff tool"],
      readTime: "10 min read",
      date: "2026-01-10",
      content: "# Code Diff Tools: The Ultimate Guide for Developers\n\nCode diff tools are essential for every developer's toolkit..."
    },
    {
      id: 7,
      title: "How to Compare Code Files: Step-by-Step Tutorial",
      category: "diff",
      excerpt: "Master code comparison with this detailed tutorial covering tools, techniques, and best practices.",
      keywords: ["file comparison tool", "diff checker", "code comparison online"],
      readTime: "9 min read",
      date: "2026-01-07",
      content: "# How to Compare Code Files: Step-by-Step Tutorial\n\nComparing code files is essential for development workflows..."
    },
    {
      id: 8,
      title: "Git Diff vs Online Diff Tools: Which Should You Use?",
      category: "diff",
      excerpt: "Compare Git diff with online diff tools to choose the best option for your development workflow.",
      keywords: ["compare code online", "find differences between files"],
      readTime: "8 min read",
      date: "2026-01-04",
      content: "# Git Diff vs Online Diff Tools: Which Should You Use?\n\nChoosing between Git diff and online diff tools depends on your specific needs..."
    },
    {
      id: 9,
      title: "Spotting Code Changes: Using Diff Tools Effectively",
      category: "diff",
      excerpt: "Learn advanced techniques for identifying and analyzing code changes using diff tools effectively.",
      keywords: ["code diff tool", "text diff tool"],
      readTime: "9 min read",
      date: "2026-01-02",
      content: "# Spotting Code Changes: Using Diff Tools Effectively\n\nEffective change detection is crucial for code quality and debugging..."
    },
    {
      id: 10,
      title: "Merging Code Changes: Diff Tools in Version Control",
      category: "diff",
      excerpt: "Master merge conflicts and code integration using diff tools in version control systems.",
      keywords: ["file comparison tool", "code comparison online"],
      readTime: "11 min read",
      date: "2025-12-30",
      content: "# Merging Code Changes: Diff Tools in Version Control\n\nMerging code changes is a critical skill in collaborative development..."
    },
    // Code Formatter Tool Posts (5 posts)
    {
      id: 11,
      title: "Code Formatter vs Code Beautifier: What's the Difference?",
      category: "formatter",
      excerpt: "Understand the key differences between code formatters and beautifiers to choose the right tool.",
      keywords: ["code formatter", "code beautifier", "format code online"],
      readTime: "7 min read",
      date: "2026-01-14",
      content: "# Code Formatter vs Code Beautifier: What's the Difference?\n\nCode formatting tools come in different flavors..."
    },
    {
      id: 12,
      title: "Top 5 Code Formatters for 2026: Comparison and Review",
      category: "formatter",
      excerpt: "Compare the best code formatters available in 2026 with detailed reviews and recommendations.",
      keywords: ["code formatter", "format code online", "javascript formatter"],
      readTime: "12 min read",
      date: "2026-01-11",
      content: "# Top 5 Code Formatters for 2026: Comparison and Review\n\nChoosing the right code formatter can significantly improve your workflow..."
    },
    {
      id: 13,
      title: "Prettier vs Black: Choosing the Right Code Formatter",
      category: "formatter",
      excerpt: "Compare Prettier and Black formatters to make an informed decision for your projects.",
      keywords: ["prettier code formatter", "python code formatter", "html formatter online"],
      readTime: "8 min read",
      date: "2026-01-09",
      content: "# Prettier vs Black: Choosing the Right Code Formatter\n\nPrettier and Black are two of the most popular code formatters..."
    },
    {
      id: 14,
      title: "Automatic Code Formatting: Improving Code Quality",
      category: "formatter",
      excerpt: "Learn how automatic code formatting can improve code quality and team productivity.",
      keywords: ["code formatter", "code beautifier"],
      readTime: "9 min read",
      date: "2026-01-05",
      content: "# Automatic Code Formatting: Improving Code Quality\n\nAutomatic code formatting is a game-changer for development teams..."
    },
    {
      id: 15,
      title: "Code Formatting Best Practices for Teams",
      category: "formatter",
      excerpt: "Establish effective code formatting standards and practices for your development team.",
      keywords: ["format code online", "javascript formatter"],
      readTime: "10 min read",
      date: "2026-01-03",
      content: "# Code Formatting Best Practices for Teams\n\nConsistent code formatting is crucial for team collaboration..."
    },
    // Color Tool Posts (5 posts)
    {
      id: 16,
      title: "Complete Guide to Color Pickers: Tools and Techniques",
      category: "color",
      excerpt: "Master color selection with this comprehensive guide to color pickers, formats, and design techniques.",
      keywords: ["color picker", "hex color picker", "color converter"],
      readTime: "11 min read",
      date: "2026-01-13",
      content: "# Complete Guide to Color Pickers: Tools and Techniques\n\nColor selection is crucial in design and development..."
    },
    {
      id: 17,
      title: "RGB vs Hex vs HSL: Understanding Color Formats",
      category: "color",
      excerpt: "Learn the differences between RGB, Hex, and HSL color formats and when to use each one.",
      keywords: ["rgb to hex converter", "hex to rgb converter", "color code converter"],
      readTime: "8 min read",
      date: "2026-01-11",
      content: "# RGB vs Hex vs HSL: Understanding Color Formats\n\nColor formats can be confusing for developers and designers..."
    },
    {
      id: 18,
      title: "Creating Harmonious Color Palettes: A Designer's Guide",
      category: "color",
      excerpt: "Learn color theory and practical techniques for creating beautiful, harmonious color palettes.",
      keywords: ["color palette generator", "color picker", "color converter"],
      readTime: "12 min read",
      date: "2026-01-08",
      content: "# Creating Harmonious Color Palettes: A Designer's Guide\n\nColor harmony is the foundation of great design..."
    },
    {
      id: 19,
      title: "Color Psychology in Web Design: Choosing the Right Palette",
      category: "color",
      excerpt: "Understand how color psychology affects user behavior and learn to choose effective color palettes.",
      keywords: ["color picker", "hex color picker"],
      readTime: "10 min read",
      date: "2026-01-06",
      content: "# Color Psychology in Web Design: Choosing the Right Palette\n\nColors have a profound psychological impact on users..."
    },
    {
      id: 20,
      title: "Accessibility in Color Selection: WCAG Guidelines",
      category: "color",
      excerpt: "Learn how to choose accessible colors that meet WCAG guidelines for inclusive design.",
      keywords: ["color converter", "color palette generator"],
      readTime: "9 min read",
      date: "2026-01-04",
      content: "# Accessibility in Color Selection: WCAG Guidelines\n\nAccessible color selection is crucial for inclusive web design..."
    },
    // JWT Tool Posts (5 posts)
    {
      id: 21,
      title: "JWT Decoder: How to Debug JSON Web Tokens",
      category: "jwt",
      excerpt: "Learn how to decode and debug JWT tokens effectively with practical examples and security considerations.",
      keywords: ["jwt decoder", "decode jwt", "jwt token decoder online"],
      readTime: "9 min read",
      date: "2026-01-12",
      content: "# JWT Decoder: How to Debug JSON Web Tokens\n\nJSON Web Tokens (JWT) are widely used for authentication and authorization..."
    },
    {
      id: 22,
      title: "Understanding JWT: A Complete Guide for Developers",
      category: "jwt",
      excerpt: "Master JSON Web Tokens with this comprehensive guide covering structure, implementation, and best practices.",
      keywords: ["json web token", "jwt decoder", "jwt encoder"],
      readTime: "13 min read",
      date: "2026-01-09",
      content: "# Understanding JWT: A Complete Guide for Developers\n\nJSON Web Tokens have become the standard for modern authentication..."
    },
    {
      id: 23,
      title: "JWT Authentication: Security Best Practices",
      category: "jwt",
      excerpt: "Learn essential security practices for implementing JWT authentication in your applications.",
      keywords: ["jwt validation", "jwt authentication explained", "json web token"],
      readTime: "11 min read",
      date: "2026-01-07",
      content: "# JWT Authentication: Security Best Practices\n\nSecure JWT implementation is crucial for application security..."
    },
    {
      id: 24,
      title: "Decoding JWT Claims: What Each Part Means",
      category: "jwt",
      excerpt: "Understand JWT structure and learn what each claim means for effective token management.",
      keywords: ["jwt decoder", "decode jwt", "jwt token decoder online"],
      readTime: "8 min read",
      date: "2026-01-05",
      content: "# Decoding JWT Claims: What Each Part Means\n\nJWT tokens contain three parts, each with specific purposes..."
    },
    {
      id: 25,
      title: "JWT vs Session Tokens: Which Should You Use?",
      category: "jwt",
      excerpt: "Compare JWT and session-based authentication to choose the best approach for your application.",
      keywords: ["jwt authentication explained", "json web token", "jwt validation"],
      readTime: "10 min read",
      date: "2026-01-02",
      content: "# JWT vs Session Tokens: Which Should You Use?\n\nChoosing between JWT and session tokens depends on your application's needs..."
    },
    // Regex Tool Posts (5 posts)
    {
      id: 26,
      title: "Regex Tester Tutorial: Master Regular Expressions",
      category: "regex",
      excerpt: "Learn how to test and debug regular expressions effectively with practical examples and best practices.",
      keywords: ["regex tester", "regular expression tester", "regex101"],
      readTime: "12 min read",
      date: "2026-01-14",
      content: "# Regex Tester Tutorial: Master Regular Expressions\n\nRegular expressions are powerful tools for pattern matching and text processing..."
    },
    {
      id: 27,
      title: "Common Regex Patterns: Email, Phone, URL Validation",
      category: "regex",
      excerpt: "Master essential regex patterns for validating emails, phone numbers, URLs, and other common data formats.",
      keywords: ["test regex online", "regex pattern examples", "regex cheat sheet"],
      readTime: "10 min read",
      date: "2026-01-11",
      content: "# Common Regex Patterns: Email, Phone, URL Validation\n\nValidation is a crucial part of web development..."
    },
    {
      id: 28,
      title: "Regex Performance: Optimization Tips and Tricks",
      category: "regex",
      excerpt: "Learn how to optimize regex patterns for better performance and avoid common pitfalls.",
      keywords: ["regex tester", "regular expression tester"],
      readTime: "9 min read",
      date: "2026-01-08",
      content: "# Regex Performance: Optimization Tips and Tricks\n\nRegex performance can make or break your application..."
    },
    {
      id: 29,
      title: "Regex in Different Languages: JavaScript, Python, PHP",
      category: "regex",
      excerpt: "Understand regex differences across programming languages and write portable patterns.",
      keywords: ["regex101", "test regex online"],
      readTime: "11 min read",
      date: "2026-01-06",
      content: "# Regex in Different Languages: JavaScript, Python, PHP\n\nRegex syntax varies slightly between programming languages..."
    },
    {
      id: 30,
      title: "Debugging Regex Patterns: Common Mistakes and Solutions",
      category: "regex",
      excerpt: "Learn to identify and fix common regex mistakes with debugging techniques and tools.",
      keywords: ["regex pattern examples", "regex cheat sheet", "regular expression tutorial"],
      readTime: "8 min read",
      date: "2026-01-03",
      content: "# Debugging Regex Patterns: Common Mistakes and Solutions\n\nRegex debugging can be challenging, but with the right approach..."
    },
    // URL Tool Posts (5 posts)
    {
      id: 31,
      title: "URL Encoding Explained: Why and How It Works",
      category: "url",
      excerpt: "Understand URL encoding principles and learn when and how to properly encode URLs.",
      keywords: ["url encoder", "url encode online", "percent encoding"],
      readTime: "8 min read",
      date: "2026-01-13",
      content: "# URL Encoding Explained: Why and How It Works\n\nURL encoding is essential for web development and data transmission..."
    },
    {
      id: 32,
      title: "URL Encoder vs URL Decoder: When to Use Each",
      category: "url",
      excerpt: "Learn the differences between URL encoding and decoding and when to apply each technique.",
      keywords: ["url decode", "url decoder online", "url safe encoding"],
      readTime: "7 min read",
      date: "2026-01-10",
      content: "# URL Encoder vs URL Decoder: When to Use Each\n\nURL encoding and decoding are fundamental web development concepts..."
    },
    {
      id: 33,
      title: "Percent Encoding in URLs: A Complete Guide",
      category: "url",
      excerpt: "Master percent encoding with this comprehensive guide covering rules, examples, and best practices.",
      keywords: ["percent encoding", "url encode online", "url decoder online"],
      readTime: "9 min read",
      date: "2026-01-07",
      content: "# Percent Encoding in URLs: A Complete Guide\n\nPercent encoding is the standard method for encoding URLs..."
    },
    {
      id: 34,
      title: "URL Encoding Special Characters: Best Practices",
      category: "url",
      excerpt: "Learn how to properly handle special characters in URLs with encoding best practices.",
      keywords: ["url encoder", "url safe encoding"],
      readTime: "6 min read",
      date: "2026-01-04",
      content: "# URL Encoding Special Characters: Best Practices\n\nSpecial characters in URLs require careful handling..."
    },
    {
      id: 35,
      title: "URL Encoding in Different Programming Languages",
      category: "url",
      excerpt: "Compare URL encoding implementations across JavaScript, Python, PHP, Java, and C# with examples.",
      keywords: ["url encode online", "encode url to base64"],
      readTime: "10 min read",
      date: "2026-01-01",
      content: "# URL Encoding in Different Programming Languages\n\nURL encoding implementation varies across programming languages..."
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'base64', name: 'Base64 Tool', count: blogPosts.filter(p => p.category === 'base64').length },
    { id: 'diff', name: 'Code Diff', count: blogPosts.filter(p => p.category === 'diff').length },
    { id: 'formatter', name: 'Code Formatter', count: blogPosts.filter(p => p.category === 'formatter').length },
    { id: 'color', name: 'Color Tool', count: blogPosts.filter(p => p.category === 'color').length },
    { id: 'jwt', name: 'JWT Tool', count: blogPosts.filter(p => p.category === 'jwt').length },
    { id: 'regex', name: 'Regex Tool', count: blogPosts.filter(p => p.category === 'regex').length },
    { id: 'url', name: 'URL Tool', count: blogPosts.filter(p => p.category === 'url').length },
  ];
  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  if (selectedPost) {
    return (
      <div className="blog-container">
        <nav className="blog-nav">
          <button onClick={() => onNavigate('json')} className="back-to-tools">
            ← Back to Tools
          </button>
          <button onClick={() => setSelectedPost(null)} className="back-to-blog">
            ← Back to Blog
          </button>
        </nav>
        
        <article className="blog-post">
          <header className="blog-post-header">
            <div className="blog-post-meta">
              <span className="blog-category">{selectedPost.category}</span>
              <span className="blog-date">{selectedPost.date}</span>
              <span className="blog-read-time">{selectedPost.readTime}</span>
            </div>
            <h1>{selectedPost.title}</h1>
            <div className="blog-keywords">
              {selectedPost.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          </header>
          
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br>') }} />
          
          <footer className="blog-post-footer">
            <div className="blog-actions">
              <button onClick={() => setSelectedPost(null)} className="btn btn-primary">
                ← Back to Blog
              </button>
              <button 
                onClick={() => onNavigate(selectedPost.category)} 
                className="btn btn-secondary"
              >
                Try {selectedPost.category} Tool →
              </button>
            </div>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <nav className="blog-nav">
        <button onClick={() => onNavigate('json')} className="back-to-tools">
          ← Back to Tools
        </button>
      </nav>
      
      <header className="blog-header">
        <h1>DevTools Developer Blog</h1>
        <p>Tutorials, guides, and best practices for web development tools</p>
        <div className="blog-stats">
          <span className="stat-badge">📚 {blogPosts.length} Articles</span>
          <span className="stat-badge">🛠️ 7 Tools Covered</span>
          <span className="stat-badge">⭐ Expert Tips</span>
        </div>
      </header>

      <div className="blog-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      <div className="blog-grid">
        {filteredPosts.map(post => (
          <article key={post.id} className="blog-card">
            <div className="blog-card-header">
              <span className="blog-category">{post.category}</span>
              <span className="blog-date">{post.date}</span>
            </div>
            
            <h2 className="blog-title">{post.title}</h2>
            <p className="blog-excerpt">{post.excerpt}</p>
            
            <div className="blog-keywords">
              {post.keywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className="keyword-tag">{keyword}</span>
              ))}
            </div>
            
            <div className="blog-card-footer">
              <span className="read-time">{post.readTime}</span>
              <button 
                className="read-more-btn"
                onClick={() => setSelectedPost(post)}
              >
                Read More →
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="no-posts">
          <h3>No posts found</h3>
          <p>Try selecting a different category or check back later for new content.</p>
        </div>
      )}
    </div>
  );
};

export default BlogSection;