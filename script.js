// Selecting elements to interact with
var searchFormEl = $('#search-input')
var searchHistoryEl = $('#search-history')
var searchInputEl = $('#search-value')
var cityName = ""

var apiKey = "f30afd0d9c78b669a42b1299a1eee959"
var forecastContainerEl = $('#data-container')
// var currentForecastEl = $('#current-forecast')
// var dailyForecastEl = $('#daily-forecast')

// Fetch request functions

function formSubmit(event){
    
    event.preventDefault()
    
    cityName =""

    if(event.type === "click"){
        cityName = event.target.dataset.city
    }else if (event.type === "submit"){
        cityName = searchInputEl.val()
    }
    
    if (!cityName.length){
        alert("Please enter a city name.")
        return
    }

    console.log(cityName)
    geoData(cityName)
    // clears out search input after logging it into City Name variable
    searchInputEl.val("")

}


// Fetch geolocation data (lat, lon)
function geoData(city){
    
    var requestUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`

    fetch(requestUrl)
        .then(function(response){
            if (response.ok) {
            return response.json()
        .then(function(data){
            
            searchHistory(data[0].name)
            // working with the data we provide
            weatherData(data[0].lat, data[0].lon, data[0].name)
            })
        } else {
            throw Error('Error: ' + response.statusText);
        }
        })
        .catch(function (Error) {
          alert('Unable to connect to Openweathermap Geocoding API.');
        });
        // Api parameters
            // q=Name of city
                // Name of the City
                // Query strings start with ?
                // Separate keys and value with equal sign =
                // Separate key value pairs with ampersand &
                // Looking for only city name
        
                // Save city name to history
            // limit=5
        
            // appid={my custom api key}
}

function weatherData(lat, lon, cityN){
    
    var requestUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`

    fetch(requestUrl)
        .then(function(response){
            if (response.ok) {
            console.log(response)
            return response.json()
        .then(function(data){
                console.log(data)
                renderCurrentForecast(data, cityN)
            
            })
        } else {
            throw Error('Error: ' + response.statusText);
        }
        })
        .catch(function (Error) {
          alert('Unable to connect to Openweathermap One Call API.');
        });
        // API parameters
            // Latitude
    
            // Longitude
    
            // appid
    
            // units= imperial
    
                // configuring the units
                    // Unit of measurement that is returned
    
            // exclude= minutely,hourly
}



// Render html elements to page

    // Render current day forecast

    // Render 5 day forecast

    
    // Add search history button
function searchHistory(cityAttr) {
    
    for (i=0; i < searchHistoryEl[0].childElementCount; i++){
        if (searchHistoryEl[0].children[i].dataset.city === cityAttr){
            console.log("match")
            return
        }
    }
    
    var htmlTemplate = `
    <button class="button is-dark is-fullwidth" data-city="${cityAttr}">${cityAttr}</button>        
        `
    searchHistoryEl.append(htmlTemplate)
}

function renderCurrentForecast(data, cityN) {

    var weatherInfo = data
    console.log(cityN)
    // console.log(weatherInfo.current.weather[0].icon)
    var iconURL = weatherIcon(weatherInfo.current.weather[0].icon)
    console.log(iconURL)
    
    var htmlTemplate = `
        <div id="current-forecast" class="box is-flex is-flex-direction-column">
            <h2>${cityN} ${weatherInfo.current.dt} <img src="${iconURL}"></h2>
            <p>Temp: ${weatherInfo.current.temp}</p>
            <p>Wind: ${weatherInfo.current.wind_speed}</p>
            <p>Humidity: ${weatherInfo.current.humidity}</p>
            <p>UV Index: ${weatherInfo.current.uvi}</p>
        </div>       
        `
    forecastContainerEl.append(htmlTemplate)

    console.log("data.current.dt",data.current.dt)
    console.log("data.current.weather.description ",""+data.current.weather[0].description)
    console.log("data.current.weather.icon ","http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png")
    console.log("data.current.temp",data.current.temp)
    console.log("data.current.wind_speed",data.current.wind_speed)
    console.log("data.current.humidity",data.current.humidity)
    console.log("data.current.humidity",data.current.uvi)
    console.log(data)
};



function weatherIcon(iconCode){
    var iconURL = "http://openweathermap.org/img/wn/"+ iconCode +"@2x.png"
    console.log(iconURL)
    return iconURL
}

// function renderDailyForecast(data)
// Event listeners
searchFormEl.on('submit', formSubmit)

searchHistoryEl.on('click', 'button', formSubmit)