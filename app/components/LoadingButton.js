import React, {Component} from "react";
import PropTypes from 'prop-types'
import {Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from "react-native";

export default class LoadingButton extends Component {
    static propTypes = {
        processing: PropTypes.bool,
        buttonText: PropTypes.string,
        onPress: PropTypes.func.isRequired
    };

    static defaultProps = {
        processing: false,
        buttonText: "button",
        buttonStyle: {},
        buttonTextStyle: {}
    };

    _onPress = () => {
        this.props.onPress();
    };

    render() {
        const {
            processing,
            buttonText,
            buttonStyle,
            buttonTextStyle,
        } = this.props;

        return (
            <TouchableOpacity onPress={() => this._onPress()} style={[styles.buttonStyle, buttonStyle]} disabled={processing}>
                <Text style={[styles.buttonTextStyle, buttonTextStyle]}>{buttonText}</Text>
                <ActivityIndicator style={{opacity: processing? 1.0:0.0, marginLeft: 10}} color="white"/>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    buttonTextStyle: {
        marginLeft: 30,
        fontSize:(Platform.OS === 'ios') ? 18 : 17,
        color: 'white',
        backgroundColor: 'transparent'
    }
});
