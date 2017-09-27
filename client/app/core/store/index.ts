import * as createLogger from 'redux-logger';

import { IAppState, rootReducer, deimmutify, reimmutify } from './store';
import { ISessionRecord, IUserRecord, IMessage  } from './session';
import * as adapter from 'redux-localstorage/lib/adapters/localStorage';
import persistState, {mergePersistedState} from 'redux-localstorage';
import {compose, createStore} from 'redux';
export {
  IAppState,
  ISessionRecord,
  rootReducer,
  IUserRecord,
  IMessage,
  reimmutify,
};
let storage = compose(
)(adapter(window.localStorage));
export let middleware = [];
export let enhancers = [
  persistState(storage,"redux-localstorage",()=>{})
];
middleware.push(
    createLogger({
    level: 'info',
    collapsed: true,
    stateTransformer: deimmutify,
}));
