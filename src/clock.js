const clockItem = document.querySelector('.clock-item');

const getTime = () =>{
    const date = new Date()
        , minutes = date.getMinutes()
        , hours = date.getHours()
        , seconds = date.getSeconds();
        
    clockItem.innerHTML = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const initClock = () => {
    getTime();
    setInterval(getTime, 1000);
};

initClock();