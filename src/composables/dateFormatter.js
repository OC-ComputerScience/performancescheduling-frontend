export function formatDate(date) {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date + " 00:00:00").toLocaleDateString("us-EN", options);
}
export function formatDateDash(date) {
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  month = month < 10 ? "0" + month : month;
 
  let day = date.getDate();
 day = day < 10 ? "0" + day : day;
  return year + "-" + month + "-" + day;
}
