import * as types from './action-types';

const initialNavState = {
    keyboardHeight: 0,
};

export default function reduce(state = initialNavState, action = {}) {
    switch (action.type) {
        case types.KEYBOARD_DID_CHANGE_HEIGHT:
            return {...state, keyboardHeight: action.height};
        default:
            return state;
    }
}