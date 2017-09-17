import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    ActivityIndicator,
    AsyncStorage,
    Dimensions,
    Image,
    Keyboard,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {Icon, Divider} from 'react-native-elements';
import Pusher from 'pusher-js/react-native';
import LoadingButton from '../components/LoadingButton';
import * as api from '../api';

Pusher.logToConsole = false;
const INPUT_NAME = 1;
const INPUT_EMAIL = 2;
const INPUT_PHONE = 3;
const INPUT_ADDRESS = 4;

class RegisterContainer extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            registerInProgress: false,
            name: '',
            email: '',
            phone: '',
            address: ''
        }

    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    onChangeText(text, type) {
        switch (type) {
            case INPUT_NAME:
                this.setState({name: text});
                break;
            case INPUT_EMAIL:
                this.setState({email: text});
                break;
            case INPUT_PHONE:
                this.setState({phone: text});
                break;
            case INPUT_ADDRESS:
                this.setState({address: text});
                break;
        }
    }

    register() {

    }

    render() {
        let showLoadingIndicator = this.props.auth.status === 'undefined' || this.props.auth.status === 'logging_in_with_token' || this.props.auth.status === 'logged_in';
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '90%'}}>
                    <TouchableOpacity
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this.props.dispatch(NavigationActions.back())}
                    >
                        <Icon name='arrow-back' size={30}/>
                    </TouchableOpacity>
                    <Text
                        style={{marginLeft: 10, fontWeight: 'bold', fontSize: 30, marginVertical: 5}}
                    >
                        Đăng ký tài khoản
                    </Text>
                </View>
                <Divider style={{height: 3, width: '90%', backgroundColor: '#3C8DBC', marginBottom: 5}}/>
                <View
                    style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}
                >
                    <TextInput
                        style={[styles.formTextInput, {marginTop: 10}]}
                        underlineColorAndroid='transparent'
                        maxLength={32}
                        onChangeText={(text) => this.onChangeText(text, INPUT_NAME)}
                        placeholder='Họ và tên (*)'
                        returnKeyType='next'
                        placeholderTextColor='#bdbdbd'
                        value={this.state.name}
                    />
                    <TextInput
                        style={[styles.formTextInput, {marginTop: 10}]}
                        underlineColorAndroid='transparent'
                        maxLength={32}
                        onChangeText={(text) => this.onChangeText(text, INPUT_EMAIL)}
                        placeholder='Email nhận cảnh báo thị trường (*)'
                        returnKeyType='next'
                        placeholderTextColor='#bdbdbd'
                        value={this.state.email}
                    />
                    <TextInput
                        style={[styles.formTextInput, {marginTop: 10}]}
                        underlineColorAndroid='transparent'
                        maxLength={32}
                        onChangeText={(text) => this.onChangeText(text, INPUT_PHONE)}
                        placeholder='Số điện thoại (*)'
                        keyboardType='phone-pad'
                        returnKeyType='next'
                        placeholderTextColor='#bdbdbd'
                        value={this.state.phone}
                    />
                    <TextInput
                        style={[styles.formTextInput, {marginTop: 10}]}
                        underlineColorAndroid='transparent'
                        maxLength={32}
                        onChangeText={(text) => this.onChangeText(text, INPUT_ADDRESS)}
                        placeholder='Địa chỉ (*)'
                        returnKeyType='next'
                        placeholderTextColor='#bdbdbd'
                        value={this.state.address}
                    />
                    <LoadingButton
                        processing={this.state.registerInProgress}
                        buttonText='Tiếp tục'
                        buttonStyle={[styles.buttonLogin, {marginVertical: 10}]}
                        onPress={() => {
                            this.register()
                        }}
                    />
                </View>
                <View style={{height: this.props.common.keyboardHeight}}/>
            </View>
        );
    }
}

RegisterContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        rootNav: state.rootNav,
        common: state.common,
        auth: state.auth
    };
}

export default connect(mapStateToProps)(RegisterContainer);

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
