import {combineReducers} from 'redux';
import quizReducer from './quizReducer';
import createReducer from './createReducer';

export default combineReducers({
    quiz: quizReducer,
    create: createReducer,
})