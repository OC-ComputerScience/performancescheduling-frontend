import http from "./services.js";
class EventTypeDataService {
  baseUrl = "/performanceapi/eventType/";

  getAll(sortVar = null, ascending = true, filter = null) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url +="?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC") + "&filter=" + filter;
    }
    return http.get(url);
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
export default new EventTypeDataService();
