import React from 'react';

const LocationStructuredData = ({ locations }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Vedic Astrology Calculator by Location",
    "description": "Get accurate Vedic astrology calculations based on your geographic location",
    "mainEntity": {
      "@type": "Service",
      "name": "Location-Based Vedic Astrology Calculations",
      "description": "Precise Chandrashtam, Panchang, and Nakshatra calculations tailored to your specific geographic location",
      "provider": {
        "@type": "Organization",
        "name": "Moon Mood",
        "url": "https://moonmood.xyz"
      },
      "areaServed": locations.map(location => ({
        "@type": "Place",
        "name": location.name,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": location.latitude || location.lat,
          "longitude": location.longitude || location.lon
        },
        "timezone": location.timezone || location.tz
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default LocationStructuredData;