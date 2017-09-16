import * as types from './action-types';

export const onLoginRequest = (email, password) => {
    return {type: types.ON_LOG_IN_REQUEST, email, password};
};

export const onLoginRequestWithToken = (token) => {
    return {type: types.ON_LOGIN_REQUEST_WITH_TOKEN, token};
};

export const onLoadTokenFailed = () => {
    return {type: types.ON_LOG_IN_WITH_TOKEN_FAILURE};
};

export const removeAccessToken = () => {
    return {type: types.REMOVE_ACCESS_TOKEN};
}