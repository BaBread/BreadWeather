let myApiKey = '206b45aa67675777abb26bef2259556a';
let borrowedAPIKey = '1b18ce13c84e21faafb19c931bb29331';
let openWeatherCoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
let oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='
let userFormEL = $('#city-search');
let col2El = $('.col2');
let cityInputEl = $('#city');
let fiveDayEl = $('#five-day');
let searchHistoryEl = $('#search-history');
let currentDay = moment().format('M/DD/YYYY');
const weatherIconUrl = 'http://openweathermap.org/img/wn/';
let searchHistoryArray = loadSearchHistory();
let currentCity = $("#current-city");
let currentTemp = $("#current-temp");
let currentHumidity = $("#current-humidity");
let currentWindSpeed = $("#current-wind-speed");
let UVindex = $("#uv-index");

function titleCase(string) {
    const words = string.split(' ');

    const titleCaseWords = words.map((word)=>{
        if (word.length>0) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
    });
    return titleCaseWords.join(' ');
}


function loadSearchHistory() {
    let searchHistoryArray = JSON.parse(localStorage.getItem('search history'));


    if (!searchHistoryArray) {
        searchHistoryArray = {
            searchedCity: [],
        };
    } else {

        for (let i = 0; i < searchHistoryArray.searchedCity.length; i++) {
            searchHistory(searchHistoryArray.searchedCity[i]);
        }
    }

    return searchHistoryArray;
}


function saveSearchHistory() {
    localStorage.setItem('search history', JSON.stringify(searchHistoryArray));
};


function searchHistory(city) {
    let searchHistoryBtn = $('<button>')
        .addClass('btn')
        .text(city)
        .on('click', function () {
            $('#current-weather').remove();
            $('#five-day').empty();
            $('#five-day-header').remove();
            getWeather(city);
        })
        .attr({
            type: 'button'
        });


    searchHistoryEl.append(searchHistoryBtn);
}

function getWeather(cityName) {

    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${borrowedAPIKey}`
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDay + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        let lat = response.coord.lat;
        let lon = response.coord.lon;
        

        let UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + borrowedAPIKey;
        $.ajax({
            url: UVurl,
            method: "GET"
        }).then(function(response){
            UVindex.text(response.value);
        });

        let countryCode = response.sys.country;
        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + borrowedAPIKey + "&lat=" + lat +  "&lon=" + lon;
        
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            $('#five-day-forecast').empty();
            for (let i = 1; i < response.list.length; i+=8) {

                let forecastDateString = moment(response.list[i].dt_txt).format("L");

                let forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                let forecastCard = $("<div class='card'>");
                let forecastCardBody = $("<div class='card-body'>");
                let forecastDate = $("<h5 class='card-title'>");
                let forecastIcon = $("<img>");
                let forecastTemp = $("<p class='card-text mb-0'>");
                let forecastHumidity = $("<p class='card-text mb-0'>");


                $('#five-day-forecast').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardBody);

                forecastCardBody.append(forecastDate);
                forecastCardBody.append(forecastIcon);
                forecastCardBody.append(forecastTemp);
                forecastCardBody.append(forecastHumidity);
                
                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main)
                forecastDate.text(forecastDateString);
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;F");
                forecastHumidity.text(response.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");
                


            }
        });

    });

    

};

 

function submitCitySearch(event) {
    event.preventDefault();

   
    let city = titleCase(cityInputEl.val().trim());

 
    if (searchHistoryArray.searchedCity.includes(city)) {
        alert(city + ' is included in history below. Click the ' + city + ' button to get weather.');
        cityInputEl.val('');
    } else if (city) {
        getWeather(city);
        searchHistory(city);
        searchHistoryArray.searchedCity.push(city);
        saveSearchHistory();
      
        cityInputEl.val('');
        
    
    } else {
        alert('Please enter a city');
    }
}


userFormEL.on('submit', submitCitySearch);


$('#search-btn').on('click', function () {
    $('#current-weather').remove();
    $('#five-day').empty();
    $('#five-day-header').remove();
})
