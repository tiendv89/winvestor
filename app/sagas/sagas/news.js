import {put, call, select} from 'redux-saga/effects';
import {AsyncStorage} from 'react-native';
import * as types from '../../stores/news/action-types';
import * as api from '../../api';
import * as selectors from "../../stores/selectors";
import FireabseDatabase from '../../services/firebase-database';

export const fetchPublicNews = function* () {
    try {
        let profile = yield select(selectors.getProfile);

        if (profile.accessToken && profile.accessToken.length > 0) {
            const public_news = yield call(api.get, 'https://winvestor.vn/api/user-notification?token=' + profile.accessToken);
            if (public_news.status && public_news.status === 'error') {
                const local_news = yield AsyncStorage.getItem('local_news');

                if (local_news) {
                    let local_data = JSON.parse(local_news);
                    FireabseDatabase.trackFetchNewsSuccess(local_data, true);
                    yield put({type: types.LOAD_LOCAL_PUBLIC_NEWS_SUCCESS, data: local_data});
                } else {
                    FireabseDatabase.trackFetchNewsFailed('');
                    yield put({type: types.LOAD_LOCAL_PUBLIC_NEWS_FAILED});
                }
            } else {
                FireabseDatabase.trackFetchNewsSuccess(public_news.data, false);
                yield put({type: types.FETCH_PUBLIC_NEWS_SUCCESS, data: public_news.data});
            }
        } else {
            FireabseDatabase.v('no_auth');
            yield put({type: types.FETCH_PUBLIC_NEWS_FAILED_NO_AUTH})
        }
    } catch (error) {
        FireabseDatabase.trackFetchNewsFailed(error);
        yield put({type: types.FETCH_PUBLIC_NEWS_FAILED});
    }
};


export const receiveNewMessages = function* ({data}) {
    try {
        if (Array.isArray(data)) {
            let current_news = yield select(selectors.getCurrentNews);
            data.forEach(function(item) {
                let index = current_news.findIndex(x => x.id ? x.id === item.id : false)
                if (index === -1) {
                    current_news.push(item);
                }
            });

            yield put({type: types.FETCH_PUBLIC_NEWS_SUCCESS, data: current_news});
        }
    } catch (error) {

    }
};