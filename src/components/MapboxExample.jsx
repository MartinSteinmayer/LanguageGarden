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

  // Load ElevenLabs voice data
  useEffect(() => {
    const loadVoiceData = async () => {
      try {
        const response = await fetch('/data/eleven_lab_voices_coordinates.json');
        const voiceData = await response.json();
        setCountriesData(voiceData);
      } catch (error) {
        console.error('Error loading voice data:', error);
        setCountriesData({});
      }
    };

    loadVoiceData();
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

    // Language name mapping from ISO codes
    const languageNames = {
      'es': 'Spanish',
      'en': 'English', 
      'fr': 'French',
      'vi': 'Vietnamese',
      'pt': 'Portuguese',
      'ko': 'Korean',
      'hi': 'Hindi',
      'ja': 'Japanese',
      'sk': 'Slovak',
      'ru': 'Russian',
      'de': 'German',
      'fil': 'Filipino',
      'id': 'Indonesian',
      'it': 'Italian',
      'pl': 'Polish',
      'ar': 'Arabic',
      'nl': 'Dutch',
      'tr': 'Turkish',
      'cs': 'Czech',
      'zh': 'Chinese',
      'ro': 'Romanian',
      'ms': 'Malay',
      'uk': 'Ukrainian',
      'ta': 'Tamil',
      'bg': 'Bulgarian',
      'hu': 'Hungarian',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'sv': 'Swedish',
      'da': 'Danish',
      'hr': 'Croatian',
      'el': 'Greek'
    };

    // Create GeoJSON from ElevenLabs voice data
    const languagesData = {
      type: 'FeatureCollection',
      features: []
    };

    let featureId = 0;
    
    // Process each language in the voice data
    Object.keys(countriesData).forEach(langCode => {
      const language = countriesData[langCode];
      const languageName = languageNames[langCode] || langCode.toUpperCase();
      
      // Process each dialect/region for this language
      Object.keys(language).forEach(dialectKey => {
        const dialect = language[dialectKey];
        const coordinates = dialect.coordinates;
        const voiceCount = dialect.voice_ids ? dialect.voice_ids.length : 0;
        
        if (coordinates && coordinates.lat && coordinates.long) {
          // All ElevenLabs voices are green (voice chat available)
          const status = 'voice';
          
          const feature = {
            type: 'Feature',
            id: featureId++,
            properties: {
              name: `${languageName} (${dialectKey.charAt(0).toUpperCase() + dialectKey.slice(1)})`,
              iso6393: langCode,
              dialect: dialectKey,
              status: status,
              voiceCount: voiceCount,
              speakers: voiceCount * 1000000, // Rough estimate based on voice availability
              description: `${voiceCount} ElevenLabs voices available for ${dialectKey} ${languageName}`,
              voice_ids: dialect.voice_ids
            },
            geometry: {
              type: 'Point',
              coordinates: [parseFloat(coordinates.long), parseFloat(coordinates.lat)]
            }
          };
          
          languagesData.features.push(feature);
        }
      });
    });

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
          // Animated radius with hover effect - selected state takes priority
          'circle-radius': [
            'case',
            // Selected state (largest)
            ['boolean', ['feature-state', 'selected'], false],
            8, // Selected: 133% of default
            // Hover state (medium)
            ['boolean', ['feature-state', 'hover'], false],
            7.2, // Hover: 120% of default
            // Default state
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
          // Enhanced stroke - selected state gets thickest border
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            4, // Selected: thickest border
            ['boolean', ['feature-state', 'hover'], false],
            3, // Hover: medium border
            2 // Default: thin border
          ],
          'circle-stroke-color': '#ffffff',
          // Opacity hierarchy
          'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            1, // Selected: fully opaque
            ['boolean', ['feature-state', 'hover'], false],
            0.95, // Hover: almost opaque
            0.8 // Default: slightly transparent
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
      
      // Clear ALL previous selection states (simpler and more reliable)
      const allFeatures = map.querySourceFeatures('languages');
      allFeatures.forEach(f => {
        if (f.id !== undefined) {
          map.setFeatureState({ source: 'languages', id: f.id }, { selected: false });
        }
      });
      
      // Set new selection
      if (feature.id !== undefined) {
        map.setFeatureState({ source: 'languages', id: feature.id }, { selected: true });
        setSelectedLanguage(feature.properties);
      }
    });

    // Click handler for map background (deselect)
    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['language-dots']
      });
      
      if (features.length === 0) {
        // Clear ALL selection states
        const allFeatures = map.querySourceFeatures('languages');
        allFeatures.forEach(f => {
          if (f.id !== undefined) {
            map.setFeatureState({ source: 'languages', id: f.id }, { selected: false });
          }
        });
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
          <div className="bg-black/80 text-white px-2 py-1 rounded-lg text-xs" style={{
            animation: 'gentleBounce 1s ease-in-out infinite'
          }}>
            Click on any language dot to learn more
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes gentleBounce {
          0%, 100% {
            transform: translateY(-6px);
          }
          50% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default MapboxExample;