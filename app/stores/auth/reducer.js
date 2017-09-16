import * as types from './action-types';
import * as common_types from '../common/action-types';

const initialNavState = {
    status: 'undefined',
    profile: {

    }
};

export default function reduce(state = initialNavState, action = {}) {
    switch (action.type) {
        case types.ON_LOGIN_REQUEST_WITH_TOKEN:
            return {...state, status: 'logging_in_with_token'};
        case types.ON_LOG_IN_REQUEST:
            return {...state, status: 'logging_in'};
        case types.ON_LOG_IN_WITH_TOKEN_FAILURE:
            return {...state, status: 'logging_failed_with_token'};
        case types.ON_LOG_IN_SUCCESS:
            return {...state, status: 'logged_in', profile: action.profile.data};
        case types.ON_LOG_IN_FAILURE:
            return {...state, status: 'unauthorized'};
        case common_types.USER_LOG_OUT:
            return {status: 'undefined', profile: {}};
        default:
            return state;
    }
}