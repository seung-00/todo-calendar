const placeDOM = document.querySelector('.location')
    , temperatureDOM = document.querySelector('.temperature');

const API_KEY = 'a29cb33b78a528c567aca30580f59c45'
    , COORDS = 'coords';

const getWeather1 = (lat, lng) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json)
        const temperature = json.main.temp
            , place = json.name;

        loc.innerHTML = `${place}`;
        temp.innerHTML = `${temperature}°C`
    });
}
    
const getWeather = async (lat, lng) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
            const weatherRes = await fetch(url);
            const weatherInfo = await weatherRes.json()
            const temperature = weatherInfo.main.temp;
            const place = weatherInfo.name;

            placeDOM.innerHTML = `${place}`;
            temperatureDOM.innerHTML = `${temperature}°C`;
        } catch (e) {
            alert(e);
        }
}

const saveCoords = (coordsObj) => {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

const handleGeoSuccess = (position) => {
    const latitude = position.coords.latitude
        , longitude = position.coords.longitude;

    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

const handleGeoError = () => {
    console.log("Can't access geo location");
}

const askForCoords = () => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

const loadCoords = () => {
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null) {
        askForCoords();
    } else {
        const parseCoords = JSON.parse(loadedCoords);
        getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}

const weatherInit = () => {
    loadCoords();
};

weatherInit();