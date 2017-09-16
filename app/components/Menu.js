import React, {Component, PropTypes} from 'react';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import {Icon} from 'react-native-elements';

export const MENU_PROFILE = 1;
export const MENU_NEWS = 2;
export const MENU_ABOUT = 3;
export const MENU_LOGOUT = 3;

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
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10}}
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
                        Profile
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10}}
                    onPress={() => {
                        this.props.onItemSelected(MENU_NEWS)
                    }}
                >
                    <Icon name='settings' color='white'/>
                    <Text style={{
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 20,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                    }}>
                        News
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10}}
                    onPress={() => {
                        this.props.onItemSelected(MENU_ABOUT)
                    }}
                >
                    <Icon name='settings' color='white'/>
                    <Text style={{
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 20,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                    }}>
                        About
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{flexDirection: 'row', marginVertical: 10}}
                    onPress={() => {
                        this.props.onItemSelected(MENU_LOGOUT)
                    }}
                >
                    <Icon name='settings' color='white'/>
                    <Text style={{
                        marginLeft: 10,
                        color: 'white',
                        fontSize: 20,
                        textAlignVertical: 'center',
                        textAlign: 'center'
                    }}>
                        Log out
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
};

Menu.propsType = {
    wallets: PropTypes.array
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
});

export default Menu;