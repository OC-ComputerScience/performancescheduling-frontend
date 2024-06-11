import http from "./services.js";
class StudentInstrumentSignupDataService {
  baseUrl = "/performanceapi/studentInstrumentSignup/";

  getAll(sortVar = null, ascending = true) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }
  getAllData() {
    var url = this.baseUrl;
    url += "allData/";
    return http.get(url);
  }
  getAllDataById(id) {
    var url = this.baseUrl;
    url += "allData/" + id;
    return http.get(url);
  }
  getAllDataByEventSingupId(id) {
    var url = this.baseUrl;
    url += "eventSignup/" + id;
    return http.get(url);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getByUserRoleId(
    userRoleId, 
    date,
    select,
    order = "ASC") {
    return http.get(this.baseUrl + 
        "userRoleId/" + 
        userRoleId +
        "?date=" +
        date +
        "&select=" +
        select +
        "&order=" +
        order);
  }
}
export default new StudentInstrumentSignupDataService();
