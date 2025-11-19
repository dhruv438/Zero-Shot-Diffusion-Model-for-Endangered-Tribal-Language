import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InteractiveWaveBackground from "../components/InteractiveWaveBackground.jsx";
import TranslatorPanel from "../components/TranslatorPanel.jsx";
import FlipTransition from "../components/FlipTransition.jsx";
import { translateText, detectLanguage } from "../services/api.js";

const languages = [
  { id: "auto", label: "Detect Language" },
  { id: "desia", label: "Desia" },
  { id: "en", label: "English" },
  { id: "odia", label: "Odia" },
];

export default function Translate() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("desia");
  const [toLang, setToLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showFlip, setShowFlip] = useState(true);
  const [flipComplete, setFlipComplete] = useState(false);

  const headerCopy = useMemo(
    () => ({
      eyebrow: "Zero-Shot Translation Model",
      title: "Preserve Tribal Heritage Through AI",
      subtitle:
        "Experience our diffusion-based translation model for Desia, an endangered tribal language from Koraput. Translate between Desia, English, and Odia with semantic accuracy.",
    }),
    []
  );

  const handleSwap = () => {
    if (fromLang === "auto") return;
    setFromLang(toLang);
    setToLang(fromLang);
    setTranslatedText("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipComplete(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedText("");
      return;
    }
    
    setIsTranslating(true);
    
    try {
      // Auto-detect language if needed
      let sourceLang = fromLang;
      if (fromLang === "auto") {
        const detectionResult = await detectLanguage(sourceText);
        sourceLang = detectionResult.detected_language || "desia";
      }
      
      // Call translation API
      const result = await translateText(sourceText, sourceLang, toLang);
      
      setTranslatedText(result.translated_text || result.translation);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText(
        `⚠️ Translation Error\n\nCould not connect to translation service. Please check:\n• Backend server is running\n• API endpoint is correct\n• Network connection is stable\n\nError: ${error.message}`
      );
    } finally {
      setIsTranslating(false);
    }
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
          <span className="brand">Desia Translator</span>
          <div className="nav-actions">
            <Link className="ghost-btn" to="/">
              ← Back to home
            </Link>
            <button className="outline-btn">Need help?</button>
          </div>
        </header>

        {showFlip && !flipComplete ? (
          <FlipTransition onComplete={() => setFlipComplete(true)}>
            <section className="translate-grid">
              <div className="hero-copy translate-copy">
                <p className="eyebrow">{headerCopy.eyebrow}</p>
                <h1>{headerCopy.title}</h1>
                <p className="lede">{headerCopy.subtitle}</p>
                <div className="hero-cta">
                  <button className="cta" onClick={handleTranslate} disabled={isTranslating}>
                    {isTranslating ? "Translating…" : "Start translating"}
                  </button>
                  <button className="link-btn" onClick={() => setSourceText("")}>
                    Reset form
                  </button>
                </div>
                <div className="stat-badges">
                  <span>Zero-shot model</span>
                  <span>Diffusion-based</span>
                  <span>Free & Open-source</span>
                </div>
              </div>

              <section className="translate-panel" aria-live="polite">
                <div className="translator-heading">
                  <div>
                    <p className="eyebrow">Translation Interface</p>
                    <h2>Enter your text</h2>
                  </div>
                  <button className="swap" onClick={handleSwap} disabled={fromLang === "auto"}>
                    Swap
                  </button>
                </div>

                <TranslatorPanel
                  languages={languages}
                  fromLang={fromLang}
                  toLang={toLang}
                  onChangeFrom={setFromLang}
                  onChangeTo={setToLang}
                  sourceText={sourceText}
                  onChangeSource={setSourceText}
                  translatedText={translatedText}
                  isTranslating={isTranslating}
                  onTranslate={handleTranslate}
                />
              </section>
            </section>
          </FlipTransition>
        ) : (
          <section className="translate-grid">
            <div className="hero-copy translate-copy">
              <p className="eyebrow">{headerCopy.eyebrow}</p>
              <h1>{headerCopy.title}</h1>
              <p className="lede">{headerCopy.subtitle}</p>
              <div className="hero-cta">
                <button className="cta" onClick={handleTranslate} disabled={isTranslating}>
                  {isTranslating ? "Translating…" : "Start translating"}
                </button>
                <button className="link-btn" onClick={() => setSourceText("")}>
                  Reset form
                </button>
              </div>
              <div className="stat-badges">
                <span>Real-time context</span>
                <span>Team-ready outputs</span>
                <span>No credit card</span>
              </div>
            </div>

            <section className="translate-panel" aria-live="polite">
              <div className="translator-heading">
                <div>
                  <p className="eyebrow">Control room</p>
                  <h2>Refine the output</h2>
                </div>
                <button className="swap" onClick={handleSwap} disabled={fromLang === "auto"}>
                  Swap
                </button>
              </div>

              <TranslatorPanel
                languages={languages}
                fromLang={fromLang}
                toLang={toLang}
                onChangeFrom={setFromLang}
                onChangeTo={setToLang}
                sourceText={sourceText}
                onChangeSource={setSourceText}
                translatedText={translatedText}
                isTranslating={isTranslating}
                onTranslate={handleTranslate}
              />
            </section>
          </section>
        )}
      </div>
    </div>
  );
}

