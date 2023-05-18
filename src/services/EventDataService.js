import http from "./services.js";
class EventDataService {
  baseUrl = "/performanceapi/event/";

  getAll() {
    return http.get(this.baseUrl);
  }

  getById(eventId) {
    return http.get(this.baseUrl + eventId);
  }

  update(data) {
    return http.put(this.baseUrl + `${data.id}`, data);
  }

  getGTEDate(date) {
    return http.get(this.baseUrl + `date/${date}`);
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

  getByStudent(userId) {
    return http.get(this.baseUrl + `userId/${userId}`);
  }
}
export default new EventDataService();
