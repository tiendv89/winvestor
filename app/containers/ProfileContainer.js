import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    AppState,
    Dimensions,
    FlatList,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    StatusBar,
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {Divider, SideMenu, Icon} from 'react-native-elements';
import {refreshNews} from '../stores/news/actions';
import {removeAccessToken} from '../stores/auth/actions';
import Menu, {MENU_PROFILE, MENU_NEWS, MENU_ABOUT, MENU_LOGOUT} from '../components/Menu';
import LoadingButton from '../components/LoadingButton';
import * as strings from '../resources/strings';

const MAX_WIDTH = Dimensions.get('window').width * 0.9;

class ProfileContainer extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            chosen: MENU_NEWS,
            appState: AppState.currentState
        }
    }

    componentWillMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.props.dispatch(refreshNews());
        }

        this.setState({appState: nextAppState});
    };

    _onPress() {

    }

    toogleSideMenu() {
        this.setState({isOpen: !this.state.isOpen});
    }

    onMenuItemSelected(item) {
        if (item !== MENU_LOGOUT)
            this.setState({isOpen: !this.state.isOpen, chosen: item});
        else {
            this.props.dispatch(removeAccessToken());
        }
    }

    render() {
        let {dispatch, nav} = this.props;
        const menu = <Menu onItemSelected={(item) => this.onMenuItemSelected(item)}/>;
        return (
            <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                bounceBackOnOverdraw={false}
                disableGestures={true}
                onChange={(isOpen) => this.setState({isOpen: isOpen})}
            >
                {this.renderContent()}
            </SideMenu>
        )
    }

    renderContent() {
        if (this.state.chosen === MENU_PROFILE)
            return this.renderProfile();
        else if (this.state.chosen === MENU_NEWS)
            return this.renderNews();
        else if (this.state.chosen === MENU_ABOUT)
            return this.renderAbout();
    }

    _renderItem = ({item}) => (
        <View style={{flex: 1, width: MAX_WIDTH, marginBottom: 15}}>
            <Text
                style={{fontSize: 20, fontWeight: 'bold', marginTop: 5, marginLeft: 5}}
            >
                {item.message}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 5}}>
                <Icon name="access-time" size={18}/>
                <Text
                    style={{fontSize: 18, marginLeft: 5, marginTop: 5}}
                >
                    {item.creationDate}
                </Text>
            </View>
        </View>
    );

    _keyExtractor = (item) => item.id ? item.id : item.creationDate;
    renderNews() {
        let message_list = this.props.news.data;
        message_list.sort(function(a, b) {
            if (!a.timestamp || !b.timestamp)
                return 0;

            return b.timestamp - a.timestamp;
        });
        let status = this.props.news.status;
        let loading = status !== 'local' && status !== 'online' && status !== 'refreshing';
        let small_loading = status === 'refreshing' && message_list.length > 0;
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '90%'}}>
                    <TouchableOpacity
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this.toogleSideMenu()}
                    >
                        <Icon name='menu' size={30} type='material-community'/>
                    </TouchableOpacity>
                    <Text
                        style={{marginLeft: 10, fontWeight: 'bold', fontSize: 30, marginVertical: 5}}
                    >
                        Thông tin cập nhật
                    </Text>
                </View>
                <Divider style={{height: 3, width: '90%', backgroundColor: '#3C8DBC', marginBottom: 5}}/>
                {loading ?
                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator animating={true}/>
                    </View>
                    :
                    <View>
                        {small_loading ?
                            <View style={{
                                height: 50,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <ActivityIndicator animating={true}/>
                            </View>
                            :
                            null
                        }
                        <FlatList
                            data={message_list}
                            renderItem={this._renderItem}
                            refreshing={this.props.news.state === 'refreshing'}
                            onRefresh={() => this.props.dispatch(refreshNews())}
                            keyExtractor={this._keyExtractor}
                        />
                    </View>
                }
            </View>
        )
    }

    renderProfile() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '90%'}}>
                    <TouchableOpacity
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this.toogleSideMenu()}
                    >
                        <Icon name='menu' size={30} type='material-community'/>
                    </TouchableOpacity>
                    <Text
                        style={{marginLeft: 10, fontWeight: 'bold', fontSize: 30, marginVertical: 5}}
                    >
                        Thông tin cá nhân
                    </Text>
                </View>
                <Divider style={{height: 3, width: '90%', backgroundColor: '#3C8DBC'}}/>
                <Image style={styles.circle_image}
                       source={{uri: this.props.profile.avatar ? this.props.profile.avatar : 'https://jnaengineering.co.za/images/no_product.png'}}/>
                <Text
                    style={{fontSize: 25, marginVertical: 5}}
                >
                    {this.props.profile.name}
                </Text>
                <Text
                    style={{fontSize: 18, marginBottom: 10, color: '#D2D6DE'}}
                >
                    Free Member
                </Text>
                <Divider style={{height: 1, width: '90%', backgroundColor: '#D2D6DE'}}/>
                <View style={styles.profile_item_container}>
                    <Text style={styles.profile_item_label}>
                        Biệt danh
                    </Text>
                    <Text style={styles.profile_item_value}>
                        {this.props.profile.nickname}
                    </Text>
                </View>
                <Divider style={{height: 1, width: '90%', backgroundColor: '#D2D6DE'}}/>
                <View style={styles.profile_item_container}>
                    <Text style={styles.profile_item_label}>
                        Ngày tham gia
                    </Text>
                    <Text style={styles.profile_item_value}>
                        {this.props.profile.created_at}
                    </Text>
                </View>
                <Divider style={{height: 1, width: '90%', backgroundColor: '#D2D6DE'}}/>
                <View style={styles.profile_item_container}>
                    <Text style={styles.profile_item_label}>
                        Tỉnh thành
                    </Text>
                    <Text style={styles.profile_item_value}>
                        {this.props.profile.city}
                    </Text>
                </View>
                <Divider style={{height: 1, width: '90%', backgroundColor: '#D2D6DE'}}/>
                <View style={styles.profile_item_container}>
                    <Text style={styles.profile_item_label}>
                        Địa chỉ
                    </Text>
                    <Text style={styles.profile_item_value}>
                        {this.props.profile.address && this.props.profile.address.length > 0 ? this.props.profile.address.length : 'Chưa cập nhật'}
                    </Text>
                </View>
                <Divider style={{height: 1, width: '90%', backgroundColor: '#D2D6DE'}}/>
                <View style={styles.profile_item_container}>
                    <Text style={styles.profile_item_label}>
                        Ngày sinh
                    </Text>
                    <Text style={styles.profile_item_value}>
                        {this.props.profile.birthday}
                    </Text>
                </View>
                <Divider style={{height: 1, width: '90%', backgroundColor: '#D2D6DE'}}/>
                <View style={styles.profile_item_container}>
                    <Text style={styles.profile_item_label}>
                        Số điện thoại
                    </Text>
                    <Text style={styles.profile_item_value}>
                        {this.props.profile.phone}
                    </Text>
                </View>
                <Divider style={{height: 1, width: '90%', backgroundColor: '#D2D6DE'}}/>
                <View style={styles.profile_item_container}>
                    <Text style={styles.profile_item_label}>
                        Độ thành thạo ứng dụng
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    width: '90%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#337AB7'
                }}>
                    <Text style={{fontSize: 18, color: 'white'}}>
                        Exp: {this.props.profile.point}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => this._onPress()}
                    style={styles.buttonStyle}
                >
                    <Text style={{fontSize: 25, color: 'white'}}>Update</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderAbout() {
        return (
            <View style={[styles.container, {paddingBottom: 10}]}>
                <StatusBar hidden={true}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '90%'}}>
                    <TouchableOpacity
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this.toogleSideMenu()}
                    >
                        <Icon name='menu' size={30} type='material-community'/>
                    </TouchableOpacity>
                    <Text
                        style={{marginLeft: 10, fontWeight: 'bold', fontSize: 30, marginVertical: 5}}
                    >
                        Về chúng tôi
                    </Text>
                </View>
                <Divider style={{height: 3, width: '90%', backgroundColor: '#3C8DBC', marginBottom: 20}}/>
                <View
                    style={{flex: 1, borderWidth: 2, borderRadius: 5, borderColor: '#34495e', marginHorizontal: 20, paddingHorizontal: 10, paddingVertical: 10}}
                >
                    <ScrollView>
                        <Text style={{color: '#34495e', fontWeight: 'bold', fontSize: 24, alignSelf: 'center', marginVertical: 10}}>
                            TỔNG QUAN
                        </Text>
                        <Text style={{color: '#34495e', fontSize: 18}}>
                            {strings.overview_text}
                        </Text>
                        <Text style={{color: '#34495e', fontWeight: 'bold', fontSize: 24, alignSelf: 'center', marginVertical: 10}}>
                            SẢN PHẨM
                        </Text>
                        <Text style={{color: '#34495e', fontSize: 18, marginBottom: 5}}>
                            {strings.product_detail1}
                        </Text>
                        <Text style={{color: '#34495e', fontSize: 18}}>
                            {strings.product_detail2}
                        </Text>
                        <Text style={{color: '#34495e', fontSize: 18, marginBottom: 5}}>
                            {strings.product_detail3}
                        </Text>
                        <Text style={{color: '#34495e', fontSize: 18, marginBottom: 5}}>
                            {strings.product_detail4}
                        </Text>
                        <Text style={{color: '#34495e', fontSize: 18, marginBottom: 5}}>
                            {strings.product_detail5}
                        </Text>
                        <Text style={{color: '#34495e', fontSize: 18, marginBottom: 5}}>
                            {strings.product_detail6}
                        </Text>
                    </ScrollView>
                </View>
                <LoadingButton
                    processing={false}
                    buttonText='Đến Website'
                    buttonStyle={[styles.buttonLogin, {marginTop: 10}]}
                    onPress={() => {
                        Linking.openURL('https://winvestor.vn').catch(err => console.error('An error occurred', err));
                    }}
                />
            </View>
        )
    }
}

ProfileContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        profile: state.auth.profile,
        news: state.news
    };
}

export default connect(mapStateToProps)(ProfileContainer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    circle_image: {
        marginTop: 20,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#D2D6DE',
        width: 100
    },
    profile_item_container: {
        flex: 2,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    profile_item_label: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    profile_item_value: {
        fontSize: 18,
        color: '#94D2FF'
    },
    buttonStyle: {
        backgroundColor: '#337AB7',
        marginVertical: 15,
        paddingVertical: 8,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonLogin: {
        width: 0.7 * Dimensions.get('window').width,
        height: 0.09 * Dimensions.get('window').height,
        backgroundColor: '#0000a0',
        borderRadius: 15
    }
});
