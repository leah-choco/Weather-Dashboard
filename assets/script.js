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
    console.log(currentWeatherIcon)


    //Formatting timezone 
    let currentTimeUTC = response.dt;
    let currentTimeZoneOffset = response.timezone;
    let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
    let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

    renderCities();


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
var getFiveDays = function(event) {
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
        
          if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
            fiveDayForecastHTML += `
            <div class="weather-card card m-2 p0">
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

         // HTML template
         fiveDayForecastHTML += `</div>`;
         $('#forecast-five-day').html(fiveDayForecastHTML);

      })
    }
  })


}

var saveCity= (newCity) => {
  let cityExists = false;
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage["cities" + i] === newCity) {
      cityExists = true;
      break;
    }
  }

  if(cityExists=== false){
    localStorage.setItem("cities" + localStorage.length, newCity)
  }

}

// Render searched cities
var renderCities = () => {
  $('#results-city').empty();
  // If localStorage is empty
  if (localStorage.length===0){
    if (lastCity){
      $('#city-search').attr("value", lastCity);
    } else {
      $('#city-search').attr("value", "New York");
    }
  } else {
    //Last city written to localStorage
    let lastCityKey="cities"+(localStorage.length-1);
    lastCity=localStorage.getItem(lastCityKey);

    // Search input for last city
    $('#city-search').attr("value", lastCity);

    // Stored cities to page
    for (let i = 0; i < localStorage.length; i++) {
      let city = localStorage.getItem("cities" + i);
      let cityEl;

      // Set to lastCity if currentCity not set
      if (currentCity===""){
        currentCity=lastCity;
      }
      // Set button class to active for currentCity
      if (city === currentCity) {
        cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
      } else {
        cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
      } 
          
      $('#results-city').prepend(cityEl);
    }
    // Add a "clear" button
    if (localStorage.length>0){
      $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
    } else {
     $('#clear-storage').html('');
    }
  }
  
}

// New city search button event listener
$('#search-btn').on("click", (event) => {
  event.preventDefault();
  currentCity = $('#city-search').val();
  getCurrentConditions(event);
  });
  
  // Old searched cities buttons event listener
  $('#results-city').on("click", (event) => {
      event.preventDefault();
      $('#city-search').val(event.target.textContent);
      currentCity=$('#city-search').val();
      getCurrentConditions(event);
  });
  
  
  
  
  renderCities();
  
  getCurrentConditions();



