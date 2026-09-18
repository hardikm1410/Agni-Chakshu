# ThermoWatch: AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources

## Project Overview

ThermoWatch is a robust system for processing live FIRMS (Fire Information for Resource Management System) data from NASA, classifying thermal anomalies using OpenStreetMap (OSM) facility context, and returning valid GeoJSON format for direct use in GIS and mapping libraries like OpenStreetMap, Leaflet, or Mapbox.

The system eliminates hardcoded/demo values in the frontend, ensuring all components dynamically consume data from the backend. It respects FIRMS API limits (max 5 days per request) and loads facility context dynamically from OSM exports or user-provided CSV files.

## Features

- **Live FIRMS Data Processing**: Fetches and processes real-time fire data from NASA FIRMS API.
- **Dynamic Facility Context**: Loads industrial facilities from OSM exports or user-provided CSV files (name, type, latitude, longitude[, osm_id]).
- **Intelligent Classification**: Classifies thermal anomalies into categories like:
  - Probable gas flare
  - Industrial thermal source
  - Intense wildfire
  - Agricultural burning
  - Thermal anomaly - requires review
- **GeoJSON Output**: Returns standard GeoJSON FeatureCollection for direct mapping library use.
- **Persistence Tracking**: Tracks historical detections to identify persistent thermal sources.
- **Frontend-Backend Separation**: 
  - Backend: FastAPI service handling data fetching, processing, and classification.
  - Frontend: React application with dynamic data fetching via context API (no hardcoded data).
- **Security**: FIRMS MAP_KEY is kept on the backend only; frontend only needs the API URL.
- **Scalable Design**: Easy to extend with new classification rules or data sources.

## System Architecture

### Backend (`/backend`)
- **Technology**: Python 3.11, FastAPI, Uvicorn
- **Key Components**:
  - `app.py`: Main FastAPI application with endpoints for:
    - `/api/hotspots`: Returns classified FIRMS data as GeoJSON with metadata
    - `/api/hotspots/geojson`: Returns pure GeoJSON for mapping libraries
    - `/api/facilities`: Returns loaded facilities as GeoJSON
    - `/health`: Health check endpoint
  - **Functions**:
    - `fetch_firms_data()`: Fetches data from NASA FIRMS API
    - `load_facility_data()`: Loads facilities from CSV, OSM export, or sample data
    - `classify_firms_detection()`: Classifies each FIRMS record based on:
      - Proximity to facilities (<5km)
      - Fire characteristics (FRP, brightness, confidence)
      - Time of observation (day/night)
      - (Optional) Persistence tracking
    - `haversine_distance()`: Calculates distance between points for facility proximity

### Frontend (`/frontend`)
- **Technology**: React 18, Vite, Tailwind CSS
- **Key Components**:
  - `src/context/FirmsDataContext.jsx`: React context for global state management
  - `src/App.jsx`: Root component wrapped with data and auth providers
  - `src/pages/`: All pages (Dashboard, Analytics, Home, Alerts, etc.) consume live data from context
  - `src/api/firms.js`: API wrapper calling `/api/hotspots/geojson` without exposing MAP_KEY
- **Features**:
  - Dynamic data fetching from backend (no hardcoded/demo values)
  - Live KPIs, charts, and maps
  - Persistent source detection
  - Alert generation
  - System status monitoring

## Installation & Setup

### Prerequisites
- Node.js >= 16 (for frontend)
- Python >= 3.11 (for backend)
- Git

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Agni-Chakshu
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set environment variables (create a `.env` file in `/backend`):
   ```env
   FIRMS_MAP_KEY=your_nasa_firms_map_key_here
   ```
   > **Note**: Obtain your MAP_KEY from [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/)

4. Start the backend:
   ```bash
   python -m app
   ```
   The backend will run on `http://localhost:8000`

### Frontend Setup
1. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
2. Create a `.env` file in `/frontend`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

### Base URL: `http://localhost:8000`

| Endpoint | Method | Description | Key Parameters |
|----------|--------|-------------|----------------|
| `/` | GET | Root endpoint with API info | - |
| `/health` | GET | Health check | - |
| `/api/facilities` | GET | Get loaded facilities as GeoJSON | - |
| `/api/hotspots` | GET | Get classified FIRMS data with metadata | `map_key`, `source`, `area`, `days`, `use_sample`, `refresh`, `facility_path` |
| `/api/hotspots/geojson` | GET | Get pure GeoJSON for mapping libraries | Same as `/api/hotspots` |

#### Query Parameters for `/api/hotspots` and `/api/hotspots/geojson`:
- `map_key` (optional): NASA FIRMS MAP_KEY. If not provided, uses sample data.
- `source` (default: `"VIIRS_SNPP_NRT"`): FIRMS data source (e.g., `VIIRS_NOAA20_NRT`).
- `area` (default: `"69.5,22.0,70.5,22.8"`): Bounding box as `west,south,east,north`.
- `days` (default: `5`, max: `5`): Number of days to look back (FIRMS API limit).
- `use_sample` (default: `false`): Force use of bundled sample data.
- `refresh` (default: `false`): Force refresh of FIRMS data from API.
- `facility_path` (optional): Path to facility CSV (must contain `name,type,latitude,longitude[,osm_id]`).

#### Response Format (`/api/hotspots`):
```json
{
  "type": "FeatureCollection",
  "features": [ /* GeoJSON features */ ],
  "metadata": {
    "count": <number of features>,
    "query_params": { /* echoed parameters */ },
    "processing_stats": { "total_records": ..., "processed": ..., "errors": ... },
    "timestamp": "<ISO timestamp>",
    "facilities_used": <number of facilities loaded>
  }
}
```

#### Response Format (`/api/hotspots/geojson`):
Standard GeoJSON FeatureCollection:
```json
{
  "type": "FeatureCollection",
  "features": [ /* Array of GeoJSON feature objects */ ]
}
```

Each feature has properties including:
- `label`: Classification label (e.g., "Probable gas flare")
- `category`: Classification category
- `color`: Hex color for visualization
- `confidence`: Classification confidence (0-95)
- `nearest_facility_name`: Name of nearest facility
- `distance_to_facility_km`: Distance to nearest facility in km
- `frp_mw`: Fire Radiative Power in megawatts
- `brightness_k`: Brightness temperature in Kelvin
- `daynight`: "Day" or "Night"
- `reasons`: Array of reasoning strings for classification

## Data Sources

### FIRMS Data
- Source: NASA FIRMS API
- Format: CSV with columns like latitude, longitude, brightness, FRP, etc.
- The backend respects the FIRMS API limit of maximum 5 days per request.

### Facility Data
The system loads facilities in this order of precedence:
1. **User-provided CSV** (via `facility_path` parameter)
   - Must contain columns: `name`, `type`, `latitude`, `longitude` (and optionally `osm_id`)
   - Example:
     ```csv
     name,type,latitude,longitude,osm_id
     Reliance Refinery,refinery,22.3367861,69.8665828,91585872
     Jamnagar Power Plant,plant,22.3230732,69.8669379,295429703
     ```
2. **OSM Export** (default: `/home/hardik/Desktop/EmberWatch/export.geojson`)
   - The system extracts industrial facilities from OSM data (landuse=industrial, power=plant, etc.)
3. **Sample Facilities** (hard-coded fallback)
   - Five sample facilities in the Jamnagar, India area for development/testing

## Classification Logic

The classification algorithm assigns a score based on:
- **Night-time observation** (+20): FIRMS night observations are more likely to be persistent industrial sources like gas flares.
- **Proximity to facility** (+35 if within 5km): Closer to known industrial facilities increases likelihood of industrial source.
- **Fire Radiative Power (FRP)** (+0 to 10): Higher FRP indicates more intense heat source.
- **Brightness temperature** (+0 to 5): Higher brightness indicates stronger thermal signal.
- **Confidence level** (-5 to +10): Based on FIRMS confidence flag (nominal, high, low).

### Classification Thresholds:
- **Score >= 60**: 
  - Near facility & low FRP & night → "Probable gas flare"
  - Near facility → "Industrial thermal source"
  - Else → "Persistent thermal anomaly"
- **Score >= 40**: "Thermal anomaly - likely industrial"
- **Score < 40**: "Thermal anomaly - requires review"

Additional adjustments for wildfire/agricultural patterns:
- High FRP (>10 MW) + high brightness → "Intense wildfire"
- Moderate FRP (1-10 MW) → "Large fire" or "Moderate fire"
- Low FRP (<1 MW) + no nearby facility → "Possible agricultural burning"

## Persistence Tracking

The system optionally tracks persistent thermal sources by:
- Recording detection locations (rounded to ~1km grid)
- Tracking which dates each location was active
- Calculating persistence score as number of unique days detected in the last 7 days
- This requires historical data accumulation over time

## Frontend Components

All frontend pages are dynamically driven by data from the backend via React context:

- **Dashboard**: KPIs (total hotspots, avg confidence, last update) and charts (daily trend, category distribution)
- **Analytics**: Detailed charts (confidence, brightness, FRP, category, satellite, day/night)
- **Home**: Live stats and recent hotspots list
- **Alerts**: Configurable alert rules and recent alerts log
- **PersistentSources**: Locations detected on multiple days (persistence analysis)
- **FireIntel**: Detailed fire intelligence and facility proximity analysis
- **SystemStatus**: Backend health, facility count, and system metrics
- **LiveGISMap**: Interactive map showing classified hotspots (using Leaflet or Mapbox)

## Configuration

### Backend (`/backend`)
- Environment variables in `.env`:
  - `FIRMS_MAP_KEY`: Your NASA FIRMS MAP_KEY (required for live data)
- Constants in `app.py`:
  - `FIRMS_API_BASE`: NASA FIRMS API endpoint
  - `DATA_CACHE_DIR`: Directory for persistence data
  - `PERSISTENCE_DAYS`: Days to keep persistence data (default: 7)
  - `PERSISTENCE_GRID_SIZE`: Grid size for persistence tracking (default: 0.01° ≈ 1km)

### Frontend (`/frontend`)
- Environment variables in `.env`:
  - `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)
- Configuration in `src/App.jsx` and context providers

## Development

### Backend
- Run tests: `python -m pytest` (if tests are added)
- Linting: `flake8` or `pylint`
- Type checking: `mypy` (if type hints are added)

### Frontend
- Linting: `eslint src/**/*.jsx`
- Formatting: `prettier --write src/**/*.jsx`
- Build for production: `npm run build`

## Deployment

### Backend (Production)
- Use a production ASGI server like `uvicorn` or `gunicorn`:
  ```bash
  gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
  ```
- Set up reverse proxy (NGINX) for SSL and load balancing
- Set environment variables in production environment

### Frontend (Production)
- Build static assets:
  ```bash
  cd frontend
  npm run build
  ```
- Serve the `dist` directory with any static web server (NGINX, Apache, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NASA FIRMS for providing free fire data
- OpenStreetMap contributors for facility data
- The React and FastAPI communities for excellent frameworks
- SIH26162 organizers for the problem statement that inspired this project

---

**Last Updated**: September 2026  
**Maintained by**: The ThermoWatch Team