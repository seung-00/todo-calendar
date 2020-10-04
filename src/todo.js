const TDForm = document.querySelector('.add-task')
    , TDInput = TDForm.querySelector('input')
    , delayedTDList = document.querySelector('.delayed-todo')
    , dailyContainer = document.querySelector('.daily')
    , dailyTDList = dailyContainer.querySelector('.daily-todo');

const DAILYTD_LS = 'dailyTD'
    , DELAYEDTD_LS = 'delayedTD';

let dailyTDMaps = new Map(),
    delayedTDMap = new Map();

/**
 * Renders a current date on the daily ToDo Container
 */
const updateDailyTD  = () => {   
    let span = dailyContainer.querySelector('span');
    span.innerText = `${curDate.getMonth()+1}/${curDate.getDate()}`;
}

/**
 * Parses daily ToDo to the DOM
 */
const parseDailyTD = () => {
    let todayTDs = dailyTDMaps.get(convertDateToKey(curDate));
    if (todayTDs) {
        todayTDs.forEach((value, key) => {
            addTDToDOM(key, value, 'daily');
        });
    }
}

/** 
 * Run set of tasks for synchronizing to-do when the date changes.
 */
const syncTDToDate = () => {
    updateDailyTD();
    parseDailyTD();
    selectCalByDate();
}

/**
 * Parses delayed ToDo to the DOM
 */
const parseDelayedTD = () => {
    if (delayedTDMap.size) {
        delayedTDMap.forEach((value, key) => {
            addTDToDOM(key, value, 'delayed');
        });
    }
}

/**
 * Removes all ToDo elements from DOM
 * @param {Document} ToDoList 
 */
const clearTDDom = (ToDoList) => {
    while (ToDoList.hasChildNodes()) {
        ToDoList.removeChild(ToDoList.firstChild);
    }
}

/**
 * Handles click event of calBody elements (date)
 * @param {Event} e
 */
const handleClickDate = (e) => {

    // excepts blank space
    if (!e.target.className) {
        return;
    }
    
    unselectDay();
    clearTDDom(dailyTDList);
    curDate = convertKeyToDate(e.target.classList[0]); // updates curDate
    syncTDToDate();
}

const clickDate = () => {
    calBody.addEventListener('click', handleClickDate);
}

/**
 * Handles click event of DOM
 * Removes the clicked element on the DOM
 * Saves change in a localstorage
 * @param {Event} e 
 */
const handleDeleteTD = (e) => {
    const btn = e.target
        , li = btn.parentNode
        , key = li.id;
    if (li.parentNode.classList.contains('daily-todo')) {
        removeTDMapItem(key, 'daily');
        dailyTDList.removeChild(li);
    } else if (li.parentNode.classList.contains('delayed-todo')) {
        removeTDMapItem(key, 'delayed');
        delayedTDList.removeChild(li);
    }

    saveMapToLS();
}

/**
 * Handles click event of DOM
 * Switch positions between daily-todo and delayed-todo(DOM)
 * Saves change in a localstorage
 * @param {Event} e 
 */
const handleMoveTD = (e) => {
    const btn = e.target
        , li = btn.parentNode
        , key = li.id;

    if (li.parentNode.classList.contains('daily-todo')){
        let content = dailyTDMaps.get(convertDateToKey(curDate)).get(key);
        removeTDMapItem(key, 'daily');
        dailyTDList.removeChild(li);
        addTDToMap(key, content, 'delayed');
        delayedTDList.appendChild(li);
    } else if (li.parentNode.classList.contains('delayed-todo')) {
        let content = delayedTDMap.get(key);
        removeTDMapItem(key, 'delayed');
        delayedTDList.removeChild(li);
        addTDToMap(key, content, 'daily');
        dailyTDList.appendChild(li);
    }

    saveMapToLS();
}


/**
 * Convert nested Object from nested Map
 * @param {Object} TDObjs
 */
const convertMapFromObj = (TDObjs) => {
    let TDMaps = new Map();
    for (const key in TDObjs) {
        TDMaps.set(key, new Map(Object.entries(TDObjs[key])));
    }

    return TDMaps;
}

/**
 * Convert nested Map into nested Object
 */
const convertObjFromMaps = (TDMaps) => {
    let TDObjs = {};
    TDMaps.forEach((map, key) => {
        TDObjs[key] = Object.fromEntries(map)
    });

    return TDObjs;
}

/**
 * Saves daily, delayed ToDos in a localstorage
 */
const saveMapToLS = () => {
    saveDailyMapsToLS();
    saveDelyaedTDToLS();
}

const saveDailyMapsToLS = () => {
    let TDObjs = convertObjFromMaps(dailyTDMaps);
    localStorage.setItem(DAILYTD_LS, JSON.stringify(TDObjs));
}

const saveDelyaedTDToLS = () => {
    let TDObj = Object.fromEntries(delayedTDMap);
    localStorage.setItem(DELAYEDTD_LS, JSON.stringify(TDObj));
}

/**
 * Load delayed ToDos and daily ToDos from localstorage
 */
const loadTDFromLS = () => {
    const loadedDailyTD = localStorage.getItem(DAILYTD_LS)
        , loadedDelayedTD = localStorage.getItem(DELAYEDTD_LS);
    if (loadedDailyTD) {
        const TDObjs = JSON.parse(loadedDailyTD);
        dailyTDMaps = convertMapFromObj(TDObjs);
    }

    if (loadedDelayedTD) {
        const TDObj = JSON.parse(loadedDelayedTD);
        delayedTDMap = new Map(Object.entries(TDObj));
    }
}

/**
 * Create li element (ToDo) with key and value
 * Returns li element whose id is object's key (expected to the date type)
 * @param {Object} TDObj 
 */
const createToDo = (key, value) => {
    const li = document.createElement('li')    // new task
        , spanValue = document.createElement('div')
        , spanDate = document.createElement('div')
        , delBtn = document.createElement('button')
        , moveBtn = document.createElement('button');

    let yearDigits = String(curDate.getFullYear()).substring(2,4);

    li.id = key;

    spanValue.innerText = value;
    spanValue.className = 'value';
    spanDate.innerText = `${ curDate.getMonth() +1 }.${ curDate.getDate() }.${ yearDigits }`;
    spanDate.className = 'time';

    delBtn.className = 'del-btn';
    delBtn.addEventListener('click', handleDeleteTD);

    moveBtn.className = 'move-btn';
    moveBtn.addEventListener('click', handleMoveTD);

    li.appendChild(spanValue);
    li.appendChild(spanDate);
    li.appendChild(delBtn);
    li.appendChild(moveBtn);
    return li;
}

/**
 * Creates a li element with the TDObj
 * Add the created li to the DOM (.daily)
 * @param {Object} TDObj
 */
const addTDToDOM = (key, value, determinant) => {
    const li = createToDo(key, value);    // task element
    switch (determinant) {
        case 'daily':
            dailyTDList.appendChild(li);
            break;

        case 'delayed':
            delayedTDList.appendChild(li);
    }
}

/**
 * Puts the key and value(ToDo) to the appropriate hash map (daily or delayed)
 * Decides which hash map to put in based on determinant
 * @param {String} key
 * @param {String} value
 * @param {Boolean} determinant
 */
const addTDToMap = (key, value, determinant) => {
    switch (determinant) {
        case 'daily':
            if (dailyTDMaps.has(convertDateToKey(curDate))) {
                dailyTDMaps.get(convertDateToKey(curDate)).set(key, value);
            } else {

                // create new hash map in nested hash map
                dailyTDMaps.set(convertDateToKey(curDate), new Map());
                dailyTDMaps.get(convertDateToKey(curDate)).set(key, value);
            }
            break;

        case 'delayed':
            delayedTDMap.set(key, value);
    }
}

/**
 * Removes ToDo from TDMap with key and determinant
 * Decides which hash map to put in based on determinant
 * Saves change in a localstorage
 * @param {*} key 
 * @param {*} determinant 
 */
const removeTDMapItem = (key, determinant) => {
    switch (determinant) {
        case 'daily':
            dailyTDMap = dailyTDMaps.get(convertDateToKey(curDate));
            if (dailyTDMap.size <= 1) { // remove hash map in nested hash map
                dailyTDMaps.delete(convertDateToKey(curDate));
            } else {
                dailyTDMaps.get(convertDateToKey(curDate)).delete(key);
            }
            break;

        case 'delayed':
            delayedTDMap.delete(key);
    }
}

/** 
 * Handles submit event of DOM
 * Creates a ToDo object with submitted content
 * Adds the ToDo object to the hash map
 * Renders ToDo elements
 * Saves change in a localstorage
 * @param {Event} e
*/
const handleSubmitTD = (e) => {
    e.preventDefault();
    const dateNow = String(Date.now());
    addTDToMap(dateNow, TDInput.value, 'daily');
    saveMapToLS();
    addTDToDOM(dateNow, TDInput.value, 'daily');
    TDInput.value = '';
}

const submitTD = () => {
    TDForm.addEventListener('submit', handleSubmitTD);
}

const TDInit = () => {
    loadTDFromLS();
    syncTDToDate();
    parseDelayedTD();
    clickDate();
    submitTD();
}

TDInit();