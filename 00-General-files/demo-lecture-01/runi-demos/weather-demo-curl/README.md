# Demo 1: Calling a Weather API with curl

This demo shows how to call the [OpenWeatherMap API](https://openweathermap.org/api) directly from the terminal using `curl`.

## Prerequisites

- `curl` (pre-installed on macOS/Linux)
- `jq` for pretty-printing JSON (`brew install jq` on macOS)
- An OpenWeatherMap API key (free tier): https://home.openweathermap.org/api_keys

## API Base URL

```
https://api.openweathermap.org/data/2.5
```

Replace `YOUR_API_KEY` in the examples below with your actual key.

## Current Weather

Get the current weather for a city:

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric" | jq
```

### Query Parameters

| Parameter | Description                                | Example        |
|-----------|--------------------------------------------|----------------|
| `q`       | City name                                  | `London`, `Tel+Aviv`, `New+York` |
| `appid`   | Your API key                               | `abc123...`    |
| `units`   | Temperature units: `metric` (°C), `imperial` (°F), or omit for Kelvin | `metric` |

### What `| jq` Does

The API returns raw JSON on a single line. Piping into `jq` pretty-prints it with indentation so it's readable.

Without `jq`:
```
{"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":800,"main":"Clear"...}]}
```

With `jq`:
```json
{
  "coord": {
    "lon": -0.13,
    "lat": 51.51
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky"
    }
  ]
}
```

## More Examples

### Different cities

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=Tel+Aviv&appid=YOUR_API_KEY&units=metric" | jq
```

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=New+York&appid=YOUR_API_KEY&units=imperial" | jq
```

### 5-Day Forecast

Use the `/forecast` endpoint instead of `/weather`:

```bash
curl "https://api.openweathermap.org/data/2.5/forecast?q=London&appid=YOUR_API_KEY&units=metric" | jq
```

This returns weather predictions in 3-hour intervals for the next 5 days.

### Extract specific fields with jq

Get just the temperature and description:

```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric" | jq '{temp: .main.temp, description: .weather[0].description}'
```

Output:
```json
{
  "temp": 16.8,
  "description": "clear sky"
}
```
