export function get12HourTimeStringFromString(t) {
  if(t != null){
    return parseInt(t.substring(0, 2)) > 11
      ? parseInt(t.substring(0, 2)) == 12
        ? parseInt(t.substring(0, 2)) + t.substring(2, t.length - 3) + "pm"
        : parseInt(t.substring(0, 2)) - 12 + t.substring(2, t.length - 3) + "pm"
      : parseInt(t.substring(0, 2)) < 10
      ? t.substring(1, t.length - 3) + "am"
      : t.substring(0, t.length - 3) + "am";
  }
}

export function get12HourTimeStringFromStringWithoutPostfix(t) {
  return parseInt(t.substring(0, 2)) > 11
    ? parseInt(t.substring(0, 2)) == 12
      ? parseInt(t.substring(0, 2)) + t.substring(2, t.length - 3)
      : parseInt(t.substring(0, 2)) - 12 + t.substring(2, t.length - 3)
    : parseInt(t.substring(0, 2)) < 10
    ? t.substring(1, t.length - 3)
    : t.substring(0, t.length - 3);
}

export function getHourWordFromNumber(n) {
  if (n === "1") {
    return "one";
  } else if (n === "2") {
    return "two";
  } else if (n === "3") {
    return "three";
  } else if (n === "4") {
    return "four";
  } else if (n === "5") {
    return "five";
  } else if (n === "6") {
    return "six";
  } else if (n === "7") {
    return "seven";
  } else if (n === "8") {
    return "eight";
  } else if (n === "9") {
    return "nine";
  } else if (n === "10") {
    return "ten";
  } else if (n === "11") {
    return "eleven";
  } else if (n === "12") {
    return "twelve";
  }
}

export function get24HourTimeString(t) {
  const modifier = t.slice(-2);
  let [hours, minutes] = t.slice(0, -2).split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "pm") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
}
