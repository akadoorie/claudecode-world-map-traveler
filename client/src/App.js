import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorldMap from './components/WorldMap';
import Controls from './components/Controls';
import Counter from './components/Counter';
import AddCountryForm from './components/AddCountryForm';
import Notification from './components/Notification';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [entries, setEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/countries`);
      if (response.data.success) {
        setEntries(response.data.data);
        setCurrentIndex(0);
      }
    } catch (err) {
      setError('Failed to load countries data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFirst = () => {
    setCurrentIndex(0);
  };

  const handleLast = () => {
    setCurrentIndex(entries.length - 1);
  };

  const handleAddCountry = async (newEntry) => {
    try {
      const response = await axios.post(`${API_URL}/countries`, newEntry);
      if (response.data.success) {
        await fetchCountries();
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to add country:', err);
      throw err;
    }
  };

  const handleRefresh = async () => {
    await fetchCountries();
    setRefreshTrigger(prev => prev + 1);
  };

  const handleWarning = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type: 'warning' }]);
  };

  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Get all entries up to current index
  const visibleEntries = entries.slice(0, currentIndex + 1);

  // Calculate unique countries
  const uniqueCountries = new Set(visibleEntries.map(e => e.country));
  const countryCount = uniqueCountries.size;

  // Calculate total days abroad
  const calculateDays = (dateFrom, dateTo) => {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  const totalDaysAbroad = visibleEntries.reduce((total, entry) => {
    return total + calculateDays(entry.dateFrom, entry.dateTo);
  }, 0);

  // Get current country name, area, and year (the last entry in visibleEntries)
  const currentEntry = visibleEntries.length > 0 ? visibleEntries[visibleEntries.length - 1] : null;
  const currentCountry = currentEntry ? currentEntry.country : null;
  const currentArea = currentEntry ? currentEntry.area : null;
  const currentYear = currentEntry ? new Date(currentEntry.dateFrom).getFullYear() : null;

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading your travels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <p>{error}</p>
        <button onClick={fetchCountries}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>World Map Traveler</h1>
        <Counter count={countryCount} total={entries.length} daysAbroad={totalDaysAbroad} currentCountry={currentCountry} currentArea={currentArea} currentYear={currentYear} />
        <div className="header-buttons">
          <button
            className="refresh-button"
            onClick={handleRefresh}
            title="Reload data from file"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh
          </button>
          <button
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            + Add Visit
          </button>
        </div>
      </header>

      <div className="map-container">
        <WorldMap
          entries={visibleEntries}
          allEntries={entries}
          refreshTrigger={refreshTrigger}
          onWarning={handleWarning}
        />
      </div>

      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => closeNotification(notification.id)}
        />
      ))}

      <Controls
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFirst={handleFirst}
        onLast={handleLast}
        canGoPrevious={currentIndex > 0}
        canGoNext={currentIndex < entries.length - 1}
        currentIndex={currentIndex}
        totalEntries={entries.length}
      />

      {showAddForm && (
        <AddCountryForm
          onSubmit={handleAddCountry}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

export default App;
