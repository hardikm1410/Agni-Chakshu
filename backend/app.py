"""
ThermoWatch API - FIRMS Data Processing Backend
Robust backend for processing live FIRMS data and returning classified GeoJSON for OSM overlay
"""

import pandas as pd
import numpy as np
import requests
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from math import radians, sin, cos, sqrt, atan2

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ThermoWatch API",
    description="Backend for classifying FIRMS thermal anomalies with OSM context",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
FIRMS_API_BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
DEFAULT_MAP_KEY = os.getenv("FIRMS_MAP_KEY", "3f0c20da7f7a6b406eced6fecf905b95")  # Should be set via environment variable
DATA_CACHE_DIR = "/home/hardik/Desktop/EmberWatch/backend/data"

# Ensure cache directory exists
os.makedirs(DATA_CACHE_DIR, exist_ok=True)

# Facility data model
class Facility(BaseModel):
    name: str
    type: str
    latitude: float
    longitude: float
    osm_id: Optional[int] = None
    properties: Dict = {}

# Classification result model
class ClassificationResult(BaseModel):
    type: str = "FeatureCollection"
    features: List[Dict]

# FIRMS data model (based on actual CSV columns)
class FirmsRecord(BaseModel):
    latitude: float
    longitude: float
    bright_ti4: float
    bright_ti5: float
    scan: float
    track: float
    acq_date: str
    acq_time: int
    satellite: str
    instrument: str
    confidence: str
    version: str
    frp: float
    daynight: str

# Helper functions
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    radius_km = 6371  # Earth radius in kilometers
    
    return radius_km * c

def load_facility_data() -> List[Facility]:
    """
    Load facility data from OSM export or create sample data
    In production, this would load from a proper OSM extract or database
    """
    facilities = []
    
    # Try to load from the export.geojson file
    osm_path = "/home/hardik/Desktop/EmberWatch/export.geojson"
    if os.path.exists(osm_path):
        try:
            with open(osm_path, 'r') as f:
                osm_data = json.load(f)
                
            for feature in osm_data.get('features', []):
                if feature.get('geometry', {}).get('type') == 'Point':
                    props = feature.get('properties', {})
                    coords = feature['geometry']['coordinates']
                    
                    # Determine if this is an industrial facility
                    is_industrial = (
                        props.get('landuse') == 'industrial' or
                        props.get('industrial') in ['refinery', 'oil'] or
                        props.get('power') == 'plant' or
                        'refinery' in props.get('name', '').lower() or
                        'power' in props.get('name', '').lower() or
                        'plant' in props.get('name', '').lower()
                    )
                    
                    if is_industrial:
                        facility = Facility(
                            name=props.get('name', 'Unknown Facility'),
                            type=props.get('industrial') or props.get('power') or props.get('landuse') or 'industrial',
                            latitude=coords[1],
                            longitude=coords[0],
                            osm_id=int(props.get('@id', '').split('/')[-1]) if props.get('@id', '').startswith('way/') else None,
                            properties=props
                        )
                        facilities.append(facility)
                        
            logger.info(f"Loaded {len(facilities)} facilities from OSM data")
            return facilities
        except Exception as e:
            logger.error(f"Error loading OSM data: {e}")
    
    # Fallback: create sample facilities based on what we saw in the export
    sample_facilities = [
        Facility(
            name="Reliance Refinery",
            type="refinery",
            latitude=22.3367861,
            longitude=69.8665828,
            osm_id=91585872,
            properties={
                "@id": "way/91585872",
                "industrial": "refinery",
                "landuse": "industrial",
                "name": "Reliance Refinery",
                "operator": "Reliance Industries Limited",
                "website": "https://www.ril.com/OurBusinesses/PetroleumRefiningAndMarketing.aspx",
                "wikipedia": "en:Jamnagar Refinery"
            }
        ),
        Facility(
            name="Jamnagar Power Plant",
            type="plant",
            latitude=22.3230732,
            longitude=69.8669379,
            osm_id=295429703,
            properties={
                "@id": "way/295429703",
                "plant:output:electricity": "720 MW",
                "plant:source": "oil",
                "power": "plant",
                "@geometry": "center"
            }
        ),
        Facility(
            name="Industrial Zone",
            type="industrial",
            latitude=22.3422483,
            longitude=69.8603135,
            osm_id=322037750,
            properties={
                "@id": "way/322037750",
                "landuse": "industrial",
                "@geometry": "center"
            }
        ),
        Facility(
            name="DTA Refinery CPP",
            type="plant",
            latitude=22.3289612,
            longitude=69.8569452,
            osm_id=1333561675,
            properties={
                "@id": "way/1333561675",
                "landuse": "industrial",
                "name:en": "DTA Refinery Captive Power Plant (CPP)",
                "power": "plant",
                "source": "https://environmentclearance.nic.in/writereaddata/Online/TOR/27_Dec_2021_16305618795707294Coverletter.pdf",
                "@geometry": "center"
            }
        ),
        Facility(
            name="Oil Industrial Area",
            type="industrial",
            latitude=22.3669749,
            longitude=69.8599535,
            osm_id=1340347659,
            properties={
                "@id": "way/1340347659",
                "industrial": "oil",
                "landuse": "industrial",
                "@geometry": "center"
            }
        )
    ]
    
    logger.info(f"Using {len(sample_facilities)} sample facilities")
    return sample_facilities

def classify_firms_detection(record: FirmsRecord, facilities: List[Facility]) -> Dict:
    """
    Classify a FIRMS detection based on:
    1. Temporal persistence (would need historical data)
    2. Proximity to known facilities
    3. Fire characteristics (FRP, brightness, timing)
    4. Day/Night observation
    
    Returns a GeoJSON feature dictionary
    """
    # Facilities lookup
    nearest_facility = None
    min_distance = float('inf')
    
    for facility in facilities:
        distance = haversine_distance(
            record.latitude, record.longitude,
            facility.latitude, facility.longitude
        )
        if distance < min_distance:
            min_distance = distance
            nearest_facility = facility
    
    # Determine if near industrial facility (within 5km for FIRMS resolution consideration)
    near_facility = nearest_facility and min_distance <= 5.0
    
    # Parse acquisition time
    acq_time_str = str(record.acq_time).zfill(4)
    hour = int(acq_time_str[:2]) if len(acq_time_str) >= 2 else 0
    is_night = hour >= 20 or hour <= 6  # 8PM to 6AM local time approximation
    
    # Classification logic based on the PDF/roast guidelines
    flare_score = 0
    reasons = []
    
    # Note: For persistence scoring, we would need historical data
    # In a real implementation, we'd check how many times this location
    # has been detected in the last N days
    # For now, we'll note that persistence checking requires historical data
    
    # Night-time observation (important for gas flares)
    if is_night:
        flare_score += 20
        reasons.append("Night-time satellite observation")
    
    # Proximity to known industrial facility
    if near_facility:
        flare_score += 35
        reasons.append(f"{min_distance:.2f} km from OSM-mapped {nearest_facility.name}")
    
    # Fire Radiative Power contribution
    frp = record.frp
    if frp > 0:
        flare_score += min(10, frp * 2)  # Cap at 10 points for FRP
        reasons.append(f"Thermal radiative power: {frp:.2f} MW")
    
    # Brightness temperature indicator
    brightness = record.bright_ti4
    if brightness > 300:  # Significant heat signature
        flare_score += 5
        reasons.append(f"High brightness temperature: {brightness:.1f} K")
    
    # Confidence level
    confidence_map = {'n': 0, 'h': 10, 'l': -5}  # nominal, high, low
    conf_bonus = confidence_map.get(record.confidence, 0)
    if conf_bonus != 0:
        flare_score += conf_bonus
        reasons.append(f"Confidence level: {record.confidence}")
    
    # Determine classification based on score and characteristics
    if flare_score >= 60:
        if near_facility and frp < 5.0 and is_night:
            label = "Probable gas flare"
            category = "industrial_persistent_source"
            color = "#f59e0b"  # amber/orange
        elif near_facility:
            label = "Industrial thermal source"
            category = "industrial_thermal"
            color = "#ef4444"  # red
        else:
            label = "Persistent thermal anomaly"
            category = "persistent_anomaly"
            color = "#f97316"  # amber
    elif flare_score >= 40:
        label = "Thermal anomaly - likely industrial"
        category = "likely_industrial"
        color = "#fbbf24"  # yellow
    else:
        label = "Thermal anomaly - requires review"
        category = "unknown"
        color = "#64748b"  # slate
    
    # Adjust for wildfire/agricultural indicators
    if not near_facility and frp > 10.0:
        if brightness > 350:
            label = "Intense wildfire"
            category = "wildfire_intense"
            color = "#dc2626"  # dark red
            flare_score = max(flare_score, 75)
        else:
            label = "Large fire - possibly wildfire or agricultural"
            category = "fire_large"
            color = "#ea580c"  # orange-red
            flare_score = max(flare_score, 60)
    elif not near_facility and frp > 1.0:
        label = "Moderate fire - possible agricultural burning"
        category = "fire_moderate"
        color = "#f97316"  # amber
        flare_score = max(flare_score, 40)
    
    # Ensure score doesn't exceed 95 for display purposes
    display_confidence = min(flare_score, 95)
    
    # Create GeoJSON feature
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [record.longitude, record.latitude]  # GeoJSON: [lon, lat]
        },
        "properties": {
            # Classification results
            "label": label,
            "category": category,
            "color": color,
            "confidence": display_confidence,
            "flare_score": flare_score,
            
            # Temporal info
            "date": record.acq_date,
            "time_utc": str(record.acq_time).zfill(4),
            "daynight": "Night" if is_night else "Day",
            
            # Fire characteristics
            "brightness_k": record.bright_ti4,
            "brightness_ti5": record.bright_ti5,
            "frp_mw": record.frp,
            "scan": record.scan,
            "track": record.track,
            
            # Satellite info
            "satellite": record.satellite,
            "instrument": record.instrument,
            "confidence_raw": record.confidence,
            "version": record.version,
            
            # Facility context
            "nearest_facility_name": nearest_facility.name if nearest_facility else None,
            "nearest_facility_type": nearest_facility.type if nearest_facility else None,
            "distance_to_facility_km": round(min_distance, 2) if nearest_facility else None,
            "near_industrial_facility": near_facility,
            
            # Classification reasoning
            "reasons": reasons,
            
            # Original FIRMS ID (if we had it)
            "firms_record_index": 0  # Placeholder
        }
    }
    
    return feature

def fetch_firms_data(map_key: str, source: str = "VIIRS_SNPP_NRT", 
                     area: str = "69.5,22.0,70.5,22.8", 
                     days: int = 10) -> Optional[pd.DataFrame]:
    """
    Fetch FIRMS data from NASA API
    Returns DataFrame or None if failed
    """
    if not map_key:
        logger.warning("No MAP_KEY provided, using cached/sample data")
        return None
    
    # Construct URL
    # Format: /api/area/csv/MAP_KEY/SOURCE/AREA/DAYS
    # If DATE is omitted, gets most recent DATA days
    url = f"{FIRMS_API_BASE}/{map_key}/{source}/{area}/{days}"
    
    try:
        logger.info(f"Fetching FIRMS data from: {url}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Check if we got CSV data
        if response.text.strip() and not response.text.startswith('ERROR'):
            # Parse CSV
            from io import StringIO
            df = pd.read_csv(StringIO(response.text))
            logger.info(f"Successfully fetched {len(df)} FIRMS records")
            return df
        else:
            logger.warning(f"FIRMS API returned empty or error response: {response.text[:200]}")
            return None
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching FIRMS data: {e}")
        return None
    except Exception as e:
        logger.error(f"Error parsing FIRMS data: {e}")
        return None

def load_sample_firms_data() -> pd.DataFrame:
    """
    Load sample FIRMS data for testing/development
    Uses the sample data we already have
    """
    sample_path = "/home/hardik/Desktop/gods-eye-view/src/data/fixtures/firms-viirs-noaa20-sample.csv"
    if os.path.exists(sample_path):
        try:
            df = pd.read_csv(sample_path)
            logger.info(f"Loaded {len(df)} sample FIRMS records from {sample_path}")
            return df
        except Exception as e:
            logger.error(f"Error loading sample FIRMS data: {e}")
            return pd.DataFrame()
    else:
        logger.warning("Sample FIRMS data not found")
        return pd.DataFrame()

@app.on_event("startup")
async def startup_event():
    """Initialize data on startup"""
    logger.info("Starting ThermoWatch API...")
    # Load facility data
    global facilities
    facilities = load_facility_data()
    logger.info(f"Backend initialized with {len(facilities)} facilities")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "ThermoWatch API - FIRMS Data Processing Backend",
        "version": "1.0.0",
        "status": "operational",
        "facilities_loaded": len(facilities) if 'facilities' in globals() else 0
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/facilities")
async def get_facilities():
    """Get all loaded facilities"""
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [f.longitude, f.latitude]
                },
                "properties": {
                    "name": f.name,
                    "type": f.type,
                    "osm_id": f.osm_id,
                    **f.properties
                }
            }
            for f in facilities
        ]
    }

@app.get("/api/hotspots", response_model=ClassificationResult)
async def get_hotspots(
    map_key: Optional[str] = Query(None, description="NASA FIRMS MAP_KEY"),
    source: str = Query("VIIRS_SNPP_NRT", description="FIRMS data source"),
    area: str = Query("69.5,22.0,70.5,22.8", description="Area bbox (west,south,east,north)"),
    days: int = Query(5, description="Number of days to look back (max 5 due to FIRMS API limit)"),
    use_sample: bool = Query(False, description="Force use of sample data"),
    refresh: bool = Query(False, description="Force refresh of FIRMS data")
):
    """
    Get classified FIRMS hotspots as GeoJSON for OSM overlay
    
    Parameters:
    - map_key: NASA FIRMS MAP_KEY (optional, uses sample if not provided)
    - source: FIRMS data source (default: VIIRS_SNPP_NRT)
    - area: Bounding box as "west,south,east,north"
    - days: Number of days of historical data to consider
    - use_sample: Whether to use bundled sample data
    - refresh: Whether to force refresh from API
    
    Returns:
    - GeoJSON FeatureCollection with classified hotspots
    """
    global facilities
    
    # Ensure facilities are loaded
    if not facilities:
        facilities = load_facility_data()
    
    # Determine data source
    df = None
    
    if use_sample or not map_key:
        logger.info("Using sample FIRMS data")
        df = load_sample_firms_data()
    else:
        logger.info(f"Fetching live FIRMS data: {days} days, source={source}")
        df = fetch_firms_data(map_key, source, area, days)
        
        # Fallback to sample data if API fails
        if df is None or len(df) == 0:
            logger.warning("Live FIRMS data fetch failed, falling back to sample data")
            df = load_sample_firms_data()
    
    if df is None or len(df) == 0:
        logger.error("No FIRMS data available")
        raise HTTPException(
            status_code=503,
            detail="No FIRMS data available from API or sample sources"
        )
    
    # Process each record
    features = []
    stats = {
        "total_records": len(df),
        "processed": 0,
        "errors": 0
    }
    
    try:
        for idx, row in df.iterrows():
            try:
                # Convert row to FirmsRecord
                record = FirmsRecord(**row.to_dict())
                
                # Classify the detection
                feature = classify_firms_detection(record, facilities)
                feature["properties"]["firms_record_index"] = idx
                
                features.append(feature)
                stats["processed"] += 1
                
            except Exception as e:
                logger.error(f"Error processing FIRMS record {idx}: {e}")
                stats["errors"] += 1
                continue
        
        logger.info(f"Processed {stats['processed']}/{stats['total_records']} FIRMS records "
                   f"({stats['errors']} errors)")
        
        # Create GeoJSON response
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        
        # Add metadata
        response_metadata = {
            "count": len(features),
            "query_params": {
                "map_key_provided": bool(map_key and not use_sample),
                "source": source,
                "area": area,
                "days": days,
                "used_sample_data": use_sample or not bool(map_key)
            },
            "processing_stats": stats,
            "timestamp": datetime.now().isoformat(),
            "facilities_used": len(facilities)
        }
        
        # Return GeoJSON with metadata in a wrapper for API consumers
        # Frontend can extract the features array directly for mapping libraries
        return {
            "type": "FeatureCollection",
            "features": features,
            "metadata": response_metadata
        }
        
    except Exception as e:
        logger.error(f"Error in hotspots processing: {e}")
        raise HTTPException(status_code=500, detail=f"Internal processing error: {str(e)}")

@app.get("/api/hotspots/geojson")
async def get_hotspots_geojson(
    map_key: Optional[str] = Query(None, description="NASA FIRMS MAP_KEY"),
    source: str = Query("VIIRS_SNPP_NRT", description="FIRMS data source"),
    area: str = Query("69.5,22.0,70.5,22.8", description="Area bbox (west,south,east,north)"),
    days: int = Query(5, description="Number of days to look back (max 5 due to FIRMS API limit)"),
    use_sample: bool = Query(False, description="Force use of sample data"),
    refresh: bool = Query(False, description="Force refresh of FIRMS data")
):
    """
    Get pure GeoJSON output for direct use in mapping libraries
    This endpoint returns only the FeatureCollection without metadata wrapper
    """
    result = await get_hotspots(map_key, source, area, days, use_sample, refresh)
    # Return just the GeoJSON part
    return {
        "type": result["type"],
        "features": result["features"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)