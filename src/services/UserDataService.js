import http from "./services.js";
class UserDataService {
  baseUrl = "/performanceapi/user/";

  getAll(sortVar = null, ascending = true) {
    let url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getAllWithRoles() {
    return http.get(this.baseUrl + "all/roles");
  }

  getAllWithRolesAndStudentInstruments(sortVar = null, ascending = true) {
    let url = this.baseUrl + "all/roles/studentInstruments/";
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  disableAllUsers() {
    return http.put(this.baseUrl);
  }
}
export default new UserDataService();
