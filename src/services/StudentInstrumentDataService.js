import http from "./services.js";
class StudentInstrumentDataService {
  baseUrl = "/performanceapi/studentInstrument/";

  getAll(sortVar = null, ascending = true) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }

  getByUser(userId) {
    return http.get(this.baseUrl + "userId/" + userId);
  }

  getStudentInstrumentSignupsByUserRoleId(userRoleId, date) {
    return http.get(
      this.baseUrl + "instrumentSignups/" + userRoleId + "/" + date
    );
  }

  getStudentsForInstructorId(instructorId) {
    return http.get(this.baseUrl + "instructorId/" + instructorId);
  }

  getStudentInstrumentsForStudentId(studentId) {
    return http.get(this.baseUrl + "studentId/" + studentId);
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
export default new StudentInstrumentDataService();
