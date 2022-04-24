const apiKey = "ff5efd6ccb32c688cc5cf4db3f84e813";
const unit = "metric";

let tempCelsius = null;
let tempCelsiusFCmax = [];
let tempCelsiusFCmin = [];

let tempFahrenheit = null;
let tempFahrenheitFCmax = [];
let tempFahrenheitFCmin = [];

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let hour = date.getHours();
  let minute = String(date.getMinutes()).padStart(2, "0");
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return [days[day], hour, minute];
}

function searchCity(event) {
  event.preventDefault();

  let cityName = event.target[0].value;
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

  axios.get(apiURL).then(getCityData);
}

function getCityData(response) {
  console.log(response);
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  let forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=${unit}`;

  let cityName = response.data.name + ", " + response.data.sys.country;
  let currentTemp = Math.round(response.data.main.temp);
  let currentHum = Math.round(response.data.main.humidity);
  let currentWind = Math.round(response.data.wind.speed);
  let weatherIcon = response.data.weather[0].icon;
  let weatherDescription = response.data.weather[0].description;
  let lastUpdate = formatDay(response.data.dt);

  tempCelsius = currentTemp;
  tempFahrenheit = Math.round((tempCelsius * 9) / 5 + 32);

  changePage(
    currentTemp,
    currentHum,
    currentWind,
    weatherIcon,
    cityName,
    weatherDescription,
    lastUpdate
  );

  axios.get(forecastURL).then(displayForecastData);
}

function changePage(temp, humidity, wind, icon, cityName, weatherDesc, time) {
  document.querySelector("#city-name").innerHTML = cityName;
  document.querySelector("#weather-description").innerHTML = weatherDesc;
  document.querySelector("#temperature").innerHTML = temp;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = wind;
  document.querySelector(
    "#weather-icon"
  ).innerHTML = `<img src='https://openweathermap.org/img/wn/${icon}@2x.png' id="icon" />`;

  document.querySelector("#current-time").innerHTML =
    "Last updated: " + time[0] + ", " + time[1] + ":" + time[2];
}

function displayForecastData(response) {
  let forecastData = response.data.daily;
  forecastData.splice(0, 1);

  let forecast = `<div class="row">`;

  forecastData.forEach(function (forecastDay, index) {
    if (index < 6) {
      tempCelsiusFCmax.push(Math.round(forecastDay.temp.max));
      tempCelsiusFCmin.push(Math.round(forecastDay.temp.min));

      tempFahrenheitFCmax.push(
        Math.round((tempCelsiusFCmax[index] * 9) / 5 + 32)
      );
      tempFahrenheitFCmin.push(
        Math.round((tempCelsiusFCmin[index] * 9) / 5 + 32)
      );

      forecast += `<div class="col-2 forecast forecast-child-${index}">
      <div class="forecast-day">${formatDay(forecastDay.dt)[0]}</div>
      <div>
        <img
          src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          id="icon"
          width="70px"
        />
      </div>
      <div>
        <span id="temperature-forecast-max${index}">${Math.round(
        forecastDay.temp.max
      )}°</span>
        <span
          class="temperature-forecast-min"
          id="temperature-forecast-min${index}"
          >${Math.round(forecastDay.temp.min)}°</span
        >
      </div>
    </div>`;
    }
  });

  forecast += `</div>`;
  document.querySelector("#forecast").innerHTML = forecast;
}

function searchLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiURL).then(getCityData);
}

function changeUnitToC(event) {
  event.preventDefault();

  document.querySelector("#temperature").innerHTML = tempCelsius;
  for (let i = 0; i < 6; i++) {
    document.querySelector(`#temperature-forecast-max${i}`).innerHTML =
      tempCelsiusFCmax[i] + "°";
    document.querySelector(`#temperature-forecast-min${i}`).innerHTML =
      tempCelsiusFCmin[i] + "°";
  }
}

function changeUnitToF(event) {
  event.preventDefault();

  document.querySelector("#temperature").innerHTML = tempFahrenheit;
  for (let i = 0; i < 6; i++) {
    document.querySelector(`#temperature-forecast-max${i}`).innerHTML =
      tempFahrenheitFCmax[i] + "°";
    document.querySelector(`#temperature-forecast-min${i}`).innerHTML =
      tempFahrenheitFCmin[i] + "°";
  }
}

document.querySelector("#search").addEventListener("submit", searchCity);

document
  .querySelector("#get-location")
  .addEventListener("click", searchLocation);

document
  .querySelector("#unit-celsius")
  .addEventListener("click", changeUnitToC);
document
  .querySelector("#unit-fahrenheit")
  .addEventListener("click", changeUnitToF);

navigator.geolocation.getCurrentPosition(getPosition);
