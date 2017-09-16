import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RNPusherPushNotifications from 'react-native-pusher-push-notifications';
import LoadingButton from '../components/LoadingButton';
import {ActivityIndicator, AsyncStorage, Dimensions, Image, Keyboard, Platform, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {onLoginRequest, onLoginRequestWithToken, onLoadTokenFailed} from '../stores/auth/actions';
import {receiveNewMessages} from '../stores/news/actions';
import Pusher from 'pusher-js/react-native';
import * as api from '../api';

Pusher.logToConsole = false;

class LoginContainer extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loginInProgress: false
        }

        this.subscribePNChannel = this.subscribePNChannel.bind(this);
    }

    componentWillMount() {
        this._loadToken().then(token => {
            if (!token) {
                this.props.dispatch(onLoadTokenFailed());
            } else {
                this.props.dispatch(onLoginRequestWithToken(token));
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.status !== this.props.auth.status && nextProps.auth.status === 'logged_in') {
            // Pusher Pushnotifications
            RNPusherPushNotifications.setAppKey('2912f2814f5e00f8b82d');

            if (Platform.OS === 'ios') {
                // iOS must wait for rego
                RNPusherPushNotifications.on('registered', this.subscribePNChannel);
            } else {
                // Android is immediate
                this.subscribePNChannel(nextProps.auth.profile._id);
            }

            this.initPusher().then(_token => {
                let userId = nextProps.auth.profile._id;
                let channelId = 'private-' + userId;
                let token = nextProps.auth.profile.accessToken;
                let authEndpoint = 'https://winvestor.vn/api/private-channel/' + userId + '/' + token;
                // Pusher private channel
                this.pusher = new Pusher('2912f2814f5e00f8b82d', {
                    cluster: 'ap1',
                    authEndpoint: authEndpoint,
                    auth: {
                        params: {
                            _token: _token.data.token,
                        }
                    }
                });

                let channel = this.pusher.subscribe(channelId);
                channel.bind('privateStockEvent', function(data) {
                    this.props.dispatch(receiveNewMessages(data));
                }.bind(this));
            });

            this.props.dispatch(NavigationActions.navigate({routeName: 'Profile'}));
        }
    }

    async initPusher() {
        let _token = api.get('https://winvestor.vn/api/token');
        return _token;
    }

    subscribePNChannel(id) {
        // Subscribe to push notifications
        if (Platform.OS === 'ios') {
            // iOS callbacks are beta, so dont use them
            let channelId = this.props.auth.profile._id;
            RNPusherPushNotifications.subscribe(channelId);
        } else {
            // Android is better, so handle faults
            let channelId = id;
            RNPusherPushNotifications.subscribe(
                channelId,
                (error) => {
                    console.error(error);
                },
                (success) => {
                    console.log(success);
                }
            );
        }
    }

    async _loadToken() {
        const token = await AsyncStorage.getItem('winvestor_profile');

        return token;
    }

    onChangeText(text, isEmail) {
        this.setState(isEmail ? {email: text} : {password: text});
    }

    login() {
        Keyboard.dismiss();
        this.setState({loginInProgress: true});
        this.props.dispatch(onLoginRequest(this.state.email, this.state.password));
    }

    render() {
        let showLoadingIndicator = this.props.auth.status === 'undefined' || this.props.auth.status === 'logging_in_with_token' || this.props.auth.status === 'logged_in';
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <Image
                    style={{width: 100, height: 100}}
                    source={require('../resources/logo.png')}
                />
                <Text
                    style={{color: '#0000a0', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: 40}}
                >
                    WINVESTOR
                </Text>
                <Text
                    style={{color: '#0000a0', backgroundColor: 'transparent', fontStyle: 'italic', marginTop: 5, textAlign: 'center'}}
                >
                    Đầu tư kỷ luật để thành công{'\n'}Disciplined investing for success
                </Text>
                {showLoadingIndicator ?
                    <ActivityIndicator style={{marginTop: 20}} animating={true}/>
                    :
                    <View style={{alignItems: 'center'}}>
                        <TextInput
                            style={[styles.formTextInput, {marginTop: 40}]}
                            underlineColorAndroid='transparent'
                            maxLength={32}
                            onChangeText={(text) => this.onChangeText(text, true)}
                            placeholder='Email'
                            returnKeyType='next'
                            placeholderTextColor='#bdbdbd'
                            value={this.state.email}
                        />
                        <TextInput
                            style={[styles.formTextInput, {marginTop: 10}]}
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                            maxLength={32}
                            onChangeText={(text) => this.onChangeText(text, false)}
                            placeholder='Password'
                            placeholderTextColor='#bdbdbd'
                            value={this.state.password}
                        />
                        <LoadingButton
                            processing={this.state.loginInProgress}
                            buttonText='Sign in'
                            buttonStyle={[styles.buttonLogin, {marginTop: 10}]}
                            onPress={() => {
                                this.login()
                            }}
                        />
                    </View>
                }
                <View style={{height: this.props.common.keyboardHeight}}/>
            </View>
        );
    }
}

LoginContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        rootNav: state.rootNav,
        common: state.common,
        auth: state.auth
    };
}

export default connect(mapStateToProps)(LoginContainer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    formTextInput: {
        marginHorizontal: 20,
        padding: 10,
        width: 0.9 * Dimensions.get('window').width,
        backgroundColor: '#ffffff',
        textAlign: 'left',
        fontSize: (Platform.OS === 'ios') ? 17 : 18,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#c9c9c9'
    },
    buttonLogin: {
        width: 0.9 * Dimensions.get('window').width,
        height: 0.09 * Dimensions.get('window').height,
            backgroundColor: '#34495e',
        borderRadius: 5
    }
});
