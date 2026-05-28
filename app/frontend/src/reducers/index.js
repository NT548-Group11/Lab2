import {combineReducers} from 'redux';
import loginReducer from './login';
import cartReducer from './cart';
const allReducers = combineReducers({
    login:loginReducer,
    cart: cartReducer,
});
export default allReducers;