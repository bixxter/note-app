import React, { useState, useEffect, Fragment, useContext } from 'react';
import firebase from '../config/firebase';
import { AuthContext } from './auth/Auth';
import { Redirect, useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function Note() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const { id } = useParams();
    const ref = firebase.firestore().collection('notes').doc(id);
    function getNotes() {
        setLoading(true);
        ref.get()
            .then((doc) => {
                const { text, title } = doc.data();
                setTitle(title);
                setText(text);
            })
            .catch((error) => {
                console.log('Error getting cached document:', error);
            });
        setLoading(false);
    }

    useEffect(() => {
        getNotes();
    }, []);

    // EDIT FUNCTION
    function editNote() {
        const updatedNote = {
            title: title,
            text: text,
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
        };
        setLoading();
        ref.update(updatedNote).catch((err) => {
            console.error(err);
        });
        <Redirect to="/" />;
    }
    if (!currentUser) return <Redirect to="/login" />;
    return (
        <Fragment>
            {loading ? <h1>Loading...</h1> : null}

            <section className="notes-edit">
                <Link to="/">
                    <button onClick={() => editNote()}>👈</button>
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
