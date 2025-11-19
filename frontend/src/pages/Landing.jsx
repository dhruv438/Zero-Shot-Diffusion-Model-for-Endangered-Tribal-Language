import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/ScrollLanding.css';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();
  const scalerRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.enhanced = 'true';
    document.documentElement.dataset.center = 'true';
    document.documentElement.dataset.layers = 'true';
    document.documentElement.dataset.stagger = 'range';

    const section = document.querySelector('main section:first-of-type');
    
    if (section) {
      // Set initial states for center image
      if (scalerRef.current) {
        gsap.fromTo(
          scalerRef.current,
          { width: 'calc(100vw - 4rem)', height: 'calc(100vh - 4rem)' },
          {
            width: '100%',
            height: '100%',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      // Set initial states for layers - start hidden and small
      if (layer1Ref.current) {
        gsap.fromTo(
          layer1Ref.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '40% top',
              scrub: 1.2,
            },
          }
        );
      }

      if (layer2Ref.current) {
        gsap.fromTo(
          layer2Ref.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: '10% top',
              end: '65% top',
              scrub: 1.2,
            },
          }
        );
      }

      if (layer3Ref.current) {
        gsap.fromTo(
          layer3Ref.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: '20% top',
              end: '80% top',
              scrub: 1.2,
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="scroll-landing">
      <div className="content-wrap">
        <header className="scroll-header">
          <h1 className="fluid hero-title">
            Preserving<br />
            Desia.
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
                      src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&auto=format&fit=crop&q=80"
                      alt="Tribal heritage"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80"
                      alt="Indigenous community"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80"
                      alt="Traditional art"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1555881603-1f2a3d600a3c?w=800&auto=format&fit=crop&q=80"
                      alt="Cultural wisdom"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800&auto=format&fit=crop&q=80"
                      alt="Language preservation"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80"
                      alt="Community gathering"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Layer 2 - Technology & Innovation */}
                <div className="layer" ref={layer2Ref}>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
                      alt="AI technology"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=80"
                      alt="Innovation"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80"
                      alt="Machine learning"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=80"
                      alt="Digital preservation"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80"
                      alt="Collaboration"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                      alt="Team work"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Layer 3 - Learning & Connection */}
                <div className="layer" ref={layer3Ref}>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80"
                      alt="Learning"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80"
                      alt="Education"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Center Hero Image */}
                <div className="scaler">
                  <img
                    ref={scalerRef}
                    src="https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=1200&auto=format&fit=crop&q=90"
                    alt="Desia Language Translator - Preserving Indigenous Heritage"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="final-section">
            <div className="final-content">
              <h2 className="fluid final-title">
                Bridge the<br />
                Language Gap.
              </h2>
              <p className="final-description">
                Our AI-powered translator helps preserve the endangered Desia tribal language,<br />
                connecting generations and keeping cultural heritage alive through cutting-edge<br />
                zero-shot diffusion models.
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

      <footer className="scroll-footer">
        <p>
          Preserving endangered languages through technology 🌍<br />
          © 2025 Desia Translator Project • Zero-Shot Diffusion for Tribal Language Preservation
        </p>
      </footer>
    </div>
  );
}

