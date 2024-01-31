import { get12HourTimeStringFromString } from "./timeFormatter";

//Create time slots for users to select from
export function generateTimeSlots(startTime, endTime, minLength) {
  let timeInterval = minLength;
  // get the total minutes between the start and end times.
  var totalMins = subtractTimes(startTime, endTime);

  // set the initial timeSlots array to just the start time
  var timeSlots = [startTime];

  // get the rest of the time slots.
  let generatedTimes = getTimeSlots(timeInterval, totalMins, timeSlots);

  let newTimeText = "";

  let times = [];
  for (let i = 0; i < generatedTimes.length; i++) {
    if (generatedTimes[i].length < 8)
      generatedTimes[i] = generatedTimes[i] + ":00";
    newTimeText = get12HourTimeStringFromString(generatedTimes[i]);
    times.push({
      time: generatedTimes[i],
      timeText: newTimeText,
    });
  }
  return times;
}

export function getTimeSlots(timeInterval, totalMins, timeSlots) {
  // base case - there are still more minutes
 
  if (totalMins - timeInterval > 0) {
    // get the previous time slot to add interval to
    var prevTimeSlot = timeSlots[timeSlots.length - 1];
    // add timeInterval to previousTimeSlot to get nextTimeSlot
    var nextTimeSlot = addMinsToTime(timeInterval, prevTimeSlot);
    console.log(nextTimeSlot);
    timeSlots.push(nextTimeSlot);

    // update totalMins
    totalMins -= timeInterval;
    // get next time slot
    return getTimeSlots(timeInterval, totalMins, timeSlots);
  } else {
    // all done!
    return timeSlots;
  }
}

export function subtractTimes(t2, t1) {
  // get each time's hour and min values
  var [t1Hrs, t1Mins] = getHoursAndMinsFromTime(t1);
  var [t2Hrs, t2Mins] = getHoursAndMinsFromTime(t2);

  // time arithmetic (subtraction)
  if (t1Mins < t2Mins) {
    t1Hrs--;
    t1Mins += 60;
  }
  var mins = t1Mins - t2Mins;
  var hrs = t1Hrs - t2Hrs;

  return hrs * 60 + mins;
}

export function addMinsToTime(mins, time) {
  // get the times hour and min value
  var [timeHrs, timeMins] = getHoursAndMinsFromTime(time);

  // time arithmetic (addition)
  if (timeMins + mins >= 60) {
    var addedHrs = parseInt((timeMins + mins) / 60);
    timeMins = (timeMins + mins) % 60;
    if (timeHrs + addedHrs > 23) {
      timeHrs = (timeHrs + addedHrs) % 24;
    } else {
      timeHrs += addedHrs;
    }
  } else {
    timeMins += mins;
  }

  // make sure the time slots are padded correctly
  return (
    String("00" + timeHrs).slice(-2) +
    ":" +
    String("00" + timeMins).slice(-2) +
    ":00"
  );
}

export function getHoursAndMinsFromTime(time) {
  // console.log(time);
  return time.split(":").map(function (str) {
    return parseInt(str);
  });
}
