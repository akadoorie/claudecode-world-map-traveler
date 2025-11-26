<div align="center">

# 🗺️ World Map Traveler

### Track and visualize all the countries and places you've visited

<img src="https://raw.githubusercontent.com/StephanWagner/worldMapSvg/master/maps/world.svg" width="400" alt="World Map"/>

*A modern, professional web application for your travel memories*

</div>

---

## Features

- **Interactive World Map**: Beautiful map visualization with country borders, powered by Leaflet.js
- **Timeline Navigation**: Navigate through your travel history chronologically using arrow keys or on-screen controls
- **Country Counter**: Real-time counter showing unique countries visited
- **Detailed Tooltips**: Hover over countries to see visit dates and specific places
- **Place Markers**: Red dots mark specific locations with popups showing visit details
- **Google Maps Integration**: Click red place markers to open the exact location in Google Maps
- **Add New Visits**: Easy-to-use form to add new travel entries
- **Responsive Design**: Works seamlessly on desktop browsers
- **Modern UI**: Clean, professional interface with smooth animations

## Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **Leaflet.js**: Industry-leading map visualization library
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with animations and transitions

### Backend
- **Python Flask**: Lightweight and powerful web framework
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **Text File Storage**: Simple and human-readable data storage

## Project Structure

```
claudecode-world-map-traveler/
├── server/
│   ├── app.py              # Flask server with API endpoints
│   ├── requirements.txt    # Python dependencies
│   └── countries.txt       # Travel data (auto-generated)
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorldMap.js         # Main map component
│   │   │   ├── Controls.js         # Navigation controls
│   │   │   ├── Counter.js          # Country counter
│   │   │   └── AddCountryForm.js   # Add visit form
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Step 1: Set Up Your Travel Data

Create your own travel data file from the example:

```bash
cd server
cp countries.json.example countries.json
cp geocode_cache.json.example geocode_cache.json
```

Edit `countries.json` to add your own travel history.

### Step 2: Install Server Dependencies

```bash
cd server
pip install -r requirements.txt
```

### Step 3: Install Client Dependencies

```bash
cd client
npm install
```

## Running the Application

You need to run both the server and client in separate terminal windows.

### Terminal 1: Start the Flask Server

```bash
cd server
python app.py
```

The server will start on `http://localhost:5000`

### Terminal 2: Start the React Client

```bash
cd client
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

## Stopping the Application

You can easily stop the application using the provided scripts:

### Windows (Command Prompt or PowerShell)
```bash
# Stop both client and server
stop-all.bat

# Or stop them individually
stop-client.bat  # Stops React client on port 3000
stop-server.bat  # Stops Flask server on port 5000
```

### Git Bash or WSL
```bash
# Stop both client and server
./stop-all.sh

# Or stop them individually
./stop-client.sh  # Stops React client on port 3000
./stop-server.sh  # Stops Flask server on port 5000
```

### Manual Method
If the scripts don't work, you can:
- Close the terminal windows where you started the servers
- Or press `Ctrl+C` in each terminal window

## How to Use

### Initial View
- When you first open the app, you'll see the first country from your travel history highlighted on the map
- The counter shows how many unique countries you've visited so far

### Navigating Your Travel History
- **Right Arrow Key** or **Right Button**: Move forward in time
- **Left Arrow Key** or **Left Button**: Move backward in time
- As you navigate, countries are highlighted in blue, showing your cumulative travel history
- The progress indicator shows your current position (e.g., "3/8")

### Viewing Details
- **Hover over any visited country** to see a popup with:
  - Country name
  - Visit dates (from - to)
  - Specific places visited within that country
  - If no places are specified, it shows "Whole country visited"
- **Click on red place markers** to see a popup with:
  - Place name and country
  - Visit dates
  - "Open in Google Maps" link - click to open the exact location in Google Maps

### Adding New Visits
1. Click the **"+ Add Visit"** button in the top-right corner
2. Fill in the form:
   - **Country**: Name of the country (e.g., "France")
   - **From Date**: Start date of your visit
   - **To Date**: End date of your visit
   - **Places**: (Optional) Comma-separated list of places (e.g., "Paris, Alsace")
3. Click **"Add Visit"** to save

### Country Counter
- Shows the total number of unique countries visited up to the current point in your timeline
- If you visit a country multiple times, it's only counted once
- Reaches the final count when you navigate to the last entry

## Data Format

The `countries.txt` file stores your travel data in a simple tab-separated format:

```
Date From    Date To      Country    Places
2020-01-15   2020-01-25   France     Paris, Alsace
2020-06-10   2020-06-20   Italy      Rome, Venice
2021-03-05   2021-03-15   Spain      Barcelona, Madrid
```

### File Structure
- **Column 1**: Start date (YYYY-MM-DD)
- **Column 2**: End date (YYYY-MM-DD)
- **Column 3**: Country name
- **Column 4**: Places (comma-separated, optional)

**Important**: Entries must be ordered chronologically by date.

## Sample Data

The application comes with sample data to help you get started:

```
2020-01-15	2020-01-25	France	Paris, Alsace
2020-06-10	2020-06-20	Italy	Rome, Venice
2021-03-05	2021-03-15	Spain	Barcelona, Madrid
2021-08-01	2021-08-10	Germany	Berlin
2022-02-14	2022-02-21	Japan	Tokyo, Kyoto
```

## API Endpoints

### GET `/api/countries`
Returns all travel entries
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "dateFrom": "2020-01-15",
      "dateTo": "2020-01-25",
      "country": "France",
      "places": ["Paris", "Alsace"]
    }
  ]
}
```

### POST `/api/countries`
Add a new travel entry
```json
{
  "dateFrom": "2023-05-10",
  "dateTo": "2023-05-20",
  "country": "Portugal",
  "places": ["Lisbon", "Porto"]
}
```

### GET `/api/stats`
Get travel statistics
```json
{
  "success": true,
  "data": {
    "totalVisits": 5,
    "uniqueCountries": 5,
    "countries": ["France", "Italy", "Spain", "Germany", "Japan"]
  }
}
```

## Design Features

- **Color Scheme**:
  - Ocean/Seas: Light blue (#a8daff)
  - Unvisited Countries: Light gray (#e0e0e0)
  - Visited Countries: Purple/Blue gradient (#667eea)
  - Country Borders: Visible gray lines

- **Animations**:
  - Smooth transitions when navigating
  - Hover effects on countries
  - Button animations
  - Modal slide-up effect

- **Professional UI**:
  - Modern gradient header
  - Rounded corners and shadows
  - Consistent spacing and typography
  - Clear visual hierarchy

## Troubleshooting

### Server Issues
- **Port 5000 already in use**: Change the port in `server/app.py` (line at the bottom)
- **CORS errors**: Make sure Flask-CORS is installed and the server is running

### Client Issues
- **Dependencies not found**: Run `npm install` in the client directory
- **Map not loading**: Check your internet connection (GeoJSON data is loaded from external source)
- **Port 3000 already in use**: React will prompt you to use a different port

### Data Issues
- **Countries not appearing**: Ensure country names in `countries.txt` match the GeoJSON data (standard English names)
- **Entries not ordered**: Make sure dates in `countries.txt` are in chronological order

## Customization

### Adding More Sample Data
Edit `server/countries.txt` directly or use the "+ Add Visit" button in the application.

### Changing Colors
Modify the CSS files in `client/src/components/` to customize the color scheme.

### Map Settings
Adjust zoom levels and center position in `client/src/components/WorldMap.js`

## Future Enhancements

Potential features for future versions:
- Edit and delete existing entries
- Export data to various formats (JSON, CSV)
- Statistics dashboard with charts
- Search and filter functionality
- Multiple user support with authentication
- Photo attachments for visits
- Shareable travel maps

## License

This project is open source and available for personal use.

## Support

For issues or questions, please check:
1. This README file
2. Console logs in browser developer tools
3. Server terminal output for error messages

---

**Enjoy tracking your world travels!**
