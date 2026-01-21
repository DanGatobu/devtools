import React, { useState, useEffect } from 'react';

const RegexTool = ({ onNavigate }) => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [replacedText, setReplacedText] = useState('');
  const [activeTab, setActiveTab] = useState('test'); // 'test' or 'replace'

  // Common regex patterns for quick selection
  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
    { name: 'Phone (US)', pattern: '\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})', flags: 'g' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: 'g' },
    { name: 'IPv4 Address', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b', flags: 'g' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12][0-9]|3[01])\\/(19|20)\\d\\d\\b', flags: 'g' },
    { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})', flags: 'g' },
    { name: 'Credit Card', pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b', flags: 'g' },
    { name: 'HTML Tags', pattern: '<[^>]*>', flags: 'g' }
  ];

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setIsValid(null);
      setError('');
      setReplacedText('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      setIsValid(true);
      setError('');

      if (!testString) {
        setMatches([]);
        setReplacedText('');
        return;
      }

      // Find all matches
      const foundMatches = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
          
          // Prevent infinite loop on zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
        }
      }

      setMatches(foundMatches);

      // Handle replacement if in replace mode
      if (activeTab === 'replace' && replaceText !== '') {
        const replaced = testString.replace(regex, replaceText);
        setReplacedText(replaced);
      }

    } catch (err) {
      setIsValid(false);
      setError(err.message);
      setMatches([]);
      setReplacedText('');
    }
  };

  useEffect(() => {
    testRegex();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, flags, testString, replaceText, activeTab]);

  const loadPattern = (patternObj) => {
    setPattern(patternObj.pattern);
    setFlags(patternObj.flags);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearAll = () => {
    setPattern('');
    setFlags('g');
    setTestString('');
    setReplaceText('');
    setMatches([]);
    setReplacedText('');
    setIsValid(null);
    setError('');
  };

  const loadSampleText = () => {
    const sampleText = `Contact us at support@example.com or sales@company.org
Call us at (555) 123-4567 or 555.987.6543
Visit our website: https://www.example.com
Our office IP: 192.168.1.100
Meeting date: 12/25/2023
Color codes: #FF5733, #33FF57, #3357FF
Card number: 1234-5678-9012-3456`;
    setTestString(sampleText);
  };

  const highlightMatches = (text) => {
    if (!matches.length || !pattern) return text;

    let highlightedText = text;
    let offset = 0;

    matches.forEach((match, index) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const highlighted = `<mark class="regex-match" data-match="${index}">${match.match}</mark>`;
      
      highlightedText = 
        highlightedText.slice(0, start) + 
        highlighted + 
        highlightedText.slice(end);
      
      offset += highlighted.length - match.match.length;
    });

    return highlightedText;
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
          <button className="nav-btn active">
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
          <h1>Regular Expression Tester & Builder</h1>
          <p>Test, build, and debug regular expressions with real-time matching</p>
        </div>

        {/* Pattern Input Section */}
        <div className="regex-pattern-section">
          <h2 className="section-title">Regular Expression Pattern</h2>
          
          <div className="pattern-input-group">
            <span className="regex-delimiter">/</span>
            <input
              type="text"
              className={`pattern-input ${isValid === true ? 'success' : isValid === false ? 'error' : ''}`}
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter your regex pattern here..."
              spellCheck={false}
            />
            <span className="regex-delimiter">/</span>
            <input
              type="text"
              className="flags-input"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
              maxLength="6"
            />
          </div>

          <div className="flags-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={flags.includes('g')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(prev => prev.includes('g') ? prev : prev + 'g');
                  } else {
                    setFlags(prev => prev.replace('g', ''));
                  }
                }}
              />
              Global (g)
            </label>
            <label>
              <input
                type="checkbox"
                checked={flags.includes('i')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(prev => prev.includes('i') ? prev : prev + 'i');
                  } else {
                    setFlags(prev => prev.replace('i', ''));
                  }
                }}
              />
              Ignore Case (i)
            </label>
            <label>
              <input
                type="checkbox"
                checked={flags.includes('m')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(prev => prev.includes('m') ? prev : prev + 'm');
                  } else {
                    setFlags(prev => prev.replace('m', ''));
                  }
                }}
              />
              Multiline (m)
            </label>
          </div>

          {error && (
            <div className="status error">
              {error}
            </div>
          )}

          {isValid === true && (
            <div className="status success">
              ✓ Valid regular expression
            </div>
          )}
        </div>

        {/* Common Patterns */}
        <div className="common-patterns">
          <h3>Common Patterns</h3>
          <div className="pattern-buttons">
            {commonPatterns.map((patternObj, index) => (
              <button
                key={index}
                className="btn btn-secondary pattern-btn"
                onClick={() => loadPattern(patternObj)}
                title={patternObj.pattern}
              >
                {patternObj.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="mode-tabs">
          <button 
            className={`tab ${activeTab === 'test' ? 'active' : ''}`}
            onClick={() => setActiveTab('test')}
          >
            Test & Match
          </button>
          <button 
            className={`tab ${activeTab === 'replace' ? 'active' : ''}`}
            onClick={() => setActiveTab('replace')}
          >
            Find & Replace
          </button>
        </div>

        <div className="main-content">
          <div className="input-section">
            <h2 className="section-title">Test String</h2>
            
            <textarea
              className="textarea"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test your regex against..."
              spellCheck={false}
            />

            {activeTab === 'replace' && (
              <div className="replace-input">
                <label htmlFor="replace-text">Replace with:</label>
                <input
                  id="replace-text"
                  type="text"
                  className="replace-input-field"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replacement text (use $1, $2 for groups)"
                />
              </div>
            )}

            <div className="controls">
              <button className="btn btn-primary" onClick={loadSampleText}>
                Load Sample Text
              </button>
              <button className="btn btn-secondary" onClick={clearAll}>
                Clear All
              </button>
            </div>
          </div>

          <div className="output-section">
            <h2 className="section-title">
              {activeTab === 'test' ? 'Matches' : 'Replaced Text'}
            </h2>
            
            {activeTab === 'test' ? (
              <>
                <div className="matches-preview">
                  <div 
                    className="highlighted-text"
                    dangerouslySetInnerHTML={{ __html: highlightMatches(testString) }}
                  />
                </div>

                <div className="matches-list">
                  <h3>Match Details ({matches.length} matches)</h3>
                  {matches.length > 0 ? (
                    <div className="matches-container">
                      {matches.map((match, index) => (
                        <div key={index} className="match-item">
                          <div className="match-header">
                            <strong>Match {index + 1}:</strong> "{match.match}"
                            <span className="match-position">at position {match.index}</span>
                          </div>
                          {match.groups.length > 0 && (
                            <div className="match-groups">
                              <strong>Groups:</strong>
                              {match.groups.map((group, groupIndex) => (
                                <span key={groupIndex} className="group">
                                  ${groupIndex + 1}: "{group}"
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-matches">No matches found</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <textarea
                  className="textarea"
                  value={replacedText}
                  readOnly
                  placeholder="Replaced text will appear here..."
                  spellCheck={false}
                />
                
                <div className="controls">
                  <button 
                    className="btn btn-success"
                    onClick={() => copyToClipboard(replacedText)}
                    disabled={!replacedText}
                  >
                    Copy Result
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTool;