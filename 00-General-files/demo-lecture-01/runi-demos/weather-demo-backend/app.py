from flask import Flask, redirect, send_from_directory, request, jsonify
import requests

app = Flask(__name__, static_folder="static")


@app.route("/")
def index():
    return redirect("/static/index.html")


# API_KEY = "YOUR_API_KEY_HERE"
OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5"


@app.route("/api/weather")
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "Missing 'city' query parameter"}), 400

    try:
        weather_resp = requests.get(
            f"{OPENWEATHER_BASE}/weather",
            params={"q": city, "appid": OPENWEATHER_API_KEY, "units": "metric"},
            timeout=5,
        )
        forecast_resp = requests.get(
            f"{OPENWEATHER_BASE}/forecast",
            params={"q": city, "appid": OPENWEATHER_API_KEY, "units": "metric"},
            timeout=5,
        )

        if weather_resp.status_code != 200:
            return jsonify({"error": "City not found"}), 404

        weather = weather_resp.json()
        forecast_data = forecast_resp.json()

        forecast = []
        for item in forecast_data.get("list", []):
            forecast.append({
                "date": item["dt_txt"],
                "temp": item["main"]["temp"],
                "description": item["weather"][0]["description"],
            })

        result = {
            "city": weather["name"],
            "current": {
                "temp": weather["main"]["temp"],
                "description": weather["weather"][0]["description"],
                "icon": f"https://openweathermap.org/img/wn/{weather['weather'][0]['icon']}@2x.png",
            },
            "forecast": forecast,
        }

        return jsonify(result)

    except requests.RequestException:
        return jsonify({"error": "Failed to fetch data from weather API"}), 502


if __name__ == "__main__":
    app.run(debug=True, port=5000)
