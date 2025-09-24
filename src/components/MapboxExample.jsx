"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import LanguageInfoCard from './LanguageInfoCard';
import MapLegend from './MapLegend';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxExample = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [countriesData, setCountriesData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [hoveredLanguage, setHoveredLanguage] = useState(null);

  // Language to country mapping
  const languageCountryMap = {
    'eng': 'GB', // English -> United Kingdom
    'spa': 'ES', // Spanish -> Spain
    'cmn': 'CN', // Mandarin Chinese -> China
    'hin': 'IN', // Hindi -> India
    'ara': 'SA', // Arabic -> Saudi Arabia
    'por': 'PT', // Portuguese -> Portugal
    'rus': 'RU', // Russian -> Russia
    'jpn': 'JP', // Japanese -> Japan
    'deu': 'DE', // German -> Germany
    'fra': 'FR', // French -> France
  };

  // Load and parse CSV data
  useEffect(() => {
    const loadCountriesData = async () => {
      try {
        const response = await fetch('/data/countries.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        const countries = {};
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          const countryCode = values[0];
          const latitude = parseFloat(values[1]);
          const longitude = parseFloat(values[2]);
          const name = values[3]?.replace(/"/g, ''); // Remove quotes
          
          if (!isNaN(latitude) && !isNaN(longitude)) {
            countries[countryCode] = {
              latitude,
              longitude,
              name
            };
          }
        }
        
        setCountriesData(countries);
      } catch (error) {
        console.error('Error loading countries data:', error);
        // Fallback to hardcoded data if CSV loading fails
        setCountriesData({
          'GB': { latitude: 55.378051, longitude: -3.435973, name: 'United Kingdom' },
          'ES': { latitude: 40.463667, longitude: -3.74922, name: 'Spain' },
          'CN': { latitude: 35.86166, longitude: 104.195397, name: 'China' },
          'IN': { latitude: 20.593684, longitude: 78.96288, name: 'India' },
          'SA': { latitude: 23.885942, longitude: 45.079162, name: 'Saudi Arabia' },
          'PT': { latitude: 39.399872, longitude: -8.224454, name: 'Portugal' },
          'RU': { latitude: 61.52401, longitude: 105.318756, name: 'Russia' },
          'JP': { latitude: 36.204824, longitude: 138.252924, name: 'Japan' },
          'DE': { latitude: 51.165691, longitude: 10.451526, name: 'Germany' },
          'FR': { latitude: 46.227638, longitude: 2.213749, name: 'France' }
        });
      }
    };

    loadCountriesData();
  }, []);

  useEffect(() => {
    if (!countriesData) return; // Wait for countries data to load

    mapboxgl.accessToken = "pk.eyJ1IjoibWFydGluc3RlaW5tYXllciIsImEiOiJjbHduem5pdnExMW9jMnFueGFmcHliaWczIn0.jjbMWXUB0w-rbkPMFbiz5Q";
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/martinsteinmayer/cmfyfd5ig00g101si3km81gse/draft',
      projection: 'globe', // 3D globe projection
      center: [0, 20],
      zoom: 1.5,
      maxZoom: 8,
      minZoom: 1
    });

    // Create language data using coordinates from CSV
    // Language definitions
    const languages = [
      {
        name: 'English',
        iso6393: 'eng',
        status: 'voice',
        speakers: 1500000000,
        description: 'Most widely spoken language globally'
      },
      {
        name: 'Spanish',
        iso6393: 'spa',
        status: 'voice',
        speakers: 500000000,
        description: 'Second most spoken language by native speakers'
      },
      {
        name: 'Mandarin Chinese',
        iso6393: 'cmn',
        status: 'history',
        speakers: 918000000,
        description: 'Most spoken language by native speakers'
      },
      {
        name: 'Hindi',
        iso6393: 'hin',
        status: 'history',
        speakers: 602000000,
        description: 'Primary language of India'
      },
      {
        name: 'Arabic',
        iso6393: 'ara',
        status: 'no-data',
        speakers: 422000000,
        description: 'Liturgical language of Islam'
      },
      {
        name: 'Portuguese',
        iso6393: 'por',
        status: 'voice',
        speakers: 260000000,
        description: 'Official language of Brazil and Portugal'
      },
      {
        name: 'Russian',
        iso6393: 'rus',
        status: 'history',
        speakers: 258000000,
        description: 'Most widely spoken Slavic language'
      },
      {
        name: 'Japanese',
        iso6393: 'jpn',
        status: 'no-data',
        speakers: 125000000,
        description: 'Primary language of Japan'
      },
      {
        name: 'German',
        iso6393: 'deu',
        status: 'voice',
        speakers: 100000000,
        description: 'Most widely spoken first language in the EU'
      },
      {
        name: 'French',
        iso6393: 'fra',
        status: 'history',
        speakers: 280000000,
        description: 'Official language in 29 countries'
      }
    ];

    // Create GeoJSON using CSV coordinates
    const languagesData = {
      type: 'FeatureCollection',
      features: languages.map((lang, index) => {
        const countryCode = languageCountryMap[lang.iso6393];
        const country = countriesData[countryCode];
        
        if (!country) {
          console.warn(`No country data found for language ${lang.name} (${lang.iso6393})`);
          return null;
        }

        return {
          type: 'Feature',
          id: index, // Add unique ID for feature state management
          properties: {
            ...lang,
            countryName: country.name
          },
          geometry: {
            type: 'Point',
            coordinates: [country.longitude, country.latitude]
          }
        };
      }).filter(Boolean) // Remove null entries
    };

    // Add fog/atmosphere for 3D globe effect
    map.on('style.load', () => {
      map.setFog({
        'range': [0.5, 10],
        'color': '#fafafa',
        'horizon-blend': 0.01,
        'space-color': '#13141d',
        'star-intensity': 0.1
      });

      // Remove all labels - try multiple approaches for better compatibility
      const layers = map.getStyle().layers;
      
      // First, hide all symbol layers
      layers.forEach((layer) => {
        if (layer.type === 'symbol') {
          try {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
          } catch (e) {
            console.log('Could not hide layer:', layer.id);
          }
        }
      });
      
      // Also try removing label layers entirely (more aggressive approach)
      const labelLayers = layers.filter(layer => 
        layer.type === 'symbol' && 
        (layer.id.includes('label') || layer.id.includes('place') || layer.id.includes('poi'))
      );
      
      labelLayers.forEach((layer) => {
        try {
          if (map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
          }
        } catch (e) {
          console.log('Could not remove layer:', layer.id);
        }
      });

      // Add language data source
      map.addSource('languages', {
        type: 'geojson',
        data: languagesData
      });

      // Add language dots layer with smooth animations and hover states
      map.addLayer({
        id: 'language-dots',
        type: 'circle',
        source: 'languages',
        paint: {
          // Animated radius with hover effect (105% scale = 6.3px)
          'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            6.3, // 105% of 6
            ['boolean', ['feature-state', 'selected'], false],
            7, // Slightly larger for selected state
            6 // Default size
          ],
          // Color coding based on status
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'voice'],
            '#22c55e', // Green for voice chat available
            ['==', ['get', 'status'], 'history'],
            '#eab308', // Yellow for history available
            '#ef4444' // Red for needs funding
          ],
          // Enhanced stroke on hover
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            ['boolean', ['feature-state', 'selected'], false],
            3,
            2
          ],
          'circle-stroke-color': '#ffffff',
          // Slightly more opaque on hover
          'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.95,
            ['boolean', ['feature-state', 'selected'], false],
            1,
            0.8
          ],
          // Add subtle shadow effect on hover
          'circle-blur': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.2,
            0
          ]
        },
        layout: {
          // Ensure smooth transitions
          'visibility': 'visible'
        }
      });

      // Set up smooth transitions (300ms as requested)
      map.setPaintProperty('language-dots', 'circle-radius-transition', {
        duration: 300,
        delay: 0
      });
      map.setPaintProperty('language-dots', 'circle-stroke-width-transition', {
        duration: 300,
        delay: 0
      });
      map.setPaintProperty('language-dots', 'circle-opacity-transition', {
        duration: 300,
        delay: 0
      });
      map.setPaintProperty('language-dots', 'circle-blur-transition', {
        duration: 200,
        delay: 0
      });
    });

    // Click handler for language dots
    map.on('click', 'language-dots', (event) => {
      if (!event.features.length) return;
      
      const feature = event.features[0];
      
      // Clear previous selection state
      if (selectedLanguage) {
        const prevFeatures = map.querySourceFeatures('languages');
        prevFeatures.forEach(f => {
          if (f.properties.iso6393 === selectedLanguage.iso6393) {
            map.setFeatureState({ source: 'languages', id: f.id }, { selected: false });
          }
        });
      }
      
      // Set new selection
      map.setFeatureState({ source: 'languages', id: feature.id }, { selected: true });
      setSelectedLanguage(feature.properties);
    });

    // Click handler for map background (deselect)
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['language-dots']
      });
      
      if (features.length === 0) {
        // Clear selection state
        if (selectedLanguage) {
          const allFeatures = map.querySourceFeatures('languages');
          allFeatures.forEach(f => {
            map.setFeatureState({ source: 'languages', id: f.id }, { selected: false });
          });
        }
        setSelectedLanguage(null);
      }
    });

    // Enhanced hover effects with feature state
    let hoveredFeatureId = null;
    
    map.on('mouseenter', 'language-dots', (e) => {
      if (e.features && e.features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        
        // Set hover state
        if (hoveredFeatureId !== null) {
          map.setFeatureState({ source: 'languages', id: hoveredFeatureId }, { hover: false });
        }
        
        hoveredFeatureId = e.features[0].id;
        map.setFeatureState({ source: 'languages', id: hoveredFeatureId }, { hover: true });
        
        // Update React state for potential future use
        setHoveredLanguage(e.features[0].properties);
      }
    });

    map.on('mouseleave', 'language-dots', () => {
      map.getCanvas().style.cursor = '';
      
      // Clear hover state
      if (hoveredFeatureId !== null) {
        map.setFeatureState({ source: 'languages', id: hoveredFeatureId }, { hover: false });
        hoveredFeatureId = null;
        setHoveredLanguage(null);
      }
    });

    // Add smooth cursor change on map container
    map.on('mousemove', 'language-dots', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    mapRef.current = map;

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [countriesData]); // Depend on countriesData

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Loading State */}
      {!countriesData && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Loading language data...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Language Information Card */}
      {selectedLanguage && (
        <div className="absolute top-6 right-6 z-10">
          <LanguageInfoCard 
            language={selectedLanguage} 
            onClose={() => setSelectedLanguage(null)}
          />
        </div>
      )}
      
      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 z-10">
        <MapLegend />
      </div>
      
      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            World Languages
          </h1>
          <p className="text-sm text-gray-600">
            Explore languages around the globe
          </p>
        </div>
      </div>

      {/* Interactive Hint - shows when no language is selected */}
      {!selectedLanguage && !hoveredLanguage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm animate-bounce">
            Click on any language dot to learn more
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxExample;