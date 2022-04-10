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
const firstHour = 8;
const lastHour = 17;
const hourMap = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM",
    "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];



setCurrentDayAndTime();
TimeBlocks();



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

localStorage.setItem(timeEntryName, JSON.stringify(timeEntry));

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

    if (!entryFound) {
        timeEntry.splice(newEntryIndex, 0, newEntry);
    }


    localStorage.setItem(timeEntryName, JSON.stringify(timeEntry));
}
