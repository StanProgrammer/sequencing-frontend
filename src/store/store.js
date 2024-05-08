// store.js

import { createStore } from 'redux';
// import counterReducer from './reducers/counterReducer';
import createReducer from './reducer';

const store = createStore(createReducer);

export default store;
