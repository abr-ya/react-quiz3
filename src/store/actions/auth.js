import {AUTH_SUCCESS, AUTH_LOGOUT} from './actionTypes';
import axios from 'axios';

// регистрация и авторизация в одном флаконе - може есть смысл разделить?!
export function auth(email, password, isLogin) {
    return async dispatch => {
        const baseUrl = 'https://identitytoolkit.googleapis.com/v1/';
        const key = 'AIzaSyASHvL35-6iv71Xiwfts1PcSXNwHoTlgB4'; // вынести в конфиг!
        const requestData = {
            email,
            password,
            returnSecureToken: true,
        }

        let requestAction = 'signUp';

        if (isLogin) requestAction = 'signInWithPassword';

        const requestUrl = `${baseUrl}accounts:${requestAction}?key=${key}`;
        const response = await axios.post(requestUrl, requestData);
        const data = response.data;
        const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);

        // поддержка сессии
        localStorage.setItem('token', data.idToken);
        localStorage.setItem('userId', data.localId);
        localStorage.setItem('expirationDate', expirationDate);

        dispatch(authSuccess(data.idToken));
        dispatch(autoLogout(data.expiresIn));
    }
}

export function authSuccess(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    return {
        type: AUTH_LOGOUT,
    }
}

export function autoLogin() {
    console.log('autoLogin');
    return dispatch => {
        const token = localStorage.getItem('token');
        // если токена нет
        if (!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token));
                dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    }
}
