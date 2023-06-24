import http from "./services.js";
class CritiqueDataService {
  baseUrl = "/performanceapi/critique/";

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

  getCritiquesByTimeslotAndFaculty(timeslotId, facultyId) {
    return http.get(
      this.baseUrl + "timeslotId/" + timeslotId + "/facultyId/" + facultyId
    );
  }

  getSemesterCritiques(semesterId) {
    return http.get(this.baseUrl + "semesterId/" + semesterId);
  }

  getStudentSemesterCritiques(semesterId, userId) {
    return http.get(
      this.baseUrl + "semesterId/" + semesterId + "/userId/" + userId
    );
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  update(data) {
    return http.put(this.baseUrl + data.id, data);
  }

  delete(id) {
    return http.delete(this.baseUrl + id);
  }

  deleteAll() {
    return http.delete(this.baseUrl);
  }
}
export default new CritiqueDataService();
