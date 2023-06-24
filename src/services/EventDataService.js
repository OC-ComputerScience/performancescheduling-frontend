import http from "./services.js";
class EventDataService {
  baseUrl = "/performanceapi/event/";

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

  getById(eventId) {
    return http.get(this.baseUrl + eventId);
  }

  update(data) {
    return http.put(this.baseUrl + `${data.id}`, data);
  }

  getGTEDateForStudents(date) {
    return http.get(this.baseUrl + `date/${date}?role=Student`);
  }

  getGTEDateForAdmins(date) {
    return http.get(this.baseUrl + `date/${date}?role=Admin`);
  }

  create(data) {
    return http.post(this.baseUrl, data);
  }

  remove(id) {
    return http.delete(this.baseUrl + id);
  }

  createCritique(data) {
    return http.post(this.baseUrl, data);
  }

  getStudentTimeslotsForEvent(eventId) {
    return http.get(this.baseUrl + "studentInstrumentSignups/" + eventId);
  }

  getBySemester(semesterId) {
    return http.get(this.baseUrl + `semesterId/${semesterId}`);
  }
}
export default new EventDataService();
