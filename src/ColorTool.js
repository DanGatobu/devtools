import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function ColorTool({ onNavigate }) {
  const [inputColor, setInputColor] = useState('#ff0000');
  const [hexColor, setHexColor] = useState('#ff0000');
  const [rgbColor, setRgbColor] = useState('rgb(255, 0, 0)');
  const [hslColor, setHslColor] = useState('hsl(0, 100%, 50%)');
  const [rgbValues, setRgbValues] = useState({ r: 255, g: 0, b: 0 });
  const [hslValues, setHslValues] = useState({ h: 0, s: 100, l: 50 });
  const [inputMode, setInputMode] = useState('hex'); // 'hex', 'rgb', 'hsl', 'picker'
  const [error, setError] = useState('');

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Update all color formats based on RGB values
  const updateAllFormats = useCallback((rgb) => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    setRgbValues(rgb);
    setHexColor(hex);
    setRgbColor(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    setHslColor(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    setHslValues(hsl);
    setInputColor(hex);
    setError('');
  }, []);

  // Handle hex input
  const handleHexInput = (value) => {
    const hex = value.startsWith('#') ? value : '#' + value;
    const rgb = hexToRgb(hex);
    
    if (rgb && /^#[0-9A-F]{6}$/i.test(hex)) {
      updateAllFormats(rgb);
    } else {
      setError('Invalid hex color format');
    }
  };

  // Handle RGB input
  const handleRgbInput = (r, g, b) => {
    const rgb = { r: parseInt(r) || 0, g: parseInt(g) || 0, b: parseInt(b) || 0 };
    
    if (rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255) {
      updateAllFormats(rgb);
    } else {
      setError('RGB values must be between 0 and 255');
    }
  };

  // Handle HSL input
  const handleHslInput = (h, s, l) => {
    const hsl = { h: parseInt(h) || 0, s: parseInt(s) || 0, l: parseInt(l) || 0 };
    
    if (hsl.h >= 0 && hsl.h <= 360 && hsl.s >= 0 && hsl.s <= 100 && hsl.l >= 0 && hsl.l <= 100) {
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      updateAllFormats(rgb);
    } else {
      setError('HSL values must be: H(0-360), S(0-100%), L(0-100%)');
    }
  };

  // Handle color picker change
  const handlePickerChange = (e) => {
    const hex = e.target.value;
    const rgb = hexToRgb(hex);
    if (rgb) {
      updateAllFormats(rgb);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const loadRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    updateAllFormats({ r, g, b });
  };

  const loadPresetColor = (preset) => {
    const presets = {
      red: { r: 255, g: 0, b: 0 },
      green: { r: 0, g: 255, b: 0 },
      blue: { r: 0, g: 0, b: 255 },
      yellow: { r: 255, g: 255, b: 0 },
      cyan: { r: 0, g: 255, b: 255 },
      magenta: { r: 255, g: 0, b: 255 },
      white: { r: 255, g: 255, b: 255 },
      black: { r: 0, g: 0, b: 0 }
    };
    updateAllFormats(presets[preset]);
  };

  // Initialize with red color
  useEffect(() => {
    updateAllFormats({ r: 255, g: 0, b: 0 });
  }, [updateAllFormats]);

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
          <button className="nav-btn active">
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
          <h1>Color Picker & Converter</h1>
          <p>Convert between Hex, RGB, and HSL color formats</p>
        </div>

        <div className="main-content">
          <div className="input-section">
            <h2 className="section-title">Color Input</h2>
            
            {/* Color Picker */}
            <div className="color-picker-section">
              <label htmlFor="color-picker">Visual Color Picker:</label>
              <div className="color-picker-container">
                <input
                  id="color-picker"
                  type="color"
                  value={inputColor}
                  onChange={handlePickerChange}
                  className="color-picker"
                />
                <div 
                  className="color-preview"
                  style={{ backgroundColor: inputColor }}
                ></div>
              </div>
            </div>

            {/* Input Mode Selector */}
            <div className="input-mode-selector">
              <button 
                className={`btn ${inputMode === 'hex' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setInputMode('hex')}
              >
                Hex Input
              </button>
              <button 
                className={`btn ${inputMode === 'rgb' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setInputMode('rgb')}
              >
                RGB Input
              </button>
              <button 
                className={`btn ${inputMode === 'hsl' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setInputMode('hsl')}
              >
                HSL Input
              </button>
            </div>

            {/* Input Fields */}
            {inputMode === 'hex' && (
              <div className="input-group">
                <label>Hex Color:</label>
                <input
                  type="text"
                  value={hexColor}
                  onChange={(e) => handleHexInput(e.target.value)}
                  placeholder="#ff0000"
                  className="color-input"
                />
              </div>
            )}

            {inputMode === 'rgb' && (
              <div className="rgb-inputs">
                <div className="input-group">
                  <label>R:</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.r}
                    onChange={(e) => handleRgbInput(e.target.value, rgbValues.g, rgbValues.b)}
                    className="color-input"
                  />
                </div>
                <div className="input-group">
                  <label>G:</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.g}
                    onChange={(e) => handleRgbInput(rgbValues.r, e.target.value, rgbValues.b)}
                    className="color-input"
                  />
                </div>
                <div className="input-group">
                  <label>B:</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.b}
                    onChange={(e) => handleRgbInput(rgbValues.r, rgbValues.g, e.target.value)}
                    className="color-input"
                  />
                </div>
              </div>
            )}

            {inputMode === 'hsl' && (
              <div className="hsl-inputs">
                <div className="input-group">
                  <label>H:</label>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={hslValues.h}
                    onChange={(e) => handleHslInput(e.target.value, hslValues.s, hslValues.l)}
                    className="color-input"
                  />
                </div>
                <div className="input-group">
                  <label>S:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hslValues.s}
                    onChange={(e) => handleHslInput(hslValues.h, e.target.value, hslValues.l)}
                    className="color-input"
                  />
                </div>
                <div className="input-group">
                  <label>L:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hslValues.l}
                    onChange={(e) => handleHslInput(hslValues.h, hslValues.s, e.target.value)}
                    className="color-input"
                  />
                </div>
              </div>
            )}

            <div className="controls">
              <button className="btn btn-primary" onClick={loadRandomColor}>
                Random Color
              </button>
              <div className="preset-colors">
                {['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white', 'black'].map(color => (
                  <button
                    key={color}
                    className="btn btn-secondary preset-btn"
                    onClick={() => loadPresetColor(color)}
                    title={color}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="status error">
                {error}
              </div>
            )}
          </div>

          <div className="output-section">
            <h2 className="section-title">Color Formats</h2>
            
            <div className="color-output">
              <div className="color-format">
                <label>Hex:</label>
                <div className="output-row">
                  <input
                    type="text"
                    value={hexColor}
                    readOnly
                    className="color-output-field"
                  />
                  <button 
                    className="btn btn-success copy-btn"
                    onClick={() => copyToClipboard(hexColor)}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="color-format">
                <label>RGB:</label>
                <div className="output-row">
                  <input
                    type="text"
                    value={rgbColor}
                    readOnly
                    className="color-output-field"
                  />
                  <button 
                    className="btn btn-success copy-btn"
                    onClick={() => copyToClipboard(rgbColor)}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="color-format">
                <label>HSL:</label>
                <div className="output-row">
                  <input
                    type="text"
                    value={hslColor}
                    readOnly
                    className="color-output-field"
                  />
                  <button 
                    className="btn btn-success copy-btn"
                    onClick={() => copyToClipboard(hslColor)}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="color-info">
              <h3>Color Information</h3>
              <div className="color-details">
                <div>RGB Values: R({rgbValues.r}) G({rgbValues.g}) B({rgbValues.b})</div>
                <div>HSL Values: H({hslValues.h}°) S({hslValues.s}%) L({hslValues.l}%)</div>
                <div>Hex Code: {hexColor.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorTool;