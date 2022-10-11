import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    ERROR_MODAL: "ERROR_MODAL",
    LOGOUT_USER: "LOGOUT_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        error: false,
        message: ""
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: auth.error,
                    message: auth.message
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: auth.error,
                    message: auth.message
                })
            }
            // part 1
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: auth.error,
                    message: auth.message
                })
            }
            // part 2
            case AuthActionType.ERROR_MODAL:{
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: payload.error,
                    message: payload.message,
                    
                })
            }
            // part 4
            case AuthActionType.LOGOUT_USER:{
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: auth.error,
                    message: auth.message
                })
            }

            default:
                return auth;
        }
    }

    // part 1
    auth.loginUser = async function (userData, store){
        try{
            const response = await api.loginUser(userData);
            if (response.status === 200) {
                console.log(response);
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: response.data.loggedIn
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }catch(err){
            // part 2
            const message = err.response.data.errorMessage;
            auth.showErrorModal(message);
        }
    }

    auth.showErrorModal = async function(message) {
        authReducer({
            type: AuthActionType.ERROR_MODAL,
            payload: {
                error: true,
                message: message
            }
        })
    }
    auth.closeErrorModal = async function() {
        authReducer({
            type: AuthActionType.ERROR_MODAL,
            payload: {
                error: false,
                message: null
            }
        })
    }

    // part 4
    auth.logoutUser = async function(store){
        try{
            const response = await api.logoutUser();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload:{
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                })
            }
            history.push("/");
            store.closeCurrentList();
        }catch(err){
            console.log(err);
        }
    }

    auth.getLoggedIn = async function () {
        try{
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                console.log(response);
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
        }catch(err){
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false
                }
            })
        }
    }

    auth.registerUser = async function(userData, store) {
        try{
            const response = await api.registerUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }catch(err){
            // part 2
            const message = err.response.data.errorMessage;
            auth.showErrorModal(message);
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };