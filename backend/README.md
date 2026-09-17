# ThermoWatch API

A FastAPI backend for processing NASA FIRMS thermal anomaly data, classifying detections using OSM facility context, and returning GeoJSON for overlay on OpenStreetMap or GIS systems.

## Features

- Fetches live FIRMS VIIRS data via NASA's FIRMS Area API (requires a free MAP_KEY)
- Classifies thermal anomalies into categories:
  - Probable gas flare (persistent night-time near facilities)
  - Industrial thermal source
  - Wildfire (intense/large)
  - Agricultural burning (moderate)
  - Thermal anomaly - requires review
- Uses OSM industrial facility data (from your exported GeoJSON) for proximity context
- Returns standard GeoJSON FeatureCollection with properties suitable for styling in Leaflet, Mapbox GL, OpenLayers, QGIS, etc.
- Includes detailed reasoning and confidence scores for transparency
- CORS-enabled for easy frontend integration
- Falls back to sample data when API unavailable (useful for development)

## Installation

1. Clone the repository (or copy the backend folder)
2. Navigate to the backend directory:
   ```bash
   cd /home/hardik/Desktop/EmberWatch/backend
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Or create a virtual environment first)*

## Configuration

### NASA FIRMS MAP_KEY
You need a free MAP_KEY from NASA FIRMS:
1. Go to https://firms.modaps.eosdis.nasa.gov/api/
2. Click "MAP KEY" (top right) and register with your email/institution
3. Copy the key (looks like a hex string)

Set the key as an environment variable before starting the server:
```bash
export FIRMS_MAP_KEY=your_actual_key_here
```
Or pass it per request via the `map_key` query parameter.

### OSM Facility Data
Place your OSM export (containing industrial facilities) at:
```
/home/hardik/Desktop/EmberWatch/export.geojson
```
The backend will automatically load all point features tagged as industrial (refinery, power plant, oil facility, etc.) from this file.

## Usage

Start the server:
```bash
cd /home/hardik/Desktop/EmberWatch/backend
python -m app
```
By default, it runs on `http://0.0.0.0:8000`.

### API Endpoints

- `GET /` – API info and status
- `GET /health` – Health check (`{"status":"healthy", ...}`)
- `GET /api/facilities` – Returns GeoJSON of all loaded OSM industrial facilities
- `GET /api/hotspots` – Returns GeoJSON FeatureCollection with metadata wrapper
- `GET /api/hotspots/geojson` – Returns pure GeoJSON FeatureCollection (ideal for mapping libraries)

#### Query Parameters (for `/api/hotspots` and `/api/hotspots/geojson`)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `map_key` | NASA FIRMS MAP_KEY (optional if `FIRMS_MAP_KEY` env var is set) | (none) |
| `source` | FIRMS data source (e.g., `VIIRS_SNPP_NRT`, `VIIRS_NOAA20_NRT`) | `VIIRS_SNPP_NRT` |
| `area` | Bounding box as `west,south,east,north` (decimal degrees) | `69.5,22.0,70.5,22.8` (Jamnagar, India) |
| `days` | Number of days to look back (max 5 due to FIRMS API limit) | `5` |
| `use_sample` | Force use of bundled sample data (ignore live API) | `false` |
| `refresh` | Force refresh (ignores any client-side caching) | `false` |

### Example Requests

**Live data (using env var):**
```bash
curl "http://localhost:8000/api/hotspots/geojson"
```

**With explicit key and custom area (e.g., Punjab stubble burning region):**
```bash
curl "http://localhost:8000/api/hotspots/geojson?map_key=YOUR_KEY&source=VIIRS_SNPP_NRT&area=74,29,76,31&days=5"
```

**Force sample data (for testing without API key):**
```bash
curl "http://localhost:8000/api/hotspots/geojson?use_sample=true"
```

## Response Format

The `/api/hotspots/geojson` endpoint returns a GeoJSON FeatureCollection where each feature has:

### Geometry
- `type`: "Point"
- `coordinates`: [longitude, latitude] (standard GeoJSON order)

### Properties
- `label`: Human-readable classification (e.g., "Probable gas flare", "Intense wildfire")
- `category`: Machine-readable category string
- `color`: Suggested hex color for visualization (e.g., "#f59e0b" for gas flares)
- `confidence`: Integer 0‑95 representing classification confidence
- `flare_score`: Raw score used to derive label and confidence
- `date`: Acquisition date (YYYY-MM-DD)
- `time_utc`: Acquisition time in UTC (HHMM)
- `daynight`: "Day" or "Night"
- `brightness_k`: Brightness temperature (channel 4) in Kelvin
- `brightness_ti5`: Brightness temperature (channel 5) in Kelvin
- `frp_mw`: Fire Radiative Power in Megawatts
- `scan`, `track`: FIRMS scan and track dimensions
- `satellite`: Satellite identifier (e.g., "N20" for NOAA‑20)
- `instrument`: Instrument (always "VIIRS" for this dataset)
- `confidence_raw`: Original FIRMS confidence flag ("n", "h", "l")
- `version`: FIRMS version string
- `nearest_facility_name`: Name of the closest OSM industrial facility (if any)
- `nearest_facility_type`: Type of that facility (e.g., "refinery", "plant")
- `distance_to_facility_km`: Distance to nearest facility in kilometers
- `near_industrial_facility`: Boolean true if within ~5km (FIRMS resolution considered)
- `reasons`: Array of strings explaining the classification (e.g., ["Night-time satellite observation", "1.2 km from OSM-mapped Reliance Refinery"])
- `firms_record_index`: Index of the original record in the input CSV (for debugging)

### Metadata Wrapper (`/api/hotspots` only)
In addition to the FeatureCollection, the `/api/hotspots` endpoint returns a `metadata` object containing:
- `count`: Number of features
- `query_params`: Echo of the parameters used
- `processing_stats`: Total records processed, errors, etc.
- `timestamp`: ISO timestamp of response generation
- `facilities_used`: Number of OSM facilities loaded

## Integration with Frontend (Leaflet Example)

```javascript
fetch('http://localhost:8000/api/hotspots/geojson')
  .then(response => response.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      pointToLayer: (feature, latlng) => {
        const color = feature.properties.color || '#64748b';
        return L.circleMarker(latlng, {
          radius: 8,
          color: color,
          fillColor: color,
          fillOpacity: 0.7,
          weight: 1
        });
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        const reasons = props.reasons ? props.reasons.join('<br>') : '';
        layer.bindPopup(`
          <div style="min-width:200px;">
            <b>${props.label}</b><br/>
            Confidence: ${props.confidence}%<br/>
            FRP: ${props.frp_mw?.toFixed(2)||0} MW<br/>
            Brightness: ${props.brightness_k?.toFixed(1)||0} K<br/>
            ${props.nearest_facility_name ? `Nearest: ${props.nearest_facility_name} (${props.distance_to_facility_km?.toFixed(1)} km)` : ''}
            <hr style="margin:8px 0;">
            ${reasons}
          </div>
        `);
      }
    }).addTo(map);
  });
```

## Development Notes

- The server loads facility data once at startup (from `export.geojson`). To update facilities without restarting, you would need to add an endpoint to reload or use a file-watcher (not implemented for simplicity).
- Classification logic is based on the guidelines from the SIH26162 problem statement and the associated roast analysis, emphasizing transparency and evidence-based labeling.
- Persistence detection (identifying repeated hotspots over multiple days) currently relies on the `days` parameter: you can request up to 5 days per call. For longer periods, make multiple requests and merge results client-side, or extend the backend to page through the API.

## License

MIT – feel free to adapt and extend for your project.

## Acknowledgments

- NASA FIRMS for providing free global fire data
- OpenStreetMap contributors for the facility data
- The SIH26162 problem statement for the inspiring challenge