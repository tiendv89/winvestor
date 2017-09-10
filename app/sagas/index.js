import {fork} from 'redux-saga/effects';
import * as watchers from './watchers';

// Here, we register our watcher saga(s) and export as a single generator
// function (startForeman) as our root Saga.
const startForeman = function* startForeman() {
    yield fork(watchers.watchKeyBoardDidChangeHeight);
    yield fork(watchers.watchLoginRequest);
    yield fork(watchers.watchLoginRequestWithToken);
    yield fork(watchers.watchFetchPublicNews);
};

export default startForeman;