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
            console.log(response)
            return response.json();
        })
        .then(function(data){
            // we only have the data in this .then() menthod.
            
            // console.log(data)
            console.log(data)
            // working with the data we provide
            
            // 
            // weatherData( /* provide lat and long data here*/ )

        })
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

// Render html elements to page

    // Render current day forecast

    // Render 5 day forecast

    // Add search history button


// Event listeners
searchFormEl.on('submit', formSubmit)

searchHistoryEl.on('click', 'button', formSubmit)