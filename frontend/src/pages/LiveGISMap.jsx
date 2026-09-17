import { MapPin, Search, Filter, Flame, AlertTriangle, Clock, ThermometerSun, Navigation, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom fire marker icons using HTML
const createFireIcon = (color) => L.divIcon({
  className: 'custom-fire-marker',
  html: `<div style="
    width: 20px; 
    height: 20px; 
    background-color: ${color}; 
    border-radius: 50%; 
    box-shadow: 0 0 15px 4px ${color}80;
    position: relative;
  ">
    <div style="
      position: absolute; 
      top: 50%; left: 50%; 
      width: 100%; height: 100%; 
      background-color: ${color}; 
      border-radius: 50%; 
      transform: translate(-50%, -50%); 
      animation: ping-marker 2s cubic-bezier(0, 0, 0.2, 1) infinite; 
      opacity: 0.8;
    "></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const redIcon = createFireIcon('#ef4444');
const orangeIcon = createFireIcon('#f97316');
const yellowIcon = createFireIcon('#eab308');

// Demo data matching NASA FIRMS structure
const demoFirmsData = [
  { id: 1, latitude: 34.0522, longitude: -118.2437, brightness: 345.2, confidence: 98, frp: 124.5, acq_date: "2023-10-27", acq_time: "14:20", satellite: "Aqua", severity: "Critical", name: "Los Angeles Sector" },
  { id: 2, latitude: -33.8688, longitude: 151.2093, brightness: 312.4, confidence: 85, frp: 45.2, acq_date: "2023-10-27", acq_time: "08:15", satellite: "Terra", severity: "Active", name: "Sydney Outskirts" },
  { id: 3, latitude: 51.5074, longitude: -0.1278, brightness: 305.1, confidence: 72, frp: 22.1, acq_date: "2023-10-27", acq_time: "10:45", satellite: "Aqua", severity: "Active", name: "London Industrial" },
  { id: 4, latitude: -23.5505, longitude: -46.6333, brightness: 358.9, confidence: 100, frp: 210.8, acq_date: "2023-10-27", acq_time: "16:30", satellite: "Terra", severity: "Critical", name: "São Paulo Border" },
  { id: 5, latitude: 35.6762, longitude: 139.6503, brightness: 298.5, confidence: 65, frp: 18.4, acq_date: "2023-10-27", acq_time: "03:10", satellite: "Aqua", severity: "Low", name: "Tokyo Anomaly" },
];

export default function LiveGISMap() {
  const [firmsData, setFirmsData] = useState(demoFirmsData);
  const [selectedFire, setSelectedFire] = useState(demoFirmsData[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingLive, setIsUsingLive] = useState(false);

  useEffect(() => {
    async function fetchLiveFirmsData() {
      const MAP_KEY = import.meta.env.VITE_NASA_FIRMS_MAP_KEY;
      if (!MAP_KEY) return;

      try {
        setIsLoading(true);
        const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${MAP_KEY}/VIIRS_SNPP_NRT/IND/1`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('API fetch failed');
        
        const csvText = await response.text();
        const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
        
        if (lines.length > 1) {
          const headers = lines[0].split(',');
          const parsedData = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            const getVal = (key) => values[headers.indexOf(key)];
            
            const confRaw = getVal('confidence');
            let confNum = 70;
            if (confRaw === 'h') confNum = 95;
            if (confRaw === 'l') confNum = 40;
            if (!isNaN(parseInt(confRaw))) confNum = parseInt(confRaw);

            const frp = parseFloat(getVal('frp')) || 0;
            let severity = 'Low';
            if (frp > 100) severity = 'Critical';
            else if (frp > 30) severity = 'Active';

            return {
              id: `live-${index}`,
              latitude: parseFloat(getVal('latitude')),
              longitude: parseFloat(getVal('longitude')),
              brightness: parseFloat(getVal('brightness')) || 0,
              confidence: confNum,
              frp: frp,
              acq_date: getVal('acq_date'),
              acq_time: getVal('acq_time'),
              satellite: getVal('satellite') || 'VIIRS',
              severity,
              name: `IND Sector ${index + 1}`
            };
          });
          
          const validData = parsedData.filter(d => !isNaN(d.latitude) && !isNaN(d.longitude));
          if (validData.length > 0) {
            setFirmsData(validData);
            setSelectedFire(validData[0]);
            setIsUsingLive(true);
          }
        }
      } catch (error) {
        console.error("NASA FIRMS API failed, using fallback demo data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLiveFirmsData();
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [confidenceFilter, setConfidenceFilter] = useState('All Confidence');
  const [timeFilter, setTimeFilter] = useState('Last 7 Days');

  // Apply Filters
  const filteredData = firmsData.filter(fire => {
    const matchesSearch = fire.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fire.satellite.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'All Severity' || fire.severity === severityFilter;
    
    let matchesConfidence = true;
    if (confidenceFilter === '> 90%') matchesConfidence = fire.confidence > 90;
    else if (confidenceFilter === '> 75%') matchesConfidence = fire.confidence > 75;
    else if (confidenceFilter === '> 50%') matchesConfidence = fire.confidence > 50;

    let matchesTime = true;
    if (timeFilter === 'Last 24 Hours') {
      // Mock logic: assuming demo data is within 7 days, limit to specific ids for demo purposes
      matchesTime = fire.confidence > 80; // Arbitrary logic just to show filtering
    }

    return matchesSearch && matchesSeverity && matchesConfidence && matchesTime;
  });

  const activeCount = filteredData.filter(d => d.severity === 'Active').length;
  const criticalCount = filteredData.filter(d => d.severity === 'Critical').length;

  const handleReset = () => {
    setSearchQuery('');
    setSeverityFilter('All Severity');
    setConfidenceFilter('All Confidence');
    setTimeFilter('Last 7 Days');
  };

  return (
    <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#f8fafc', letterSpacing: '-0.5px' }}>Live GIS Map</h2>
          <p style={{ color: '#a1a1aa', margin: 0, fontSize: '1.1rem' }}>
            Monitor active thermal hotspots and fire-risk regions in real time.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.3)', color: '#fdba74' }}>
            <span style={{ fontWeight: 'bold' }}>{activeCount}</span> Active Fires
          </div>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}>
            <span style={{ fontWeight: 'bold' }}>{criticalCount}</span> Critical Fires
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'rgba(15,15,15,0.6)', border: '1px solid #27272a', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={18} color="#71717a" />
          <input 
            placeholder="Search region or hotspot..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#f4f4f5', width: '100%', outline: 'none' }} 
          />
        </div>
        <select 
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{ backgroundColor: 'rgba(15,15,15,0.6)', color: '#f4f4f5', border: '1px solid #27272a', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none' }}
        >
          <option>All Severity</option>
          <option>Critical</option>
          <option>Active</option>
          <option>Low</option>
        </select>
        <select 
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value)}
          style={{ backgroundColor: 'rgba(15,15,15,0.6)', color: '#f4f4f5', border: '1px solid #27272a', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none' }}
        >
          <option>All Confidence</option>
          <option>&gt; 90%</option>
          <option>&gt; 75%</option>
          <option>&gt; 50%</option>
        </select>
        <select 
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          style={{ backgroundColor: 'rgba(15,15,15,0.6)', color: '#f4f4f5', border: '1px solid #27272a', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none' }}
        >
          <option>Last 7 Days</option>
          <option>Last 24 Hours</option>
        </select>
        <button 
          onClick={handleReset}
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5', border: '1px solid #3f3f46', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Filter size={16} /> Clear Filters
        </button>
      </div>

      {isUsingLive ? (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6ee7b7', fontSize: '0.95rem' }}>
          <Info size={18} />
          <strong>Live Telemetry Active</strong>
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#93c5fd', fontSize: '0.95rem' }}>
          <Info size={18} />
          <strong>Demo Mode — MAP_KEY required for live NASA FIRMS satellite telemetry.</strong>
        </div>
      )}

      <div className="gis-main-grid">
        {/* Large Map */}
        <div className="thermal-card" style={{ height: '700px', padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #27272a', backgroundColor: 'rgba(5, 5, 5, 0.4)', zIndex: 1000, position: 'relative' }}>
            <h3 style={{ margin: 0, color: '#e4e4e7', fontSize: '1.2rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Navigation size={20} /> Global Thermal Intelligence Map
            </h3>
          </div>
          <div style={{ flex: 1, backgroundColor: '#09090b', zIndex: 1 }}>
            <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%', backgroundColor: '#050505' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredData.map(fire => {
                let icon = yellowIcon;
                if (fire.severity === 'Critical') icon = redIcon;
                else if (fire.severity === 'Active') icon = orangeIcon;

                return (
                  <Marker 
                    key={fire.id} 
                    position={[fire.latitude, fire.longitude]} 
                    icon={icon}
                    eventHandlers={{ click: () => setSelectedFire(fire) }}
                  >
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </div>

        {/* Selected Details Panel */}
        <div className="thermal-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '700px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27272a', paddingBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.75rem', color: '#f8fafc' }}>{selectedFire.name}</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#a1a1aa' }}>Selected Hotspot</p>
            </div>
            <div style={{ backgroundColor: selectedFire.severity === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)', padding: '0.75rem', borderRadius: '12px', color: selectedFire.severity === 'Critical' ? '#ef4444' : '#f97316' }}>
              <Flame size={32} />
            </div>
          </div>

          <div style={{ 
            backgroundColor: selectedFire.severity === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)', 
            border: `1px solid ${selectedFire.severity === 'Critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(249, 115, 22, 0.4)'}`, 
            padding: '0.5rem 1rem', borderRadius: '6px', 
            color: selectedFire.severity === 'Critical' ? '#fca5a5' : '#fdba74', 
            fontWeight: '700', display: 'inline-block', width: 'fit-content', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' 
          }}>
            {selectedFire.severity} RISK
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderBottom: '1px solid #27272a', paddingBottom: '1.5rem' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#71717a', fontSize: '0.9rem' }}>Brightness</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '1.3rem', fontWeight: '600' }}>
                <ThermometerSun size={20} color={selectedFire.severity === 'Critical' ? '#ef4444' : '#f97316'} /> {selectedFire.brightness}K
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#71717a', fontSize: '0.9rem' }}>Detected</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '1.3rem', fontWeight: '600' }}>
                <Clock size={20} color="#a1a1aa" /> {selectedFire.acq_time}
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#71717a', fontSize: '0.9rem' }}>Coordinates</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '1.1rem', fontWeight: '600' }}>
                <MapPin size={20} color="#3b82f6" /> {selectedFire.latitude}°, {selectedFire.longitude}°
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#71717a', fontSize: '0.9rem' }}>Confidence</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '1.3rem', fontWeight: '600' }}>
                {selectedFire.confidence}%
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={20} color="#f97316" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ margin: 0, color: '#fdba74', fontSize: '0.95rem', lineHeight: '1.5' }}>
                <strong>FRP (Fire Radiative Power):</strong> {selectedFire.frp} MW
              </p>
              <p style={{ margin: 0, color: '#fdba74', fontSize: '0.95rem', lineHeight: '1.5' }}>
                <strong>Satellite:</strong> {selectedFire.satellite}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#dc2626'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#ef4444'}>
              Generate Incident Report
            </button>
            <button style={{ backgroundColor: 'transparent', color: '#a1a1aa', border: '1px solid #3f3f46', padding: '1rem', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              View Historical Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}