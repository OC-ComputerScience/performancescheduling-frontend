import http from "./services.js";
class MajorDataService {
  baseUrl = "/performanceapi/major/";

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

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getAllByStatus(status) {
    return http.get(this.baseUrl + "status/" + status);
  }
  disable(id) {
    const data = { status: "Disabled" };
    return http.put(this.baseUrl + id, data);
  }

  enable(id) {
    const data = { status: "Active" };
    return http.put(this.baseUrl + id, data);
  }
}
export default new MajorDataService();
