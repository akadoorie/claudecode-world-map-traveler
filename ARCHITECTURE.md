# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                     (localhost:3000)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │               React Application                    │     │
│  │                                                    │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │     │
│  │  │   App    │  │ WorldMap │  │ Controls │          │     │
│  │  │Component │→ │Component │  │Component │          │     │
│  │  └──────────┘  └──────────┘  └──────────┘          │     │
│  │       ↓             ↓              ↓               │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │     │
│  │  │ Counter  │  │AddCountry│  │ Leaflet  │          │     │
│  │  │Component │  │   Form   │  │   Map    │          │     │
│  │  └──────────┘  └──────────┘  └──────────┘          │     │
│  │                                                    │     │
│  └──────────────────────┬─────────────────────────────┘     │
│                         │ HTTP (Axios)                      │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                     Flask Server                            │
│                   (localhost:5000)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │                  API Endpoints                     │     │
│  │                                                    │     │
│  │  GET  /api/countries  → Get all visits             │     │
│  │  POST /api/countries  → Add new visit              │     │
│  │  GET  /api/stats      → Get statistics             │     │
│  │                                                    │     │
│  └──────────────────────┬─────────────────────────────┘     │
│                         │                                   │
│                         ↓                                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │              File Operations                       │     │
│  │                                                    │     │
│  │  parse_countries_file() → Read & Parse             │     │
│  │  write_countries_file() → Write & Save             │     │
│  │                                                    │     │
│  └──────────────────────┬─────────────────────────────┘     │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage                             │
│                                                             │
│              server/countries.txt                           │
│                                                             │
│  Format: Date_From  Date_To  Country  Places                │ 
│                                                             │
│  Example:                                                   │
│  2020-01-15  2020-01-25  France  Paris, Alsace              │
│  2020-06-10  2020-06-20  Italy   Rome, Venice               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Header
│   ├── Title (h1)
│   ├── Counter
│   │   ├── count (unique countries)
│   │   └── label
│   └── Add Button
│
├── MapContainer
│   └── WorldMap
│       ├── Leaflet Map
│       ├── GeoJSON Layer (countries)
│       ├── Popups (tooltips)
│       └── Event Handlers
│
├── Controls
│   ├── Previous Button
│   ├── Progress Indicator
│   └── Next Button
│
└── AddCountryForm (Modal)
    ├── Form Fields
    │   ├── Country Input
    │   ├── Date From Input
    │   ├── Date To Input
    │   └── Places Input
    └── Action Buttons
        ├── Cancel
        └── Submit
```

## Data Flow

### 1. Initial Load
```
User Opens App
     ↓
App.useEffect()
     ↓
fetchCountries()
     ↓
axios.get('/api/countries')
     ↓
Flask: parse_countries_file()
     ↓
Read countries.txt
     ↓
Parse & Format Data
     ↓
Return JSON Response
     ↓
Update React State (entries)
     ↓
WorldMap Re-renders
     ↓
Show First Country
```

### 2. Navigation Flow
```
User Presses Right Arrow
     ↓
Controls.handleKeyPress()
     ↓
onNext()
     ↓
setCurrentIndex(index + 1)
     ↓
Calculate visibleEntries
     ↓
WorldMap Receives New Props
     ↓
Re-render GeoJSON Layer
     ↓
Update Country Highlighting
     ↓
Update Counter Display
```

### 3. Add Country Flow
```
User Clicks "+ Add Visit"
     ↓
setShowAddForm(true)
     ↓
AddCountryForm Opens
     ↓
User Fills Form
     ↓
User Clicks Submit
     ↓
Validate Input
     ↓
handleAddCountry()
     ↓
axios.post('/api/countries', data)
     ↓
Flask: Receive Request
     ↓
Parse JSON Body
     ↓
Validate Data
     ↓
Read countries.txt
     ↓
Append New Entry
     ↓
Write countries.txt
     ↓
Return Success Response
     ↓
fetchCountries() (Refresh)
     ↓
Update UI
     ↓
Close Modal
```

## State Management

### App Component State
```javascript
{
  entries: [],           // All travel entries
  currentIndex: 0,       // Current timeline position
  loading: true,         // Loading state
  error: null,          // Error message
  showAddForm: false    // Modal visibility
}
```

### Derived State
```javascript
visibleEntries = entries.slice(0, currentIndex + 1)
uniqueCountries = new Set(visibleEntries.map(e => e.country))
countryCount = uniqueCountries.size
```

## API Contract

### GET /api/countries

**Response:**
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

### POST /api/countries

**Request:**
```json
{
  "dateFrom": "2023-05-10",
  "dateTo": "2023-05-20",
  "country": "Portugal",
  "places": ["Lisbon", "Porto"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "dateFrom": "2023-05-10",
    "dateTo": "2023-05-20",
    "country": "Portugal",
    "places": ["Lisbon", "Porto"]
  }
}
```

### GET /api/stats

**Response:**
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

## Key Technologies

### Frontend Stack
```
React 18.2.0
├── react-dom         (UI rendering)
├── react-scripts     (build tools)
├── leaflet 1.9.4     (mapping library)
├── react-leaflet 4.2 (React bindings)
└── axios 1.6.0       (HTTP client)
```

### Backend Stack
```
Python 3.8+
├── Flask 3.0.0       (web framework)
└── flask-cors 4.0.0  (CORS support)
```

## File Structure

```
project/
│
├── client/                    # Frontend
│   ├── public/
│   │   └── index.html        # HTML template
│   │
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── WorldMap.js
│   │   │   ├── WorldMap.css
│   │   │   ├── Controls.js
│   │   │   ├── Controls.css
│   │   │   ├── Counter.js
│   │   │   ├── Counter.css
│   │   │   ├── AddCountryForm.js
│   │   │   └── AddCountryForm.css
│   │   │
│   │   ├── App.js            # Main component
│   │   ├── App.css
│   │   ├── index.js          # Entry point
│   │   └── index.css
│   │
│   └── package.json          # Dependencies
│
├── server/                    # Backend
│   ├── app.py                # Flask application
│   ├── requirements.txt      # Python deps
│   └── countries.txt         # Data storage
│
├── README.md                  # Documentation
├── QUICKSTART.md             # Quick guide
├── PROJECT_SUMMARY.md        # Summary
├── ARCHITECTURE.md           # This file
├── .gitignore
├── start-server.bat          # Windows launcher
└── start-client.bat          # Windows launcher
```

## Design Patterns Used

### 1. Component Pattern
Each UI element is a reusable component with props and state.

### 2. Container/Presenter Pattern
- **Container**: App.js (manages state and logic)
- **Presenters**: All child components (receive props, render UI)

### 3. Controlled Components
Form inputs controlled by React state.

### 4. Custom Hooks (useEffect)
Side effects managed in lifecycle hooks.

### 5. REST API Pattern
Standard HTTP methods and response formats.

### 6. MVC-like Pattern
- **Model**: countries.txt
- **View**: React components
- **Controller**: Flask endpoints

## Performance Considerations

### Frontend
- Minimal re-renders (proper state management)
- Efficient map layer updates
- CSS transforms (hardware accelerated)
- Conditional rendering

### Backend
- Simple file I/O (fast for small datasets)
- No complex database queries
- Efficient parsing

### Network
- Small payloads
- Single API calls
- No unnecessary polling

## Security Architecture

### Input Validation
```
User Input
    ↓
Client-Side Validation (React)
    ↓
Server-Side Validation (Flask)
    ↓
Sanitize & Store
```

### CORS Policy
```
Origin: http://localhost:3000
    ↓
CORS Middleware Check
    ↓
Allow if matches
    ↓
Process Request
```

## Scalability Considerations

### Current Design
- Good for: 100-1000 entries
- File-based storage works well
- Fast response times

### Future Scaling
- 1000+ entries: Consider SQLite
- Multiple users: Add authentication
- Global access: Deploy to cloud
- Heavy traffic: Add caching

## Error Handling Flow

```
Error Occurs
    ↓
Try/Catch Block
    ↓
Log to Console
    ↓
Set Error State
    ↓
Display User-Friendly Message
    ↓
Provide Retry Option
```

## Development Workflow

```
1. Make Changes
    ↓
2. Save Files
    ↓
3. React Hot Reload (Auto)
    ↓
4. View in Browser
    ↓
5. Check Console for Errors
    ↓
6. Test Functionality
    ↓
7. Repeat
```

---

This architecture provides a solid foundation that's easy to understand, maintain, and extend.
