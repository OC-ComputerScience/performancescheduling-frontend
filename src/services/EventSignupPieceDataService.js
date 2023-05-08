import http from "./services.js";
class EventSignupPieceDataService {
  baseUrl = "/performanceapi/eventSignupPiece/";

  getAll() {
    return http.get(this.baseUrl);
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
