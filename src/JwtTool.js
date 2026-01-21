import React, { useState } from 'react';

const JwtTool = ({ onNavigate }) => {
  const [inputToken, setInputToken] = useState('');
  const [decodedHeader, setDecodedHeader] = useState('');
  const [decodedPayload, setDecodedPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  const decodeJWT = (token) => {
    try {
      setError('');
      
      if (!token.trim()) {
        clearOutput();
        return;
      }

      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.');
      }

      // Decode header
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      setDecodedHeader(JSON.stringify(header, null, 2));

      // Decode payload
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setDecodedPayload(JSON.stringify(payload, null, 2));

      // Set signature (base64url encoded)
      setSignature(parts[2]);

      // Extract token information
      const now = Math.floor(Date.now() / 1000);
      const info = {
        algorithm: header.alg || 'Unknown',
        type: header.typ || 'Unknown',
        issued: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'Not specified',
        expires: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Not specified',
        notBefore: payload.nbf ? new Date(payload.nbf * 1000).toLocaleString() : 'Not specified',
        issuer: payload.iss || 'Not specified',
        audience: payload.aud || 'Not specified',
        subject: payload.sub || 'Not specified',
        isExpired: payload.exp ? payload.exp < now : false,
        isNotYetValid: payload.nbf ? payload.nbf > now : false,
        timeToExpiry: payload.exp ? payload.exp - now : null
      };

      setTokenInfo(info);
      setIsValid(true);

    } catch (err) {
      setError(err.message);
      setIsValid(false);
      clearOutput();
    }
  };

  const clearOutput = () => {
    setDecodedHeader('');
    setDecodedPayload('');
    setSignature('');
    setTokenInfo(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputToken(value);
    decodeJWT(value);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearAll = () => {
    setInputToken('');
    clearOutput();
    setIsValid(null);
    setError('');
  };

  const loadSample = () => {
    // Sample JWT token (this is a demo token, not a real one)
    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzI4MjM0MjIsImF1ZCI6ImV4YW1wbGUuY29tIiwiaXNzIjoiZXhhbXBsZS1pc3N1ZXIifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setInputToken(sampleToken);
    decodeJWT(sampleToken);
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return 'Expired';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusMessage = () => {
    if (isValid === null) return null;
    if (isValid) {
      if (tokenInfo?.isExpired) {
        return { type: 'error', message: '⚠️ Token is expired' };
      }
      if (tokenInfo?.isNotYetValid) {
        return { type: 'error', message: '⚠️ Token is not yet valid' };
      }
      return { type: 'success', message: '✓ Valid JWT format' };
    }
    return { type: 'error', message: error };
  };

  const status = getStatusMessage();

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
          <button className="nav-btn active">
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
          <h1>JWT Decoder/Debugger</h1>
          <p>Decode and analyze JSON Web Tokens (JWT)</p>
        </div>

        <div className="main-content">
          <div className="input-section">
            <h2 className="section-title">JWT Token</h2>
            
            <textarea
              className={`textarea ${isValid === true ? 'success' : isValid === false ? 'error' : ''}`}
              value={inputToken}
              onChange={handleInputChange}
              placeholder="Paste your JWT token here..."
              spellCheck={false}
              rows={4}
            />

            <div className="controls">
              <button className="btn btn-primary" onClick={loadSample}>
                Load Sample JWT
              </button>
              <button className="btn btn-secondary" onClick={clearAll}>
                Clear All
              </button>
            </div>

            {status && (
              <div className={`status ${status.type}`}>
                {status.message}
              </div>
            )}

            {tokenInfo && (
              <div className="token-info">
                <h3>Token Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Algorithm:</strong> {tokenInfo.algorithm}
                  </div>
                  <div className="info-item">
                    <strong>Type:</strong> {tokenInfo.type}
                  </div>
                  <div className="info-item">
                    <strong>Issuer:</strong> {tokenInfo.issuer}
                  </div>
                  <div className="info-item">
                    <strong>Audience:</strong> {tokenInfo.audience}
                  </div>
                  <div className="info-item">
                    <strong>Subject:</strong> {tokenInfo.subject}
                  </div>
                  <div className="info-item">
                    <strong>Issued At:</strong> {tokenInfo.issued}
                  </div>
                  <div className="info-item">
                    <strong>Expires At:</strong> {tokenInfo.expires}
                  </div>
                  {tokenInfo.timeToExpiry !== null && (
                    <div className="info-item">
                      <strong>Time to Expiry:</strong> 
                      <span className={tokenInfo.isExpired ? 'expired' : 'valid'}>
                        {formatTimeRemaining(tokenInfo.timeToExpiry)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="output-section">
            <div className="jwt-parts">
              <div className="jwt-part">
                <h3 className="section-title">Header</h3>
                <textarea
                  className="textarea"
                  value={decodedHeader}
                  readOnly
                  placeholder="Decoded header will appear here..."
                  spellCheck={false}
                  rows={6}
                />
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => copyToClipboard(decodedHeader)}
                  disabled={!decodedHeader}
                >
                  Copy Header
                </button>
              </div>

              <div className="jwt-part">
                <h3 className="section-title">Payload</h3>
                <textarea
                  className="textarea"
                  value={decodedPayload}
                  readOnly
                  placeholder="Decoded payload will appear here..."
                  spellCheck={false}
                  rows={6}
                />
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => copyToClipboard(decodedPayload)}
                  disabled={!decodedPayload}
                >
                  Copy Payload
                </button>
              </div>

              <div className="jwt-part">
                <h3 className="section-title">Signature</h3>
                <textarea
                  className="textarea"
                  value={signature}
                  readOnly
                  placeholder="Signature will appear here..."
                  spellCheck={false}
                  rows={3}
                />
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => copyToClipboard(signature)}
                  disabled={!signature}
                >
                  Copy Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtTool;