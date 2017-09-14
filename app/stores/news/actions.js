import * as types from './action-types';

export const receiveNewMessages = (data) => {
    return {type: types.RECEIVE_NEW_MESSAGES, data};
};

export const fetchPublicNews = () => {
    return {type: types.FETCH_PUBLIC_NEWS};
};

export const refreshNews = () => {
    return {type: types.REFRESH_NEWS};
};