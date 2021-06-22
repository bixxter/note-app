import React, { useState, useEffect, Fragment, useContext } from 'react';
import firebase from '../config/firebase';
import { AuthContext } from './auth/Auth';
import { useHistory } from 'react-router';
import { Redirect, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';

function Note() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const ref = firebase.firestore().collection('notes');
    const history = useHistory();
    // ADD FUNCTION
    function addNote() {
        if (title || text) {
            const owner = currentUser ? currentUser.uid : 'unknown';
            const ownerEmail = currentUser ? currentUser.email : 'unknown';
            const newNote = {
                title,
                text,
                id: uuidv4(),
                owner,
                ownerEmail,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
            };

            ref.doc(newNote.id)
                .set(newNote)
                .catch((err) => {
                    console.error(err);
                });
            history.push('/');
        }
    }

    if (!currentUser) return <Redirect to="/login" />;
    return (
        <Fragment>
            {loading ? <h1>Loading...</h1> : null}
            <section className="notes-edit">
                <Link to="/">
                    <button onClick={() => addNote()}>👈</button>
                </Link>
                <div className="inputBox ">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="title"
                    />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="text"
                    />
                    <ReactMarkdown className="markdown-preview">{text}</ReactMarkdown>
                </div>
            </section>
        </Fragment>
    );
}

export default Note;
