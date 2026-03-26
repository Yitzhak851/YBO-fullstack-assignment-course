# Demo 3: JavaScript Frontend

A vanilla JS frontend for the weather backend from Demo 2. The files in this folder are the frontend — read through them first to understand them in isolation, then move them into the Flask app to wire everything together.

## Files

- `index.html` — search form + weather display area
- `script.js` — fetches `/api/weather?city=...` and populates the page
- `style.css` — layout and styling

## How it works

1. User types a city name and clicks "Search"
2. `script.js` calls `fetch("/api/weather?city=London")` — a relative URL
3. The backend (Demo 2) handles this request, calls OpenWeatherMap, and returns the merged response
4. `showWeather(data)` fills in the current weather and forecast on the page

## Connecting it to the backend

Copy the frontend files into the Flask app's `static/` folder:

```bash
mkdir -p ../weather-demo-backend/static
cp index.html script.js style.css ../weather-demo-backend/static/
```

The backend already has a route that serves `static/index.html` at `/`, so once the files are copied you just need to:

1. Start the backend: `cd ../weather-demo-backend && source venv/bin/activate && python app.py`
2. Open `http://localhost:5000` in your browser
3. Search for a city

The fetch URL in `script.js` is relative (`/api/weather?city=...`), so it works as-is when served from Flask — no changes needed.
