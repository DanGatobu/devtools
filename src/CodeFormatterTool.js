import React, { useState } from 'react';
import axios from 'axios';

const CodeFormatterTool = ({ onNavigate }) => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('formatted'); // 'formatted' or 'minified'
  const [minifiedCode, setMinifiedCode] = useState('');

  const API_BASE_URL = 'http://localhost:8010';

  const supportedLanguages = [
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'html', label: 'HTML', extension: 'html' },
    { value: 'css', label: 'CSS', extension: 'css' },
    { value: 'json', label: 'JSON', extension: 'json' },
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'sql', label: 'SQL', extension: 'sql' },
    { value: 'xml', label: 'XML', extension: 'xml' },
    { value: 'yaml', label: 'YAML', extension: 'yml' },
    { value: 'bash', label: 'Bash/Shell', extension: 'sh' },
    { value: 'markdown', label: 'Markdown', extension: 'md' },
    { value: 'php', label: 'PHP', extension: 'php' }
  ];

  const formatCode = async () => {
    if (!inputCode.trim()) {
      setError('Please enter some code to format');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/format-code`, {
        code: inputCode,
        language: language
      });

      const data = response.data;
      
      if (data.success) {
        setOutputCode(data.formatted);
        setMinifiedCode(data.minified || '');
        setSuccess(true);
        setError('');
      } else {
        setError(data.error || 'Failed to format code');
        setOutputCode('');
        setMinifiedCode('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the API server');
      setOutputCode('');
      setMinifiedCode('');
    }
    
    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
    setMinifiedCode('');
    setError('');
    setSuccess(false);
  };

  const loadSample = () => {
    const samples = {
      javascript: `function calculateTotal(items) {
const tax = 0.08;
let subtotal = 0;
for (let i = 0; i < items.length; i++) {
subtotal += items[i].price * items[i].quantity;
}
return subtotal * (1 + tax);
}`,
      typescript: `interface User {
name: string;
age: number;
email?: string;
}
function greetUser(user: User): string {
return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}`,
      html: `<!DOCTYPE html>
<html><head><title>Sample</title></head>
<body><div class="container"><h1>Hello World</h1><p>This is a sample HTML document.</p></div></body></html>`,
      css: `.container{max-width:1200px;margin:0 auto;padding:20px}.header{background-color:#333;color:white;padding:1rem}`,
      json: `{"name":"John Doe","age":30,"address":{"street":"123 Main St","city":"New York"},"hobbies":["reading","coding"]}`,
      python: `def fibonacci(n):
if n <= 1:
return n
else:
return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
print(fibonacci(i))`,
      sql: `SELECT u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2023-01-01' GROUP BY u.id ORDER BY order_count DESC;`,
      xml: `<?xml version="1.0"?><catalog><book id="1"><author>Smith, John</author><title>Sample Book</title><price>29.99</price></book></catalog>`,
      yaml: `version: '3.8'
services:
web:
build: .
ports:
- "5000:5000"
volumes:
- .:/code
environment:
FLASK_ENV: development
database:
image: postgres:13
environment:
POSTGRES_DB: myapp`,
      bash: `#!/bin/bash
for file in *.txt; do
if [ -f "$file" ]; then
echo "Processing $file"
cp "$file" "backup_$file"
fi
done`,
      markdown: `# Project Title
## Overview
This is a **sample** markdown document with various formatting options.
### Features
- Item 1
- Item 2
- Item 3
\`\`\`javascript
console.log("Hello World");
\`\`\``,
      php: `<?php
class User {
private $name;
private $email;
public function __construct($name, $email) {
$this->name = $name;
$this->email = $email;
}
public function getName() {
return $this->name;
}
}`
    };
    
    setInputCode(samples[language] || '');
  };

  const currentOutput = activeTab === 'formatted' ? outputCode : minifiedCode;
  const currentLanguage = supportedLanguages.find(lang => lang.value === language);

  return (
    <div className="app">
      <nav className="navigation">
        <div className="nav-brand">
          <h1>Developer Tools</h1>
        </div>
        <div className="nav-links">
          <button 
            className="nav-btn"
            onClick={() => onNavigate('json')}
          >
            JSON Formatter
          </button>
          <button 
            className="nav-btn"
            onClick={() => onNavigate('base64')}
          >
            Base64 Tool
          </button>
          <button 
            className="nav-btn"
            onClick={() => onNavigate('url')}
          >
            URL Tool
          </button>
          <button 
            className="nav-btn"
            onClick={() => onNavigate('color')}
          >
            Color Tool
          </button>
          <button 
            className="nav-btn"
            onClick={() => onNavigate('regex')}
          >
            Regex Tool
          </button>
          <button 
            className="nav-btn"
            onClick={() => onNavigate('jwt')}
          >
            JWT Tool
          </button>
          <button className="nav-btn active">
            Code Formatter
          </button>
          <button 
            className="nav-btn"
            onClick={() => onNavigate('diff')}
          >
            Code Diff
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="header">
          <h1>Code Beautifier & Formatter</h1>
          <p>Format, beautify, and minify code in multiple languages</p>
        </div>

        <div className="main-content">
          <div className="input-section">
            <h2 className="section-title">Input Code</h2>
            
            <div className="language-selector">
              <label htmlFor="language">Language:</label>
              <select 
                id="language" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="textarea code-input"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder={`Paste your ${currentLanguage?.label || 'code'} here...`}
              spellCheck={false}
            />
            
            <div className="controls">
              <button 
                className="btn btn-primary" 
                onClick={formatCode}
                disabled={loading || !inputCode.trim()}
              >
                {loading ? 'Formatting...' : 'Format Code'}
              </button>
              <button className="btn btn-secondary" onClick={loadSample}>
                Load Sample
              </button>
              <button className="btn btn-secondary" onClick={clearAll}>
                Clear All
              </button>
            </div>

            {error && (
              <div className="status error">
                {error}
              </div>
            )}

            {success && (
              <div className="status success">
                ✓ Code formatted successfully
              </div>
            )}
          </div>

          <div className="output-section">
            <h2 className="section-title">Formatted Code</h2>
            
            {(outputCode || minifiedCode) && (
              <div className="output-tabs">
                <button 
                  className={`tab ${activeTab === 'formatted' ? 'active' : ''}`}
                  onClick={() => setActiveTab('formatted')}
                >
                  Formatted
                </button>
                {minifiedCode && (
                  <button 
                    className={`tab ${activeTab === 'minified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('minified')}
                  >
                    Minified
                  </button>
                )}
              </div>
            )}

            <textarea
              className="textarea code-output"
              value={currentOutput}
              readOnly
              placeholder="Formatted code will appear here..."
              spellCheck={false}
            />
            
            <div className="controls">
              <button 
                className="btn btn-success"
                onClick={() => copyToClipboard(currentOutput)}
                disabled={!currentOutput}
              >
                Copy to Clipboard
              </button>
            </div>

            {currentOutput && (
              <div className="stats">
                <span>Lines: {currentOutput.split('\n').length}</span>
                <span>Characters: {currentOutput.length}</span>
                <span>Size: {new Blob([currentOutput]).size} bytes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeFormatterTool;