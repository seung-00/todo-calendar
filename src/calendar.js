const mainTab = document.querySelector('.main')
    , calBody = document.querySelector('.cal-body')
    , nextBtn = document.querySelector('.next-btn')
    , previousBtn = document.querySelector('.previous-btn');

// Each click updates a curDate. This makes date a key value when adding todo.
let curDate = new Date(); 

const convertKeyToDate = (key) => {

    // value decreases by 1 converting from a string to a date
    let dateString = `${key.substring(0, 3)} ${key.substring(3, 6)} ${key.substring(6, 8)} ${key.substring(8,12)}`;
    let date = new Date(dateString);
    return date;
}

const convertDateToKey = (date) => {
    let re = / /g,
        key = date.toDateString().replace(re, '');
    return key;
}

/**
 * brief: Creates and renders a calendar based on the current date.
 * This function uses curDate variable to check current date.
 */
const buildCalendar = () => {

    // first and last days of the month
    let firstDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1),
        lastDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0);
    let firstDay = firstDate.getDay(),
        lastDay = lastDate.getDay(),
        leftDays = 7;
    let weeks,
        days;

    if (firstDay > 4 && firstDay-lastDay > 4) {
        weeks = 6;
    } else {
        weeks = 5;
    }

    mainTab.innerHTML = `${curDate.getFullYear()} - ${curDate.getMonth() + 1}`;
    for (let i = 0; i < weeks; i++) {
        let row = calBody.insertRow();
        while (firstDay != 0) {
            
            // insert '' before the first day
            row.insertCell().innerHTML = '';
            firstDay -= 1;
            leftDays -= 1;
        }

        while (leftDays != 0) {
            let temp = firstDate;
            if (temp <= lastDate) {
                days = row.insertCell();
                days.className = `${convertDateToKey(temp)}`;
                days.innerHTML = `${temp.getDate()}`;
                temp.setDate(temp.getDate() + 1);
                leftDays -= 1;
            } else {
                row.insertCell().innerHTML = ''; // insert '' after the last days
                leftDays -= 1;
            }
        }

        leftDays = 7;
    }
};

const deleteCalendar = () => {
    while (calBody.rows.length) {
        calBody.deleteRow(0);
    }
}

/**
 * Remove classname for css markup on curDate DOM
 */
const unselectDay = () => {
    let td = document.querySelector(`.${convertDateToKey(curDate)}`);
    td.classList.remove('selected-day');
}

/** 
 * Add classname for css markup on curDate DOM
 */
const selectCalByDate = () => {
    let td = document.querySelector(`.${convertDateToKey(curDate)}`);
    td.classList.add('selected-day');
}

const moveMonth = () => {
    nextBtn.addEventListener('click', handleMoveMonth);
    previousBtn.addEventListener('click', handleMoveMonth);
}

/**
 * Handles click event of DOM(nextBtn, previousBtn)
 * Initialize the curDate to the first day of a new month.
 * Remove all elements related to the previous month.
 * Rerendering calendar based on the new month (culDate variable).
 * @param {Event} e
 */
const handleMoveMonth = (e) => {
    unselectDay();
    deleteCalendar();
    clearTDDom(dailyTDList);
    if (e.target.className == 'next-btn') {
        curDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 1);
    } else {
        curDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, 1);
    }

    buildCalendar();
    syncTDToDate();
}

const calendarInit = () => {
    buildCalendar();
    moveMonth();
}

calendarInit();