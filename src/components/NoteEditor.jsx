import React, { useState, useEffect, Fragment, useContext } from 'react';
import firebase from '../config/firebase';
import { AuthContext } from './auth/Auth';
import { Redirect, useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Loader from './Loader';
import { useHistory } from 'react-router';

function Note() {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const { id } = useParams();
    const history = useHistory();
    const ref = firebase.firestore().collection('notes').doc(id);
    function getNotes() {
        setLoading(true);
        ref.get()
            .then((doc) => {
                const { text, title } = doc.data();
                setTitle(title);
                setText(text);
                setLoading(false);
            })
            .catch((error) => {
                console.log('Error getting cached document:', error);
            });
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
        ref.update(updatedNote)
            .then(() => {
                history.push('/');
            })
            .catch((err) => {
                console.error(err);
            });
    }
    if (!currentUser) return <Redirect to="/login" />;
    if (loading) {
        return <Loader />;
    }
    return (
        <Fragment>
            <section className="notes-edit">
                <Link to="/">
                    <button onClick={() => editNote()}>
                        <span role="img" aria-label="Leftwards Hand">
                            👈
                        </span>
                    </button>
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
