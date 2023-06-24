import http from "./services.js";
class SemesterDataService {
  baseUrl = "/performanceapi/semester/";

  getAll(sortVar = null, order = null) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar;
      if (order != null) {
        url += "&order=" + order;
      }
    }
    return http.get(url);
  }

  getCurrent(date) {
    return http.get(this.baseUrl + "date/" + date);
  }
}
export default new SemesterDataService();
