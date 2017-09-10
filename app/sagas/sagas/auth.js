import {put, call} from 'redux-saga/effects';
import {AsyncStorage} from 'react-native';
import {NavigationActions} from 'react-navigation';
import * as types from '../../stores/auth/action-types';
import * as news_types from '../../stores/news/action-types';
import * as api from '../../api';

export const onLoginRequest = function* ({email, password}) {
    try {
        const {data} = yield call(api.get, 'https://winvestor.vn/api/token');
        console.log(data);

        if (!data.token) {
            yield put({type: types.ON_LOG_IN_FAILURE, error: 'Token request failed'});
        } else {
            const auth_info = yield call(api.post, 'https://winvestor.vn/api/login', {email: email, password: password, _token: data.token})
            console.log(auth_info);

            if (auth_info.data.status === 'error') {
                yield put({type: types.ON_LOG_IN_FAILURE});
            } else {
                yield put({type: types.ON_LOG_IN_SUCCESS, profile: auth_info});
                yield AsyncStorage.setItem('winvestor_profile', auth_info.data.accessToken);
                yield put({type: news_types.FETCH_PUBLIC_NEWS});
            }
        }
    } catch (error) {
        yield put({type: types.ON_LOG_IN_FAILURE, error});
    }
};

export const onLoginRequestWithToken = function* ({token}) {
    try {
        const {data} = yield call(api.get, 'https://winvestor.vn/api/token');
        console.log(data);

        if (!data.token) {
            yield put({type: types.ON_LOG_IN_FAILURE, error: 'Token request failed'});
        } else {
            const auth_info = yield call(api.post, 'https://winvestor.vn/api/login-access-token', {token: token, _token: data.token})
            console.log(auth_info);

            if (auth_info.data.status === 'error') {
                yield put({type: types.ON_LOG_IN_WITH_TOKEN_FAILURE});
            } else {
                yield put({type: types.ON_LOG_IN_SUCCESS, profile: auth_info});
                yield AsyncStorage.setItem('winvestor_profile', auth_info.data.accessToken);
                yield put({type: news_types.FETCH_PUBLIC_NEWS});
            }
        }
    } catch (error) {
        yield put({type: types.ON_LOG_IN_WITH_TOKEN_FAILURE, error});
    }
};