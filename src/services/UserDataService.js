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

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }
}
export default new UserDataService();
