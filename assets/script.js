//My authoried OpenWeather API key
var apiKey = "01799a4d0b2dee08aa5540200bac64d8";
//Using "var" to create global variables
var currentCity ="";
var lastCity="";

//This function gets the conditons from the API and displays it
var getCurrentConditions = (event) => {
  let city = $("#city-search").val();
  currentCity = $('#city-search').val();
  var mainURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  fetch(mainURL)
  .then((response) => {
    return response.json()
  })
  .then((response) => {
    //localStorage
    saveCity(city);
    $("#search-error").text("");

    //URL for icons for the current weather displayed
    let currentWeatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    console.log(iconsCurrentWeather)


    //Formatting timezone 
    let currentTimeUTC = response.dt;
    let currentTimeZoneOffset = response.timezone;
    let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
    let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

    renderCities();

    //"5 day" for the city that was searched
    getFiveDayForecast(event);

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
    let latitude = response.coord.lat;
    let longitude = response.coord.lon;
    let latLonURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
    fetch(latLonURL)
    .then((response) => {
    return response.json();
  })
  .then((response) => {
  let uvIndex= response.value;
  $("#uvIndex").html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
  if ( uvIndex>=0 && uvIndex<3) {
      $("#uvVal").attr("class", "uv-favorable");
  } else if (uvIndex>=3 && uvIndex<8) {
      $("#uvVal").attr("class", "uv-moderate");
  } else if (uvIndex>=8) {
      $("#uvVal").attr("class", "uv-severe");
  }

});


// Search for weather conditions by calling the OpenWeather API
var getFiveDayForecast = (event) => {
    let city = $("#city-search").val();


    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial";

    fetch(queryURL)
      .then((response)=>{
        return response.json();
      })
      .then((response)=> {
        //template for HTML
        let fiveDayForecastHTML = `
        <h2>5 Day Forecast:</h2>
        <div class="d-inline-flex flex-wrap" id="fiveDayForecastUl">`;


        //Loop through cities and times
        for (let i=0; i < response.list.length; i++){
          let dayData = response.list[i];
          let dayTimeUTC = dayData.dt;
          let timeZoneOffset = response.city.timezone;
          let timeZoneOffsetHours = timeZoneOffset / 60/ 60;
          let thisMoment= moment.unix(dayTimeUTC).utc().utcOffset(timeZOneOffsetHours);
          let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
        }
      })

      //Format HTML elements

}


/*// Function to display the last searched city
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
});*/
