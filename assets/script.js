$(document).ready(function() {

    var apiKey="2adb0e1386fd4562a25991a6f5385a87";

    var cityEl=$("h2#city");
    var dateEl=$("h3#date");
    var weatherIconEl=$("img#weather-icon");
    var temperatureEl=$("span#temperature");
    var humidityEl=$("span#humidity");
    var windEl=$("span#wind");
    var uvIndexEl=$("span#uv-index");
    var cityListEl=$(".cityList");

    var cityInput=$("#city-input");

    let pastCities=[];

    //function compare(a,b){
       // const cityA=
    //}
    
})

function loadCities(){
    const storedCities=JSON.parse(localStorage.getItem("pastCities"));
    if (storedCities){
        pastCities=storedCities;
    }
}
 
function storeCities(){
    localStorage.setItem("pastCities", JSON.stringify(pastCities));
}

function buildURLInputs (city) {
    if (city){
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }
}

function buildURLIds(id){
    return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
}

function displayCities(pastCities){
    cityListEl.empty();
    pastCities.splice(5);
    let sortedCities=[...pastCities];
    sortedCities.sort(compare);
    sortedCities.forEach(function (location){
        let cityDiv=$('<div>').addClass("col-12 city");
        let cityBtn=$("<button>").addClass("btn btn-light city-btn").text(location.city);
        cityDiv.append(cityBtn);
        cityListEl.append(cityDiv);
    });
}


function UVIndexColor(uvi){
    if (uvi < 3){
        return "green";
    }else if (uvi >= 3 && uvi < 6){
        return "yellow";
    } else if (uvi >= 6 && uvi < 8){
        return "orange";
    }else if (uvi >= 8 && uvi < 11){
        return "red";
    }else return "purple";
}

function searchWeather(queryURL){

    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function (response){

        let city= response.name;
        let id= response.id;
        
    })
}
pastCities.unshift({ city, id});
storeCities();
displayCities(pastCities);

cityEl.text(response.name);
let formattedDate=moment.unix(response.dt).format("L");
dateEl.text(formattedDate);
let weatherIcon =response.weather[0].icon;
weatherIconEl.attr("src", `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
temperatureEl.html(((response.main.temp- 273.15) * 1.8 + 32).toFixed (1));
humidityEl.text(response.main.humidity);
windEl.text((response.wind.speed * 2.237).toFixed(1));


let lat= response.coored.lat;
let lon= response.coord.lon;
let queryURLAll= `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
$.ajax({
    url:queryURLAll,
    method:"GET"
}).then(function(response){
    let uvIndex=response.current.uvi;
    let uvColor= setUVIndexColor(uvIndex);
    uvIndexEl.text(response.current.uvi);
    let fiveDay=response.daily;

    for(let i=0; i <= 5; i++){
        let currDay= fiveDay[i];
        $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
         $(`div.day-${i} .fiveDay-img`).attr( 'src',`http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                    ).attr('alt', currDay.weather[0].description);
                    $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                    $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
                }
});

function displayLastSearchedCity() {
    if (pastCities[0]) {
     let queryURL = buildURLFromId(pastCities[0].id);
 searchWeather(queryURL);
    
    }
 
$('#search-btn').on('click', function (event) {

event.preventDefault();

    
    let city = cityInput.val().trim();
    city = city.replace(' ', '%20');
    
    cityInput.val('');

 
     if (city) {
    let queryURL = buildURLFromInputs(city);
     searchWeather(queryURL);
    
    }; 
    
    
    $(document).on("click", "button.city-btn", function (event) {
        let clickedCity = $(this).text();
        let foundCity = $.grep(pastCities, function (storedCity) {
            return clickedCity === storedCity.city;
        })
        let queryURL = buildURLFromId(foundCity[0].id)
        searchWeather(queryURL);
    });


    loadCities();
    displayCities(pastCities);

   
    displayLastSearchedCity();

