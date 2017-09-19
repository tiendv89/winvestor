import React, {Component, PropTypes} from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Icon} from 'react-native-elements';

export const MENU_PROFILE = 1;
export const MENU_NEWS = 2;
export const MENU_ABOUT = 3;
export const MENU_LOGOUT = 4;

class Menu extends Component {
    static propTypes = {
        onItemSelected: React.PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: '#004A7C'}]}>
                <Image style={styles.circle_image}
                       source={{uri: this.props.image !== undefined && this.props.image.length > 0 ? this.props.image : 'https://jnaengineering.co.za/images/no_product.png'}}/>
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10, paddingLeft: 20, alignSelf: 'flex-start'}}
                    onPress={() => {
                        this.props.onItemSelected(MENU_PROFILE)
                    }}
                >
                    <Icon name='lock-outline' color='white'/>
                    <Text style={{
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 20,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                    }}>
                        Thông tin cá nhân
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10, paddingLeft: 20, alignSelf: 'flex-start'}}
                    onPress={() => {
                        this.props.onItemSelected(MENU_NEWS)
                    }}
                >
                    <Icon name='message' color='white'/>
                    <Text style={{
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 20,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                    }}>
                        Cảnh báo thị trường
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10, paddingLeft: 20, alignSelf: 'flex-start'}}
                    onPress={() => {
                        this.props.onItemSelected(MENU_ABOUT)
                    }}
                >
                    <Icon name='info' color='white'/>
                    <Text style={{
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 20,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                    }}>
                        Giới thiệu
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10, paddingLeft: 20, alignSelf: 'flex-start'}}
                    onPress={() => {
                        this.props.onItemSelected(MENU_LOGOUT)
                    }}
                >
                    <Icon name='sign-out' color='white' type='font-awesome'/>
                    <Text style={{
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 20,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                    }}>
                        Thoát tài khoản
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20,
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 5,
    },
    circle_image: {
        marginVertical: 50,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#D2D6DE',
        width: 100
    }
});

export default Menu;