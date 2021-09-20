const apiKey = "ff5efd6ccb32c688cc5cf4db3f84e813";
const unit = "metric";

let tempCelsius = null;
let tempFahrenheit = null;

function displayTime() {
  let date = new Date();
  let options = {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  document.querySelector("#current-time").innerHTML = new Intl.DateTimeFormat(
    "de-DE",
    options
  ).format(date);
}

function searchCity(event) {
  event.preventDefault();

  let cityName = event.target[0].value;
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

  axios.get(apiURL).then(getCityData);
}

function getCityData(response) {
  console.log(response);
  let cityName = response.data.name;
  let currentTemp = Math.round(response.data.main.temp);
  let currentHum = Math.round(response.data.main.humidity);
  let currentWind = Math.round(response.data.wind.speed);
  let weatherDesc = response.data.weather[0].description;
  let weatherIcon = response.data.weather[0].id;

  tempCelsius = currentTemp;
  tempFahrenheit = Math.round((tempCelsius * 9) / 5 + 32);

  changePage(
    currentTemp,
    currentHum,
    currentWind,
    weatherDesc,
    weatherIcon,
    cityName
  );
}

function changePage(temp, humidity, wind, desc, icon, cityName) {
  document.querySelector("#city-name").innerHTML = cityName;
  document.querySelector("#weather-description").innerHTML = `(${desc})`;
  document.querySelector("#temperature").innerHTML = temp;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = wind;

  let newIcon = "";

  if (icon <= 232) {
    newIcon = "11d";
  } else if (icon <= 321) {
    newIcon = "09d";
  } else if (icon <= 504) {
    newIcon = "10d";
  } else if (icon == 511) {
    newIcon = "13d";
  } else if (icon <= 531) {
    newIcon = "09d";
  } else if (icon <= 622) {
    newIcon = "13d";
  } else if (icon <= 781) {
    newIcon = "50d";
  } else if (icon == 800) {
    newIcon = "01d";
  } else if (icon == 801) {
    newIcon = "02d";
  } else if (icon == 802) {
    newIcon = "03d";
  } else if (icon <= 804) {
    newIcon = "04d";
  }

  document.querySelector(
    "#weather-icon"
  ).innerHTML = `<img src='http://openweathermap.org/img/wn/${newIcon}@2x.png' />`;

  displayTime();
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
}

function changeUnitToF(event) {
  event.preventDefault();

  document.querySelector("#temperature").innerHTML = tempFahrenheit;
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
