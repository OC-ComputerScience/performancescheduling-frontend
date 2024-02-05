import http from "./services.js";
class StudentPieceDataService {
  baseUrl = "/performanceapi/studentPiece/";

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

  getByUser(userId) {
    return http.get(this.baseUrl + "userId/" + userId);
  }

  getSemesterByUser(userId) {
    return http.get(this.baseUrl + "semesters/userId/" + userId);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  getAllByPieceId(pieceId) {
    var url = this.baseUrl + "/pieceId/" + pieceId;
    return http.get(url);
  }
}
export default new StudentPieceDataService();
