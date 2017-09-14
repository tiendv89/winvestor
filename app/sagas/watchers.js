import {takeLatest} from 'redux-saga/effects';
import * as common_types from '../stores/common/action-types';
import * as auth_types from '../stores/auth/action-types';
import * as news_types from '../stores/news/action-types';
import * as common_sagas from './sagas/common';
import * as auth_sagas from './sagas/auth';
import * as news_sagas from './sagas/news';

export const watchKeyBoardDidChangeHeight = function* () {
    yield takeLatest(common_types.KEYBOARD_DID_CHANGE_HEIGHT, common_sagas.onKeyBoardDidChangeHeight)
};

export const watchLoginRequest = function* () {
    yield takeLatest(auth_types.ON_LOG_IN_REQUEST, auth_sagas.onLoginRequest);
};

export const watchLoginRequestWithToken = function* () {
    yield takeLatest(auth_types.ON_LOGIN_REQUEST_WITH_TOKEN, auth_sagas.onLoginRequestWithToken);
};

export const watchFetchPublicNews = function* () {
    yield takeLatest(news_types.FETCH_PUBLIC_NEWS, news_sagas.fetchPublicNews);
};

export const watchReceiveNewMessages = function* () {
    yield takeLatest(news_types.RECEIVE_NEW_MESSAGES, news_sagas.receiveNewMessages);
}