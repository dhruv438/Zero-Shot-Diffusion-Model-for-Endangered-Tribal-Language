import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlippingCard from '../components/FlippingCard.jsx';
import HeroFlipCard from '../components/HeroFlipCard.jsx';
import '../styles/ScrollLanding.css';
import centreImage from '../assets/centre.jpg';
import i1 from '../assets/i1.jpg';
import i2 from '../assets/i2.jpg';
import i3 from '../assets/i3.jpg';
import i4 from '../assets/i4.jpg';
import i5 from '../assets/i5.jpg';
import i6 from '../assets/i6.jpg';
import i7 from '../assets/i7.jpg';
import i8 from '../assets/i8.jpg';
import i9 from '../assets/i9.jpg';
import i10 from '../assets/i10.jpg';
import i11 from '../assets/i11.jpg';
import i12 from '../assets/i12.jpg';
import i13 from '../assets/i13.jpg';
import i14 from '../assets/i14.jpg';

gsap.registerPlugin(ScrollTrigger);

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
  const scalerRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.enhanced = 'true';
    document.documentElement.dataset.center = 'true';
    document.documentElement.dataset.layers = 'true';
    document.documentElement.dataset.stagger = 'range';

    const section = document.querySelector('main section:first-of-type');
    
    if (section && scalerRef.current && layer1Ref.current && layer2Ref.current && layer3Ref.current) {
      // Set initial states
      gsap.set(scalerRef.current, { width: '100vw', height: '100vh' });
      gsap.set([layer1Ref.current, layer2Ref.current, layer3Ref.current], { 
        opacity: 0, 
        scale: 0,
        transformOrigin: 'center center'
      });

      // Pin the content for the scroll duration
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: '.content',
          pinSpacing: true,
        }
      });

      // Center image scale (from fullscreen to grid cell)
      tl.to(
        scalerRef.current,
        { width: '100%', height: '100%', ease: 'power2.out', duration: 1 },
        0
      );

      // Layer reveals staggered with proper duration
      tl.to(layer1Ref.current, { opacity: 1, scale: 1, ease: 'power1.out', duration: 0.8 }, 0.3);
      tl.to(layer2Ref.current, { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.8 }, 0.5);
      tl.to(layer3Ref.current, { opacity: 1, scale: 1, ease: 'power3.out', duration: 0.8 }, 0.7);
    }

    // Footer IntersectionObserver
    if (footerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px'
        }
      );

      observer.observe(footerRef.current);

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        if (footerRef.current) {
          observer.unobserve(footerRef.current);
        }
      };
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="scroll-landing">
      <a 
        href="https://github.com/dhruv438/Zero-Shot-Diffusion-Model-for-Endangered-Tribal-Language" 
        target="_blank" 
        rel="noopener noreferrer"
        className="github-link"
        aria-label="View on GitHub"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <div className="content-wrap">
        <header className="scroll-header">
          <p className="hero-eyebrow">Preserving Tribal Heritage Through AI</p>
          <h1 className="fluid hero-title">
            Zero-Shot Translation<br />
            for Endangered<br />
            Tribal Languages
          </h1>
        </header>
        
        <main>
          <section>
            <div className="content">
              <div className="grid">
                {/* Layer 1 - Cultural Images */}
                <div className="layer" ref={layer1Ref}>
                  <div>
                    <img
                      src={i1}
                      alt="Tribal heritage"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i2}
                      alt="Indigenous community"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i3}
                      alt="Traditional art"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i4}
                      alt="Cultural wisdom"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i5}
                      alt="Language preservation"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i6}
                      alt="Community gathering"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Layer 2 - Technology & Innovation */}
                <div className="layer" ref={layer2Ref}>
                  <div>
                    <img
                      src={i7}
                      alt="AI technology"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i8}
                      alt="Innovation"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i9}
                      alt="Machine learning"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i10}
                      alt="Digital preservation"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i11}
                      alt="Collaboration"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i12}
                      alt="Team work"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Layer 3 - Learning & Connection */}
                <div className="layer" ref={layer3Ref}>
                  <div>
                    <img
                      src={i13}
                      alt="Learning"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src={i14}
                      alt="Education"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Center Hero Image */}
                <div className="scaler">
                  <img
                    ref={scalerRef}
                    src={centreImage}
                    alt="Desia Language Translator - Preserving Indigenous Heritage"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Hero Flip Card Container - Wraps all three sections */}
          <HeroFlipCard 
            sections={[
              // Section 1: Problems
              <section key="problems" className="problem-section">
                <div className="section-header">
                  <h2 className="section-title section-title--white">Challenges of Endangered Languages</h2>
                  <p className="section-subtitle">
                    Explore unique obstacles that traditional NLP approaches cannot solve
                  </p>
                </div>
                <div className="flipping-cards-grid">
                  {problems.map((problem, index) => (
                    <div key={index} className="static-card problem-card">
                      <div className="card-number">{String(index + 1).padStart(2, '0')}</div>
                      <h3>{problem.title}</h3>
                      <p>{problem.body}</p>
                    </div>
                  ))}
                </div>
              </section>,

              // Section 2: Solutions
              <section key="solutions" className="solution-section" id="solution-section">
                <div className="section-header">
                  <h2 className="section-title">Our Zero-Shot Diffusion Approach</h2>
                  <p className="section-subtitle">
                     Learn how diffusion models enable translation without parallel data—a first for Desia.
                  </p>
                </div>
                <div className="flipping-cards-grid solution-cards-grid">
                  {solutionSteps.map((step, index) => (
                    <div key={index} className="static-card solution-card">
                      <div className="card-number">{step.number}</div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  ))}
                </div>
              </section>,

              // Section 3: Features
              <section key="features" className="features-section">
                <div className="section-header">
                  <h2 className="section-title">Powerful Features for Language Preservation</h2>
                  <p className="section-subtitle">
                    Discover features built for researchers, linguists, and community members
                  </p>
                </div>
                <div className="flipping-cards-grid features-cards-grid">
                  {features.map((feature, index) => (
                    <div key={index} className="static-card feature-card">
                      {feature.badge && <span className="badge">{feature.badge}</span>}
                      <h3>{feature.title}</h3>
                      <p>{feature.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            ]}
          />

          <section className="final-section">
            <div className="final-content">
              <h2 className="fluid final-title">
                Bridge the<br />
                Language Gap.
              </h2>
              <p className="final-description">
                Bridging the digital divide for Desia, a low-resource tribal language from Koraput.<br />
                Our diffusion-based model enables accurate translation without parallel datasets,<br />
                preserving linguistic heritage for future generations.
              </p>
              <div className="cta-buttons">
                <button 
                  className="primary-cta"
                  onClick={() => navigate('/translate')}
                >
                  Start Translating
                  <span className="arrow">→</span>
                </button>
                <button 
                  className="secondary-cta"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer ref={footerRef} className="scroll-footer">
        <span className="footer-signature" aria-hidden="true">
          <span className="arm">Zero-Shot Diffusion for Tribal Language Preservation</span>
          <span className="spring"><span>© 2025</span></span>
          <span className="table">Desia Translator Project</span>
        </span>
      </footer>
    </div>
  );
}

