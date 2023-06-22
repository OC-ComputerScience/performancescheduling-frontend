import http from "./services.js";
class UserDataService {
  baseUrl = "/performanceapi/user/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getAll() {
    return http.get(this.baseUrl);
  }

  getAllWithRoles() {
    return http.get(this.baseUrl + "all/roles");
  }

  getAllWithRolesAndStudentInstruments() {
    return http.get(this.baseUrl + "all/roles/studentInstruments");
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  disable(id) {
    return http.put(this.baseUrl + "disable/" + id);
  }

  enable(id) {
    return http.put(this.baseUrl + "enable/" + id);
  }
}
export default new UserDataService();
