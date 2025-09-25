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
  const [showHint, setShowHint] = useState(true);

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

  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);

    return () => clearTimeout(timer);
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

    // Create GeoJSON from ElevenLabs voice data with grouping by coordinates
    const languagesData = {
      type: 'FeatureCollection',
      features: []
    };

    let featureId = 0;
    const coordinateGroups = {}; // Group languages by coordinates
    
    // First pass: collect all languages by coordinate
    Object.keys(countriesData).forEach(langCode => {
      const language = countriesData[langCode];
      const languageName = languageNames[langCode] || langCode.toUpperCase();
      
      // Process each dialect/region for this language
      Object.keys(language).forEach(dialectKey => {
        const dialect = language[dialectKey];
        const coordinates = dialect.coordinates;
        const voiceCount = dialect.voice_ids ? dialect.voice_ids.length : 0;
        
        if (coordinates && coordinates.lat && coordinates.long) {
          const baseLat = parseFloat(coordinates.lat);
          const baseLong = parseFloat(coordinates.long);
          const coordKey = `${baseLat.toFixed(4)},${baseLong.toFixed(4)}`; // Round to avoid floating point issues
          
          // All ElevenLabs voices are green (voice chat available)
          const status = 'voice';
          
          const languageInfo = {
            name: dialect.name || `${languageName} (${dialectKey.charAt(0).toUpperCase() + dialectKey.slice(1)})`,
            officialName: dialect.official_name,
            iso6393: langCode,
            dialect: dialectKey,
            status: status,
            voiceCount: voiceCount,
            speakers: voiceCount * 1000000, // Rough estimate based on voice availability
            description: `${voiceCount} ElevenLabs voices available for ${dialectKey} ${languageName}`,
            voice_ids: dialect.voice_ids
          };
          
          // Group by coordinates
          if (!coordinateGroups[coordKey]) {
            coordinateGroups[coordKey] = {
              lat: baseLat,
              long: baseLong,
              languages: []
            };
          }
          
          coordinateGroups[coordKey].languages.push(languageInfo);
        }
      });
    });
    
    // Second pass: create features from grouped coordinates
    Object.keys(coordinateGroups).forEach(coordKey => {
      const group = coordinateGroups[coordKey];
      
      // Sort languages by speaker count (descending)
      group.languages.sort((a, b) => b.speakers - a.speakers);
      
      // Determine the overall status of the group (prioritize voice > history > funding)
      const hasVoice = group.languages.some(lang => lang.status === 'voice');
      const hasHistory = group.languages.some(lang => lang.status === 'history');
      const groupStatus = hasVoice ? 'voice' : (hasHistory ? 'history' : 'funding');
      
      // Create the feature
      const feature = {
        type: 'Feature',
        id: featureId++,
        properties: {
          // For single language, use its properties directly
          // For multiple languages, create a group representation
          ...(group.languages.length === 1 ? group.languages[0] : {
            name: `${group.languages.length} Languages`,
            iso6393: 'multiple',
            dialect: 'group',
            status: groupStatus,
            voiceCount: group.languages.reduce((sum, lang) => sum + lang.voiceCount, 0),
            speakers: group.languages.reduce((sum, lang) => sum + lang.speakers, 0),
            description: `${group.languages.length} languages available at this location`,
            languages: group.languages // Store all languages for the info card
          }),
          languageCount: group.languages.length,
          isGroup: group.languages.length > 1
        },
        geometry: {
          type: 'Point',
          coordinates: [group.long, group.lat]
        }
      };
      
      languagesData.features.push(feature);
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
          // Larger radius for groups with multiple languages
          'circle-radius': [
            'case',
            // Selected state (largest)
            ['boolean', ['feature-state', 'selected'], false],
            [
              'case',
              ['>', ['get', 'languageCount'], 1],
              10, // Groups are larger when selected
              8   // Single languages when selected
            ],
            // Hover state (medium)
            ['boolean', ['feature-state', 'hover'], false],
            [
              'case',
              ['>', ['get', 'languageCount'], 1],
              8.5, // Groups are larger when hovered
              7.2  // Single languages when hovered
            ],
            // Default state
            [
              'case',
              ['>', ['get', 'languageCount'], 1],
              7.5, // Groups are larger by default
              6    // Single languages default
            ]
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
          // Groups get thicker strokes to indicate multiple languages
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            [
              'case',
              ['>', ['get', 'languageCount'], 1],
              5, // Groups get thicker stroke when selected
              4  // Single language stroke when selected
            ],
            ['boolean', ['feature-state', 'hover'], false],
            [
              'case',
              ['>', ['get', 'languageCount'], 1],
              4, // Groups get thicker stroke when hovered
              3  // Single language stroke when hovered
            ],
            [
              'case',
              ['>', ['get', 'languageCount'], 1],
              3, // Groups get thicker stroke by default
              2  // Single language default stroke
            ]
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

      // Add layer for language count labels (only show for groups with multiple languages)
      map.addLayer({
        id: 'language-count-labels',
        type: 'symbol',
        source: 'languages',
        filter: ['>', ['get', 'languageCount'], 1], // Only show for groups
        layout: {
          'text-field': ['get', 'languageCount'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-anchor': 'center',
          'text-allow-overlap': true,
          'text-ignore-placement': true
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': 'rgba(0, 0, 0, 0.8)',
          'text-halo-width': 1,
          'text-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            1,
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.8
          ]
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
      map.setPaintProperty('language-count-labels', 'text-opacity-transition', {
        duration: 300,
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
        
        // Pass the feature properties, which now contain either single language or language group
        console.log('Selected language/group:', feature.properties);
        setSelectedLanguage(feature.properties);
      }
    });

    // Click handler for labels (same as dots)
    map.on('click', 'language-count-labels', (event) => {
      if (!event.features.length) return;
      
      const feature = event.features[0];
      
      // Clear ALL previous selection states
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
        layers: ['language-dots', 'language-count-labels']
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

    // Enhanced hover effects with feature state - works for both dots and labels
    let hoveredFeatureId = null;
    
    const handleMouseEnter = (e) => {
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
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      
      // Clear hover state
      if (hoveredFeatureId !== null) {
        map.setFeatureState({ source: 'languages', id: hoveredFeatureId }, { hover: false });
        hoveredFeatureId = null;
        setHoveredLanguage(null);
      }
    };

    // Apply hover effects to both layers
    map.on('mouseenter', 'language-dots', handleMouseEnter);
    map.on('mouseleave', 'language-dots', handleMouseLeave);
    map.on('mouseenter', 'language-count-labels', handleMouseEnter);
    map.on('mouseleave', 'language-count-labels', handleMouseLeave);

    // Add smooth cursor change on map container
    map.on('mousemove', 'language-dots', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mousemove', 'language-count-labels', () => {
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
            languageGroup={selectedLanguage} 
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

      {/* Interactive Hint - shows when no language is selected and fades away after 5s */}
      {!selectedLanguage && !hoveredLanguage && (
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none transition-opacity duration-1000 ${
            showHint ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-black/80 text-white px-2 py-1 rounded-lg text-xs" style={{
            animation: showHint ? 'gentleBounce 1s ease-in-out infinite' : 'none'
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