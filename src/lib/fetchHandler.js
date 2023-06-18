import merge from 'lodash/merge'
import { configureRefreshFetch, fetchJSON } from 'refresh-fetch'
import {clearToken, retrieveToken, saveToken} from "@/lib/authHelpers";

const baseUrl = process.env.NEXT_PUBLIC_URL



const fetchJSONWithToken = (url, options = {}) => {
    const token = retrieveToken()

    let optionsWithToken = options
    if (token != null) {
        optionsWithToken = merge({}, options, {
            headers: {
                'x-refresh': token,
                'Content-Type': 'application/json',
            }
        })
    }
    console.log("FETCH_HANDLER :: request options", optionsWithToken)
    return fetchJSON(url, optionsWithToken)
}

const shouldRefreshToken = error => {
    console.log("FETCH_HANDLER :: shouldRefreshToken - check if error", error)
    return  error.response.status === 401 &&
        error.body.msg === 'Token has expired'
}

const refreshToken = () => {
    console.log("FETCH_HANDLER :: refreshToken START")
    return fetchJSONWithToken('/api/auth/login', {
        method: 'PUT',
    })
        .then(response => {
            console.log("FETCH_HANDLER :: refreshToken RESPONSE", response)
            saveToken(response.body.refreshToken)
        })
        .catch(error => {
            console.log("FETCH_HANDLER :: refreshToken ERROR, clear", error)
            clearToken()
            throw error
        })
}

const fetch = configureRefreshFetch({
    fetch: fetchJSONWithToken,
    shouldRefreshToken,
    refreshToken
})
// =================
// ==== WRAPPER ====
// =================
function post(url, body) {
    const requestOptions = {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        // headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(baseUrl + url, requestOptions).then(handleResponse);
}


function get(url) {
    const requestOptions = {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include',
        // headers: authHeader(url)
    };
    return fetch(baseUrl + url, requestOptions).then(handleResponse);
}

function put(url) {
    const requestOptions = {
        method: 'PUT',
        mode: 'no-cors',
        credentials: 'include',
    };
    return fetch(baseUrl + url, requestOptions).then(handleResponse);
}

function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        credentials: 'include',
    };
    return fetch(baseUrl + url, requestOptions).then(handleResponse);
}


function handleResponse(res) {
    console.log("FETCH_HANDLER :: handleResponse", res)

    if (!res.response.ok) {
        console.log("REQ - handle response - response not ok", res.response)

        // if ([401, 403].includes(response.status) && userService.userValue) {
        //     // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        //     userService.logout();
        // }

        // const error = (data && data.message) || response.statusText;
        // return Promise.reject(error);
        return Promise.reject("erro");
    }
    return res.body;
}

export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
};
