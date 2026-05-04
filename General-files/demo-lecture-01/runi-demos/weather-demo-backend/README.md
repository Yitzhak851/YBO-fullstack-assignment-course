# Demo 2: Flask Weather Backend

A Flask server that wraps the OpenWeatherMap API. One endpoint, two upstream API calls — the backend fetches both current weather and the 5-day forecast, then returns them merged in a single response.

## Why a backend?

- **Combines data**: one `fetch` from a frontend triggers two API calls on the server, so the client gets everything it needs in one request.
- **Hides the API key**: the key lives on the server, never exposed to the browser.

## Setup

```bash
cd weather-demo-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

The server starts at `http://localhost:5000`.

## Try it

```bash
curl "http://localhost:5000/api/weather?city=London" | jq
```

Example response:

```json
{
  "city": "London",
  "current": {
    "temp": 16.8,
    "feels_like": 16.0,
    "description": "clear sky",
    "icon": "https://openweathermap.org/img/wn/01d@2x.png",
    "humidity": 53,
    "wind_speed": 5.14
  },
  "forecast": [
    {
      "date": "2026-03-19 12:00:00",
      "temp": 14.2,
      "description": "light rain",
      "icon": "https://openweathermap.org/img/wn/10d@2x.png"
    }
  ]
}
```

## Error handling

- Missing `city` parameter → `400`
- City not found → `404`
- Upstream API failure → `502`
