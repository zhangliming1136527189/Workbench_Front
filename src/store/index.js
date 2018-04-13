import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Home from './home/reducer';
import * as Ifr from './ifr/reducer';
import * as AppStore from './appStore/reducer';
import thunk from 'redux-thunk';

let store = createStore(
	combineReducers({ ...Home, ...Ifr, ...AppStore }),
	{},
	composeWithDevTools(applyMiddleware(thunk))
);
export default store;
