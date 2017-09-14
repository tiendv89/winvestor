import * as types from './action-types';

export const receiveNewMessages = (data) => {
    return {type: types.RECEIVE_NEW_MESSAGES, data};
};
