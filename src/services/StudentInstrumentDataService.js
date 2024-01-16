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

  getStudentInstrumentSignupsByUserRoleId(
    userRoleId,
    date,
    select,
    order = "ASC"
  ) {
    return http.get(
      this.baseUrl +
        "instrumentSignups/" +
        userRoleId +
        "?date=" +
        date +
        "&select=" +
        select +
        "&order=" +
        order
    );
  }
  getStudentInstrumentSignupsByFacultyRoleId(
    facultyRoleId,
    date,
    select,
    order = "ASC"
  ) {
    return http.get(
      this.baseUrl +
        "instrumentSignups/faculty/" +
        facultyRoleId +
        "?date=" +
        date +
        "&select=" +
        select +
        "&order=" +
        order
    );
  }
  getStudentsForInstructorId(instructorId, active) {
    return http.get(
      this.baseUrl + "instructorId/" + instructorId + "?active=" + active
    );
  }

  getStudentsForAccompanistId(accompanistId, active) {
    return http.get(
      this.baseUrl + "accompanistId/" + accompanistId + "?active=" + active
    );
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

  disableAllStudentsInstruments() {
    return http.put(this.baseUrl);
  }
}
export default new StudentInstrumentDataService();
