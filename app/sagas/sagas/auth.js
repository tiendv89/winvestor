import {put, call} from 'redux-saga/effects';
import {AsyncStorage} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {MENU_ABOUT} from '../../components/Menu';
import FirebaseDatabase from '../../services/firebase-database';
import * as types from '../../stores/auth/action-types';
import * as news_types from '../../stores/news/action-types';
import * as common_types from '../../stores/common/action-types';
import * as api from '../../api';

export const onLoginRequest = function* ({email, password}) {
    try {
        FirebaseDatabase.trackLoginRequest('email', {email: email});
        const {data} = yield call(api.get, 'https://winvestor.vn/api/token');

        if (!data.token) {
            FirebaseDatabase.trackOnTokenRequestFailed('login');
            yield put({type: types.ON_LOG_IN_FAILURE, error: 'Token request failed'});
        } else {
            const auth_info = yield call(api.post, 'https://winvestor.vn/api/login', {email: email, password: password, _token: data.token})

            if (auth_info.data.status === 'error') {
                FirebaseDatabase.trackLoginFailed('');
                yield put({type: types.ON_LOG_IN_FAILURE});
            } else {
                FirebaseDatabase.trackLoginSuccess(auth_info.data);
                yield put({type: types.ON_LOG_IN_SUCCESS, profile: auth_info});
                yield AsyncStorage.setItem('winvestor_profile', auth_info.data.accessToken);
                yield put({type: news_types.FETCH_PUBLIC_NEWS});
            }
        }
    } catch (error) {
        FirebaseDatabase.trackLoginFailed(error);
        yield put({type: types.ON_LOG_IN_FAILURE, error});
    }
};

export const onLoginRequestWithToken = function* ({token}) {
    try {
        FirebaseDatabase.trackLoginRequest('token', {token: token});
        const {data} = yield call(api.get, 'https://winvestor.vn/api/token');

        if (!data.token) {
            FirebaseDatabase.trackOnTokenRequestFailed('login_with_token');
            yield put({type: types.ON_LOG_IN_FAILURE, error: 'Token request failed'});
        } else {
            const auth_info = yield call(api.post, 'https://winvestor.vn/api/login-access-token', {token: token, _token: data.token})

            if (auth_info.data.status === 'error') {
                FirebaseDatabase.trackLoginFailed('');
                yield put({type: types.ON_LOG_IN_WITH_TOKEN_FAILURE});
            } else {
                FirebaseDatabase.trackLoginSuccess(auth_info.data);
                yield put({type: types.ON_LOG_IN_SUCCESS, profile: auth_info});
                yield AsyncStorage.setItem('winvestor_profile', auth_info.data.accessToken);
                yield put({type: news_types.FETCH_PUBLIC_NEWS});
            }
        }
    } catch (error) {
        FirebaseDatabase.trackLoginFailed(error);
        yield put({type: types.ON_LOG_IN_WITH_TOKEN_FAILURE, error});
    }
};

export const removeAccessToken = function* () {
  try {
      yield AsyncStorage.removeItem('winvestor_profile');
      yield put({type: common_types.USER_LOG_OUT});

      const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
              NavigationActions.navigate({ routeName: 'Login'})
          ]
      });
      yield put(resetAction);
  } catch (error) {
      FirebaseDatabase.trackRemoveAccessTokenFailed(error);
  }
};

export const onRegisterRequest = function* ({email, password, name, phone, address}) {
  try {
      FirebaseDatabase.trackRegisterRequest(email, name, phone, address);
      const {data} = yield call(api.get, 'https://winvestor.vn/api/token');

      if (!data.token) {
          FirebaseDatabase.trackOnTokenRequestFailed('register');
          yield put({type: types.ON_REGISTER_REQUEST_FAILED, error: 'Token request failed'});
      } else {
          const auth_info = yield call(api.post, 'https://winvestor.vn/api/register', {email: email, password: password, name: name, phone: phone, address: address, _token: data.token});
          if (auth_info.data.status === 'error') {
              FirebaseDatabase.trackRegisterFailed(auth_info.data.data.length > 0 ? auth_info.data.data[0] : '');
              yield put({type: types.ON_REGISTER_REQUEST_FAILED, error: auth_info.data.data.length > 0 ? auth_info.data.data[0] : 'Vui lòng thử lại.'});
          } else {
              FirebaseDatabase.trackRegisterSuccess(auth_info.data);
              yield put({type: types.ON_REGISTER_SUCCEES, profile: auth_info});
              yield AsyncStorage.setItem('winvestor_profile', auth_info.data.accessToken);
              const resetAction = NavigationActions.reset({
                  index: 0,
                  actions: [
                      NavigationActions.navigate({ routeName: 'Profile', params: {chosenMenu: MENU_ABOUT}}),
                  ]
              });
              yield put(resetAction);
          }
      }
  } catch (error) {
      FirebaseDatabase.trackRegisterFailed(error);
      yield put({type: types.ON_REGISTER_REQUEST_FAILED, error});
  }
};