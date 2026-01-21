import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Base64Tool from './Base64Tool';
import UrlTool from './UrlTool';
import ColorTool from './ColorTool';
import RegexTool from './RegexTool';
import JwtTool from './JwtTool';
import CodeFormatterTool from './CodeFormatterTool';
import CodeDiffTool from './CodeDiffTool';
import BlogSection from './BlogSection';
import FeedbackPopup from './FeedbackPopup';
import './App.css';

const API_BASE_URL = 'https://sharp-kissie-devtools-5e818c05.koyeb.app';

function App() {
  const [currentTool, setCurrentTool] = useState('json'); // 'json', 'base64', 'url', 'color', 'regex', 'jwt', 'formatter', 'diff', or 'blog'
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [minifiedJson, setMinifiedJson] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [indent, setIndent] = useState(2);
  const [activeTab, setActiveTab] = useState('formatted');
  const [stats, setStats] = useState({ lines: 0, characters: 0 });
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  // Popup management
  useEffect(() => {
    // Show popup after 10 seconds of visiting
    const timer = setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Re-show popup after dismissal (30 seconds)
  const handlePopupDismiss = () => {
    setShowFeedbackPopup(false);
    setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 30000);
  };

  const validateAndFormat = useCallback(async (jsonContent) => {
    if (!jsonContent.trim()) {
      setIsValid(null);
      setError('');
      setOutputJson('');
      setMinifiedJson('');
      setStats({ lines: 0, characters: 0 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/validate`, {
        content: jsonContent,
        indent: indent
      });

      const data = response.data;
      setIsValid(data.valid);
      
      if (data.valid) {
        setOutputJson(data.formatted);
        setMinifiedJson(data.minified);
        setError('');
        setStats({
          lines: data.line_count || 0,
          characters: data.character_count || 0
        });
      } else {
        setError(data.error);
        setOutputJson('');
        setMinifiedJson('');
        setStats({ lines: 0, characters: 0 });
      }
    } catch (err) {
      setIsValid(false);
      setError('Failed to connect to the API server');
      setOutputJson('');
      setMinifiedJson('');
      setStats({ lines: 0, characters: 0 });
    }
    setLoading(false);
  }, [indent]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputJson(value);
    validateAndFormat(value);
  };

  const handleIndentChange = (e) => {
    const newIndent = parseInt(e.target.value);
    setIndent(newIndent);
    if (inputJson.trim()) {
      validateAndFormat(inputJson);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearInput = () => {
    setInputJson('');
    setOutputJson('');
    setMinifiedJson('');
    setIsValid(null);
    setError('');
    setStats({ lines: 0, characters: 0 });
  };

  const loadSample = () => {
    const sampleJson = {
      "name": "John Doe",
      "age": 30,
      "email": "john.doe@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "hobbies": ["reading", "swimming", "coding"],
      "isActive": true
    };
    const jsonString = JSON.stringify(sampleJson, null, 2);
    setInputJson(jsonString);
    validateAndFormat(jsonString);
  };

  const getStatusMessage = () => {
    if (loading) return { type: 'info', message: 'Validating...' };
    if (isValid === null) return null;
    if (isValid) return { type: 'success', message: '✓ Valid JSON' };
    return { type: 'error', message: error };
  };

  const status = getStatusMessage();
  const currentOutput = activeTab === 'formatted' ? outputJson : minifiedJson;

  if (currentTool === 'blog') {
    return <BlogSection onNavigate={setCurrentTool} />;
  }

  if (currentTool === 'base64') {
    return <Base64Tool onNavigate={setCurrentTool} />;
  }

  if (currentTool === 'url') {
    return <UrlTool onNavigate={setCurrentTool} />;
  }

  if (currentTool === 'color') {
    return <ColorTool onNavigate={setCurrentTool} />;
  }

  if (currentTool === 'regex') {
    return <RegexTool onNavigate={setCurrentTool} />;
  }

  if (currentTool === 'jwt') {
    return <JwtTool onNavigate={setCurrentTool} />;
  }

  if (currentTool === 'formatter') {
    return <CodeFormatterTool onNavigate={setCurrentTool} />;
  }

  if (currentTool === 'diff') {
    return <CodeDiffTool onNavigate={setCurrentTool} />;
  }

  return (
    <div className="app">
      {showFeedbackPopup && (
        <FeedbackPopup onDismiss={handlePopupDismiss} />
      )}
      
      <nav className="navigation">
        <div className="nav-brand">
          <h1>DevTools</h1>
          <span className="nav-subtitle">Free Developer Utilities</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-btn ${currentTool === 'json' ? 'active' : ''}`}
            onClick={() => setCurrentTool('json')}
          >
            JSON Formatter
          </button>
          <button 
            className={`nav-btn ${currentTool === 'base64' ? 'active' : ''}`}
            onClick={() => setCurrentTool('base64')}
          >
            Base64 Tool
          </button>
          <button 
            className={`nav-btn ${currentTool === 'url' ? 'active' : ''}`}
            onClick={() => setCurrentTool('url')}
          >
            URL Tool
          </button>
          <button 
            className={`nav-btn ${currentTool === 'color' ? 'active' : ''}`}
            onClick={() => setCurrentTool('color')}
          >
            Color Tool
          </button>
          <button 
            className={`nav-btn ${currentTool === 'regex' ? 'active' : ''}`}
            onClick={() => setCurrentTool('regex')}
          >
            Regex Tool
          </button>
          <button 
            className={`nav-btn ${currentTool === 'jwt' ? 'active' : ''}`}
            onClick={() => setCurrentTool('jwt')}
          >
            JWT Tool
          </button>
          <button 
            className={`nav-btn ${currentTool === 'formatter' ? 'active' : ''}`}
            onClick={() => setCurrentTool('formatter')}
          >
            Code Formatter
          </button>
          <button 
            className={`nav-btn ${currentTool === 'diff' ? 'active' : ''}`}
            onClick={() => setCurrentTool('diff')}
          >
            Code Diff
          </button>
          <button 
            className={`nav-btn ${currentTool === 'blog' ? 'active' : ''}`}
            onClick={() => setCurrentTool('blog')}
          >
            Blog
          </button>
        </div>
      </nav>

      <div className="container">
      <div className="header">
        <h1>JSON Formatter & Validator</h1>
        <p>Format, validate, and minify your JSON data</p>
      </div>

      <div className="main-content">
        <div className="input-section">
          <h2 className="section-title">Input JSON</h2>
          <textarea
            className={`textarea ${isValid === true ? 'success' : isValid === false ? 'error' : ''}`}
            value={inputJson}
            onChange={handleInputChange}
            placeholder="Paste your JSON here..."
            spellCheck={false}
          />
          
          <div className="controls">
            <button className="btn btn-primary" onClick={loadSample}>
              Load Sample
            </button>
            <button className="btn btn-secondary" onClick={clearInput}>
              Clear
            </button>
            <div className="indent-control">
              <label htmlFor="indent">Indent:</label>
              <select id="indent" value={indent} onChange={handleIndentChange}>
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
                <option value={0}>Compact</option>
              </select>
            </div>
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
            placeholder="Formatted JSON will appear here..."
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
              <span>Lines: {stats.lines}</span>
              <span>Characters: {stats.characters}</span>
              <span>Size: {new Blob([currentOutput]).size} bytes</span>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DevTools</h3>
            <p>Free developer utilities for everyday coding tasks</p>
          </div>
          
          <div className="footer-section">
            <h4>Tools</h4>
            <ul>
              <li><button onClick={() => setCurrentTool('json')}>JSON Formatter</button></li>
              <li><button onClick={() => setCurrentTool('base64')}>Base64 Tool</button></li>
              <li><button onClick={() => setCurrentTool('url')}>URL Tool</button></li>
              <li><button onClick={() => setCurrentTool('color')}>Color Tool</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><button onClick={() => setCurrentTool('blog')}>Blog</button></li>
              <li><a href="https://devtoolss.sbs">Home</a></li>
              <li><a href="mailto:dan@devtoolss.sbs">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Quick Feedback</h4>
            <div className="footer-feedback-form">
              <textarea 
                placeholder="Share your thoughts about DevTools..."
                className="footer-feedback-input"
                rows="3"
                id="footerFeedback"
              ></textarea>
              <button 
                className="footer-feedback-btn"
                onClick={() => {
                  const feedback = document.getElementById('footerFeedback').value;
                  if (feedback.trim()) {
                    fetch('/api/feedback', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        message: feedback,
                        timestamp: new Date().toISOString(),
                        page: 'footer',
                        user_agent: navigator.userAgent
                      })
                    }).then(() => {
                      alert('Thank you for your feedback!');
                      document.getElementById('footerFeedback').value = '';
                    }).catch(() => {
                      alert('Failed to send feedback. Please try again.');
                    });
                  }
                }}
              >
                Send Feedback
              </button>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <div className="support-links">
              <a href="https://buymeacoffee.com/dandev2026" target="_blank" rel="noopener noreferrer" className="coffee-link">
                ☕ Buy me a coffee
              </a>
              <div className="qr-code">
                <img src="/qr-code.png" alt="Buy me coffee QR" width="80" height="80" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="social-links">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="https://www.linkedin.com/in/dan-gatobu-012544214/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors" title="LinkedIn" aria-label="LinkedIn">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="md:w-7 md:h-7" height="32" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path>
                </svg>
              </a>
              <a href="https://www.upwork.com/freelancers/~01128993ebc1bd665b" target="_blank" rel="noreferrer" className="hover:text-green-400 transition-colors" title="Upwork" aria-label="Upwork">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="md:w-7 md:h-7" height="32" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M56 32l336 0c30.9 0 56 25.1 56 56l0 336c0 30.9-25.1 56-56 56L56 480c-30.9 0-56-25.1-56-56L0 88C0 57.1 25.1 32 56 32zM270.9 274.2c6.6-52.9 25.9-69.5 51.4-69.5c25.3 0 44.9 20.2 44.9 49.7s-19.7 49.7-44.9 49.7c-27.9 0-46.3-21.5-51.4-29.9zm-26.7-41.8c-8.2-15.5-14.3-36.3-19.2-55.6l-29.7 0-33.2 0 0 78.1c0 28.4-12.9 49.4-38.2 49.4s-39.8-20.9-39.8-49.3l.3-78.1-36.2 0 0 78.1c0 22.8 7.4 43.5 20.9 58.2c13.9 15.2 32.8 23.2 54.8 23.2c43.7 0 74.2-33.5 74.2-81.5l0-52.5c4.6 17.3 15.4 50.5 36.2 79.7L215 392.6l36.8 0 12.8-78.4c4.2 3.5 8.7 6.6 13.4 9.4c12.3 7.8 26.4 12.2 40.9 12.6l.1 0c.5 0 1.1 0 1.6 0c.6 0 1.1 0 1.7 0c45.1 0 80.9-34.9 80.9-81.9s-35.9-82.2-80.9-82.2c-45.4 0-70.9 29.7-78.1 60.1z"></path>
                </svg>
              </a>
              <a href="https://github.com/DanGatobu" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition-colors" title="GitHub" aria-label="GitHub">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" className="md:w-7 md:h-7" height="32" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                </svg>
              </a>
            </div>
          </div>
          <p>&copy; 2026 DevTools. Made with ❤️ by Dan Gatobu</p>
        </div>
      </footer>
    </div>
  );
}

export default App;