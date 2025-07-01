let dataList;
let searchBtn = document.getElementById("searchBtn");
let searchInp = document.getElementById("searchInp");
let search = searchInp.addEventListener("input", function () {
  displayData(searchInp.value);
});
searchBtn.addEventListener("click", function () {
  displayData(searchInp.value);
});

navigator.geolocation.getCurrentPosition(
  async function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=21c29368f0c94213aca203645252706&q=${lat},${lon}&days=3`
    );

    if (response.ok) {
      let data = await response.json();
      let city = data.location.name;
      displayData(city);
    }
  },
  function (error) {
    displayData("Cairo");
  }
);

//todo =========Main Function
async function displayData(cityName) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=21c29368f0c94213aca203645252706&q=${cityName}&days=3`
    );
    if (response.ok) {
      let dataList = await response.json();

      console.log(dataList);

      data(cityName);

      // todo=====For Current Location Data

      document.getElementById("mainDeg").innerHTML = dataList.current.temp_c + "°C";

      // document.getElementById("mainDay").innerHTML=(dataList.current.last_updated)
      let date = new Date(dataList.current.last_updated);
      let dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(date); // "Monday"
      document.getElementById("mainDay").innerHTML = dayName;
      document.getElementById("mainCon").innerHTML =
        dataList.current.condition.text;

      let iconURL = "https:" + dataList.current.condition.icon;
      document.getElementById("mainIcon").setAttribute("src", iconURL);

      document.getElementById("mainCity").innerHTML = dataList.location.name;

      document.getElementById("currentDate").innerHTML =
        new Date(dataList.current.last_updated)
          .toDateString()
          .split(" ")
          .slice(2, 3)
          .join("") +
        new Date(dataList.current.last_updated)
          .toDateString()
          .split(" ")
          .slice(1, 2)
          .join("");
      let feelLike = dataList.current.feelslike_c;
      document.getElementById("FeelLike").innerHTML = feelLike + "°C";
      //todo EXTRA for DiractionMap
      let windDir = dataList.current.wind_dir;

      let directionsMap = {
        N: "North",
        S: "South",
        E: "East",
        W: "West",
        NE: "Northeast",
        NW: "Northwest",
        SE: "Southeast",
        SW: "Southwest",
        NNW: "North-Northwest",
        NNE: "North-Northeast",
        SSW: "South-Southwest",
        SSE: "South-Southeast",
        ENE: "East-Northeast",
        ESE: "East-Southeast",
        WSW: "West-Southwest",
        WNW: "West-Northwest",
      };

      let fullDirection = directionsMap[windDir] || windDir;

      document.getElementById("windDir").innerHTML = fullDirection;

      let kph = dataList.current.wind_kph;

      document.getElementById("windKph").innerHTML = kph + " Km/H ";

      let humidity  = dataList.current.humidity;
      document.getElementById("humidity").innerHTML=  humidity +"%"
    }
  } catch (error) {
    alert("please Reload Page");
    console.log(error);
  }
}

// Todo for the Next 2 Days Data
async function data(cityName) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=21c29368f0c94213aca203645252706&q=${cityName}&days=3`
    );
    let dataList = await response.json();

    // todo ===== deleted the currentDay
    let forecastObj = dataList.forecast.forecastday.slice(1);

    let days = document.querySelectorAll(".days");
    let icons = document.querySelectorAll(".icon");
    let text = document.querySelectorAll(".condition");
    let maxTemp = document.querySelectorAll(".maxtemp");
    let minTemp = document.querySelectorAll(".mintemp");

    for (let i = 0; i < forecastObj.length; i++) {
      let date = new Date(forecastObj[i].date);
      let dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(date);
      days[i].innerHTML = dayName;

      // days[i].innerHTML = new Date(forecastObj[i].date).toDateString().split(" ", 1).join(" ");

      let iconURL = "https:" + forecastObj[i].day.condition.icon;
      icons[i].setAttribute("src", iconURL);

      text[i].innerHTML = forecastObj[i].day.condition.text;
      maxTemp[i].innerHTML = forecastObj[i].day.maxtemp_c + "°C";
      minTemp[i].innerHTML = forecastObj[i].day.mintemp_c + "°C";
    }
  } catch (error) {
    console.log("error");
  }
}
