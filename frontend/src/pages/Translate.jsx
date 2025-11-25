import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InteractiveWaveBackground from "../components/InteractiveWaveBackground.jsx";
import { translateText, detectLanguage } from "../services/api.js";

const languages = [
  { id: "auto", label: "🔍 Auto Detect", flag: "🌐" },
  { id: "desia", label: "Desia", flag: "🏛️" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "odia", label: "Odia", flag: "🇮🇳" },
];

export default function Translate() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("desia");
  const [toLang, setToLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLang, setDetectedLang] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setCharCount(sourceText.length);
  }, [sourceText]);

  // Auto-translate on text change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText.trim() && sourceText.length > 2) {
        handleTranslate();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [sourceText, fromLang, toLang]);

  const handleSwap = () => {
    if (fromLang === "auto" || isTranslating) return;
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setDetectedLang(null);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedText("");
      setError(null);
      return;
    }
    
    setIsTranslating(true);
    setError(null);
    
    try {
      let sourceLang = fromLang;
      
      // Auto-detect language if needed
      if (fromLang === "auto") {
        const detectionResult = await detectLanguage(sourceText);
        sourceLang = detectionResult.detected_language || "desia";
        setDetectedLang(sourceLang);
      }
      
      // Call translation API
      const result = await translateText(sourceText, sourceLang, toLang);
      setTranslatedText(result.translated_text || result.translation);
    } catch (err) {
      console.error("Translation failed:", err);
      setError("Translation service unavailable. Please check if backend is running.");
      setTranslatedText("");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClear = () => {
    setSourceText("");
    setTranslatedText("");
    setDetectedLang(null);
    setError(null);
    setCopySuccess(false);
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getLangLabel = (langId) => {
    return languages.find(l => l.id === langId)?.label || langId;
  };

  const getLangFlag = (langId) => {
    return languages.find(l => l.id === langId)?.flag || "🌐";
  };

  return (
    <div className="translate-page">
      <div className="translate-bg" aria-hidden="true">
        <InteractiveWaveBackground
          strokeColor="rgba(255,255,255,0.5)"
          waveSpeed={0.7}
          waveAmplitude={0.85}
          mouseInfluence={0.65}
          lineSpacing={0.3}
          seed={0.55}
          resolution={0.45}
        />
      </div>

      <div className="translate-shell">
        <header className="landing-nav translate-nav">
          <span className="brand">🏛️ Desia Translator</span>
          <div className="nav-actions">
            <Link className="ghost-btn" to="/">
              ← Home
            </Link>
            <button className="outline-btn" onClick={handleClear}>
              🗑️ Clear
            </button>
          </div>
        </header>

        <div className="translate-container">
          {/* Language Selector Bar */}
          <div className="language-bar">
            <div className="language-selector">
              <label>From</label>
              <select 
                value={fromLang} 
                onChange={(e) => setFromLang(e.target.value)}
                className="lang-select"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
              {detectedLang && fromLang === "auto" && (
                <span className="detected-badge">
                  Detected: {getLangLabel(detectedLang)}
                </span>
              )}
            </div>

            <button 
              className="swap-button" 
              onClick={handleSwap} 
              disabled={fromLang === "auto" || isTranslating}
              title="Swap languages"
            >
              ⇄
            </button>

            <div className="language-selector">
              <label>To</label>
              <select 
                value={toLang} 
                onChange={(e) => setToLang(e.target.value)}
                className="lang-select"
              >
                {languages
                  .filter((lang) => lang.id !== "auto")
                  .map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Translation Panels */}
          <div className="translation-workspace">
            {/* Source Panel */}
            <div className="text-panel source-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="lang-flag">{getLangFlag(fromLang)}</span>
                  <span>{getLangLabel(fromLang)}</span>
                </div>
                <div className="char-counter">
                  {charCount} / 5000
                </div>
              </div>
              
              <textarea
                className="text-input"
                placeholder="Type or paste your text here to translate..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value.slice(0, 5000))}
                rows={12}
              />

              <div className="panel-footer">
                <button 
                  className="action-btn secondary"
                  onClick={handleClear}
                  disabled={!sourceText}
                >
                  Clear
                </button>
                <button 
                  className="action-btn primary"
                  onClick={handleTranslate}
                  disabled={!sourceText.trim() || isTranslating}
                >
                  {isTranslating ? (
                    <>
                      <span className="spinner"></span>
                      Translating...
                    </>
                  ) : (
                    <>⚡ Translate</>
                  )}
                </button>
              </div>
            </div>

            {/* Translation Status */}
            <div className="translation-status">
              {isTranslating && (
                <div className="status-indicator translating">
                  <span className="pulse-dot"></span>
                  Processing...
                </div>
              )}
              {error && (
                <div className="status-indicator error">
                  ⚠️ {error}
                </div>
              )}
              {translatedText && !isTranslating && !error && (
                <div className="status-indicator success">
                  ✓ Translation complete
                </div>
              )}
            </div>

            {/* Target Panel */}
            <div className="text-panel target-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="lang-flag">{getLangFlag(toLang)}</span>
                  <span>{getLangLabel(toLang)}</span>
                </div>
                {translatedText && (
                  <button 
                    className="copy-btn"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    {copySuccess ? "✓ Copied!" : "📋 Copy"}
                  </button>
                )}
              </div>
              
              <textarea
                className="text-input"
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
                rows={12}
              />

              <div className="panel-footer">
                <div className="translation-info">
                  {translatedText && (
                    <span className="word-count">
                      {translatedText.split(/\s+/).filter(w => w).length} words
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🚀</div>
              <div className="info-content">
                <h4>Real-time Translation</h4>
                <p>Automatic translation as you type with AI-powered accuracy</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🛡️</div>
              <div className="info-content">
                <h4>Preserve Heritage</h4>
                <p>Supporting endangered Desia tribal language preservation</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <div className="info-content">
                <h4>Zero-Shot Model</h4>
                <p>Diffusion-based approach for semantic accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

