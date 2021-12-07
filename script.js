// Selecting elements to interact with
var searchFormEl = $('#search-input')
var searchHistoryEl = $('#search-history')
var searchInputEl = $('#search-value')
var cityName = ""

var apiKey = "f30afd0d9c78b669a42b1299a1eee959"

var currentForecastEl = $('#current-forecast')
var dailyForecastEl = $('#daily-forecast')

// Fetch request functions

function formSubmit(event){
    
    event.preventDefault()
    
    cityName =""

    if(event.type === "click"){
        cityName = event.target.dataset.city
    }else if (event.type === "submit"){
        cityName = searchInputEl.val()
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
            weatherData(data[0].lat, data[0].lon)
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

function weatherData(lat, lon){
    
    var requestUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`

    fetch(requestUrl)
        .then(function(response){
            if (response.ok) {
            console.log(response)
            return response.json()
        .then(function(data){
            
            console.log(data)

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
    <button class="button is-dark is-fullwidth m-2" data-city="${cityAttr}">${cityAttr}</button>        
        `
    searchHistoryEl.append(htmlTemplate)
}


// Event listeners
searchFormEl.on('submit', formSubmit)

searchHistoryEl.on('click', 'button', formSubmit)