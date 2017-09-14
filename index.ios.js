/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    UIManager,
    Text,
    View
} from 'react-native';
import {Provider} from 'react-redux';
import RootWithNavigationState from './app/navigators/RootNavigator';
import configureStore from './app/stores/configureStore';

export default class winvestor_noexp extends Component {
    store = configureStore();

    componentWillMount() {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    render() {
        return (
            <Provider store={this.store}>
              <RootWithNavigationState/>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

AppRegistry.registerComponent('winvestor_noexp', () => winvestor_noexp);
