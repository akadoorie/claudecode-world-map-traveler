import React from 'react';
import './Controls.css';

const Controls = ({ onPrevious, onNext, onFirst, onLast, canGoPrevious, canGoNext, currentIndex, totalEntries }) => {
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && canGoPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && canGoNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPrevious, onNext, canGoPrevious, canGoNext]);

  return (
    <div className="controls">
      <button
        className="control-btn first-btn"
        onClick={onFirst}
        disabled={!canGoPrevious}
        title="Jump to Beginning"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </button>

      <button
        className="control-btn prev-btn"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        title="Previous (Left Arrow)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="progress-indicator">
        <span className="current-step">{currentIndex + 1}</span>
        <span className="separator">/</span>
        <span className="total-steps">{totalEntries}</span>
      </div>

      <button
        className="control-btn next-btn"
        onClick={onNext}
        disabled={!canGoNext}
        title="Next (Right Arrow)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <button
        className="control-btn last-btn"
        onClick={onLast}
        disabled={!canGoNext}
        title="Jump to End"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Controls;
