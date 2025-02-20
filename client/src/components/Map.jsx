import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [center, setCenter] = useState([40.6413, -73.7781]); // JFK Airport

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center,
        zoom: 13,
        minZoom: 10,
        maxZoom: 17,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      mapRef.current.on('moveend', () => {
        const newCenter = mapRef.current.getCenter();
        setCenter([newCenter.lat, newCenter.lng]);
      });
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default Map;