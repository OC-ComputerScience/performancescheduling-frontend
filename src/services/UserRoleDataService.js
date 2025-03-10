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
  get(roleId) {
    return http.get(this.baseUrl + roleId);
  }

  getRolesForUser(userId) {
    return http.get(this.baseUrl + "userId/" + userId);
  }

  getRolesForRoleId(
    roleId,
    sortVar = null,
    ascending = true,
    userStatus = null
  ) {
    var url = this.baseUrl + "roleId/" + roleId;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    if (userStatus != null) {
      url += "&userStatus=" + userStatus;
    }
    return http.get(url);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }
}
export default new UserRoleDataService();
