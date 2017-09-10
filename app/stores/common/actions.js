import * as types from './action-types';

export const onKeyboardDidChangeHeight = (height) => {
    return { type: types.KEYBOARD_DID_CHANGE_HEIGHT, height };
};
