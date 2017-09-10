import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RNPusherPushNotifications from 'react-native-pusher-push-notifications';
import LoadingButton from '../components/LoadingButton';
import {ActivityIndicator, AsyncStorage, Dimensions, Keyboard, Platform, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {onLoginRequest, onLoginRequestWithToken, onLoadTokenFailed} from '../stores/auth/actions';

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
                console.log("Hey zoo I listen");
                RNPusherPushNotifications.on('registered', this.subscribePrivateChannel);
            } else {
                // Android is immediate
                this.subscribePrivateChannel();
            }

            this.props.dispatch(NavigationActions.navigate({routeName: 'Profile'}));
        }
    }

    subscribePrivateChannel() {
        let channelId = this.props.auth.profile._id;
        console.log('Subscribe to channel: ' + channelId);
        // Subscribe to push notifications
        if (Platform.OS === 'ios') {
            // iOS callbacks are beta, so dont use them
            RNPusherPushNotifications.subscribe(channelId);
        } else {
            // Android is better, so handle faults
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
        console.log(token);

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
            <LinearGradient colors={['#2a9598', '#2ec67b']} style={styles.container}>
                <StatusBar hidden={true}/>
                <Text
                    style={{color: 'white', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: 40}}
                >
                    WINVESTOR
                </Text>
                <Text
                    style={{color: 'white', backgroundColor: 'transparent', fontStyle: 'italic', marginTop: 5, textAlign: 'center'}}
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
            </LinearGradient>
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
        backgroundColor: '#F5FCFF',
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
