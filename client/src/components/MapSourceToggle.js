import React, { useState, useRef, useEffect } from 'react';
import './MapSourceToggle.css';
import mapSources from '../mapConfig';

const MapSourceToggle = ({ currentSource, onSourceChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentSourceName = mapSources[currentSource]?.name || 'Unknown';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (sourceKey) => {
    onSourceChange(sourceKey);
    setIsOpen(false);
  };

  return (
    <div className="map-source-toggle" ref={dropdownRef}>
      <button
        className="toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Select map source"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M10 10L3 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M10 10L17 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M10 10V18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        <span className="source-name">{currentSourceName}</span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {Object.keys(mapSources).map((sourceKey) => (
            <button
              key={sourceKey}
              className={`dropdown-item ${sourceKey === currentSource ? 'active' : ''}`}
              onClick={() => handleSelect(sourceKey)}
            >
              {mapSources[sourceKey].name}
              {sourceKey === currentSource && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapSourceToggle;
