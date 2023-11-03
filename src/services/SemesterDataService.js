import http from "./services.js";
class SemesterDataService {
  baseUrl = "/performanceapi/semester/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

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
  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }
}
export default new SemesterDataService();
