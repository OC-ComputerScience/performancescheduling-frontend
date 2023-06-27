import http from "./services.js";
class UserNotificationDataService {
  baseUrl = "/performanceapi/userNotification/";

  getAll(sortVar = null, ascending = true) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + ascending ? "ASC" : "DESC";
    }
    return http.get(url);
  }

  getByUserRole(userRoleId) {
    return http.get(this.baseUrl + "userRoleId/" + userRoleId);
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
}
export default new UserNotificationDataService();
