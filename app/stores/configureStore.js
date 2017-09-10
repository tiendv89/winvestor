import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer';
import saga from '../sagas';
import config from '../config';

//  Returns the store instance
// It can  also take initialState argument when provided
const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    if (config.env === 'dev') {
        return {
            ...createStore(reducer,
                applyMiddleware(sagaMiddleware, logger)),
            runSaga: sagaMiddleware.run(saga)
        };
    } else {
        return {
            ...createStore(reducer,
                applyMiddleware(sagaMiddleware)),
            runSaga: sagaMiddleware.run(saga)
        };
    }
};

export default configureStore;