import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import axios from 'axios';
import './WorldMap.css';
import mapSources, { DEFAULT_MAP_SOURCE } from '../mapConfig';

const WorldMap = ({ entries, allEntries, refreshTrigger, onWarning, mapSource = DEFAULT_MAP_SOURCE }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const placeMarkersRef = useRef({});
  const geocodingCacheRef = useRef({});
  const [geoJsonData, setGeoJsonData] = useState(null);
  const warningsShownRef = useRef(new Set());

  // Country name mapping for common abbreviations
  const countryNameMap = {
    'USA': 'United States of America',
    'UK': 'United Kingdom',
    'UAE': 'United Arab Emirates',
    // Add more mappings as needed
  };

  // Helper function to get the official country name
  const getOfficialCountryName = (name) => {
    return countryNameMap[name] || name;
  };

  // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Load GeoJSON data and geocoding cache
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load country boundaries (only on first load)
        if (!geoJsonData) {
          const geoResponse = await axios.get(
            'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
          );
          setGeoJsonData(geoResponse.data);
        }

        // Load geocoding cache from server
        try {
          const cacheResponse = await axios.get('http://localhost:5000/api/geocode-cache');
          if (cacheResponse.data.success) {
            geocodingCacheRef.current = cacheResponse.data.data;
          } else if (cacheResponse.data.error) {
            // Server-side error loading cache
            const warningKey = 'cache-load-error';
            if (!warningsShownRef.current.has(warningKey) && onWarning) {
              warningsShownRef.current.add(warningKey);
              onWarning(`Failed to load geocode_cache.json: ${cacheResponse.data.error}`);
            }
          }
        } catch (cacheError) {
          // Network or other error loading cache
          const warningKey = 'cache-load-error';
          if (!warningsShownRef.current.has(warningKey) && onWarning) {
            warningsShownRef.current.add(warningKey);
            // Check if response has error details from server
            const errorMessage = cacheError.response?.data?.error || cacheError.message;
            onWarning(`Error loading geocode_cache.json: ${errorMessage}`);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [refreshTrigger, geoJsonData, onWarning]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: true,
      attributionControl: false,
      worldCopyJump: true
    });

    // Add tile layer from config
    const sourceConfig = mapSources[mapSource] || mapSources[DEFAULT_MAP_SOURCE];
    const tileLayer = L.tileLayer(sourceConfig.url, {
      attribution: sourceConfig.attribution,
      maxZoom: sourceConfig.maxZoom
    }).addTo(map);

    mapInstanceRef.current = map;
    tileLayerRef.current = tileLayer;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when map source changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    // Remove old tile layer
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    // Add new tile layer
    const sourceConfig = mapSources[mapSource] || mapSources[DEFAULT_MAP_SOURCE];
    const newTileLayer = L.tileLayer(sourceConfig.url, {
      attribution: sourceConfig.attribution,
      maxZoom: sourceConfig.maxZoom
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [mapSource]);

  // Update map with visited countries
  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonData) return;

    // Remove old layer if exists
    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Build visited countries map
    const visitedCountries = {};
    entries.forEach(entry => {
      const officialName = getOfficialCountryName(entry.country);
      if (!visitedCountries[officialName]) {
        visitedCountries[officialName] = [];
      }
      visitedCountries[officialName].push(entry);
    });

    // Validate dates and check if countries exist in GeoJSON
    const unresolvedCountries = new Set();
    entries.forEach(entry => {
      // Validate date range
      const dateFrom = new Date(entry.dateFrom);
      const dateTo = new Date(entry.dateTo);

      if (dateTo < dateFrom) {
        const warningKey = `invalid-date-${entry.country}-${entry.dateFrom}`;
        if (!warningsShownRef.current.has(warningKey) && onWarning) {
          warningsShownRef.current.add(warningKey);
          onWarning(`Invalid date range for ${entry.country}: "To" date (${entry.dateTo}) is before "From" date (${entry.dateFrom}). Please check countries.txt`);
        }
      }

      // Check if country exists in GeoJSON
      const officialName = getOfficialCountryName(entry.country);
      const countryExists = geoJsonData.features.some(feature =>
        (feature.properties.ADMIN === officialName || feature.properties.name === officialName)
      );

      if (!countryExists) {
        unresolvedCountries.add(entry.country);
        const warningKey = `country-${entry.country}`;
        if (!warningsShownRef.current.has(warningKey) && onWarning) {
          warningsShownRef.current.add(warningKey);
          onWarning(`Country not found: "${entry.country}". Please check the country name in countries.txt`);
        }
      }
    });

    // Get current (last) country
    const currentCountry = entries.length > 0 ? getOfficialCountryName(entries[entries.length - 1].country) : null;

    // Style function
    const style = (feature) => {
      const countryName = feature.properties.ADMIN || feature.properties.name;
      const isVisited = visitedCountries[countryName];
      const isCurrent = countryName === currentCountry;

      if (isVisited) {
        // Current country gets a different color (red)
        if (isCurrent) {
          return {
            fillColor: '#ef4444',
            weight: 3,
            opacity: 1,
            color: '#b91c1c',
            fillOpacity: 0.7
          };
        }

        // Previously visited countries (teal/green)
        return {
          fillColor: '#10b981',
          weight: 2,
          opacity: 1,
          color: '#065f46',
          fillOpacity: 0.6
        };
      }

      return {
        fillColor: '#d2b48c',
        weight: 1,
        opacity: 1,
        color: '#a0826d',
        fillOpacity: 0.7
      };
    };

    // Create GeoJSON layer
    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: style,
      onEachFeature: (feature, layer) => {
        const countryName = feature.properties.ADMIN || feature.properties.name;
        const visits = visitedCountries[countryName];

        if (visits) {
          // Use the original country name from the first visit entry
          const displayName = visits[0].country;

          // Create popup content
          let popupContent = `<div class="country-popup">
            <h3>${displayName}</h3>
            <div class="visits-list">`;

          visits.forEach(visit => {
            popupContent += `
              <div class="visit-item">
                <div class="visit-dates">${formatDate(visit.dateFrom)} to ${formatDate(visit.dateTo)}</div>
                ${visit.places.length > 0 ? `
                  <div class="visit-places">
                    <strong>Places:</strong> ${visit.places.join(', ')}
                  </div>
                ` : '<div class="visit-places">Whole country visited</div>'}
              </div>`;
          });

          popupContent += `</div></div>`;

          layer.bindPopup(popupContent);

          // Hover effect
          layer.on('mouseover', function () {
            this.setStyle({
              fillOpacity: 0.8,
              weight: 3
            });
          });

          layer.on('mouseout', function () {
            this.setStyle({
              fillOpacity: 0.6,
              weight: 2
            });
          });
        }
      }
    });

    geoJsonLayer.addTo(mapInstanceRef.current);
    geoJsonLayerRef.current = geoJsonLayer;

    // Build set of visible marker keys and collect all visits per place
    const visibleMarkerKeys = new Set();
    const placeVisits = {}; // Map of markerKey -> array of visits
    entries.forEach(entry => {
      if (entry.places && entry.places.length > 0) {
        entry.places.forEach(place => {
          const markerKey = `${entry.country}-${place}`;
          visibleMarkerKeys.add(markerKey);

          // Collect all visits to this place
          if (!placeVisits[markerKey]) {
            placeVisits[markerKey] = [];
          }
          placeVisits[markerKey].push({
            dateFrom: entry.dateFrom,
            dateTo: entry.dateTo,
            country: entry.country
          });
        });
      }
    });

    // Update marker visibility
    const updateMarkers = async () => {
      // First, hide/remove markers that shouldn't be visible
      Object.keys(placeMarkersRef.current).forEach(key => {
        if (!visibleMarkerKeys.has(key)) {
          if (placeMarkersRef.current[key]) {
            mapInstanceRef.current.removeLayer(placeMarkersRef.current[key]);
            delete placeMarkersRef.current[key];
          }
        }
      });

      // Then, add or show markers that should be visible
      for (const entry of entries) {
        // Skip place markers if the country itself is unresolved
        if (unresolvedCountries.has(entry.country)) {
          continue;
        }

        if (entry.places && entry.places.length > 0) {
          for (const place of entry.places) {
            const markerKey = `${entry.country}-${place}`;

            // Only process markers that should be visible
            if (!visibleMarkerKeys.has(markerKey)) {
              continue;
            }

            // Skip if marker already exists and is visible
            if (placeMarkersRef.current[markerKey]) {
              continue;
            }

            try {
              // Check cache with new structure: country -> place
              let coords = null;
              if (geocodingCacheRef.current[entry.country]) {
                coords = geocodingCacheRef.current[entry.country][place];
              }

              // Check cache first
              if (!coords) {
                // Use Nominatim for geocoding (free, no API key needed)
                const searchQuery = `${place}, ${entry.country}`;
                const response = await axios.get(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
                );

                if (response.data && response.data.length > 0) {
                  coords = { lat: response.data[0].lat, lon: response.data[0].lon };

                  // Cache the coordinates in ref (doesn't trigger re-render)
                  if (!geocodingCacheRef.current[entry.country]) {
                    geocodingCacheRef.current[entry.country] = {};
                  }
                  geocodingCacheRef.current[entry.country][place] = coords;

                  // Save to server cache file (fire and forget)
                  axios.post('http://localhost:5000/api/geocode-cache', {
                    country: entry.country,
                    place: place,
                    coords: coords
                  }).catch(err => console.error('Failed to save cache:', err));
                } else {
                  // Geocoding failed - show warning
                  const warningKey = `place-${entry.country}-${place}`;
                  if (!warningsShownRef.current.has(warningKey) && onWarning) {
                    warningsShownRef.current.add(warningKey);
                    onWarning(`Location not found: "${place}" in ${entry.country}. Please check the place name in countries.txt`);
                  }
                }

                // Delay to respect rate limits (1 request per second)
                await new Promise(resolve => setTimeout(resolve, 1100));
              }

              if (coords) {
                // Get all visits for this place
                const visits = placeVisits[markerKey] || [];

                // Create tooltip text with all visit dates
                let tooltipText = place;
                if (visits.length > 0) {
                  const dateRanges = visits.map(v => `${formatDate(v.dateFrom)} to ${formatDate(v.dateTo)}`).join(', ');
                  tooltipText = `${place} (${dateRanges})`;
                }

                // Create custom marker icon (red dot)
                const placeIcon = L.divIcon({
                  className: 'place-marker',
                  html: `<div class="place-marker-inner" title="${tooltipText}"></div>`,
                  iconSize: [14, 14],
                  iconAnchor: [7, 7]
                });

                // Create popup content with all visits
                let popupContent = `<div class="place-popup"><strong>${place}</strong><br/>${entry.country}<br/>`;
                visits.forEach(visit => {
                  popupContent += `<small>${visit.dateFrom} to ${visit.dateTo}</small><br/>`;
                });
                popupContent += `<a href="https://www.google.com/maps?q=${coords.lat},${coords.lon}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`;
                popupContent += `</div>`;

                const marker = L.marker([coords.lat, coords.lon], { icon: placeIcon })
                  .bindPopup(popupContent);

                marker.addTo(mapInstanceRef.current);
                placeMarkersRef.current[markerKey] = marker;
              }
            } catch (error) {
              console.error(`Error geocoding ${place}:`, error);
            }
          }
        }
      }
    };

    updateMarkers();

    // Fit bounds if there are visited countries
    if (Object.keys(visitedCountries).length > 0) {
      const visitedFeatures = geoJsonData.features.filter(
        feature => visitedCountries[feature.properties.ADMIN || feature.properties.name]
      );

      if (visitedFeatures.length > 0) {
        const group = L.featureGroup(
          visitedFeatures.map(feature => L.geoJSON(feature))
        );
        mapInstanceRef.current.fitBounds(group.getBounds(), {
          padding: [50, 50],
          maxZoom: 4
        });
      }
    }
  }, [entries, geoJsonData]);

  return (
    <div className="world-map-wrapper">
      <div ref={mapRef} className="world-map"></div>
    </div>
  );
};

export default WorldMap;
