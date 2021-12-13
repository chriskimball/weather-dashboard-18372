// Selecting elements to interact with
var searchFormEl = $('#search-input');
var searchHistoryEl = $('#search-history');
var searchInputEl = $('#search-value');
var forecastContainerEl = $('#data-container');
var cityName = "";

// Openweather API key
var apiKey = "f30afd0d9c78b669a42b1299a1eee959";

// This function handles search submission
function formSubmit(event){
    
    // Prevent default form submission and clearing cityName variable to blank string
    event.preventDefault();    
    cityName ="";

    // If button clicked in search history use dataset, if submit from form element use the search input value
    if(event.type === "click"){
        cityName = event.target.dataset.city;
    } else if (event.type === "submit"){
        cityName = searchInputEl.val().trim();
    };
    
    // If nothing is entered, render modal letting user know they need to provide more information
    if (!cityName.length) {    
        renderModal("Please enter a city name.", "is-info");
        return;
    };

    // Fetch geodata for city name from user input.
    geoData(cityName);

    // Clears out search input after logging it into City Name variable.
    searchInputEl.val("");
};

// Fetch geolocation data (lat, lon)
function geoData(city){
    
    var requestUrl=`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(requestUrl)
        .then(function(response){
            if (response.ok) {
            return response.json()
        .then(function(data){
            
            // Runs search history function to render button for city data that was retrieved form API GET request.
            searchHistory(data[0].name);
            // Passes geo data into the fetch weather data function.
            weatherData(data);
            })
        } else {
            throw Error("We were not able to locate the city you searched for.");
        }
        })
        .catch(function (Error) {
            // If error is caught render it in a modal with appropriate styling.
            renderModal(Error, "is-warning");
        }); 
};

// Fetch weather data based off location data
function weatherData(locationData){
    
    // Request URL accesses the latitude and longitude from the location data
    var requestUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${locationData[0].lat}&lon=${locationData[0].lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`;
    
    fetch(requestUrl)
    .then(function(response){
        if (response.ok) {
            return response.json()
        .then(function(data){

            // Clears any existing forcast from the forecast container so we can render the forecast for the new search
            forecastContainerEl.html("");
            
            // With the weather data we recieved pass that and the location data into the Render current forecast function
            renderCurrentForecast(data, locationData[0]);

            // Pass weather data into the render daily forecast function
            renderDailyForecast(data);
            return;
            })
        }  else {
            throw Error("We were not able to locate the weather data for the city you searched for.");
        }
        })
        .catch(function (Error) {
            // If error is caught render it in a modal with appropriate styling.
            renderModal(Error, "is-warning");
        });
        
}

// Add search history button
function searchHistory(cityAttr) {

    // For loop with if condition to check if the searched city name already has a button that exists.
    for (i=0; i < searchHistoryEl[0].childElementCount; i++){
        // If a button already exists return out of the function and do not create a duplicate button
        if (searchHistoryEl[0].children[i].dataset.city === cityAttr){
            return;
        };
    };
    
    // If button does not already exist, creates a button element within a template literal.
    var htmlTemplate = `
    <button class="button is-dark is-fullwidth" data-city="${cityAttr}">${cityAttr}</button>        
        `;
    
    // Append html template to search history container element.
    searchHistoryEl.append(htmlTemplate);
};

// Function to render current forecast to page based off weather API data
function renderCurrentForecast(data, cityN) {

    // Passing returned weather data into a variable.
    var weatherInfo = data;

    // Weather url generated with function to enter the icon code into icon URL template.
    var iconURL = weatherIcon(weatherInfo.current.weather[0].icon);
    
    // Variable for UV Index styling
    var uvStyle = "";

    // If condition to check the UV index and assign it styling depending on how severe the UV index is.
    if (weatherInfo.current.uvi <= 2) {
        uvStyle = `style="color:#48c78e;font-weight:500;"`;
    } else if (weatherInfo.current.uvi <= 5) {
        uvStyle = `style="color:yellow;font-weight:800;"`;
    } else if (weatherInfo.current.uvi <= 8) {
        uvStyle = `style="color:orange;font-weight:900;"`;
    } else if (weatherInfo.current.uvi <= 10) {
        uvStyle = `style="color:red;font-weight:1000;"`;
    };

    // Changes the favicon to the Weather Icon URL
    $('#favicon')[0].href= iconURL;

    // Weather data points being added to HTML template literal
    var htmlTemplate = `
        <div id="current-forecast" class="box is-flex is-flex-direction-column has-background-info">
            <h2 class="is-size-2">${cityN.name}, ${cityN.state}, ${cityN.country} - (${moment(weatherInfo.current.dt, "X").format("M/D/YYYY")})</h2>
            <img src="${iconURL}" alt="${weatherInfo.current.weather[0].description}" style="width:100px">
            <p>Temp: ${weatherInfo.current.temp} °F</p>
            <p>Wind: ${weatherInfo.current.wind_speed} mph</p>
            <p>Humidity: ${weatherInfo.current.humidity}%</p>
            <p>UV Index: <span ${uvStyle}>${weatherInfo.current.uvi}</span></p>
        </div>       
        `;

    // Append template literal to forecast container
    forecastContainerEl.append(htmlTemplate);
};

// Function to render 5 day forecast to page based off weather API data
function renderDailyForecast(data) {

    // Passing returned weather data into a variable.
    var weatherInfo = data;
    
    // Clears out HTML template
    var htmlTemplate = "";

    // For loop to loop through daily forecast data for day 1-5 of the forecast
    for (i=1; i <=5; i++){

        // Weather url generated with function to enter the icon code into icon URL template.
        var iconURL = weatherIcon(weatherInfo.daily[i].weather[0].icon);
        
        // Daily forecasted weather data points being added to HTML template literal
        htmlTemplate += `
            <div class="box is-flex-direction-column has-background-grey-lighter column has-text-centered m-1">
                <h3>${moment(weatherInfo.daily[i].dt,"X").format("M/D/YYYY")}</h3>
                <img src="${iconURL}" alt="${weatherInfo.daily[i].weather[0].description}">
                <p>Temp: ${weatherInfo.daily[i].temp.day} °F</p>
                <p>Wind: ${weatherInfo.daily[i].wind_speed} mph</p>
                <p>Humidity: ${weatherInfo.daily[i].humidity}%</p>
            </div>    
            `;
    };

    // HTML template literal for the daily forecast container element which has the 5 daily forecast boxes entered into it.
    var htmlContainer = `
        <div>
            <h2 class="is-size-3">5 day forecast:</h2>
            <div id="daily-forecast" class="p-5 is-flex-tablet columns">
                ${htmlTemplate}
            </div>
        </div>
    `;
    // Appending the html container temlpate literal (with 5 day forecast template literal) to the forecast container element.
    forecastContainerEl.append(htmlContainer);
};

// Function to generate an Icon url based off the icon code
function weatherIcon(iconCode){
    iconURL = "http://openweathermap.org/img/wn/"+ iconCode +"@2x.png";
    return iconURL;
};

// Render modal function acccepts the error response and severity of the error
function renderModal(errorResponse, severity) {
    
    var modalType = "";

    // Conditional check if severity is warning the modal header will display 'Warning' or 'Need more info'
    if(severity === "is-warning"){
        modalType = "Warning";
    } else {
        modalType = "We need more information.";
    };

    // Template literal with modal contents entered into modal container
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
                `);
    // Toggles modal on when modal is rendered
    modalToggle();
};

// Toggles modal class is-active on or off
function modalToggle(){
    $('.modal').toggleClass('is-active');
};

// Event listener for the search form
searchFormEl.on('submit', formSubmit);

// Event listener for the modal if it is toggled on the user can click anywhere to close it.
$('.modal').on('click', modalToggle);

// Event listener for button clicks in the search history container
searchHistoryEl.on('click', 'button', formSubmit);