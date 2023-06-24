import http from "./services.js";
class PieceDataService {
  baseUrl = "/performanceapi/piece/";

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

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getByComposerId(composerId) {
    return http.get(this.baseUrl + "composer/" + composerId);
  }

  getAllByStatus(status) {
    return http.get(this.baseUrl + "status/" + status);
  }
}
export default new PieceDataService();
