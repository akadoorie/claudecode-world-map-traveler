from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import json

app = Flask(__name__)
CORS(app)

COUNTRIES_FILE = 'countries.json'
GEOCODE_CACHE_FILE = 'geocode_cache.json'

def parse_countries_file():
    """Parse the countries.json file and return structured data sorted by dateFrom."""
    if not os.path.exists(COUNTRIES_FILE):
        return []

    try:
        with open(COUNTRIES_FILE, 'r', encoding='utf-8') as f:
            entries = json.load(f)

        # Add IDs to entries
        for idx, entry in enumerate(entries, 1):
            entry['id'] = idx

        # Sort by dateFrom
        entries.sort(key=lambda x: x['dateFrom'])

        return entries
    except json.JSONDecodeError as json_err:
        print(f"Error parsing countries.json at line {json_err.lineno}, column {json_err.colno}: {json_err.msg}")
        return []
    except Exception as e:
        print(f"Error reading countries.json: {str(e)}")
        return []

def write_countries_file(entries):
    """Write entries back to countries.json file."""
    # Sort by dateFrom before writing
    entries_sorted = sorted(entries, key=lambda x: x['dateFrom'])

    # Remove IDs before writing (they're added on read)
    entries_to_write = []
    for entry in entries_sorted:
        entry_copy = {
            'dateFrom': entry['dateFrom'],
            'dateTo': entry['dateTo'],
            'country': entry['country'],
            'area': entry.get('area', ''),
            'places': entry.get('places', [])
        }
        entries_to_write.append(entry_copy)

    with open(COUNTRIES_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries_to_write, f, indent=2, ensure_ascii=False)

@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Get all countries and visits."""
    try:
        entries = parse_countries_file()
        return jsonify({
            'success': True,
            'data': entries
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/countries', methods=['POST'])
def add_country():
    """Add a new country visit."""
    try:
        data = request.get_json()

        # Validate required fields
        if not all(key in data for key in ['dateFrom', 'dateTo', 'country']):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400

        # Parse existing entries
        entries = parse_countries_file()

        # Create new entry
        new_entry = {
            'id': len(entries) + 1,
            'dateFrom': data['dateFrom'],
            'dateTo': data['dateTo'],
            'country': data['country'],
            'places': data.get('places', [])
        }

        # Add to entries
        entries.append(new_entry)

        # Write back to file
        write_countries_file(entries)

        return jsonify({
            'success': True,
            'data': new_entry
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics about visits."""
    try:
        entries = parse_countries_file()

        # Count unique countries
        unique_countries = set(entry['country'] for entry in entries)

        return jsonify({
            'success': True,
            'data': {
                'totalVisits': len(entries),
                'uniqueCountries': len(unique_countries),
                'countries': list(unique_countries)
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/geocode-cache', methods=['GET'])
def get_geocode_cache():
    """Get the geocoding cache."""
    try:
        if os.path.exists(GEOCODE_CACHE_FILE):
            with open(GEOCODE_CACHE_FILE, 'r', encoding='utf-8') as f:
                try:
                    cache = json.load(f)
                except json.JSONDecodeError as json_err:
                    # Provide detailed error message for JSON parsing errors
                    error_msg = f"Invalid JSON in geocode_cache.json at line {json_err.lineno}, column {json_err.colno}: {json_err.msg}"
                    return jsonify({
                        'success': False,
                        'error': error_msg
                    }), 500
        else:
            cache = {}

        return jsonify({
            'success': True,
            'data': cache
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/geocode-cache', methods=['POST'])
def update_geocode_cache():
    """Update the geocoding cache."""
    try:
        data = request.get_json()

        # Load existing cache
        if os.path.exists(GEOCODE_CACHE_FILE):
            with open(GEOCODE_CACHE_FILE, 'r', encoding='utf-8') as f:
                cache = json.load(f)
        else:
            cache = {}

        # Update with new nested structure: country -> place -> coords
        country = data.get('country')
        place = data.get('place')
        coords = data.get('coords')

        if country and place and coords:
            if country not in cache:
                cache[country] = {}
            cache[country][place] = coords

        # Save cache
        with open(GEOCODE_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)

        return jsonify({
            'success': True,
            'data': cache
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/validate-location', methods=['POST'])
def validate_location():
    """Validate a location using Nominatim geocoding API."""
    try:
        import requests
        import time

        data = request.get_json()
        location = data.get('location')
        location_type = data.get('type', 'place')
        country = data.get('country', '')

        if not location:
            return jsonify({
                'success': False,
                'error': 'Location is required'
            }), 400

        # Build search query
        search_query = f"{location}, {country}" if country else location

        # Call Nominatim API
        response = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params={
                'format': 'json',
                'q': search_query,
                'limit': 1
            },
            headers={'User-Agent': 'WorldMapTraveler/1.0'}
        )

        if response.status_code != 200:
            return jsonify({
                'success': False,
                'error': 'Geocoding service error'
            }), 500

        results = response.json()

        if not results or len(results) == 0:
            return jsonify({
                'success': False,
                'valid': False,
                'message': f'{location_type.capitalize()} not found'
            })

        result = results[0]

        # For countries: check if it has addresstype='country'
        if location_type == 'country':
            is_valid = result.get('addresstype') == 'country'
            return jsonify({
                'success': True,
                'valid': is_valid,
                'message': 'Valid country' if is_valid else 'Not a country'
            })

        # For places: if we got a result, it's valid
        return jsonify({
            'success': True,
            'valid': True,
            'message': 'Valid location'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Create countries.json if it doesn't exist
    if not os.path.exists(COUNTRIES_FILE):
        sample_data = [
            {
                "dateFrom": "2020-01-15",
                "dateTo": "2020-01-25",
                "country": "France",
                "places": ["Paris", "Alsace"]
            },
            {
                "dateFrom": "2020-06-10",
                "dateTo": "2020-06-20",
                "country": "Italy",
                "places": ["Rome", "Venice"]
            },
            {
                "dateFrom": "2021-03-05",
                "dateTo": "2021-03-15",
                "country": "Spain",
                "places": ["Barcelona", "Madrid"]
            },
            {
                "dateFrom": "2021-08-01",
                "dateTo": "2021-08-10",
                "country": "Germany",
                "places": ["Berlin"]
            },
            {
                "dateFrom": "2022-02-14",
                "dateTo": "2022-02-21",
                "country": "Japan",
                "places": ["Tokyo", "Kyoto"]
            }
        ]
        with open(COUNTRIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(sample_data, f, indent=2, ensure_ascii=False)

    app.run(debug=True, port=5000)
