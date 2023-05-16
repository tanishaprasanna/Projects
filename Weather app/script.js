const userTab=document.querySelector("[user-weather]");
const searchTab=document.querySelector("[search-weather]");
const userContainer=document.querySelector(".weather-container");

const grantLocationContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[search-form]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//initial variables 
let oldTab = userTab;
const API_KEY =  "d1845658f92b31c64bd94f06f7188c9c"  //"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";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab; 
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantLocationContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

// Event listeners for tab switching
userTab.addEventListener("click",() => {
    switchTab(userTab);
});

searchTab.addEventListener("click",() => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coodinates");
    if(!localCoordinates){
        grantLocationContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantLocationContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // calling API
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
        alert('Something went wrong');
    }
}

function renderWeatherInfo(weatherInfo){
    
    //fetching elements
    const cityName = document.querySelector("[city-name]");
    const countryIcon = document.querySelector("[country-icon]");
    const desc = document.querySelector("[weather-desc]");
    const weatherIcon = document.querySelector("[weather-icon]");
    const temp = document.querySelector("[temperature]");
    const windspeed = document.querySelector("[windspeed]");
    const humidity = document.querySelector("[humidity]");
    const cloudiness = document.querySelector("[cloudiness]");

    //fetching values and putting in UI
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C `;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

const grantAccessButton=document.querySelector("[grant-access]");
grantAccessButton.addEventListener("click",getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('GeoLocation Support Unavailable!');
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}



const searchInput = document.querySelector("[search-input]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") 
        return;
    else  fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantLocationContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data =await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        alert("error");
    }
}