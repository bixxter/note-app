import React, { useState, useContext } from 'react';
import firebase from '../../config/firebase';
import { Redirect } from 'react-router-dom';
import { AuthContext } from './Auth';
const Login = () => {
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                resetInput();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const login = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                resetInput();
            })
            .catch((err) => {
                console.error(err);
            });
        <Redirect to="/" />;
    };

    const resetInput = () => {
        setEmail('');
        setPassword('');
    };
    if (currentUser) return <Redirect to="/" />;
    return (
        <div className="login">
            <div className="inputBox text-area">
                <h3>Login/Register</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                />
                <button onClick={register}>Register</button>
                <button onClick={login}>Login</button>
            </div>
        </div>
    );
};

export default Login;
