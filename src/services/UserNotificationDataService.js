import http from "./services.js";
class UserNotificationDataService {
  baseUrl = "/performanceapi/userNotification/";

  getAll() {
    return http.get(this.baseUrl);
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
