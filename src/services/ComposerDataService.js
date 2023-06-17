import http from "./services.js";
class ComposerDataService {
  baseUrl = "/performanceapi/composer/";

  getAll() {
    return http.get(this.baseUrl);
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

  getAllByStatus(status) {
    return http.get(this.baseUrl + "status/" + status);
  }
}
export default new ComposerDataService();
