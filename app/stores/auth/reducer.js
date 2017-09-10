import * as types from './action-types';

const initialNavState = {
    status: 'undefined',
    profile: {
        _id: "59aedee4702c0608e80047c5",
        name: "Đinh Văn Tiến",
        nickname: "tiendv",
        birthday: "1989-10-21 00:29:08",
        phone: "0932372636",
        email: "tiendv.2703@gmail.com",
        city: "Hà Nội",
        address: "",
        updated_at: "2017-09-06 22:14:12",
        created_at: "2017-09-06 00:29:08",
        point: 5,
        avatar: null
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
        default:
            return state;
    }
}