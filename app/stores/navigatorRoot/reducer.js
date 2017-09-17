import {RootNavigator} from '../../navigators/RootNavigator';
import {NavigationActions} from 'react-navigation';

const initialNavState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams('Login'));
const root_keys = ['Login', 'Profile'];

export default function reduce(state = initialNavState, action = {}) {
    let nextState;
    let currentRoute = '';
    switch (action.type) {
        case NavigationActions.NAVIGATE:
            currentRoute = state.routes[state.index].routeName;
            if (currentRoute !== action.routeName) {
                nextState = RootNavigator.router.getStateForAction(action, state);
            }

            break;
        case NavigationActions.RESET:
            let shouldRespond = false;
            for (let i in action.actions) {
                if (root_keys.indexOf(action.actions[i].routeName) !== -1) {
                    shouldRespond = true;
                    break;
                }
            }

            if (shouldRespond) {
                nextState = RootNavigator.router.getStateForAction(action, state);
            }
            break;
        default:
            nextState = RootNavigator.router.getStateForAction(action, state);
            break;
    }

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
}