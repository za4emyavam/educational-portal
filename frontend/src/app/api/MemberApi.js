import {apiClient} from "./ApiClient";

export const retrieveAllStudents =
    () => apiClient.get('/students')

export const retrieveStudentById =
    (id) => apiClient.get(`/students/${id}`)

export const retrieveAllStudyGroups =
    () => apiClient.get('/study_groups')

export const retrieveStudyGroupByGroupId =
    (groupId) => apiClient.get(`/study_groups/${groupId}`)

export const saveStudent =
    (student) => apiClient.post(`/students`, student)

export const retrieveSchedule =
    (studentId) => apiClient.get(`/schedules/student/${studentId}`)

export const retrieveSubjects =
    (studentId) => apiClient.get(`/subjects/student/${studentId}`)

export const retrieveSubject =
    (subjectId) => apiClient.get(`/subjects/${subjectId}`)

export const retrieveTasksBySubject =
    (subjectId) => apiClient.get(`/subjects/${subjectId}/tasks`)

export const retrieveScoreByStudentInSubject =
    (subjectId, studentId) => apiClient.get(`/subjects/${subjectId}/students/${studentId}/scores`)

export const retrieveTask =
    (taskId) => apiClient.get(`/tasks/${taskId}`)

export const retrieveScoreByTask =
    (subjectId, taskId, studentId) => apiClient.get(`/subjects/${subjectId}/tasks/${taskId}/students/${studentId}`)

export const retrieveAllScoresByStudent =
    (studentId) => apiClient.get(`/scores/${studentId}`)

export const retrieveAllTaskByStudentWithPag =
    (studentId, page, size, sort, direction) => apiClient.get(`/tasks/students/${studentId}/pag?page=${page}&size=${size}&sort=${sort}&direction=${direction}`)

export const retrieveFilesMetaByTask =
    (taskId) => apiClient.get(`/tasks/${taskId}/files`)

export const retrieveFileContent =
    (fileId) => apiClient.get(`/files/${fileId}`, { responseType: 'blob' })

export const uploadStudentTaskFileContent =
    (taskId, studentId, formData) => apiClient.post(`/tasks/${taskId}/students/${studentId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const uploadTaskFileContent =
    (taskId, formData) => apiClient.post(`/tasks/${taskId}/teach/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const retrieveStudentTaskFileMeta =
    (studentId, taskId) => apiClient.get(`/tasks/${taskId}/students/${studentId}/files`)

export const deleteStudentTaskFile =
    (studentId, taskId, fileId) => apiClient.delete(`/tasks/${taskId}/students/${studentId}/files/${fileId}`)

export const retrieveAllFilesByStudent =
    (studentId) => apiClient.get(`/student/${studentId}/files`)

export const retrieveAllSubjectsByTeacher =
    (teacherId) => apiClient.get(`/subjects/teacher/${teacherId}`)

export const saveInfoTask =
    (subjectId, task) => apiClient.post(`/subjects/${subjectId}/tasks/info`, task)

export const saveLabTask =
    (subjectId, task) => apiClient.post(`/subjects/${subjectId}/tasks/lab`, task)

export const retrieveStudentsByGroup =
    (groupId) => apiClient.get(`/study_groups/${groupId}/students`)

export const retrieveAllScoresInSubject =
    (subjectId) => apiClient.get(`/subjects/${subjectId}/scores`)

export const retrieveAllScoreByTask =
    (subjectId, taskId) => apiClient.get(`/subjects/${subjectId}/tasks/${taskId}/scores`)

export const retrieveAllStudentTaskFilesByTask =
    (taskId) => apiClient.get(`/tasks/${taskId}/students/files`)

export const deleteTask =
    (taskId) => apiClient.delete(`/tasks/${taskId}`)

export const logoutApi =
    (username) => apiClient.post(`/logout`, {
        username: username
    })

export const saveScore =
    (subjectId, taskId, studentId, score) => apiClient.post(`/subjects/${subjectId}/tasks/${taskId}/students/${studentId}`, score)

export const retrieveRenewInfoBySubject =
    (subjectId) => apiClient.get(`/subjects/${subjectId}/renew`)

export const retrieveRenewInfoByTeacher =
    (teacherId) => apiClient.get(`/teachers/${teacherId}/renews`)

export const retrieveStudentInSubject =
    (studentId, subjectId) => apiClient.get(`/subjects/${subjectId}/student/${studentId}`)

export const retrieveAllFaculties =
    () => apiClient.get('/faculties')

export const retrieveFacultyById =
    (facultyId) => apiClient.get(`/faculties/${facultyId}`)

export const saveFaculty =
    (faculty) => apiClient.post(`/faculties`, faculty)

export const updateFaculty =
    (facultyId, faculty) => apiClient.put(`/faculties/${facultyId}`, faculty)

export const deleteFaculty =
    (facultyId) => apiClient.delete(`/faculties/${facultyId}`)

export const retrieveMajors =
    () => apiClient.get(`/majors`)

export const retrieveMajorById =
    (majorId) => apiClient.get(`/majors/${majorId}`)

export const saveMajor =
    (major) => apiClient.post(`/majors`, major)

export const updateMajor =
    (majorId, major) => apiClient.put(`/majors/${majorId}`, major)

export const deleteMajor =
    (majorId) => apiClient.delete(`/majors/${majorId}`)

export const saveStudyGroup =
    (studyGroup) => apiClient.post(`/study_groups`, studyGroup)

export const updateStudyGroup =
    (groupId, studyGroup) => apiClient.put(`/study_groups/${groupId}`, studyGroup)

export const deleteStudyGroup =
    (groupId) => apiClient.delete(`/study_groups/${groupId}`)

export const retrieveAllTeachers =
    () => apiClient.get(`/teachers`)

export const saveTeacher =
    (teacher) => apiClient.post(`/teachers`, teacher)

export const retrieveTeacher =
    (teacherId) => apiClient.get(`/teachers/${teacherId}`)

export const updateTeacher =
    (teacherId, teacher) => apiClient.put(`/teachers/${teacherId}`, teacher)

export const deleteTeacher =
    (teacherId) => apiClient.delete(`/teachers/${teacherId}`)

export const updateStudent =
    (studentId, student) => apiClient.put(`/students/${studentId}`, student)

export const deleteStudent =
    (studentId) => apiClient.delete(`/students/${studentId}`)

export const retrieveAllSubjects =
    () => apiClient.get(`/subjects`)

export const saveSubject =
    (subject) => apiClient.post(`/subjects`, subject)

export const updateSubject =
    (subjectId, subject) => apiClient.put(`/subjects/${subjectId}`, subject)

export const deleteSubject =
    (subjectId) => apiClient.delete(`/subjects/${subjectId}`)

export const retrieveScheduleByStudyGroup =
    (studyGroupId) => apiClient.get(`/schedules/${studyGroupId}`)

export const retrieveSubjectsByStudyGroup =
    (studyGroupId) => apiClient.get(`/subjects/study_groups/${studyGroupId}`)

export const saveSchedule =
    (studyGroupId, schedule) => apiClient.post(`/schedules/${studyGroupId}`, schedule)

export const deleteSchedule =
    (studyGroupId, schedule) => apiClient.delete(`/schedules/${studyGroupId}?day=${schedule.day}&number=${schedule.number}`)

export const retrieveMessages =
    (taskId, studentId) => apiClient.get(`/tasks/${taskId}/students/${studentId}/chat`)

export const saveMessage =
    (taskId, studentId, message) => apiClient.post(`/tasks/${taskId}/students/${studentId}/chat`, message)

export const changePassword =
    (memberId, pass) => apiClient.post(`/members/${memberId}/change_password`, pass);

export const executeJwtAuthenticationService = (username, password) => apiClient.post("/login", {
    "username": username,
    "password": password
})