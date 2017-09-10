import {combineReducers} from "redux";
import common from './common/reducer';
import rootNav from './navigatorRoot/reducer';
import auth from './auth/reducer';
import news from './news/reducer';

// Combines all reducers to a single reducer function
const reducer = combineReducers({
    common,
    rootNav,
    auth,
    news
});

export default reducer;
