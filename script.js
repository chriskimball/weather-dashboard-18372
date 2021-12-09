// Selecting elements to interact with
var searchFormEl = $('#search-input')
var searchHistoryEl = $('#search-history')
var searchInputEl = $('#search-value')
var forecastContainerEl = $('#data-container')
var cityName = ""

var apiKey = "f30afd0d9c78b669a42b1299a1eee959"

function formSubmit(event){
    
    event.preventDefault()
    
    cityName =""

    forecastContainerEl.html("")
    
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
                renderDailyForecast(data)
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
    var iconURL = weatherIcon(weatherInfo.current.weather[0].icon)
    
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

function renderDailyForecast(data) {

    var weatherInfo = data
    
    var htmlTemplate = ""
    for (i=1; i <=5; i++){
        console.log(i)
        var iconURL = weatherIcon(weatherInfo.daily[i].weather[0].icon)
        
        htmlTemplate += `
            <div class="box is-flex-direction-column has-background-grey-lighter column">
                <h3>${weatherInfo.daily[i].dt}</h3>
                <img src="${iconURL}">
                <p>Temp:${weatherInfo.daily[i].temp.day}</p>
                <p>Wind:${weatherInfo.daily[i].wind_speed}</p>
                <p>Humidity:${weatherInfo.daily[i].humidity}</p>
            </div>    
            `
    }
    console.log(htmlTemplate)

    var htmlContainer = `
    <div class="p-5">
        <h2 class="is-size-3">5 day forecast:</h2>
        <div id="daily-forecast" class="p-5 is-flex-tablet columns">
            ${htmlTemplate}
        </div>
    </div>
    `
    console.log(htmlContainer)
    forecastContainerEl.append(htmlContainer)

    // console.log("data.current.dt",data.current.dt)
    // console.log("data.current.weather.description ",""+data.current.weather[0].description)
    // console.log("data.current.weather.icon ","http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png")
    // console.log("data.current.temp",data.current.temp)
    // console.log("data.current.wind_speed",data.current.wind_speed)
    // console.log("data.current.humidity",data.current.humidity)
    // console.log("data.current.humidity",data.current.uvi)
    // console.log(data)
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