import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    ActivityIndicator,
    AsyncStorage,
    Dimensions,
    Keyboard,
    Linking,
    Platform,
    ScrollView,
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
import {onRegisterRequest} from '../stores/auth/actions';
import Pusher from 'pusher-js/react-native';
import LoadingButton from '../components/LoadingButton';
import * as api from '../api';

Pusher.logToConsole = false;
const INPUT_NAME = 1;
const INPUT_EMAIL = 2;
const INPUT_PHONE = 3;
const INPUT_ADDRESS = 4;
const INPUT_PASSWORD = 5;
const INPUT_BIRTHDAY = 6;

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
            password: '',
            birthday: '',
            phone: '',
            address: ''
        }

    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.status !== this.props.auth.status) {
            if (nextProps.auth.status === 'register_success') {
                this.setState({registerInProgress: false});
            } else if (nextProps.auth.status === 'register_failed') {
                this.setState({registerInProgress: false});
                Alert.alert(
                    'Đăng ký thất bại',
                    nextProps.auth.error,
                    [
                        {
                            text: 'OK', onPress: () => {}
                        }
                    ]
                )
            }
        }
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
            case INPUT_PASSWORD:
                this.setState({password: text});
                break;
            case INPUT_BIRTHDAY:
                this.setState({birthday: text});
                break;
        }
    }

    register() {
        Keyboard.dismiss();
        this.setState({registerInProgress: true});
        this.props.dispatch(onRegisterRequest(this.state.email, this.state.password, this.state.name, this.state.birthday, this.state.phone, this.state.address));
    }

    render() {
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
                <View style={{flex: 3, backgroundColor: 'white', alignItems: 'center'}}>
                    <ScrollView
                        contentContainerStyle={{alignItems: 'center'}}
                    >
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
                            secureTextEntry={true}
                            maxLength={32}
                            onChangeText={(text) => this.onChangeText(text, INPUT_PASSWORD)}
                            placeholder='Password'
                            placeholderTextColor='#bdbdbd'
                            value={this.state.password}
                        />
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
                            onChangeText={(text) => this.onChangeText(text, INPUT_BIRTHDAY)}
                            placeholder='Ngày sinh - DD/MM/YY (*)'
                            returnKeyType='next'
                            placeholderTextColor='#bdbdbd'
                            value={this.state.birthday}
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
                        <Text
                            style={{marginHorizontal: 20, fontSize: 12, fontStyle: 'italic', marginTop: 15, marginBottom: 5, textDecorationLine: 'underline'}}
                            onPress={() => {Linking.openURL('https://winvestor.vn').catch(err => console.error('An error occurred', err));}}
                        >
                            (*) Bằng việc tiếp tục đăng ký, bạn đồng ý với các chính sách của chúng tôi.
                        </Text>
                        <LoadingButton
                            processing={this.state.registerInProgress}
                            buttonText='Tiếp tục'
                            buttonStyle={[styles.buttonLogin, {marginBottom: 10}]}
                            onPress={() => {
                                this.register()
                            }}
                        />
                    </ScrollView>
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
