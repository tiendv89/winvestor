import * as types from './action-types';

export const onKeyboardDidChangeHeight = (height) => {
    return { type: types.KEYBOARD_DID_CHANGE_HEIGHT, height };
};

export const logout = () => {
    return { type: types.USER_LOG_OUT };
}