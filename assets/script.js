//My authoried OpenWeather API key
var apiKey = "01799a4d0b2dee08aa5540200bac64d8";
var searchedCity ="";
var currentCity="";

//This function gets the conditons from the API and displays it
var fetchCurrentWeather= (event) => {
  let city = $("#search-city").val();
  currentCity = $('#search-city').val();
  var mainURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  fetch(mainURL)
  .then((response) => {
    console.log(response)
    return response.json()

  })
  .then((response) => {
    //localStorage
    saveCity(city);
    $("#search-error").text("");
  })
}

//URL for icons for the current weather displayed
var iconsCurrentWeather=//"https://openweathermap.org/img/w/" + weather[0].icon + ".png";
console.log(iconsCurrentWeather)


Formatting timezone 
let currentTime = response.dt;
let timeZone = response.timezone;
let currentHours = timeZone /60 /60;
let currentMoment = moment.unix(currentTime).utc().utcOffset(currentHours);

displayCities();

//"5 day" for the city that was searched
getForecastFiveDays(event);

//innerHTML for search results
let htmlCurrentWeather = `
  <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}"></h3>
  <ul class="list-unstyled">
    <li>Temperature: ${response.main.temp}&#8457;</li>
    <li>Humidity: ${response.main.humidity}%</li>
    <li>Wind Speed: ${response.wind.speed} mph</li>
    <li id="uvColors"> UV Index:</li>
  </ul>`;

  //Appending the results to the DOM
  $("#currrent-weather").html(htmlCurrentWeather);

  //Call OpenWeather API OneCall with lat and lon to get the UV index
  let lat = response.coord.lat;
  let lon = response.coord.lon;
  let latLonURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
  
  fetch(latLonURL)
  .then((response) => {
    return response.json();
  })
  .then((response) => {
  // Function to color the UV Index based on EPA color scale
  let setUVIcolor(uvi) {
  if (uvi < 3) {
    return "green";
  } else if (uvi >= 3 && uvi < 6) {
    return "yellow";
  } else if (uvi >= 6 && uvi < 8) {
    return "orange";
  } else if (uvi >= 8 && uvi < 11) {
    return "red";
  }
}
  })


// Search for weather conditions by calling the OpenWeather API
/*function searchWeather(URL) {
    fetch(URL).then(function(response){
        console.log(response)
        return response.json()
    }) .then(function(data){
        console.log(data)
    })
}*/


// Function to display the last searched city
function displayLastSearchedCity() {
  // Click handler for city buttons to load that city's weather
  $(document).on("click", "button.city-btn", function (event) {});
}
// load any cities in local storage into array
loadCities();


// Display weather for last searched city
displayLastSearchedCity();

$("#search-btn").on("click", function (event) {
  // Preventing the button from trying to submit the form
  event.preventDefault();
  console.log("I was clicked")

  // Retrieving and scrubbing the city from the inputs
  var cityInput = $("#city-input");
  console.log(cityInput)
  var city = cityInput.val();
  console.log(city)

  // Build the query url with the city and searchWeather
  if (city) {
    let queryURL = fetchCurrentWeather(city);
    console.log(queryURL);
    searchWeather(queryURL);
  }

  // Clear the input fields
  cityInput.val("");
});
