import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/map.css';
import control_tower from "../assets/images/control tower.jpg"
import managerOffice from "../assets/images/managerOffice.png"
import ground_attendat from "../assets/images/ground attendant.png"
import technician from "../assets/images/hangers.png"
import MapModal from './MapModal';
//
const createCustomIcon = (iconUrl) => {
  const iconSize = 40;
  
  const iconHtml = `
    <div class="custom-marker">
      <img src="${iconUrl}" 
           style="width: 80%; height: 80%; object-fit: contain;"
      />
    </div>`;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize/2, iconSize/2],
    popupAnchor: [0, -iconSize/2]
  });
};

const initialMarkers = [
  {
    position: [40.642289, -73.781261],
    icon: createCustomIcon(control_tower),
    title: "airportInspector",
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
    title: "groundAttendant",
    hebrewTitle: "שער עליה למטוס"
  }
];

const saveMarkerPosition = async (title, position) => {
  try {
    const response = await fetch('/api/markers/position', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        title,
        position: {
          lat: position[0],
          lng: position[1]
        }
      }),
    });
    if (!response.ok) throw new Error('Failed to save marker position');
    console.log('Marker position saved successfully');
  } catch (error) {
    console.error('Error saving marker position:', error);
  }
};

/**
 * קומפוננטת המפה הראשית
 * מציגה מפה אינטראקטיבית עם סמנים הניתנים לגרירה
 */
const Map = () => {
  // רפרנסים לשמירת התייחסות לאלמנטים של המפה
  const mapContainerRef = useRef(null);  // הקונטיינר שמכיל את המפה
  const mapRef = useRef(null);           // אובייקט המפה של leaflet
  
  // ניהול state של הקומפוננטה
  const [activeMarker, setActiveMarker] = useState(null);  // הסמן הנוכחי שנלחץ
  const [markersPositions, setMarkersPositions] = useState(initialMarkers);  // מיקומי כל הסמנים

  /**
   * אפקט לאתחול המפה - מתבצע פעם אחת בטעינה
   */
  useEffect(() => {
    const initMap = () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [
          (40.668464 + 40.629587) / 2, // ממוצע של קווי הרוחב
          (-73.724442 + -73.856277) / 2 // ממוצע של קווי האורך
        ],
        zoom: 14,
        minZoom: 14,
        maxZoom: 18,
        dragging: true,
        scrollWheelZoom: true
      });

      // הגדרת גבולות המפה - מגביל את התנועה לאזור שדה התעופה
      const bounds = L.latLngBounds(
        [40.629587, -73.856277], // נקודה דרום-מערבית
        [40.668464, -73.724442]  // נקודה צפון-מזרחית
      );

      map.fitBounds(bounds);  // התאמת המפה לגבולות שהוגדרו

      // הוספת שכבת המפה הבסיסית מ-OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // מעקב אחר גרירת המפה - מדפיס את הגבולות הנוכחיים לצורכי פיתוח
      map.on('dragend', () => {
        const bounds = map.getBounds();
        console.log('Current map bounds:', {
          southWest: {
            lat: bounds.getSouthWest().lat.toFixed(6),
            lng: bounds.getSouthWest().lng.toFixed(6)
          },
          northEast: {
            lat: bounds.getNorthEast().lat.toFixed(6),
            lng: bounds.getNorthEast().lng.toFixed(6)
          }
        });
      });

      mapRef.current = map;
    };

    // אתחול המפה רק אם היא לא קיימת
    if (!mapRef.current) {
      initMap();
    }

    // ניקוי בעת הסרת הקומפוננטה
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  /**
   * אפקט לעדכון הסמנים על המפה
   * מתבצע בכל פעם שמיקומי הסמנים משתנים
   */
  useEffect(() => {
    if (mapRef.current) {
      // הסרת כל הסמנים הקיימים לפני הוספת החדשים
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      // הוספת הסמנים החדשים למפה
      markersPositions.forEach(location => {
        // יצירת סמן חדש עם האייקון המתאים
        const marker = L.marker(location.position, {
          icon: location.icon,
          draggable: true  // Allow dragging for all users
        })
          // הוספת חלון קופץ עם הכותרת בעברית
          .bindPopup(location.hebrewTitle, {
            autoClose: true,
            closeOnClick: true,
            closeButton: false,
          })
          .addTo(mapRef.current);

        // פתיחת החלון הקופץ בעת מעבר עכבר
        marker.on('mouseover', function() {
          this.openPopup();
        });

        // סגירת החלון הקופץ כשהעכבר יוצא
        marker.on('mouseout', function() {
          this.closePopup();
        });

        // טיפול בסיום גרירת סמן
        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          const newPosition = [position.lat, position.lng];
          
          // עדכון מיקום הסמן ב-state
          setMarkersPositions(prev => prev.map(loc =>
            loc.title === location.title
              ? { ...loc, position: newPosition }
              : loc
          ));

          // שמירת המיקום החדש בשרת
          saveMarkerPosition(location.title, newPosition);
        });

        // טיפול בלחיצה על סמן - פתיחת המודל המתאים
        marker.on('click', () => {
          setActiveMarker(location.title);
        });
      });
    }
  }, [markersPositions]);

  /**
   * אפקט לטעינת מיקומי הסמנים מהשרת בטעינה הראשונית
   */
  useEffect(() => {
    const fetchMarkerPositions = async () => {
      try {
        const response = await fetch('/api/markers/positions');
        if (!response.ok) throw new Error('Failed to fetch marker positions');
        const positions = await response.json();
        
        // עדכון המיקומים רק אם יש מידע בשרת
        if (positions.length > 0) {
          setMarkersPositions(prev => prev.map(marker => {
            const savedPosition = positions.find(p => p.title === marker.title);
            return savedPosition 
              ? { ...marker, position: savedPosition.position }
              : marker;
          }));
        }
      } catch (error) {
        console.error('Error fetching marker positions:', error);
      }
    };

    fetchMarkerPositions();
  }, []);

  // רינדור הקומפוננטה
  return (
    <div className="main-content">
      <div className="map-wrapper">
        {/* מיכל המפה */}
        <div ref={mapContainerRef} className="map-container" />
        {/* מודל שנפתח בלחיצה על סמן */}
        {activeMarker && (
          <MapModal 
            type={activeMarker} 
            onClose={() => setActiveMarker(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Map;