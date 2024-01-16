import http from "./services.js";
class AvailabilityDataService {
  baseUrl = "/performanceapi/availability/";

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
  
  getAllByEventId(eventId){
    return http.get(this.baseUrl + `availability/${eventId}`)
  }
}
export default new AvailabilityDataService();
