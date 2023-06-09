import http from "./services.js";
class UserRoleDataService {
  baseUrl = "/performanceapi/userRole/";

  getAll(sortVar = null, ascending = true) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getRolesForUser(userId) {
    return http.get(this.baseUrl + "userId/" + userId);
  }

  getRolesFoRoleId(roleId) {
    return http.get(this.baseUrl + "roleId/" + roleId);
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
export default new UserRoleDataService();
