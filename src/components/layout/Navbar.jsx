import React, { useContext } from 'react';
import firebase from '../../config/firebase';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/Auth';

const Navbar = () => {
    const { currentUser } = useContext(AuthContext);
    const logOut = () => {
        firebase.auth().signOut();
    };
    return (
        <nav className="navbar">
            {currentUser && currentUser ? <span>Привет, {currentUser.email}</span> : null}

            <div className="links">
                {currentUser ? (
                    <button className="link-button" onClick={logOut}>
                        Выйти
                    </button>
                ) : null}
            </div>
        </nav>
    );
};

export default Navbar;
