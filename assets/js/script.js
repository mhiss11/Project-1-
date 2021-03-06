// this is for holding the day
var currentDay = "";

// this is for holding the date 
var currentDayString = "";

// this is for the  hour 
var currentTime = 8;

// list of logs
var timeEntry = [];



const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];


const timeEntryName = "WorkDaySchedule";
const firstHour = 10;
const lastHour = 23;
const hourMap = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM",
    "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];

var eventResultsEl = document.getElementById("event-result")

setCurrentDayAndTime();
TimeBlocks();
getTimeEntry();

var eventNameEl = document.getElementById("event-name")
var weatherApiKey = '99072ede3746b0b3efde9c724195f6dd';

$(".saveBtn").click(saveClick);



// sets day on top and shows current time
function setCurrentDayAndTime() {
    var today = new Date();
    var day = today.getDate();
    var dayEnd = "th";



    currentTime = today.getHours();

    switch (currentTime) {
        case 1:
        case 21:
        case 31: dayEnd = "st"; break;
        case 2:
        case 22: dayEnd = "nd"; break;
        case 3:
        case 23: dayEnd = "rd"; break;
        default: break;

    }

    currentDayString = days[today.getDay()] + ", " + months[today.getMonth()] + " " +
        day + dayEnd + ", " + today.getFullYear();
    $("#currentDay").text(currentDayString);
}


// Shows the time areas
function TimeBlocks() {
    var containerDiv = $(".container");




    for (let hourBlock = firstHour; hourBlock <= lastHour; hourBlock++) {

        var newHtml = '<div class="container columns time-block"> ' +
            '<div class="column is-one-fifth hour">' + hourMap[hourBlock] + '</div> ';


        if (hourBlock < currentTime) {
            newHtml = newHtml + '<textarea class="column is-half description past" id="text' +
                hourMap[hourBlock] + '"></textarea> ';
        }
        else if (hourBlock === currentTime) {
            newHtml = newHtml + '<textarea class="column is-half description present" id="text' +
                hourMap[hourBlock] + '"></textarea> ';
        }
        else {
            newHtml = newHtml + '<textarea class="column is-half description future" id="text' +
                hourMap[hourBlock] + '"></textarea> ';
        };


        newHtml = newHtml + '<button class="button saveBtn column is-1" value="' + hourMap[hourBlock] + '">' +
            '<i class="fas fa-save"></i></button> ' +
            '</div>';


        containerDiv.append(newHtml);
    }
}

//Function to save the text in the planner areas
function saveClick() {
    var hourBlock = $(this).val();
    var entryFound = false;
    var newEntryIndex = timeEntry.length;

    var newEntry = { day: currentDay, time: hourBlock, text: $("#text" + hourBlock).val() };


    function timeGreater(time1, time2) {
        var num1 = parseInt(time1.substring(0, time1.length - 2));
        var num2 = parseInt(time2.substring(0, time2.length - 2));
        var per1 = time1.substr(-2, 2);
        var per2 = time2.substr(-2, 2);


        if (num1 === 12) {
            num1 = 0;
        }

        if (num2 === 12) {
            num2 = 0;
        }


        if (per1 < per2) {
            return false;
        }
        else if (per1 > per2) {
            return true;
        }
        else {
            return (num1 > num2);
        }
    }


    for (let i = 0; i < timeEntry.length; i++) {
        if (timeEntry[i].day == currentDay) {
            if (timeEntry[i].time == hourBlock) {
                timeEntry[i].text = newEntry.text;
                entryFound = true;
                break;
            }

            else if (timeGreater(timeEntry[i].time, hourBlock)) {
                newEntryIndex = i;
                break;
            }
        }

        else if (timeEntry[i].day > currentDay) {
            newEntryIndex = i;
            break;
        }
    }



    if (!entryFound) {
        timeEntry.splice(newEntryIndex, 0, newEntry);
    }


    localStorage.setItem(timeEntryName, JSON.stringify(timeEntry));
}

//Displays timeblocks
function getTimeEntry() {
    var teList = JSON.parse(localStorage.getItem(timeEntryName));

    if (teList) {
        timeEntry = teList;
    }

    for (let i = 0; i < timeEntry.length; i++) {

        if (timeEntry[i].day == currentDay) {
            $("#text" + timeEntry[i].time).val(timeEntry[i].text);
        }
    }
}

// WEATHER JS   //
//Finds the coordinates of the searched city
function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=bea9e28f4f996779db9819daf0338f11";
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#city-name")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";

                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name button columns">' + cityName);

                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLonPair = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLonPair);

                apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

                fetch(apiURL).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert("Cannot find city!");
        }
    })
}

//Fetches weather data from searched city
function getListCity(coordinates) {
    apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getCurrentWeather(data);
            })
        }
    })
}

//Displays the current weather in the results panel
function getCurrentWeather(data) {
    $(".results-panel").removeClass("is-hidden");

    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    $("#temperature")[0].textContent = "Temperature: " + data.current.temp.toFixed(1) + " \u2109";
    $("#humidity")[0].textContent = "Humidity: " + data.current.humidity + "% ";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";
    $("#uv-index")[0].textContent = "  " + data.current.uvi;

    if (data.current.uvi < 3) {
        $("#uv-index").removeClass("moderate severe");
        $("#uv-index").addClass("favorable");
    } else if (data.current.uvi < 6) {
        $("#uv-index").removeClass("favorable severe");
        $("#uv-index").addClass("moderate");
    } else {
        $("#uv-index").removeClass("favorable moderate");
        $("#uv-index").addClass("severe");
    }


}



// This function applies title case to a city name if there is more than one word.
function titleCase(city) {
    var updatedCity = city.toLowerCase().split(" ");
    var returnedCity = "";
    for (var i = 0; i < updatedCity.length; i++) {
        updatedCity[i] = updatedCity[i][0].toUpperCase() + updatedCity[i].slice(1);
        returnedCity += " " + updatedCity[i];
    }
    return returnedCity;
}

// This converts the UNIX time that is received from the server.
function convertUnixTime(data, index) {
    const dateObject = new Date(data.daily[index + 1].dt * 1000);

    return (dateObject.toLocaleDateString());
}

//Event listener for click of weather search button
$("#search-button").on("click", function (e) {
    e.preventDefault();

    findCity();

    $("form")[0].reset();



})

//Event listener for clicking of previously searched city
$(".city-list-box").on("click", ".city-name", function () {

    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#city-name")[0].textContent = $(this)[0].textContent + " (" + moment().format('M/D/YYYY') + ")";

    getListCity(coordinates);
})

//Event js
class EventBrite {
    constructor() {
        this.auth_token = 'WKLASWB55JIUWOVX6EZU';
        this.orderby = "date";
    }

    async queryAPI(eventName, category) {
        const eventsResponse = await fetch('https://www.eventbriteapi.com/v3/events/search/?q=${eventName}&sort_by$={this.orderby}&categories=${category}&token=WKLASWB55JIUWOVX6EZU');
    }

    async getCategoriesAPI() {
        const categoriesResponse = await fetch('https://www.eventbriteapi.com/v3/categories/?token=WKLASWB55JIUWOVX6EZU')


        const categories = await categoriesResponse.json();

        return {
            categories
        }


    }





}
//Constructs list of categories for events
class UI {
    constructor() {
        this.init();
    }
    init() {
        this.printCategories();
    }
    printCategories() {
        const categoriesList = eventbrite.getCategoriesAPI()
            .then(categories => {
                const categoriesList = categories.categories.categories;
                const categoriesSelect = document.querySelector('select#category');

                //inserts catergories

                categoriesList.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.classList = ("select")
                    option.appendChild(document.createTextNode(category.name));
                    categoriesSelect.appendChild(option);
                })


            })
            .catch(error => console.log(error));
    }


}

const eventbrite = new EventBrite();
const ui = new UI();

//Event listener for event search button
document.getElementById('submitBtn').addEventListener('click', (e) => {
    e.preventDefault();


    getEvents(page);



})

//Ticketmaster js 
var page = 0;

//Fetches events from ticketmaster API
function getEvents(page) {
    $("#events-panel").show();
    $("#attraction-panel").hide();

    if (page < 0) {
        page = 0;
        return;
    }
    if (page > 0) {
        if (page > getEvents.json.page.totalPages - 1) {
            page = 0;
        }
    }

    var cityName = eventNameEl.value.trim();
    console.log(cityName);

    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&size=4&page=" + page + "&city=" + cityName,
        async: true,
        dataType: "json",
        success: function (json) {
            getEvents.json = json;
            showEvents(json);
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

//Displays events in the events panel
function showEvents(json) {
    var items = $("#events .list-group-item");
    items.hide();
    var events = json._embedded.events;
    var item = items.first();
    for (var i = 0; i < events.length; i++) {
        item.children('.list-group-item-heading').text(events[i].name);
        item.children('.list-group-item-text').text(events[i].dates.start.localDate);

        try {
            item.children(".venue").text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
        } catch (err) {
            console.log(err);
        }
        item.show();
        item.off("click");
        item.click(events[i], function (eventObject) {
            console.log(eventObject.data);
            try {
                getAttraction(eventObject.data._embedded.attractions[0].id);
            } catch (err) {
                console.log(err);
            }
        });
        item = item.next();
    }
}

//Previous and next events buttons
$("#prev").click(function () {
    getEvents(--page);
});

$("#next").click(function () {
    getEvents(++page);
});

//Gets attractions from ticketmaster
function getAttraction(id) {
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/attractions/" + id + ".json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz",
        async: true,
        dataType: "json",
        success: function (json) {
            showAttraction(json);
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}


