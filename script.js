// Selecting elements to interact with
var searchFormEl = $('#search-input')
var searchHistoryEl = $('#search-history')
var searchInputEl = $('#search-value')
var cityName = ""

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

    // clears out search input after logging it into City Name variable
    searchInputEl.val("")
    
}



// Render html elements to page

    // Render current day forecast

    // Render 5 day forecast

    // Add search history button


// Event listeners
searchFormEl.on('submit', formSubmit)

searchHistoryEl.on('click', 'button', formSubmit)