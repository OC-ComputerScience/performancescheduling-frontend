import http from "./services.js";
class EventSignupDataService {
  baseUrl = "/performanceapi/eventSignup/";

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

  remove(dataId) {
    return http.delete(this.baseUrl + dataId);
  }

  get(id) {
    return http.get(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getByEvent(id) {
    return http.get(this.baseUrl + `event/${id}`);
  }

  getByStudent(userId) {
    return http.get(this.baseUrl + `userId/${userId}`);
  }
}
export default new EventSignupDataService();
