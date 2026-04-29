// script.js   
var app = angular.module("profileApp", []);

app.controller("ProfileController", function($scope, $http) {
    $scope.profiles = [];
    $scope.newProfile = {};
    
    // Fetch profiles from the backend
    $http.get("/api/profiles").then(function(response) {
        $scope.profiles = response.data;
    });
    
    // Add a new profile
    $scope.addProfile = function() {
        $http.post("/api/profiles", $scope.newProfile).then(function(response) {
            $scope.profiles.push(response.data);
            $scope.newProfile = {}; // Clear the form
        });
    };
}); 

form.addEventListener("submit", function (event) {
    event.preventDefault();
    var city = document.getElementById("city-input  ").value.trim();
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

// function showError() TODO: implement error handling for weather API
    