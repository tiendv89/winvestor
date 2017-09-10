import * as types from './action-types';

const initialState = ({
    isConnected: undefined
});

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case types.CHANGE_CONNECTION_STATUS:
            return { isConnected: action.isConnected }
        default:
            return state;
    }
}
