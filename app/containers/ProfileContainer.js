import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    StatusBar,
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {Divider, SideMenu, Icon} from 'react-native-elements';
import Menu, {MENU_PROFILE, MENU_NEWS} from '../components/Menu';

const MAX_WIDTH = Dimensions.get('window').width * 0.9;

class ProfileContainer extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            chosen: MENU_NEWS
        }
    }

    _onPress() {

    }

    toogleSideMenu() {
        this.setState({isOpen: !this.state.isOpen});
    }

    onMenuItemSelected(item) {
        this.setState({isOpen: !this.state.isOpen, chosen: item});
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
        else
            return this.renderNews();
    }

    _onEndReached = () => {
        if (this.props.product_list[this.props.product.current_category].isLoading === false)
            this.props.dispatch(loadMoreProducts());
    };

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

    renderNews() {
        let message_list = this.props.news.data;
        let status = this.props.news.status;
        let loading = status !== 'local' && status !== 'online';
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
                        backgroundColor: '#F5FCFF',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator animating={true}/>
                    </View>
                    :
                    <FlatList
                        data={message_list}
                        renderItem={this._renderItem}
                    />
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
        backgroundColor: '#F5FCFF'
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
    }
});
