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