import http from "./services.js";
class StudentPieceDataService {
  baseUrl = "/performanceapi/studentPiece/";

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
}
export default new StudentPieceDataService();
