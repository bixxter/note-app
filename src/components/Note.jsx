import React, { useState, useEffect, Fragment, useContext } from 'react';
import firebase from '../config/firebase';
import { AuthContext } from './auth/Auth';
import { Redirect, Link } from 'react-router-dom';
import Loader from './Loader';

function Note() {
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const ref = firebase.firestore().collection('notes');

    //REALTIME GET FUNCTION
    function getNotes() {
        setLoading(true);
        ref.where('owner', '==', currentUserId).onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setNotes(items);
            setLoading(false);
        });
    }

    useEffect(() => {
        getNotes();
    }, []);

    //DELETE FUNCTION
    function deleteNote(note) {
        ref.doc(note.id)
            .delete()
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
            <section className="notes">
                <Link to="/new" className="note new-note">
                    <span role="img" aria-label="Writing Hand">
                        ✍️
                    </span>
                </Link>
                {notes.map((note) => (
                    <div className="note" key={note.id}>
                        <button onClick={() => deleteNote(note)}>
                            <span role="img" aria-label="Cross Mark">
                                ❌
                            </span>
                        </button>
                        <Link to={'notes/' + note.id}>
                            <div>
                                <h2>{note.title}</h2>
                                <p>{note.text}</p>
                                {/* <p className="owner">
                                    Автор: <br />
                                    {note.ownerEmail}
                                </p> */}
                            </div>
                        </Link>
                    </div>
                ))}
            </section>
        </Fragment>
    );
}

export default Note;
