import React, { useState, useEffect, Fragment, useContext } from 'react';
import firebase from '../config/firebase';
import { AuthContext } from './auth/Auth';
import { Redirect, Link } from 'react-router-dom';

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
    return (
        <Fragment>
            {loading ? <h1>Loading...</h1> : null}
            <section className="notes">
                <Link to="/new" className="note new-note">
                    ✍️
                </Link>
                {notes.map((note) => (
                    <div className="note">
                        <button onClick={() => deleteNote(note)}>❌</button>
                        <Link to={'notes/' + note.id} key={note.id}>
                            <div>
                                <h2>{note.title}</h2>
                                <p>{note.text}</p>
                                <p className="owner">
                                    Автор: <br />
                                    {note.ownerEmail}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </section>
        </Fragment>
    );
}

export default Note;
