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

    if(event.type === "click"){
        cityName = event.target.dataset.city
    }else if (event.type === "submit"){
        cityName = searchInputEl.val().trim()
    }
    
    if (!cityName.length){
        
        renderModal("Please enter a city name.", "is-info")
        return
    }

    
    
    geoData(cityName)
    // clears out search input after logging it into City Name variable
    searchInputEl.val("")

}




// Fetch geolocation data (lat, lon)
function geoData(city){
    
    var requestUrl=`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`

    fetch(requestUrl)
        .then(function(response){
            if (response.ok) {
                
            return response.json()
        .then(function(data){
            
            searchHistory(data[0].name)
            // working with the data we provide
            weatherData(data)
            })
        } else {
            throw Error("We were not able to locate the city you searched for.");
        }
        })
        .catch(function (Error) {
            renderModal(Error, "is-warning")
        });
    
}

function weatherData(locationData){
    
    var requestUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${locationData[0].lat}&lon=${locationData[0].lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`
    
    fetch(requestUrl)
    .then(function(response){
        if (response.ok) {
            return response.json()
            .then(function(data){
                forecastContainerEl.html("")
                
                renderCurrentForecast(data, locationData[0])
                renderDailyForecast(data)
                return
            })
        }  else {
            throw Error("We were not able to locate the weather data for the city you searched for.");
        }
        })
        .catch(function (Error) {
            renderModal(Error, "is-warning")
        });
        
}



// Render html elements to page

    
    // Add search history button
function searchHistory(cityAttr) {
    
    for (i=0; i < searchHistoryEl[0].childElementCount; i++){
        if (searchHistoryEl[0].children[i].dataset.city === cityAttr){
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
    var uvStyle = ""
    if (weatherInfo.current.uvi <= 2) {
        uvStyle = `style="color:#48c78e;font-weight:500;"`

    }   else if (weatherInfo.current.uvi <= 5) {
        uvStyle = `style="color:yellow;font-weight:800;"`

    } else if (weatherInfo.current.uvi <= 8) {
        uvStyle = `style="color:orange;font-weight:900;"`

    } else if (weatherInfo.current.uvi <= 10) {
        uvStyle = `style="color:red;font-weight:1000;"`
    }


    $('#favicon')[0].href= iconURL

    var htmlTemplate = `
        <div id="current-forecast" class="box is-flex is-flex-direction-column has-background-info">
            <h2 class="is-size-2">${cityN.name}, ${cityN.state}, ${cityN.country} - (${moment(weatherInfo.current.dt, "X").format("M/D/YYYY")})</h2>
            <img src="${iconURL}" alt="${weatherInfo.current.weather[0].description}" style="width:100px">
            <p>Temp: ${weatherInfo.current.temp} °F</p>
            <p>Wind: ${weatherInfo.current.wind_speed} mph</p>
            <p>Humidity: ${weatherInfo.current.humidity}%</p>
            <p>UV Index: <span ${uvStyle}>${weatherInfo.current.uvi}</span></p>
        </div>       
        `
    forecastContainerEl.append(htmlTemplate)

};

function renderDailyForecast(data) {

    var weatherInfo = data
    
    var htmlTemplate = ""

    for (i=1; i <=5; i++){
        var iconURL = weatherIcon(weatherInfo.daily[i].weather[0].icon)
        
        htmlTemplate += `
            <div class="box is-flex-direction-column has-background-grey-lighter column has-text-centered m-1">
                <h3>${moment(weatherInfo.daily[i].dt,"X").format("M/D/YYYY")}</h3>
                <img src="${iconURL}" alt="${weatherInfo.daily[i].weather[0].description}">
                <p>Temp: ${weatherInfo.daily[i].temp.day} °F</p>
                <p>Wind: ${weatherInfo.daily[i].wind_speed} mph</p>
                <p>Humidity: ${weatherInfo.daily[i].humidity}%</p>
            </div>    
            `
    }

    var htmlContainer = `
        <div>
            <h2 class="is-size-3">5 day forecast:</h2>
            <div id="daily-forecast" class="p-5 is-flex-tablet columns">
                ${htmlTemplate}
            </div>
        </div>
    `
    forecastContainerEl.append(htmlContainer)

};

function weatherIcon(iconCode){
    iconURL = "http://openweathermap.org/img/wn/"+ iconCode +"@2x.png"
    return iconURL
}

function renderModal(errorResponse, severity) {
    
    var modalType = ""
    if(severity === "is-warning"){
        modalType = "Warning"
    } else {
        modalType = "We need more information."
    }

    $('.modal-content').html(`
                <article class="message ${severity}">
                    <div class="message-header">
                        <p>${modalType}</p>
                        <button class="delete" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                        ${errorResponse}
                    </div>
                </article>
                `)
    modalToggle()
}

function modalToggle(){
    $('.modal').toggleClass('is-active')
}


searchFormEl.on('submit', formSubmit)

$('.modal').on('click', modalToggle)

searchHistoryEl.on('click', 'button', formSubmit)