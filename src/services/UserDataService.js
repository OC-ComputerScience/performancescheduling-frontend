import http from "./services.js";
class UserDataService {
  baseUrl = "/performanceapi/user/";

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

  create(data) {
    return http.post(this.baseUrl, data);
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
