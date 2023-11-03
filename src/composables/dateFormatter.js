export function formatDate(date) {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date + " 00:00:00").toLocaleDateString("us-EN", options);
}
