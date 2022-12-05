import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosRes, axiosReq } from '../api/axiosDefaults';
import { response } from 'msw';
import { useHistory } from 'react-router-dom';

export const CurrentUserContext = createContext()
export const SetCurrentUserContext = createContext()

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)

    // history if refresh token fails and user will be redirected to signin page
    const history = useHistory()

    const handleMount = async () => {
        try {
            const { data } = await axiosRes.get('dj-rest-auth/user/')
            setCurrentUser(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        handleMount()
    }, []);

    // intercept JWTokens
    useMemo(() => {

        axiosReq.interceptors.request.use(
            // inside try block, try refreshing token before sending a request
            async (config) => {
                try {
                    await axios.post('/dj-rest-auth/token/refresh/')
                } catch(err) {
                    // if token expired, user will be redirected to the signin page, and current user will be set to null
                    setCurrentUser((prevCurrentUser) => {
                        if (prevCurrentUser) {
                            history.push('/signin/')
                        }
                        return null
                    }) 
                    // return request config both inside and outside the catch block
                    return config
                }
                return config
            },
            // if there is an error, reject the promise with it
            (err) => {
                return Promise.reject(err);
            }
        )

        axiosRes.interceptors.response.use(
            // if there is no error, return response
            (response) => response,
            // if there is an error, check if it's status is 401 unauth
            async (err) => {
                if (err.response?.status === 401) {
                    // inside try block attempt to refresh token
                    try {
                        await axios.post('/dj-rest-auth/token/refresh/')
                    } catch(err) {
                        // if user token expired, the user will be redirected to signin and their data is set to null
                        setCurrentUser(prevCurrentUser => {
                            if (prevCurrentUser) {
                                history.push('/signin/')
                            }
                            return null
                        })
                    }
                    // if there is no error refreshing the token, axios config to exit the interceptor
                    return axios(err.config)
                }
                // if the error was not 401, reject promise to exit the interceptor
                return Promise.reject(err)
            }
        )
        // add dependency for useMemo with 'history' inside, so that useMemo only runs once
    }, [history]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    )
};