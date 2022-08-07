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
    return fetchData('http://127.0.0.1:5000/public_course_to_reviewers', param);
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
export function addRequirement(param) {
    return fetchData('http://127.0.0.1:5000/add_requirement', param);
}
export function editRequirement(param) {
    return fetchData('http://127.0.0.1:5000/edit_requirement', param);
}
export function deleteRequirement(param) {
    return fetchData('http://127.0.0.1:5000/delete_requirement', param);
}
export function getRequirementDetail(param) {
    return fetchData('http://127.0.0.1:5000/get_requirement_detail', param);
}
export function getProposals(param) {
    return fetchData('http://127.0.0.1:5000/get_proposals', param);
}
export function addProposal(param) {
    return fetchData('http://127.0.0.1:5000/add_proposal', param);
}
export function uploadPdf(param) {
    return fetchData('http://127.0.0.1:5000/upload_file', param);
}
export function deleteProposal(param) {
    return fetchData('http://127.0.0.1:5000/delete_proposal', param);
}
export function joinQuitProject(param) {
    return fetchData('http://127.0.0.1:5000/join_quit_project', param);
}
export function viewProject(param) {
    return fetchData('http://127.0.0.1:5000/view_project', param);
}
export function editProject(param) {
    return fetchData('http://127.0.0.1:5000/edit_project', param);
}
export function changeProjectStatus(param) {
    return fetchData('http://127.0.0.1:5000/change_project_status', param);
}
export function viewWorks(param) {
    return fetchData('http://127.0.0.1:5000/view_works', param);
}
export function studentSubmit(param) {
    return fetchData('http://127.0.0.1:5000/student_submit', param);
}
export function giveFeedback(param) {
    return fetchData('http://127.0.0.1:5000/give_feedback', param);
}
export function giveAward(param) {
    return fetchData('http://127.0.0.1:5000/give_award', param);
}
export function getAwardDetail(param) {
    return fetchData('http://127.0.0.1:5000/get_award_detail', param);
}
export function projStartEnd(param) {
    return fetchData('http://127.0.0.1:5000/proj_start_end', param);
}