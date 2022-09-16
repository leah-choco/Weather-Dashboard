

// OpenWeather API(LearningBot Key, mine would not work)
const apiKey = "fc02d6d30dd32f5567b9706fc1c7ef42";
    

  

// Store past searched cities
let pastCities = [];

  

   

// Load events from local storage
function loadCities() {
const storedCities = JSON.parse(localStorage.getItem('pastCities'));
    if (storedCities) {
    pastCities = storedCities;
 }
}

// Store searched cities in local storage
function storeCities() {
        localStorage.setItem('pastCities', JSON.stringify(pastCities));
}

// Functions to build the URL for the OpenWeather API call
 
function buildURLFromInputs(city) {
    if (city) {
         return `http://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${apiKey}`;
    }
}

function buildURLFromId(id) {
     return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
 
}
// Function to display the last 5 searched cities
function displayCities(pastCities) {
    
    
// Function to color the UV Index based on EPA color scale
function setUVIndexColor(uvi) {
    if (uvi < 3) {
        return 'green';
    } else if (uvi >= 3 && uvi < 6) {
        return 'yellow';
    } else if (uvi >= 6 && uvi < 8) {
        return 'orange';
    } else if (uvi >= 8 && uvi < 11) {
        return 'red';
    } 
}

// Search for weather conditions by calling the OpenWeather API
function searchWeather(){
}


// Call OpenWeather API OneCall with lat and lon to get the UV index and 5 day forecast
let lat = response.coord.lat;
let lon = response.coord.lon;
let latLon = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
          

};
    

// Function to display the last searched city
function displayLastSearchedCity() {
 
 
    // Click handler for search button
    $('#search-btn').on('click', function (event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();

        // Retrieving and scrubbing the city from the inputs
       

        // Clear the input fields
        cityInput.val('');

        // Build the query url with the city and searchWeather
        if (city) {
            let queryURL = buildURLFromInputs(city);
            searchWeather(queryURL);
        }
    }); 
    
    // Click handler for city buttons to load that city's weather
    $(document).on("click", "button.city-btn", function (event) {
       
    });

 
}
// load any cities in local storage into array
loadCities();
displayCities(pastCities);

// Display weather for last searched city
displayLastSearchedCity();




