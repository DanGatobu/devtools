import React, { useState } from 'react';

const XmlTool = ({ onNavigate }) => {
  const [inputXml, setInputXml] = useState('');
  const [formattedXml, setFormattedXml] = useState('');
  const [minifiedXml, setMinifiedXml] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('formatted');

  const validateAndFormat = (xmlContent) => {
    if (!xmlContent.trim()) {
      setIsValid(null);
      setError('');
      setFormattedXml('');
      setMinifiedXml('');
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      const parserError = xmlDoc.querySelector('parsererror');
      
      if (parserError) {
        setIsValid(false);
        setError(parserError.textContent);
        setFormattedXml('');
        setMinifiedXml('');
      } else {
        setIsValid(true);
        setError('');
        
        // Format XML
        const formatted = formatXml(xmlContent);
        setFormattedXml(formatted);
        
        // Minify XML
        const minified = xmlContent.replace(/>\s+</g, '><').trim();
        setMinifiedXml(minified);
      }
    } catch (err) {
      setIsValid(false);
      setError(err.message);
      setFormattedXml('');
      setMinifiedXml('');
    }
  };

  const formatXml = (xml) => {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;

    xml = xml.replace(reg, '$1\n$2$3');
    
    xml.split('\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      formatted += PADDING.repeat(pad) + node + '\n';
      pad += indent;
    });

    return formatted.trim();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputXml(value);
    validateAndFormat(value);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearInput = () => {
    setInputXml('');
    setFormattedXml('');
    setMinifiedXml('');
    setIsValid(null);
    setError('');
  };

  const loadSample = () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="cooking">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>
  <book category="children">
    <title lang="en">Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
</bookstore>`;
    setInputXml(sampleXml);
    validateAndFormat(sampleXml);
  };

  const getStatusMessage = () => {
    if (isValid === null) return null;
    if (isValid) return { type: 'success', message: '✓ Valid XML' };
    return { type: 'error', message: error };
  };

  const status = getStatusMessage();
  const currentOutput = activeTab === 'formatted' ? formattedXml : minifiedXml;

  return (
    <div className="app">
      <nav className="navigation">
        <div className="nav-brand">
          <h1>DevTools</h1>
          <span className="nav-subtitle">Free Developer Utilities</span>
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => onNavigate('json')}>JSON Formatter</button>
          <button className="nav-btn" onClick={() => onNavigate('base64')}>Base64 Tool</button>
          <button className="nav-btn" onClick={() => onNavigate('url')}>URL Tool</button>
          <button className="nav-btn" onClick={() => onNavigate('color')}>Color Tool</button>
          <button className="nav-btn" onClick={() => onNavigate('regex')}>Regex Tool</button>
          <button className="nav-btn" onClick={() => onNavigate('jwt')}>JWT Tool</button>
          <button className="nav-btn" onClick={() => onNavigate('formatter')}>Code Formatter</button>
          <button className="nav-btn" onClick={() => onNavigate('diff')}>Code Diff</button>
          <button className="nav-btn active" onClick={() => onNavigate('xml')}>XML Tool</button>
          <button className="nav-btn" onClick={() => onNavigate('blog')}>Blog</button>
        </div>
      </nav>

      <div className="container">
        <div className="header">
          <h1>XML Validator & Formatter</h1>
          <p>Validate, format, and minify your XML data</p>
        </div>

        <div className="main-content">
          <div className="input-section">
            <h2 className="section-title">Input XML</h2>
            <textarea
              className={`textarea ${isValid === true ? 'success' : isValid === false ? 'error' : ''}`}
              value={inputXml}
              onChange={handleInputChange}
              placeholder="Paste your XML here..."
              spellCheck={false}
            />
            
            <div className="controls">
              <button className="btn btn-primary" onClick={loadSample}>
                Load Sample
              </button>
              <button className="btn btn-secondary" onClick={clearInput}>
                Clear
              </button>
            </div>

            {status && (
              <div className={`status ${status.type}`}>
                {status.message}
              </div>
            )}
          </div>

          <div className="output-section">
            <h2 className="section-title">Output</h2>
            
            <div className="output-tabs">
              <button 
                className={`tab ${activeTab === 'formatted' ? 'active' : ''}`}
                onClick={() => setActiveTab('formatted')}
              >
                Formatted
              </button>
              <button 
                className={`tab ${activeTab === 'minified' ? 'active' : ''}`}
                onClick={() => setActiveTab('minified')}
              >
                Minified
              </button>
            </div>

            <textarea
              className="textarea"
              value={currentOutput}
              readOnly
              placeholder="Formatted XML will appear here..."
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

            {isValid && (
              <div className="stats">
                <span>Characters: {currentOutput.length}</span>
                <span>Size: {new Blob([currentOutput]).size} bytes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DevTools</h3>
            <p>Free developer utilities for everyday coding tasks</p>
          </div>
          
          <div className="footer-section">
            <h4>Tools</h4>
            <ul>
              <li><button onClick={() => onNavigate('json')}>JSON Formatter</button></li>
              <li><button onClick={() => onNavigate('xml')}>XML Validator</button></li>
              <li><button onClick={() => onNavigate('base64')}>Base64 Tool</button></li>
              <li><button onClick={() => onNavigate('url')}>URL Tool</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><button onClick={() => onNavigate('blog')}>Blog</button></li>
              <li><a href="https://devtoolss.sbs">Home</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 DevTools. Made with ❤️ by Dan Gatobu</p>
        </div>
      </footer>
    </div>
  );
};

export default XmlTool;
