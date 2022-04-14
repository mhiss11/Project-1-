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



setCurrentDayAndTime();
TimeBlocks();
getTimeEntry();



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

        var newHtml = '<div class="row time-block"> ' +
            '<div class="col-md-1 hour">' + hourMap[hourBlock] + '</div> ';


        if (hourBlock < currentTime) {
            newHtml = newHtml + '<textarea class="col-md-10 description past" id="text' +
                hourMap[hourBlock] + '"></textarea> ';
        }
        else if (hourBlock === currentTime) {
            newHtml = newHtml + '<textarea class="col-md-10 description present" id="text' +
                hourMap[hourBlock] + '"></textarea> ';
        }
        else {
            newHtml = newHtml + '<textarea class="col-md-10 description future" id="text' +
                hourMap[hourBlock] + '"></textarea> ';
        };


        newHtml = newHtml + '<button class="btn saveBtn col-md-1" value="' + hourMap[hourBlock] + '">' +
            '<i class="fas fa-save"></i></button> ' +
            '</div>';


        containerDiv.append(newHtml);
    }
}

//localStorage.setItem(timeEntryName, JSON.stringify(timeEntry));

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



//localStorage.clear();

function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=bea9e28f4f996779db9819daf0338f11";
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#city-name")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";

                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);

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

function getCurrentWeather(data) {
    $(".results-panel").addClass("visible");

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

    // getFutureWeather(data);
}

// function getFutureWeather(data) {
//     for (var i = 0; i < 5; i++) {
//         var futureWeather = {
//             date: convertUnixTime(data, i),
//             icon: "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + "@2x.png",
//             temp: data.daily[i + 1].temp.day.toFixed(1),
//             humidity: data.daily[i + 1].humidity
//         }

//         var currentSelector = "#day-" + i;
//         $(currentSelector)[0].textContent = futureWeather.date;
//         currentSelector = "#img-" + i;
//         $(currentSelector)[0].src = futureWeather.icon;
//         currentSelector = "#temp-" + i;
//         $(currentSelector)[0].textContent = "Temp: " + futureWeather.temp + " \u2109";
//         currentSelector = "#hum-" + i;
//         $(currentSelector)[0].textContent = "Humidity: " + futureWeather.humidity + "%";
//         currentSelector = "#wind-speed-" + i;
//         $(currentSelector)[0].textContent = "Wind Speed: " + futureWeather.wind_speed + " mph";
//     }
// }

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

$("#search-button").on("click", function (e) {
    e.preventDefault();

    findCity();

    $("form")[0].reset();
})

$(".city-list-box").on("click", ".city-name", function () {

    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#city-name")[0].textContent = $(this)[0].textContent + " (" + moment().format('M/D/YYYY') + ")";

    getListCity(coordinates);
})

