import * as types from './action-types';

export const connectionState = (status) => {
    return { type: types.CHANGE_CONNECTION_STATUS, isConnected: status };
};
