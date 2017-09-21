import * as Event from '../config/FirebaseAnalytics_Event';
import * as Param from '../config/FirebaseAnalytics_Param';
import RNFirebase from 'react-native-firebase';
import config from '../config/';

var firebase = RNFirebase.initializeApp({});
var dateFormat = require('dateformat');

class FirebaseAnalytics {

    uid = '-1';

    constructor() {
    }

    setUserId(user) {
        this.uid = user._id;
        firebase.database().ref('users/' + user._id).set(user);
    }

    buildAutoParam() {
        let ret = {};
        if (this.uid != '-1') {
            ret[Param.USER_ID] = this.uid;
        }
        ret[Param.APP_VERSION] = config.version;
        ret[Param.TIME_STAMP] = Math.round(new Date().getTime() / 1000);
        ret[Param.TIME] = dateFormat(new Date(), "isoDateTime");

        return ret;
    }

    trackRegisterPNSuccess(success) {
        let object = this.buildAutoParam();
        object[Param.RESPONSE] = success;

        var ref = firebase.database().ref('events/' + Event.REGISTER_PUSH_NOTIFICATION_SUCCESS).push();
        ref.set(object);

    }

    trackRegisterPNError(error) {
        let object = this.buildAutoParam();
        object[Param.RESPONSE] = error;

        var ref = firebase.database().ref('events/' + Event.REGISTER_PUSH_NOTIFICATION_FAILURE).push();
        ref.set(object);
    }

    trackRegisterPNSent(channelId) {
        let object = this.buildAutoParam();
        object[Param.CHANNEL_ID] = channelId;

        var ref = firebase.database().ref('events/' + Event.REQUEST_REGISTER_PUSH_NOTIFICATION).push();
        ref.set(object);
    }

    trackLoginRequest(purpose, data) {
        let object = this.buildAutoParam();
        object[Param.PURPOSE] = purpose;
        if (purpose === 'token') {
            object[Param.TOKEN] = data.token;
        } else {
            object[Param.USER_EMAIL] = data.email;
        }

        var ref = firebase.database().ref('events/' + Event.LOGIN_REQUEST_SENT).push();
        ref.set(object);
    }

    trackOnTokenRequestFailed(purpose) {
        let object = this.buildAutoParam();
        object[Param.PURPOSE] = purpose;

        var ref = firebase.database().ref('events/' + Event.TOKEN_REQUEST_FAILED).push();
        ref.set(object);
    }

    trackLoginFailed(error) {
        let object = this.buildAutoParam();
        object[Param.ERROR] = error;

        var ref = firebase.database().ref('events/' + Event.LOGIN_REQUEST_FAILED).push();
        ref.set(object);
    }

    trackLoginSuccess(profile) {
        let object = this.buildAutoParam();
        object[Param.USER_ID] = profile._id;
        object[Param.USER_EMAIL] = profile.email;

        var ref = firebase.database().ref('events/' + Event.LOGIN_REQUEST_SUCCESS).push();
        ref.set(object);
    }

    trackRemoveAccessTokenFailed(error) {
        let object = this.buildAutoParam();
        object[Param.ERROR] = error;

        var ref = firebase.database().ref('events/' + Event.REMOVE_ACCESS_TOKEN_ERROR).push();
        ref.set(object);
    }

    trackRegisterRequest(email, name, phone, address) {
        let object = this.buildAutoParam();
        object[Param.USER_EMAIL] = email;
        object[Param.USER_FULL_NAME] = name;
        object[Param.USER_PHONE] = phone;
        object[Param.USER_CITY] = address;

        var ref = firebase.database().ref('events/' + Event.REGISTER_REQUEST_SENT).push();
        ref.set(object);
    }

    trackRegisterFailed(error) {
        let object = this.buildAutoParam();
        object[Param.ERROR] = error;

        var ref = firebase.database().ref('events/' + Event.REGISTER_REQUEST_FAILED).push();
        ref.set(object);
    }

    trackRegisterSuccess(profile) {
        let object = this.buildAutoParam();
        object[Param.USER_ID] = profile._id;
        object[Param.USER_EMAIL] = profile.email;

        var ref = firebase.database().ref('events/' + Event.REGISTER_REQUEST_SUCCESS).push();
        ref.set(object);
    }
}

export default new FirebaseAnalytics();
