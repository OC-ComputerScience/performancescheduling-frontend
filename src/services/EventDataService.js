import http from "./services.js";
class EventDataService {
  baseUrl = "/performanceapi/event/";

  getAll(sortVar = null, ascending = true) {
    var url = this.baseUrl;
    if (sortVar != null) {
      url += "?sortVar=" + sortVar + "&order=" + (ascending ? "ASC" : "DESC");
    }
    return http.get(url);
  }

  getById(eventId) {
    return http.get(this.baseUrl + eventId);
  }

  update(data) {
    return http.put(this.baseUrl + `${data.id}`, data);
  }

  getGTEDate(date, role, sortVar, ascending) {
    var url = this.baseUrl + `date/${date}?role=${role}`;

    if (sortVar != null) {
      url += `&sortVar=${sortVar}&order=${ascending ? "ASC" : "DESC"}`;
    }
    return http.get(url);
  }

  getGTEDateForFaculty(date, sortVar = null, ascending = true) {
    return this.getGTEDate(date, 'Faculty', sortVar, ascending);
  }

  getGTEDateForStudents(date, sortVar = null, ascending = true) {
    return this.getGTEDate(date, 'Student', sortVar, ascending);
  }

  getGTEDateForAdmins(date, sortVar = null, ascending = true) {
    return this.getGTEDate(date, 'Admin', sortVar, ascending);
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

  emailActiveStudentsForEvent(eventId, data) {
    return http.post(this.baseUrl + `${eventId}/emailActiveStudents`, data);
  }

  emailActiveInstAccForEvent(eventId, data) {
    return http.post(this.baseUrl + `${eventId}/emailActiveInstAccForEvent`, data);
  }
  emailSignedUpStudentsForEvent(eventId, data) {
    return http.post(this.baseUrl + `${eventId}/emailSignedUpStudentsForEvent`, data);
  }

  emailAvailInstAccForEvent(eventId, data) {
    return http.post(this.baseUrl + `${eventId}/emailAvailInstAccForEvent`, data);
  }

}
export default new EventDataService();
