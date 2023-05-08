import http from "./services.js";
class AvailabilityDataService {
  baseUrl = "/performanceapi/availability/";

  create(data) {
    return http.post(this.baseUrl, data);
  }

  getByUserRole(userRoleId) {
    return http.get(this.baseUrl + "userRoleId/" + userRoleId);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getByUserRoleAndEvent(userRoleId, eventId) {
    return http.get(
      this.baseUrl + "userRoleId/" + userRoleId + "/eventId/" + eventId
    );
  }
}
export default new AvailabilityDataService();
