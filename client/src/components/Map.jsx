import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/map.css';
import control_tower from "../assets/images/control tower.jpg"
import managerOffice from "../assets/images/managerOffice.png"
import ground_attendat from "../assets/images/ground attendant.png"
import technician from "../assets/images/hangers.png"
import AirportInspector from '../dashboard/AirportInspector';
import CloseIcon from '@mui/icons-material/Close';
import MapModal from './MapModal';

// העברנו את הפונקציה מחוץ לקומפוננטה
const createCustomIcon = (iconUrl) => {
  return L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// הגדרת המיקומים הראשוניים מחוץ לקומפוננטה
const initialMarkers = [
  {
    position: [40.642289, -73.781261],
    icon: createCustomIcon(control_tower),
    title: "airport_inspector",
    hebrewTitle: "מגדל פיקוח"
  },
  {
    position: [40.6551680, -73.802397],
    icon: createCustomIcon(technician),
    title: "technicion",
    hebrewTitle: "האנגר"
  },
  {
    position: [40.648402, -73.799179],
    icon: createCustomIcon(managerOffice),
    title: "manager",
    hebrewTitle: "משרד מנהל"
  },
  {
    position: [40.647680, -73.792892],
    icon: createCustomIcon(ground_attendat),
    title: "ground_attendant",
    hebrewTitle: "שער עליה למטוס"
  }
];

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [center, setCenter] = useState([40.6413, -73.7781]); // JFK Airport
  const [markersPositions, setMarkersPositions] = useState(initialMarkers);


  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center,
        zoom: 14,
        minZoom: 14,
        maxZoom: 18,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // הוספת מאזין לחיצה על המפה
      mapRef.current.on('click', (e) => {
        console.log('Clicked on map at:', {
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6)
        });
      });

      mapRef.current.on('moveend', () => {
        const newCenter = mapRef.current.getCenter();
        setCenter([newCenter.lat, newCenter.lng]);
      });
    }
  }, []);

  // הוספת הסמנים למפה
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      markersPositions.forEach(location => {
        const marker = L.marker(location.position, {
          icon: location.icon,
          draggable: true
        })
          .bindPopup(location.hebrewTitle, {
            autoClose: true,     // הפופאפ ייסגר כשהעכבר יוצא
            closeOnClick: true,  // הפופאפ ייסגר בלחיצה
            closeButton: false,  // הסתרת כפתור הסגירה
          })
          .addTo(mapRef.current);

        // הצגת הפופאפ כשהעכבר מעל הסמן
        marker.on('mouseover', function() {
          this.openPopup();
        });

        // הסתרת הפופאפ כשהעכבר יוצא מהסמן
        marker.on('mouseout', function() {
          this.closePopup();
        });

        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          console.log(`${location.title} dragged to:`, {
            lat: position.lat.toFixed(6),
            lng: position.lng.toFixed(6)
          });
          setMarkersPositions(prev => prev.map(loc =>
            loc.title === location.title
              ? { ...loc, position: [position.lat, position.lng] }
              : loc
          ));
        });

        marker.on('click', () => {
          setActiveMarker(location.title);
        });
      });
    }
  }, [markersPositions]);

  return <div className="main-content">
    <div className="map-wrapper">
      <div
        ref={mapContainerRef}
        className="map-container"
      />
      {activeMarker && (
        <MapModal 
          type={activeMarker} 
          onClose={() => setActiveMarker(null)} 
        />
      )}
    </div>
  </div>
};

export default Map;