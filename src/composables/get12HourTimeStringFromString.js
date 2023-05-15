export function get12HourTimeStringFromString(t) {
  return parseInt(t.substring(0, 2)) > 12
    ? parseInt(t.substring(0, 2)) - 12 + t.substring(2, t.length - 3)
    : parseInt(t.substring(0, 2)) < 10
    ? t.substring(1, t.length - 3)
    : t.substring(0, t.length - 3);
}
