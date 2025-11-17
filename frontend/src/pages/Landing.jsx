import { useNavigate } from "react-router-dom";
import InteractiveWaveBackground from "../components/InteractiveWaveBackground.jsx";
import RotatingWheel from "../components/RotatingWheel.jsx";
import CoverflowCarousel from "../components/CoverflowCarousel.jsx";

const problems = [
  {
    title: "No Parallel Datasets",
    body: "Desia exists only in oral tradition with virtually zero digitized parallel text data for training traditional translation models.",
  },
  {
    title: "Zero Digital Footprint",
    body: "Minimal online presence means standard web-scraping and corpus-building techniques fail completely for this endangered language.",
  },
  {
    title: "High Code-Mixing",
    body: "Speakers frequently blend Desia with Odia, Hindi, and regional dialects, creating complex linguistic boundaries.",
  },
  {
    title: "Linguistic Drift",
    body: "Vocabulary and pronunciation vary significantly across villages in Koraput, making standardization challenging.",
  },
  {
    title: "Morphological Richness",
    body: "Complex word formation and agglutination require sophisticated tokenization beyond standard approaches.",
  }
];

const solutionSteps = [
  {
    number: "01",
    title: "DiffuSeq-Based Text Generation",
    body: "Leveraging diffusion models for controllable, semantically-aware translation without parallel data requirements."
  },
  {
    number: "02",
    title: "SentencePiece Tokenization",
    body: "Custom tokenizer trained on limited Desia corpus to handle morphological complexity and subword segmentation."
  },
  {
    number: "03",
    title: "Cross-Lingual Transfer",
    body: "Using XLM-R embeddings to transfer knowledge from high-resource languages to zero-shot Desia translation."
  },
  {
    number: "04",
    title: "Self-Supervised Fine-Tuning",
    body: "Iterative refinement with minimal supervision, bootstrapping from monolingual Desia text and synthetic data."
  }
];

const features = [
  {
    title: "Bidirectional Translation",
    body: "Seamlessly translate between Desia ↔ English ↔ Odia with consistent semantic preservation across all directions.",
    badge: "Core"
  },
  {
    title: "Diffusion-Based Consistency",
    body: "Novel diffusion approach ensures semantic coherence and contextual accuracy even with limited training data.",
    badge: "Research"
  },
  {
    title: "Low-Resource Robustness",
    body: "Specifically engineered for endangered languages with minimal digital presence and limited parallel corpora.",
    badge: null
  },
  {
    title: "Dataset Builder Tool",
    body: "Contribute to Desia preservation by helping build the first-ever comprehensive digital Desia language dataset.",
    badge: "Community"
  },
  {
    title: "Model Playground",
    body: "Interactive demo environment to test translations, explore model behavior, and validate outputs in real-time.",
    badge: "New"
  },
  {
    title: "Linguistic Variant Support",
    body: "Handles regional dialects and code-mixing patterns common across Koraput's diverse village communities.",
    badge: null
  }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-bg" aria-hidden="true">
        <InteractiveWaveBackground
          strokeColor="rgba(255,255,255,0.45)"
          waveSpeed={0.65}
          waveAmplitude={0.8}
          mouseInfluence={0.6}
          lineSpacing={0.25}
          seed={0.35}
          resolution={0.4}
        />
      </div>
      <div className="landing-shell">
        <header className="landing-nav">
          <span className="brand">Desia Translator</span>
          <div className="nav-actions">
            <button className="ghost-btn" onClick={() => window.open('https://github.com', '_blank')}>
              View Research
            </button>
            <button className="outline-btn" onClick={() => navigate("/translate")}>
              Try Now
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="hero-stack">
          <div className="hero-copy">
            <p className="eyebrow">Preserving Tribal Heritage Through AI</p>
            <h1>
              Zero-Shot Translation for Endangered Tribal Languages
            </h1>
            <p className="lede">
              Bridging the digital divide for Desia, a low-resource tribal language from Koraput. 
              Our diffusion-based model enables accurate translation without parallel datasets, 
              preserving linguistic heritage for future generations.
            </p>
            <div className="hero-cta">
              <button className="cta" onClick={() => navigate("/translate")}>
                Try the Model
                <span aria-hidden="true">→</span>
              </button>
              <button className="link-btn" onClick={() => document.getElementById('solution-section')?.scrollIntoView({ behavior: 'smooth' })}>
                How It Works
              </button>
            </div>
            <p className="disclaimer">Open-source research project • Free to use</p>
          </div>

          <div className="hero-visual-card">
            <div className="map-visual">
              <div className="map-marker">
                <span className="pulse"></span>
              </div>
              <div className="translation-snippet">
                <div className="snippet-header">
                  <span className="location-tag">Koraput, Odisha</span>
                </div>
                <div className="snippet-line">
                  <span className="lang-tag">Desia</span>
                  <span className="text">ମୁଇ ତୋକେ ଭଲ ପାଏ</span>
                </div>
                <div className="snippet-arrow">↓</div>
                <div className="snippet-line">
                  <span className="lang-tag">English</span>
                  <span className="text">I love you</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Problem Section - 3D Rotating Wheel */}
        <section className="problem-section">
          <div className="section-header">
            <h2>Challenges of Endangered Languages</h2>
            <p className="section-subtitle">
              Drag the wheel to explore unique obstacles that traditional NLP approaches cannot solve
            </p>
          </div>
          <RotatingWheel items={problems} />
        </section>

        {/* Solution Section - Coverflow Carousel */}
        <section className="solution-section" id="solution-section">
          <div className="section-header">
            <h2>Our Zero-Shot Diffusion Approach</h2>
            <p className="section-subtitle">
              Combining cutting-edge diffusion models with cross-lingual transfer learning, 
              we achieve translation quality without requiring parallel training data—a first for Desia.
            </p>
          </div>
          <CoverflowCarousel items={solutionSteps} />
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>Powerful Features for Language Preservation</h2>
            <p className="section-subtitle">
              Built for researchers, linguists, and community members
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-head">
                  <h3>{feature.title}</h3>
                  {feature.badge && <span className="badge">{feature.badge}</span>}
                </div>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <h2>Ready to Experience Zero-Shot Translation?</h2>
            <p>Try our model with your own Desia text or explore sample translations</p>
            <button className="cta large" onClick={() => navigate("/translate")}>
              Launch Translator
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <footer className="landing-footer">
          <p>© 2025 Desia Translator Project • Research Initiative for Tribal Language Preservation</p>
        </footer>
      </div>
    </div>
  );
}

