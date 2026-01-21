import React, { useState } from 'react';
import './App.css';

function UrlTool({ onNavigate }) {
  const [inputText, setInputText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [activeTab, setActiveTab] = useState('encode');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    
    if (value.trim()) {
      try {
        if (activeTab === 'encode') {
          setEncodedText(encodeURIComponent(value));
        } else {
          setDecodedText(decodeURIComponent(value));
        }
      } catch (error) {
        if (activeTab === 'decode') {
          setDecodedText('Invalid URL encoding');
        }
      }
    } else {
      setEncodedText('');
      setDecodedText('');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setInputText('');
    setEncodedText('');
    setDecodedText('');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setEncodedText('');
    setDecodedText('');
  };

  const loadSample = () => {
    if (activeTab === 'encode') {
      const sample = 'Hello World! This is a test with special characters: @#$%^&*()';
      setInputText(sample);
      setEncodedText(encodeURIComponent(sample));
    } else {
      const sample = 'Hello%20World%21%20This%20is%20a%20test%20with%20special%20characters%3A%20%40%23%24%25%5E%26*()';
      setInputText(sample);
      try {
        setDecodedText(decodeURIComponent(sample));
      } catch (error) {
        setDecodedText('Invalid URL encoding');
      }
    }
  };

  const currentOutput = activeTab === 'encode' ? encodedText : decodedText;

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
          <button className="nav-btn active">
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
          <button 
            className="nav-btn"
            onClick={() => onNavigate('formatter')}
          >
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
          <h1>URL Encoder & Decoder</h1>
          <p>Encode and decode URL components</p>
        </div>

        <div className="main-content">
          <div className="input-section">
            <div className="output-tabs">
              <button 
                className={`tab ${activeTab === 'encode' ? 'active' : ''}`}
                onClick={() => handleTabChange('encode')}
              >
                Encode
              </button>
              <button 
                className={`tab ${activeTab === 'decode' ? 'active' : ''}`}
                onClick={() => handleTabChange('decode')}
              >
                Decode
              </button>
            </div>

            <h2 className="section-title">
              {activeTab === 'encode' ? 'Text to Encode' : 'URL to Decode'}
            </h2>
            <textarea
              className="textarea"
              value={inputText}
              onChange={handleInputChange}
              placeholder={
                activeTab === 'encode' 
                  ? 'Enter text to URL encode...' 
                  : 'Enter URL encoded text to decode...'
              }
              spellCheck={false}
            />
            
            <div className="controls">
              <button className="btn btn-primary" onClick={loadSample}>
                Load Sample
              </button>
              <button className="btn btn-secondary" onClick={clearAll}>
                Clear
              </button>
            </div>
          </div>

          <div className="output-section">
            <h2 className="section-title">
              {activeTab === 'encode' ? 'URL Encoded' : 'Decoded Text'}
            </h2>
            
            <textarea
              className="textarea"
              value={currentOutput}
              readOnly
              placeholder={
                activeTab === 'encode' 
                  ? 'URL encoded text will appear here...' 
                  : 'Decoded text will appear here...'
              }
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
                <span>Characters: {currentOutput.length}</span>
                <span>Size: {new Blob([currentOutput]).size} bytes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlTool;