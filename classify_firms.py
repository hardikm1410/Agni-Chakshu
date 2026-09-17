import pandas as pd
import json
import os
from datetime import datetime, timedelta

# Paths
csv_path = '/home/hardik/Desktop/gods-eye-view/src/data/fixtures/firms-viirs-noaa20-sample.csv'
osm_geojson_path = '/home/hardik/Desktop/EmberWatch/export.geojson'
output_path = '/home/hardik/Desktop/EmberWatch/firms_classified.geojson'

# Read FIRMS data
print("Reading FIRMS data...")
df = pd.read_csv(csv_path)
print(f"Loaded {len(df)} FIRMS detections")

# Read OSM/industrial facilities data
print("Reading OSM industrial facilities...")
with open(osm_geojson_path, 'r') as f:
    osm_data = json.load(f)

# Extract industrial facilities points for spatial join
industrial_facilities = []
for feature in osm_data['features']:
    if feature['geometry']['type'] == 'Point':
        props = feature['properties']
        # Look for industrial indicators
        is_industrial = (
            props.get('landuse') == 'industrial' or
            props.get('industrial') in ['refinery', 'oil'] or
            props.get('power') == 'plant' or
            'refinery' in props.get('name', '').lower() or
            'power' in props.get('name', '').lower() or
            'plant' in props.get('name', '').lower()
        )
        if is_industrial:
            industrial_facilities.append({
                'geometry': feature['geometry'],
                'properties': props
            })

print(f"Found {len(industrial_facilities)} industrial facilities from OSM")

# Simple classification function
def classify_fire_detection(row, facilities):
    lat, lon = row['latitude'], row['longitude']
    
    # Check proximity to industrial facilities (within ~0.05 degrees ~5km)
    nearest_facility = None
    min_distance = float('inf')
    
    for fac in facilities:
        fac_lon = fac['geometry']['coordinates'][0]
        fac_lat = fac['geometry']['coordinates'][1]
        distance = ((lat - fac_lat)**2 + (lon - fac_lon)**2)**0.5
        if distance < min_distance:
            min_distance = distance
            nearest_facility = fac
    
    # Classification logic
    if nearest_facility and min_distance < 0.05:  # Within ~5km
        fac_props = nearest_facility['properties']
        # Determine specific type
        if fac_props.get('industrial') == 'refinery' or 'refinery' in fac_props.get('name', '').lower():
            fire_type = "industrial_fire_refinery"
        elif fac_props.get('power') == 'plant' or 'power plant' in fac_props.get('name', '').lower():
            fire_type = "thermal_power_plant"
        elif fac_props.get('industrial') == 'oil':
            fire_type = "industrial_fire_oil"
        elif fac_props.get('landuse') == 'industrial':
            fire_type = "industrial_fire_general"
        else:
            fire_type = "industrial_fire"
        
        # Check for gas flare indicators (persistent, moderate FRP)
        frp = row['frp']
        if frp < 1.0 and row['confidence'] in ['n', 'h']:  # Low-Moderate FRP, good confidence
            # Could be flare if persistent - we'd need temporal data for true flare detection
            fire_type = "suspected_gas_flare"
    else:
        # Not near known industrial facility - classify by other heuristics
        frp = row['frp']
        bright_ti4 = row['bright_ti4']
        
        if frp > 10.0:  # High FRP suggests large fire
            if bright_ti4 > 350:  # Very hot
                fire_type = "wildfire_intense"
            else:
                fire_type = "wildfire_or_agricultural_large"
        elif frp > 1.0:
            fire_type = "fire_medium"  # Could be agricultural burning, small wildfire
        else:
            fire_type = "fire_small_or_unknown"
    
    # Confidence adjustment based on FRP and brightness
    confidence_adjust = ""
    if row['frp'] > 50.0:
        confidence_adjust = "_high_energy"
    elif row['frp'] < 0.1:
        confidence_adjust = "_low_energy"
        
    return {
        'fire_type': fire_type + confidence_adjust,
        'nearest_facility_distance': min_distance if nearest_facility else None,
        'nearest_facility_name': nearest_facility['properties'].get('name') if nearest_facility else None,
        'nearest_facility_type': nearest_facility['properties'].get('industrial') or 
                                nearest_facility['properties'].get('power') or
                                nearest_facility['properties'].get('landuse') if nearest_facility else None
    }

# Process each detection
print("Classifying detections...")
classified_features = []

for idx, row in df.iterrows():
    # Get classification
    classification = classify_fire_detection(row, industrial_facilities)
    
    # Create GeoJSON feature
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [row['longitude'], row['latitude']]
        },
        "properties": {
            # Original FIRMS data
            "bright_ti4": row['bright_ti4'],
            "bright_ti5": row['bright_ti5'],
            "scan": row['scan'],
            "track": row['track'],
            "acq_date": row['acq_date'],
            "acq_time": row['acq_time'],
            "satellite": row['satellite'],
            "instrument": row['instrument'],
            "confidence": row['confidence'],
            "version": row['version'],
            "frp": row['frp'],
            "daynight": row['daynight'],
            
            # Added classification
            "fire_type": classification['fire_type'],
            "nearest_facility_distance_deg": classification['nearest_facility_distance'],
            "nearest_facility_name": classification['nearest_facility_name'],
            "nearest_facility_type": classification['nearest_facility_type'],
            
            # Computed intensity indicators
            "intensity_level": (
                "high" if row['frp'] > 10.0 else
                "medium" if row['frp'] > 1.0 else
                "low"
            ),
            "brightness_temp_k": row['bright_ti4'],
            "is_persistent_candidate": (
                row['frp'] < 1.0 and 
                row['confidence'] in ['n', 'h'] and
                classification['nearest_facility_distance'] is not None and
                classification['nearest_facility_distance'] < 0.05
            )
        }
    }
    classified_features.append(feature)

# Create FeatureCollection
geojson_output = {
    "type": "FeatureCollection",
    "features": classified_features
}

# Write output
with open(output_path, 'w') as f:
    json.dump(geojson_output, f, indent=2)

print(f"\nClassification complete!")
print(f"Output written to: {output_path}")
print(f"Number of features: {len(classified_features)}")

# Print summary statistics
fire_types = {}
for f in classified_features:
    ft = f['properties']['fire_type']
    fire_types[ft] = fire_types.get(ft, 0) + 1

print("\nFire type distribution:")
for ftype, count in sorted(fire_types.items()):
    print(f"  {ftype}: {count}")

# Show some examples
print("\nExample classifications:")
for i, f in enumerate(classified_features[:3]):
    props = f['properties']
    print(f"\n  Detection {i+1}:")
    print(f"    Location: [{f['geometry']['coordinates'][1]:.4f}, {f['geometry']['coordinates'][0]:.4f}]")
    print(f"    FRP: {props['frp']} MW, Brightness: {props['brightness_temp_k']} K")
    print(f"    Classification: {props['fire_type']}")
    print(f"    Nearest facility: {props['nearest_facility_name']} ({props['nearest_facility_type']}) "
          f"at {props['nearest_facility_distance_deg']*111:.1f} km")