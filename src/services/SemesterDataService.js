import http from "./services.js";
class SemesterDataService {
  baseUrl = "/performanceapi/semester/";

  getAll(sortVar = null, ascending = true) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }

  getCurrent(date) {
    return http.get(this.baseUrl + "date/" + date);
  }
}
export default new SemesterDataService();
