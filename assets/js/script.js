const apiKey = "fcd4959547494e3926eb7576b9b31d6a";
const searchBtnEl = document.getElementById("search-btn");

searchBtnEl.addEventListener("click", function() {
    const city = document.querySelector("input").value;
    if (city !== "") 
    {
        displayWeatherInfo(city);
        populateSearchHistory(city);
        document.querySelector("input").value = "";
    }       
});

function displayWeatherInfo(city) {
    const requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const cityDateEls = document.getElementsByClassName("city-date");
    const cityWeatherIconEls = document.getElementsByClassName("city-weather-icon");
    const cityTempEls = document.getElementsByClassName("city-temp");
    const cityWindSpeedEls = document.getElementsByClassName("city-wind-speed");
    const cityHumidityEls = document.getElementsByClassName("city-humidity");
    const cityUvIndexEl = document.getElementById("city-uvIndex");
    let cityLongitude;
    let cityLatitude;
    fetch(requestUrl)
        .then(function (response) { return response.json(); })
        .then(function (data) {
            cityLongitude = data.coord.lon;
            cityLatitude = data.coord.lat;
            const url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely&units=imperial&appid=${apiKey}`
            fetch(url2)
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    for (let i = 0; i < cityDateEls.length; i++) 
                    {
                        dataIcon = data.daily[i].weather[0].icon;
                        iconUrl = `http://openweathermap.org/img/wn/${dataIcon}.png`;
                        const dateStr = new Date(data.daily[i].dt * 1000).toLocaleString();
                        //const currentDate = dateObject.toLocaleString();
                        const dateArray = dateStr.split(",");
                        if (i === 0)
                        {
                            cityDateEls[i].textContent = `${city} ${dateArray[0]}`;
                        }
                        else
                        {
                            cityDateEls[i].textContent = dateArray[0];
                        }                        
                        cityWeatherIconEls[i].setAttribute("src", iconUrl);
                        cityTempEls[i].textContent = `Temp: ${data.daily[i].temp.day} `;
                        cityWindSpeedEls[i].textContent = `Wind: ${data.daily[i].wind_speed} MPH`;
                        cityHumidityEls[i].textContent = `Humidity: ${data.daily[i].humidity} %`;
                        if (i === 0) 
                        { 
                            cityUvIndexEl.textContent = `UV Index: ${data.daily[i].uvi}`;
                            uvIndexColor(data.daily[i].uvi) 
                        }
                    }                     
                });

        });
}

function convertDateUsingMoment(date)
{
     const dateAndTimeArray = date.split(" ");
     const currentDate = dateAndTimeArray[0];
     const momentOne = moment(currentDate).format("l");
     return momentOne;
}

function populateSearchHistory(city) {
    const searchHistoryEl = document.getElementById("search-history");
    let ulEl;
    let liEl;
    let btnEl;
    if (!searchHistoryEl.hasChildNodes()) {
        ulEl = document.createElement("ul");
        ulEl.style.listStyle = "none";
        searchHistoryEl.appendChild(ulEl);
    }
    ulEl = searchHistoryEl.querySelector("ul");
    liEl = document.createElement("li");
    liEl.style.marginTop = "10px";
    ulEl.appendChild(liEl);
    btnEl = document.createElement("button");
    btnEl.style.width = "100%";
    btnEl.textContent = city;
    liEl.appendChild(btnEl);
    btnEl.addEventListener("click", function () {
        displayWeatherInfo(city);
    });
}

function uvIndexColor(uvIndex)
{
    const cityUvIndexEl = document.getElementById("city-uvIndex");
    if (uvIndex >= 0 && uvIndex < 3) 
    { 
        cityUvIndexEl.style.backgroundColor = "green";
        cityUvIndexEl.style.color = "white"; 
    }
    else if (uvIndex >= 3 && uvIndex < 6) 
    { 
        cityUvIndexEl.style.backgroundColor = "yellow"; 
        cityUvIndexEl.style.color = "black"; 
    }
    else if (uvIndex >= 6 && uvIndex < 8) 
    { 
        cityUvIndexEl.style.backgroundColor = "orange"; 
        cityUvIndexEl.style.color = "white"; 
    }
    else if (uvIndex >= 8 && uvIndex < 11) 
    { 
        cityUvIndexEl.style.backgroundColor = "red";
        cityUvIndexEl.style.color = "white";  
    }
    else 
    { 
        cityUvIndexEl.style.backgroundColor = "violet"; 
        cityUvIndexEl.style.color = "white"; 
    }
}

