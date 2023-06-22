import http from "./services.js";
class StudentInstrumentDataService {
  baseUrl = "/performanceapi/studentInstrument/";

  getAll() {
    return http.get(this.baseUrl);
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

  disable(id) {
    return http.put(this.baseUrl + "disable/" + id);
  }

  enable(id) {
    return http.put(this.baseUrl + "enable/" + id);
  }
}
export default new StudentInstrumentDataService();
