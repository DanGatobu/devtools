import React, { useState, useEffect } from 'react';

const CodeDiffTool = ({ onNavigate }) => {
  const [originalCode, setOriginalCode] = useState('');
  const [modifiedCode, setModifiedCode] = useState('');
  const [diffResult, setDiffResult] = useState(null);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' or 'unified'
  const [language, setLanguage] = useState('javascript');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [contextLines, setContextLines] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supportedLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'text', label: 'Plain Text' }
  ];

  const generateDiff = async () => {
    if (!originalCode.trim() && !modifiedCode.trim()) {
      setDiffResult(null);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8010/diff/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original: originalCode,
          modified: modifiedCode,
          language: language,
          ignore_whitespace: ignoreWhitespace,
          context_lines: contextLines
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setDiffResult(data);
        setError('');
      } else {
        setError(data.error || 'Failed to generate diff');
        setDiffResult(null);
      }
    } catch (err) {
      setError('Failed to connect to the API server');
      setDiffResult(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateDiff();
    }, 500);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalCode, modifiedCode, language, ignoreWhitespace, contextLines]);

  const loadSampleCode = () => {
    const samples = {
      javascript: {
        original: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const user = {
  name: "John",
  age: 30
};`,
        modified: `function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

const user = {
  name: "John Doe",
  age: 30,
  email: "john@example.com"
};

function formatUser(user) {
  return \`\${user.name} (\${user.email})\`;
}`
      },
      python: {
        original: `def calculate_total(items):
    total = 0
    for item in items:
        total += item['price']
    return total

user = {
    'name': 'John',
    'age': 30
}`,
        modified: `def calculate_total(items):
    return sum(item['price'] for item in items)

user = {
    'name': 'John Doe',
    'age': 30,
    'email': 'john@example.com'
}

def format_user(user):
    return f"{user['name']} ({user['email']})"`
      }
    };

    const sample = samples[language] || samples.javascript;
    setOriginalCode(sample.original);
    setModifiedCode(sample.modified);
  };

  const clearAll = () => {
    setOriginalCode('');
    setModifiedCode('');
    setDiffResult(null);
    setError('');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderUnifiedDiff = () => {
    if (!diffResult || !diffResult.unified_diff) return null;

    return (
      <div className="unified-diff">
        <pre className="diff-content">
          {diffResult.unified_diff.split('\n').map((line, index) => {
            let className = 'diff-line';
            if (line.startsWith('+')) className += ' diff-added';
            else if (line.startsWith('-')) className += ' diff-removed';
            else if (line.startsWith('@@')) className += ' diff-hunk';

            return (
              <div key={index} className={className}>
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    );
  };

  const renderSideBySideDiff = () => {
    if (!diffResult || !diffResult.side_by_side) return null;

    const { left_lines, right_lines } = diffResult.side_by_side;
    const maxLines = Math.max(left_lines.length, right_lines.length);

    return (
      <div className="side-by-side-diff">
        <div className="diff-pane">
          <h4>Original</h4>
          <div className="diff-content">
            {Array.from({ length: maxLines }, (_, index) => {
              const line = left_lines[index];
              if (!line) return <div key={index} className="diff-line diff-empty"></div>;
              
              let className = 'diff-line';
              if (line.type === 'removed') className += ' diff-removed';
              else if (line.type === 'context') className += ' diff-context';

              return (
                <div key={index} className={className}>
                  <span className="line-number">{line.line_number || ''}</span>
                  <span className="line-content">{line.content}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="diff-pane">
          <h4>Modified</h4>
          <div className="diff-content">
            {Array.from({ length: maxLines }, (_, index) => {
              const line = right_lines[index];
              if (!line) return <div key={index} className="diff-line diff-empty"></div>;
              
              let className = 'diff-line';
              if (line.type === 'added') className += ' diff-added';
              else if (line.type === 'context') className += ' diff-context';

              return (
                <div key={index} className={className}>
                  <span className="line-number">{line.line_number || ''}</span>
                  <span className="line-content">{line.content}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
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
          <button className="nav-btn active">
            Code Diff
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="header">
          <h1>Code Diff Tool</h1>
          <p>Compare code changes and visualize differences between versions</p>
        </div>

        {/* Controls */}
        <div className="diff-controls">
          <div className="control-group">
            <label htmlFor="language">Language:</label>
            <select 
              id="language" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              {supportedLanguages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="view-mode">View Mode:</label>
            <select 
              id="view-mode" 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="side-by-side">Side by Side</option>
              <option value="unified">Unified</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="context-lines">Context Lines:</label>
            <input
              id="context-lines"
              type="number"
              min="0"
              max="10"
              value={contextLines}
              onChange={(e) => setContextLines(parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              />
              Ignore Whitespace
            </label>
          </div>

          <div className="control-buttons">
            <button className="btn btn-primary" onClick={loadSampleCode}>
              Load Sample
            </button>
            <button className="btn btn-secondary" onClick={clearAll}>
              Clear All
            </button>
          </div>
        </div>

        {error && (
          <div className="status error">
            {error}
          </div>
        )}

        <div className="main-content">
          <div className="input-section">
            <div className="code-input-group">
              <div className="code-input">
                <h3>Original Code</h3>
                <textarea
                  className="textarea code-textarea"
                  value={originalCode}
                  onChange={(e) => setOriginalCode(e.target.value)}
                  placeholder="Paste your original code here..."
                  spellCheck={false}
                />
              </div>
              
              <div className="code-input">
                <h3>Modified Code</h3>
                <textarea
                  className="textarea code-textarea"
                  value={modifiedCode}
                  onChange={(e) => setModifiedCode(e.target.value)}
                  placeholder="Paste your modified code here..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          <div className="output-section">
            <div className="diff-header">
              <h3>Diff Result</h3>
              {loading && <span className="loading">Generating diff...</span>}
              {diffResult && (
                <div className="diff-stats">
                  <span className="stat">
                    <span className="stat-label">Added:</span>
                    <span className="stat-value added">+{diffResult.stats?.additions || 0}</span>
                  </span>
                  <span className="stat">
                    <span className="stat-label">Removed:</span>
                    <span className="stat-value removed">-{diffResult.stats?.deletions || 0}</span>
                  </span>
                  <span className="stat">
                    <span className="stat-label">Modified:</span>
                    <span className="stat-value">{diffResult.stats?.modifications || 0}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="diff-output">
              {!diffResult && !loading && (
                <div className="no-diff">
                  Enter code in both panels to see the diff
                </div>
              )}
              
              {diffResult && (
                <>
                  {viewMode === 'unified' ? renderUnifiedDiff() : renderSideBySideDiff()}
                  
                  <div className="controls">
                    <button 
                      className="btn btn-success"
                      onClick={() => copyToClipboard(diffResult.unified_diff || '')}
                      disabled={!diffResult.unified_diff}
                    >
                      Copy Diff
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDiffTool;