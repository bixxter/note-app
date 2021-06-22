import React, { useEffect, useState } from 'react';
import firebase from '../../config/firebase.js';
import Loader from '../Loader.jsx';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
