//My authoried OpenWeather API key
const apiKey = "01799a4d0b2dee08aa5540200bac64d8";
var currentCity = "";
var lastCity = "";

//Added error handler to try to catch any errors that may occur
var handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

//This function fetches weather conditions for today from the OpenWeather API.
var fetchTodaysConditions = (event) => {
  let city = $('#city-search').val();
  currentCity = $('#city-search').val();
  //Added "&units=imperial" to switch from Kelvin to farenheit (default of the OpenWeatherAPI is Kelvin.)
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + apiKey;
  fetch(queryURL)
  .then(handleErrors)
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    saveCities(city);
    $('#error-search').text("");

    //Establishing a variable for the URL to fetch the weather icons.
    let currentWeatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    
    //Establishing variables to have later so I can format the date/time.
    let currentTimeUTC = response.dt;
    let currentTimeZoneOffset = response.timezone;
    let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
    let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

    searchedCityButtons();
    
    //Five day forecast for the searched city
    fetchFutureForecast(event);

    //This template allows me to dynamically create the section that displays today's weather.
    let currentWeatherHTML = `
      <h3 class="name-style">${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}"></h3>
      <ul class="list-unstyled">
        <li>Temperature: ${response.main.temp}&#8457;</li>
        <li>Humidity: ${response.main.humidity}%</li>
        <li>Wind Speed: ${response.wind.speed} mph</li>
        <li id="uvIndex">UV Index:</li>
      </ul>`;
      //This tells the browser where to put this template
    $('#weather-current').html(currentWeatherHTML);

    //Call OpenWeather API OneCall with "lat" and "lon" to get the UV index
    let latitude = response.coord.lat;
    let longitude = response.coord.lon;
    let uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + apiKey;
  
    fetch(uvQueryURL)
    .then(handleErrors)
    .then((response) => {
    return response.json();
  }) //This is allowing me to change the color background of the UV index based off of the response from the API
    .then((response) => {
      let uvIndex= response.value;
        $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
      if (uvIndex>=0 && uvIndex<3) {
        $('#uvVal').attr("class", "uv-good");
      } else if (uvIndex>=3 && uvIndex<8) {
        $('#uvVal').attr("class", "uv-medium");
      } else if (uvIndex>=8) {
        $('#uvVal').attr("class", "uv-bad");
      }
    });
  })
}

// This function allows me to fetch the future forecast and display the next 5 days.
var fetchFutureForecast = () => {
  let city = $('#city-search').val();

  //Establishing a variable with the URL for the future forecast
  let futureForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + apiKey;

  fetch(futureForecastURL)
  .then(handleErrors)
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    //Creating a template for me to add dynamically as the page loads
    let fiveDayForecastHTML = `
    <h2 class="forecast-style">5-Day Forecast:</h2>
    <div class="d-inline-flex flex-wrap" id="fiveDayForecastUl">`;


    //This loops through cities and times
    for (let i = 0; i < response.list.length; i++) {
      let dayData = response.list[i];
      let dayTimeUTC = dayData.dt;
      let timeZoneOffset = response.city.timezone;
      let timeZoneOffsetHours = timeZoneOffset / 60/ 60;
      let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
      let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
        //This template allows me to dyanicamlly create the cards to display the future weather
      if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
        fiveDayForecastHTML += `
        <div class="weather-cards card m-2 p0">
          <ul class="list-unstyled p-3">
            <li>${thisMoment.format("MM/DD/YY")}</li>
            <li class="weather-icon"><img src="${iconURL}"></li>
            <li>Temp: ${dayData.main.temp}&#8457;</li>
            <br>
            <li>Humidity: ${dayData.main.humidity}%</li>
          </ul>
        </div>`;
      }  
    }    
    //This is allowing me to add the template to this section of the HTML with id="forecast-future"
    fiveDayForecastHTML += `</div>`;
    $('#forecast-future').html(fiveDayForecastHTML);
  })
}

//Saving cities to localStorage
var saveCities= (newCity) => {
  let cityExists = false;
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage["cities" + i] === newCity) {
      cityExists = true;
      break;
    }
  }

  if(cityExists=== false) {
    localStorage.setItem("cities" + localStorage.length, newCity);
  }
}

// This saves searched cities in localStorage and creates buttons to display those cities.
var searchedCityButtons = () => {
  $('#results-city').empty();
  // If localStorage is empty use New York.
  if (localStorage.length===0){
    if (lastCity){
      $('#city-search').attr("value", lastCity);
    } else {
      $('#city-search').attr("value", "New York");
    }
  } else {
    let lastCityKey="cities"+(localStorage.length-1);
    lastCity=localStorage.getItem(lastCityKey);

    $('#city-search').attr("value", lastCity);

    // This for loop grabs the cities from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      let city = localStorage.getItem("cities" + i);
      let cityEl;

      // This if statement sets to lastCity if currentCity not set.
      if (currentCity===""){
        currentCity=lastCity;
      }
      // This if else includes a template for the searched city buttons
      if (city === currentCity) {
        cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
      } else {
        cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
      } 
          //This means cityEl is now attached to id=results-city
      $('#results-city').prepend(cityEl);
    }
   
  }
  
}

// New city search button event listener
$('#search-btn').on("click", (event) => {
event.preventDefault();
currentCity = $('#city-search').val();
fetchTodaysConditions(event);
});
   
//Clear old searched cities
$('#clear-storage').on('click', (event) => {
  localStorage.clear();
  renderCities();
});
  
// Calling my functions here at the end for the searched cities and to get today's weather data.
searchedCityButtons();
  
fetchTodaysConditions();



