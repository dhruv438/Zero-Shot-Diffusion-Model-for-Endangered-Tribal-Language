import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InteractiveWaveBackground from "../components/InteractiveWaveBackground.jsx";
import { translateText, detectLanguage } from "../services/api.js";

const languages = [
  { id: "auto", label: "Auto Detect", flag: "" },
  { id: "desia", label: "Desia", flag: "" },
  { id: "en", label: "English", flag: "" },
  { id: "odia", label: "Odia", flag: "" },
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
  const [isTyping, setIsTyping] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [showQuickPhrases, setShowQuickPhrases] = useState(false);
  const [translationTime, setTranslationTime] = useState(0);

  const quickPhrases = [
    { desia: "ନମସ୍କାର", en: "Hello", emoji: "" },
    { desia: "ଧନ୍ୟବାଦ", en: "Thank you", emoji: "" },
    { desia: "ତୁଇ କେମିତି ଅଚେ ?", en: "How are you?", emoji: "" },
    { desia: "ମୋର ନା...", en: "My name is...", emoji: "" },
    { desia: "ତୁଇ ମଦତ୍‌ କରିପାରିବା କି?", en: "Can you help?", emoji: "" },
    { desia: "ବିଦାୟ", en: "Goodbye", emoji: "" },
  ];

  useEffect(() => {
    setCharCount(sourceText.length);
    setIsTyping(true);
    const typingTimer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(typingTimer);
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
    const startTime = Date.now();
    
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
      const translation = result.translated_text || result.translation;
      setTranslatedText(translation);
      
      // Calculate translation time
      const endTime = Date.now();
      const timeElapsed = ((endTime - startTime) / 1000).toFixed(2);
      setTranslationTime(timeElapsed);
      
      // Add to history
      setTranslationHistory(prev => [
        { source: sourceText, target: translation, from: sourceLang, to: toLang, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ]);
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
    setTranslationTime(0);
  };

  const handleQuickPhrase = (phrase) => {
    if (fromLang === "desia") {
      setSourceText(phrase.desia);
    } else if (fromLang === "en") {
      setSourceText(phrase.en);
    }
    setShowQuickPhrases(false);
  };

  const loadFromHistory = (item) => {
    setSourceText(item.source);
    setTranslatedText(item.target);
    setFromLang(item.from);
    setToLang(item.to);
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
      {/* Animated background with particles */}
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
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="translate-shell">
        {/* Enhanced navigation with better styling */}
        <header className="landing-nav translate-nav">
          <span className="brand">
            <span className="brand-icon"></span>
            <span className="brand-text">Desia Translator</span>
          </span>
          <div className="nav-actions">
            <Link className="ghost-btn nav-btn" to="/">
              <span className="btn-icon">←</span>
              <span className="btn-text">Home</span>
            </Link>
            <button className="outline-btn nav-btn" onClick={handleClear}>
              <span className="btn-text">Clear</span>
            </button>
          </div>
        </header>

        <div className="translate-container">
          {/* Quick Stats Bar */}
          <div className="quick-stats-bar fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="stat-item">
              <span className="stat-icon"></span>
              <div className="stat-content">
                <span className="stat-value">{translationHistory.length}</span>
                <span className="stat-label">Translations</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-icon"></span>
              <div className="stat-content">
                <span className="stat-value">{translationTime}s</span>
                <span className="stat-label">Last Speed</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-icon"></span>
              <div className="stat-content">
                <span className="stat-value">{charCount}</span>
                <span className="stat-label">Characters</span>
              </div>
            </div>
            <button 
              className="quick-phrases-btn"
              onClick={() => setShowQuickPhrases(!showQuickPhrases)}
            >
              <span className="btn-icon"></span>
              <span className="btn-text">Quick Phrases</span>
            </button>
          </div>

          {/* Quick Phrases Panel */}
          {showQuickPhrases && (
            <div className="quick-phrases-panel slide-down">
              <div className="phrases-header">
                <h3>Quick Phrases</h3>
                <button className="close-btn" onClick={() => setShowQuickPhrases(false)}>✕</button>
              </div>
              <div className="phrases-grid">
                {quickPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    className="phrase-card"
                    onClick={() => handleQuickPhrase(phrase)}
                  >
                    <span className="phrase-emoji">{phrase.emoji}</span>
                    <div className="phrase-content">
                      <span className="phrase-desia">{phrase.desia}</span>
                      <span className="phrase-translation">{phrase.en}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Combined Translation Card */}
          <div className="translation-workspace">
            <div className="unified-translation-card fade-in-up" style={{ animationDelay: '0.4s' }}>
              {/* Card Header with Language Selectors */}
              <div className="unified-card-header">
                <div className="language-selectors-inline">
                  <div className="language-selector-group">
                    <label className="selector-label">FROM</label>
                    <select 
                      value={fromLang} 
                      onChange={(e) => setFromLang(e.target.value)}
                      className="lang-select-inline"
                    >
                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    {detectedLang && fromLang === "auto" && (
                      <span className="detected-badge-small">
                        Detected: {getLangLabel(detectedLang)}
                      </span>
                    )}
                  </div>

                  <button 
                    className="swap-button-inline" 
                    onClick={handleSwap} 
                    disabled={fromLang === "auto" || isTranslating}
                    title="Swap languages"
                  >
                    <span className="swap-icon">↔</span>
                  </button>

                  <div className="language-selector-group">
                    <label className="selector-label">TO</label>
                    <select 
                      value={toLang} 
                      onChange={(e) => setToLang(e.target.value)}
                      className="lang-select-inline"
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

                <div className={`char-counter ${charCount > 4500 ? 'warning' : ''} ${charCount === 5000 ? 'danger' : ''}`}>
                  <span className="counter-icon"></span>
                  <span className="counter-text">{charCount} / 5000</span>
                </div>
              </div>

              {/* Text Areas Side by Side */}
              <div className="text-areas-container">
                <div className="text-area-wrapper source-area">
                  <div className="area-header">
                    <span className="lang-flag">{getLangFlag(fromLang)}</span>
                    <span className="lang-label">{getLangLabel(fromLang)}</span>
                    {isTyping && <span className="typing-indicator"></span>}
                  </div>
                  <textarea
                    className="text-input source-input"
                    placeholder="Type or paste your text here to translate..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value.slice(0, 5000))}
                    rows={12}
                    spellCheck="false"
                  />
                  {sourceText && (
                    <div className="area-footer">
                      <span className="word-count-badge fade-in">
                        {sourceText.split(/\s+/).filter(w => w).length} words
                      </span>
                    </div>
                  )}
                </div>

                <div className="divider-line"></div>

                <div className="text-area-wrapper target-area">
                  <div className="area-header">
                    <span className="lang-flag">{getLangFlag(toLang)}</span>
                    <span className="lang-label">{getLangLabel(toLang)}</span>
                    {translatedText && !isTranslating && (
                      <span className="success-badge fade-in">Ready</span>
                    )}
                  </div>
                  <textarea
                    className="text-input target-input"
                    placeholder="Translation will appear here..."
                    value={translatedText}
                    readOnly
                    rows={12}
                  />
                  {translatedText && (
                    <div className="area-footer">
                      <span className="word-count-badge fade-in">
                        <span className="badge-icon"></span>
                        {translatedText.split(/\s+/).filter(w => w).length} words
                      </span>
                      <span className="char-count-badge fade-in">
                        <span className="badge-icon"></span>
                        {translatedText.length} characters
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer with Actions */}
              <div className="unified-card-footer">
                <div className="footer-left">
                  <button 
                    className="action-btn secondary"
                    onClick={handleClear}
                    disabled={!sourceText}
                  >
                    <span className="btn-icon"></span>
                    Clear
                  </button>
                  {translatedText && (
                    <button 
                      className={`copy-btn ${copySuccess ? 'copied' : ''}`}
                      onClick={handleCopy}
                      title="Copy to clipboard"
                    >
                      <span className="btn-icon">{copySuccess ? "✓" : ""}</span>
                      <span className="btn-text">{copySuccess ? "Copied!" : "Copy"}</span>
                    </button>
                  )}
                </div>
                
                <div className="footer-center">
                  {isTranslating && (
                    <div className="status-indicator translating inline-status">
                      <span className="pulse-dot"></span>
                      <span className="status-text">Processing...</span>
                    </div>
                  )}
                  {translatedText && !isTranslating && !error && (
                    <div className="status-indicator success inline-status">
                      <span className="status-icon">✓</span>
                      <span className="status-text">Translation complete</span>
                    </div>
                  )}
                  {error && (
                    <div className="status-indicator error inline-status">
                      <span className="status-icon">!</span>
                      <span className="status-text">Error</span>
                    </div>
                  )}
                </div>

                <div className="footer-right">
                  <button 
                    className="action-btn primary glow-on-hover"
                    onClick={handleTranslate}
                    disabled={!sourceText.trim() || isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <span className="spinner"></span>
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
                        <span className="btn-icon"></span>
                        <span>Translate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Translation History Sidebar */}
          {translationHistory.length > 0 && (
            <div className="history-section fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="history-header">
                <h3>Recent Translations</h3>
                <button 
                  className="clear-history-btn"
                  onClick={() => setTranslationHistory([])}
                  title="Clear history"
                >
                  Clear
                </button>
              </div>
              <div className="history-list">
                {translationHistory.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="history-item"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="history-meta">
                      <span className="history-time">{item.time}</span>
                      <span className="history-langs">
                        {getLangFlag(item.from)} → {getLangFlag(item.to)}
                      </span>
                    </div>
                    <div className="history-text">
                      <p className="history-source">{item.source.substring(0, 50)}{item.source.length > 50 ? '...' : ''}</p>
                      <p className="history-target">{item.target.substring(0, 50)}{item.target.length > 50 ? '...' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

