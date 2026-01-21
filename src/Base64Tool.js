import React, { useState, useRef } from 'react';

const Base64Tool = ({ onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleTextEncode = () => {
    try {
      setError('');
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
    } catch (err) {
      setError('Failed to encode text');
    }
  };

  const handleTextDecode = () => {
    try {
      setError('');
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
    } catch (err) {
      setError('Invalid Base64 string');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      
      if (mode === 'encode') {
        reader.onload = (e) => {
          try {
            const base64 = btoa(
              new Uint8Array(e.target.result)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            setOutputText(base64);
            setError('');
          } catch (err) {
            setError('Failed to encode file');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        reader.onload = (e) => {
          try {
            const base64Content = e.target.result.split(',')[1]; // Remove data URL prefix
            setInputText(base64Content);
            setError('');
          } catch (err) {
            setError('Failed to read file');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleTextEncode();
    } else {
      handleTextDecode();
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInputText('');
    setOutputText('');
    setError('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadAsFile = () => {
    if (!outputText) return;
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          <button className="nav-btn active">
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
          <h1>Base64 Encoder/Decoder</h1>
          <p>Convert text and files to/from Base64 encoding</p>
        </div>

        <div className="mode-selector">
          <button 
            className={`btn ${mode === 'encode' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleModeChange('encode')}
          >
            Encode
          </button>
          <button 
            className={`btn ${mode === 'decode' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleModeChange('decode')}
          >
            Decode
          </button>
        </div>

        <div className="main-content">
          <div className="input-section">
            <h2 className="section-title">
              {mode === 'encode' ? 'Text/File to Encode' : 'Base64 to Decode'}
            </h2>
            
            <textarea
              className="textarea"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === 'encode' 
                  ? 'Enter text to encode or select a file below...' 
                  : 'Paste Base64 encoded text here...'
              }
              spellCheck={false}
            />

            <div className="file-input-section">
              <label htmlFor="file-input" className="file-label">
                {mode === 'encode' ? 'Or select a file to encode:' : 'Or select a Base64 file to decode:'}
              </label>
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                className="file-input"
              />
              {selectedFile && (
                <div className="file-info">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <div className="controls">
              <button className="btn btn-primary" onClick={handleProcess}>
                {mode === 'encode' ? 'Encode' : 'Decode'}
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
          </div>

          <div className="output-section">
            <h2 className="section-title">
              {mode === 'encode' ? 'Base64 Encoded Output' : 'Decoded Output'}
            </h2>
            
            <textarea
              className="textarea"
              value={outputText}
              readOnly
              placeholder={
                mode === 'encode' 
                  ? 'Base64 encoded result will appear here...' 
                  : 'Decoded text will appear here...'
              }
              spellCheck={false}
            />
            
            <div className="controls">
              <button 
                className="btn btn-success"
                onClick={() => copyToClipboard(outputText)}
                disabled={!outputText}
              >
                Copy to Clipboard
              </button>
              <button 
                className="btn btn-info"
                onClick={downloadAsFile}
                disabled={!outputText}
              >
                Download as File
              </button>
            </div>

            {outputText && (
              <div className="stats">
                <span>Length: {outputText.length} characters</span>
                <span>Size: {new Blob([outputText]).size} bytes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;