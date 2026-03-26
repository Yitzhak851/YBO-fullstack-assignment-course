var form = document.getElementById("search-form");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    var city = document.getElementById("city-input").value.trim();
    if (!city) return;

    document.getElementById("error").textContent = "";

    fetch("/api/weather?city=" + encodeURIComponent(city))
        .then(parseJson)
        .then(showWeather)
        .catch(showError);
});

function parseJson(response) {
    if (!response.ok) throw new Error();
    return response.json();
}

function showWeather(data) {
    document.getElementById("city-name").textContent = data.city;
    document.getElementById("weather-icon").src = data.current.icon;
    document.getElementById("temp").textContent = Math.round(data.current.temp) + "°C";
    document.getElementById("description").textContent = data.current.description;
    document.getElementById("current-weather").hidden = false;

    var forecastList = document.getElementById("forecast-list");
    forecastList.innerHTML = "";

    for (var i = 0; i < data.forecast.length; i++) {
        var f = data.forecast[i];
        var div = document.createElement("div");
        div.className = "forecast-item";
        div.textContent = f.date + " — " + Math.round(f.temp) + "°C, " + f.description;
        forecastList.appendChild(div);
    }

    document.getElementById("forecast").hidden = false;
}

function showError() {
    document.getElementById("error").textContent = "Could not load weather. Check the city name.";
    document.getElementById("current-weather").hidden = true;
    document.getElementById("forecast").hidden = true;
}
