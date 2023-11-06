

let openWeatherApiKey = '877e2764405002039ea1afb5f87a8098';
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

function getWeather(city) {

    let apiCoordinatesUrl = openWeatherCoordinatesUrl + city + '&appid=' + openWeatherApiKey;

    fetch(apiCoordinatesUrl)
        .then(function (coordinateResponse) {
            if (coordinateResponse.ok) {
                coordinateResponse.json().then(function (data) {
                    let cityLatitude = data.coord.lat;
                    let cityLongitude = data.coord.lon;
               
                    let apiOneCallUrl = oneCallUrl + cityLatitude + '&lon=' + cityLongitude + '&appid=' + openWeatherApiKey + '&units=imperial';

                    fetch(apiOneCallUrl)
                        .then(function (weatherResponse) {
                            if (weatherResponse.ok) {
                                weatherResponse.json().then(function (weatherData) {

                                 
                                    let currentWeatherEl = $('<div>')
                                        .attr({
                                            id: 'current-weather'
                                        })

                                
                                    let weatherIcon = weatherData.current.weather[0].icon;
                                    let cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';

                           
                                    let currentWeatherHeadingEl = $('<h2>')
                                        .text(city + ' (' + currentDay + ')');
                                
                                    let iconImgEl = $('<img>')
                                        .attr({
                                            id: 'current-weather-icon',
                                            src: cityCurrentWeatherIcon,
                                            alt: 'Weather Icon'
                                        })
                              
                                    let currWeatherListEl = $('<ul>')

                                    let currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

                                    for (let i = 0; i < currWeatherDetails.length; i++) {
                                       
                                        if (currWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {

                                            let currWeatherListItem = $('<li>')
                                                .text('UV Index: ')

                                            currWeatherListEl.append(currWeatherListItem);

                                            let uviItem = $('<span>')
                                                .text(weatherData.current.uvi);

                                            if (uviItem.text() <= 2) {
                                                uviItem.addClass('favorable');
                                            } else if (uviItem.text() > 2 && uviItem.text() <= 7) {
                                                uviItem.addClass('moderate');
                                            } else {
                                                uviItem.addClass('severe');
                                            }

                                            currWeatherListItem.append(uviItem);

                                            
                                        } else {
                                            let currWeatherListItem = $('<li>')
                                                .text(currWeatherDetails[i])
                                           
                                            currWeatherListEl.append(currWeatherListItem);
                                        }

                                    }

                                    
                                    $('#five-day').before(currentWeatherEl);
                                    
                                    currentWeatherEl.append(currentWeatherHeadingEl);
                                  
                                    currentWeatherHeadingEl.append(iconImgEl);
                                  
                                    currentWeatherEl.append(currWeatherListEl);

                                   
                                    let fiveDayHeaderEl = $('<h2>')
                                        .text('5-Day Forecast:')
                                        .attr({
                                            id: 'five-day-header'
                                        })

                                  
                                    $('#current-weather').after(fiveDayHeaderEl)

                                    

                                    let fiveDayArray = [];

                                    for (let i = 0; i < 5; i++) {
                                        let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');

                                        fiveDayArray.push(forecastDate);
                                    }

                                
                                    for (let i = 0; i < fiveDayArray.length; i++) {
                                       
                                        let cardDivEl = $('<div>')
                                            .addClass('col3');

                                        
                                        let cardBodyDivEl = $('<div>')
                                            .addClass('card-body');

                                     
                                        let cardTitleEl = $('<h3>')
                                            .addClass('card-title')
                                            .text(fiveDayArray[i]);

                                       
                                        let forecastIcon = weatherData.daily[i].weather[0].icon;

                                        let forecastIconEl = $('<img>')
                                            .attr({
                                                src: weatherIconUrl + forecastIcon + '.png',
                                                alt: 'Weather Icon'
                                            });

                                      
                                        let currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
                                       
                                        let tempEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Temp: ' + weatherData.daily[i].temp.max)
                                       
                                        let windEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Wind: ' + weatherData.daily[i].wind_speed + ' MPH')
                                    
                                        let humidityEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Humidity: ' + weatherData.daily[i].humidity + '%')


                                       
                                        fiveDayEl.append(cardDivEl);
                                    
                                        cardDivEl.append(cardBodyDivEl);
                                        
                                        cardBodyDivEl.append(cardTitleEl);
                                      
                                        cardBodyDivEl.append(forecastIconEl);
                                      
                                        cardBodyDivEl.append(tempEL);
                                        
                                        cardBodyDivEl.append(windEL);
                                        
                                        cardBodyDivEl.append(humidityEL);
                                    }

                                
                                })
                            }
                        })
                });
                
            } else {
                alert('Error: Open Weather could not find city')
            }
        })
      
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
}

 

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
