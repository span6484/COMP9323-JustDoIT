import Fetch from '../util/fetch';

const fetchData = (url, param) => {
    return Fetch.fetchAuditDataWithPromise(url, param);
};

export function userRegister(param) {
    return fetchData('http://127.0.0.1:5000/register', param);
}
export function checkRole(param) {
    return fetchData('http://127.0.0.1:5000/check_role', param);
}
export function userLogin(param) {
    return fetchData('http://127.0.0.1:5000/login', param);
}
export function getRequirement(param) {
    return fetchData('http://127.0.0.1:5000/requirement', param);
}
export function getMessage(param) {
    return fetchData('http://127.0.0.1:5000/get_message', param);
}
export function getCourses(param) {
    return fetchData('http://127.0.0.1:5000/get_courses', param);
}
export function getAwards(param) {
    return fetchData('http://127.0.0.1:5000/get_awards', param);
}
export function setMessageRead(param) {
    return fetchData('http://127.0.0.1:5000/set_message_read', param);
}
export function deleteMessage(param) {
    return fetchData('http://127.0.0.1:5000/delete_message', param);
}

export function getMyProject(param) {
    return fetchData('http://127.0.0.1:5000/get_myProject', param);
}
export function getCourseDetail(param) {
    return fetchData('http://127.0.0.1:5000/get_course_detail', param);
}
export function publicToReviewers(param) {
    return fetchData('http://127.0.0.1:5000/public_to_reviewers', param);
}
export function getProjectsInCourse(param) {
    return fetchData('http://127.0.0.1:5000/get_projects_in_course', param);
}
export function getRequirements(param) {
    return fetchData('http://127.0.0.1:5000/get_requirements', param);
}
export function getUserProfile(param) {
    return fetchData('http://127.0.0.1:5000/get_user_profile', param);
}
export function changePasswordService(param) {
    return fetchData('http://127.0.0.1:5000/change_password', param);
}