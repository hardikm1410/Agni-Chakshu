import pandas as pd
import json

# Path to the FIRMS CSV file
csv_path = '/home/hardik/Desktop/gods-eye-view/src/data/fixtures/firms-viirs-noaa20-sample.csv'

# Read the CSV
df = pd.read_csv(csv_path)

# We'll create a GeoJSON FeatureCollection
features = []

for _, row in df.iterrows():
    # Create a feature for each row
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [row['longitude'], row['latitude']]
        },
        "properties": {
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
            "daynight": row['daynight']
        }
    }
    features.append(feature)

geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Write to a GeoJSON file
output_path = '/home/hardik/Desktop/EmberWatch/firms_fire_points.geojson'
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print(f"GeoJSON file written to {output_path}")
print(f"Number of features: {len(features)}")