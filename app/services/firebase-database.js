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
        ret[Param.USER_ID] = this.uid;
        ret[Param.APP_VERSION] = config.version;
        ret[Param.TIME_STAMP] = Math.round(new Date().getTime() / 1000);

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
        object[Param.CHANNEL_ID] = error;

        var ref = firebase.database().ref('events/' + Event.REQUEST_REGISTER_PUSH_NOTIFICATION).push();
        ref.set(object);
    }

    // trackGoToPage(to, from) {
    //     let object = this.buildAutoParam();
    //     object[Param.FROM_PAGE] = from;
    //     object[Param.TO_PAGE] = to;
    //
    //     firebase.analytics().logEvent(Event.GO_TO_PAGE, object);
    //     var ref = firebase.database().ref('events-v2/' + Event.GO_TO_PAGE).push();
    //     ref.set(object);
    // }
}

export default new FirebaseAnalytics();
