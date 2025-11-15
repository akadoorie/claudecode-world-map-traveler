import React, { useState } from 'react';
import axios from 'axios';
import './AddCountryForm.css';

const AddCountryForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    dateFrom: '',
    dateTo: '',
    country: '',
    area: '',
    places: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateLocation = async (location, type = 'place', country = '') => {
    try {
      // Call server-side validation endpoint
      const response = await axios.post('http://localhost:5000/api/validate-location', {
        location: location,
        type: type,
        country: country
      });

      // Delay to respect rate limits (1 request per second)
      await new Promise(resolve => setTimeout(resolve, 1100));

      if (response.data.success) {
        return response.data.valid;
      }

      return false;
    } catch (error) {
      console.error(`Error validating ${type}:`, error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.dateFrom || !formData.dateTo || !formData.country) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.dateFrom) > new Date(formData.dateTo)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setValidationStatus('Validating country location...');

      // Validate country
      const countryValid = await validateLocation(formData.country, 'country');
      if (!countryValid) {
        setError(`Country "${formData.country}" could not be found. Please check the spelling.`);
        setValidationStatus('');
        setLoading(false);
        return;
      }

      // Parse places (comma-separated)
      const places = formData.places
        .split(',')
        .map(p => p.trim())
        .filter(p => p);

      // Validate places if provided
      if (places.length > 0) {
        for (let i = 0; i < places.length; i++) {
          const place = places[i];
          setValidationStatus(`Validating places (${i + 1}/${places.length}): ${place}...`);
          const placeValid = await validateLocation(place, 'place', formData.country);
          if (!placeValid) {
            setError(`Place "${place}" in ${formData.country} could not be found. Please check the spelling.`);
            setValidationStatus('');
            setLoading(false);
            return;
          }
        }
      }

      setValidationStatus('Adding visit...');

      await onSubmit({
        dateFrom: formData.dateFrom,
        dateTo: formData.dateTo,
        country: formData.country,
        area: formData.area,
        places: places
      });

      onClose();
    } catch (err) {
      setError('Failed to add country. Please try again.');
      setValidationStatus('');
    } finally {
      setLoading(false);
      setValidationStatus('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Visit</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-country-form">
          {error && <div className="error-message">{error}</div>}
          {validationStatus && (
            <div className="validation-message">
              <span className="hourglass">⏳</span> {validationStatus}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g., Greece"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">Area (optional)</label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g., Crete, Rhodes"
            />
            <small>Specific region or island within the country</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateFrom">From Date *</label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={formData.dateFrom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateTo">To Date *</label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={formData.dateTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="places">Places (optional)</label>
            <input
              type="text"
              id="places"
              name="places"
              value={formData.places}
              onChange={handleChange}
              placeholder="e.g., Athens, Thessaloniki (comma-separated)"
            />
            <small>Leave empty if you visited the whole country</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCountryForm;
