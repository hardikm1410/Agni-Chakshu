import { Maximize2, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Create a realistic HTML icon for the dashboard map
const createMiniIcon = (color) => L.divIcon({
  className: 'custom-fire-marker',
  html: `<div style="width: 14px; height: 14px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 10px 2px ${color}80; position: relative;">
          <div style="position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; background-color: ${color}; border-radius: 50%; transform: translate(-50%, -50%); animation: ping-marker 2s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.8;"></div>
         </div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const redMini = createMiniIcon('#3b82f6');
const orangeMini = createMiniIcon('#f97316');

export default function MapMockup() {
  const navigate = useNavigate();
  // Realistic dense area for street-level view (e.g. San Francisco or industrial zone)
  const centerPos = [37.7749, -122.4194]; 

  return (
    <div className="thermal-card" style={{ height: '450px', padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(2, 6, 23, 0.4)', zIndex: 1000, position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Map size={20} color="#3b82f6" />
          <h3 style={{ margin: 0, color: '#e4e4e7', fontSize: '1.1rem', fontWeight: '600' }}>Live Map Overview</h3>
        </div>
        <button 
          onClick={() => navigate('/live-map')}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1e293b', padding: '0.4rem 0.75rem', borderRadius: '6px', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = '#f4f4f5'}
          onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}
        >
          <Maximize2 size={14} /> Expand
        </button>
      </div>
      
      {/* Map Container */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#020617' }}>
        <MapContainer 
          center={centerPos} 
          zoom={13} 
          zoomControl={false}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[37.7849, -122.4094]} icon={redMini}>
            <Popup>Critical Source detected</Popup>
          </Marker>
          <Marker position={[37.7649, -122.4294]} icon={orangeMini} />
          <Marker position={[37.7749, -122.4394]} icon={orangeMini} />
        </MapContainer>

        {/* Overlay Vignette to blend edges */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', boxShadow: 'inset 0 0 50px 20px rgba(2, 6, 23, 0.7)', zIndex: 10 }}></div>
      </div>
    </div>
  );
}


