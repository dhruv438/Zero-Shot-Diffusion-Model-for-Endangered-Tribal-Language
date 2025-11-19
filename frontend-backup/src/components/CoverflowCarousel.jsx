import { useState, useRef, useEffect } from 'react';

export default function CoverflowCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isDragging) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }, 3000); // Change slide every 3 seconds
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isDragging, items.length]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX]);

  const getCardStyle = (index) => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);
    
    if (absOffset > 2) return { display: 'none' };

    const scale = 1 - absOffset * 0.2;
    const translateX = offset * 380;
    const translateZ = -absOffset * 200;
    const rotateY = offset * -25;
    const opacity = 1 - absOffset * 0.3;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: 10 - absOffset,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className="coverflow-wrapper">
      <div 
        className="coverflow-container"
        ref={containerRef}
        onMouseDown={handleMouseDown}
      >
        <div className="coverflow-track">
          {items.map((item, index) => (
            <div
              key={index}
              className={`coverflow-card ${index === activeIndex ? 'active' : ''}`}
              style={getCardStyle(index)}
              onClick={() => setActiveIndex(index)}
            >
              <div className="coverflow-card-content">
                <div className="step-badge">{item.number}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="coverflow-navigation">
        <button 
          className="nav-arrow nav-prev" 
          onClick={handlePrevious}
          aria-label="Previous"
        >
          ←
        </button>
        <div className="nav-dots">
          {items.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button 
          className="nav-arrow nav-next" 
          onClick={handleNext}
          aria-label="Next"
        >
          →
        </button>
      </div>
    </div>
  );
}
