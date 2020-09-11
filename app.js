window.onload = () => {
  "use strict";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("ServiceWorker.js")
      .then((registration) => {
        console.log(registration, "Service worker is registrated");
      })
      .catch((err) => console.log("Service Worker is not registrated"));
  }
};
const locationelement = document.getElementsByClassName("location")[0];
const dayDisplay = document.getElementsByClassName("dayDisplay")[0];
const form = document.getElementsByClassName("form")[0];
const button = document.getElementsByClassName("button")[0];
const input = document.getElementsByClassName("input-city")[0];
const key = "7adac72d1e036dde5d47ec74832cdfe8";
const Kelvin = 273;
const weather = {};
const week = [];
const myStorage = window.localStorage;
weather.temperature = {
  unit: "celsius",
};

button.addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementsByClassName("input-city")[0];
  const inputValue = input.value;

  let api = `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&appid=${key}`;
  fetchAPI(api);
});
window.onbeforeunload = function () {
  myStorage.setItem("searchitem", inputValue);
};

function fetchAPI(api) {
  fetch(api)
    .then((response) => {
      const data = response.json();
      return data;
    })
    .then(function (data) {
      myStorage.setItem("data", JSON.stringify(data));
      week.length = 0;
      weather.city = data.timezone;
      locationelement.innerHTML = `${data.city.name},${data.city.country}`;
      data.list.forEach((day, index) => {
        const obj = Object.create(weather);
        if (index % 8 === 0) {
          obj.date = new Date(day.dt * 1000);
          obj.day = obj.date.toDateString().slice(0, 10);
          obj.temperature.tempHigh = Math.floor(day.main.temp_max - Kelvin);
          obj.temperature.tempLow = Math.floor(day.main.temp_min - Kelvin);
          obj.description = day.weather[0].description;
          obj.iconId = day.weather[0].icon;
          week.push(obj);
        }
      });

      displayForecast(week);
    });
}

function displayForecast() {
  let list = ``;
  const offlineData = JSON.parse(myStorage.getItem("week"));

  week.forEach((day) => {
    list += `
        <div class="day">
         <h3>${day.day}</h3>
         <img alt="weather-icon"src="icons/${day.iconId}.png"/>
         <p>${day.description}</p>
         <p> Max :${day.temperature.tempHigh} Min :${day.temperature.tempLow} </p>
         </div>

        `;
  });
  dayDisplay.innerHTML = list;
  dayDisplay.style.display = "flex";
  dayDisplay.style.flexWrap = "wrap";
}
