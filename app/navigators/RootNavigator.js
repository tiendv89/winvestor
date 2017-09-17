import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AsyncStorage, BackHandler, Keyboard, LayoutAnimation, NetInfo, Platform} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions, StackNavigator, addNavigationHelpers} from 'react-navigation';
import {connectionState} from '../stores/connection/actions';
import {onKeyboardDidChangeHeight} from '../stores/common/actions';
import ProfileContainer from '../containers/ProfileContainer';
import LoginContainer from '../containers/LoginContainer';
import RegisterContainer from '../containers/RegisterContainer';

export const RootNavigator = StackNavigator({
    Login: {screen: LoginContainer},
    Profile: {screen: ProfileContainer},
    Register: {screen: RegisterContainer}
}, {
    headerMode: 'screen',
    initialRouteName: 'Login'
});

class RootWithNavigationState extends Component {
    constructor(props) {
        super(props);

        console.ignoredYellowBox = [
            'Setting a timer'
        ];

        this.onBackPressed = this.onBackPressed.bind(this);
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));

        NetInfo.isConnected.addEventListener('connectionChange', this.onConnectionChange);
        BackHandler.addEventListener('hardwareBackPress', this.onBackPressed);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow(e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.props.dispatch(onKeyboardDidChangeHeight(e.endCoordinates.height - 60));
    }

    keyboardDidHide(e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.props.dispatch(onKeyboardDidChangeHeight(0));
    }

    onConnectionChange = (isConnected) => {
        this.props.dispatch(connectionState(isConnected));
    };

    onBackPressed() {
        this.props.dispatch(NavigationActions.back());
    }

    render() {
        let {dispatch, rootNav} = this.props;
        return (
            <RootNavigator navigation={addNavigationHelpers({dispatch, state: rootNav})}/>
        )
    }
}

RootWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootNav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    rootNav: state.rootNav,
});

export default connect(mapStateToProps)(RootWithNavigationState);
