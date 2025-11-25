import { useState, useEffect } from 'react';

export default function HeroFlipCard({ sections }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Auto-advance to next section
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSection < sections.length - 1) {
        nextSection();
      }
    }, 8000); // Auto-flip every 8 seconds

    return () => clearTimeout(timer);
  }, [currentSection]);

  const nextSection = () => {
    if (isFlipping || currentSection >= sections.length - 1) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSection(prev => prev + 1);
      setIsFlipping(false);
    }, 800);
  };

  const prevSection = () => {
    if (isFlipping || currentSection <= 0) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSection(prev => prev - 1);
      setIsFlipping(false);
    }, 800);
  };

  const goToSection = (index) => {
    if (isFlipping || index === currentSection) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSection(index);
      setIsFlipping(false);
    }, 800);
  };

  return (
    <div className="hero-flip-card-wrapper">
      <div className={`hero-flip-container ${isFlipping ? 'flipping' : ''}`}>
        {sections.map((section, index) => (
          <div
            key={index}
            className={`hero-section-face ${currentSection === index ? 'active' : ''}`}
            style={{
              transform: `rotateY(${(index - currentSection) * 180}deg)`,
              opacity: currentSection === index ? 1 : 0,
              pointerEvents: currentSection === index ? 'auto' : 'none',
            }}
          >
            {section}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="hero-flip-controls">
        <button 
          className="hero-flip-btn prev"
          onClick={prevSection}
          disabled={currentSection === 0}
        >
          ← Previous
        </button>

        <div className="hero-flip-indicators">
          {sections.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSection ? 'active' : ''}`}
              onClick={() => goToSection(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button 
          className="hero-flip-btn next"
          onClick={nextSection}
          disabled={currentSection === sections.length - 1}
        >
          Next →
        </button>
      </div>

      {/* Click area to advance */}
      <div 
        className="hero-flip-clickarea"
        onClick={nextSection}
        style={{ 
          display: currentSection < sections.length - 1 ? 'block' : 'none' 
        }}
      />
    </div>
  );
}
