import http from "./services.js";
class EventSignupPieceDataService {
  baseUrl = "/performanceapi/eventSignupPiece/";

  getAll(sortVar = null, ascending = true) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }

  getByEventSignupId(eventSignupId) {
    return http.get(this.baseUrl + "eventSignupId/" + eventSignupId);
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
export default new EventSignupPieceDataService();
