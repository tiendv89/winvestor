import * as types from './action-types';

const initialState = ({
    status: 'undefined',
    data: []
});

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_PUBLIC_NEWS_SUCCESS:
            return { ...state, status: 'online', data: [...action.data]};
        case types.LOAD_LOCAL_PUBLIC_NEWS_SUCCESS:
            return { ...state, status: 'local', data: [...action.data]};
        case types.FETCH_PUBLIC_NEWS_FAILED:
            return {...state, status: 'loading_local'};
        case types.LOAD_LOCAL_PUBLIC_NEWS_FAILED:
            return {...state, status: 'unavailable'};
        case types.FETCH_PUBLIC_NEWS_FAILED_NO_AUTH:
            return {...state, status: 'no_auth'};
        default:
            return state;
    }
}
