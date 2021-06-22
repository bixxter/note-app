import React from 'react';
import { AuthProvider } from './components/auth/Auth';
import Login from './components/auth/Login';
import NoteEditor from './components/NoteEditor';
import NoteCreate from './components/NoteCreate';
import Note from './components/Note';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

function App() {
    return (
        <div>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Switch>
                        <Route exact path="/">
                            <Note />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/notes/:id">
                            <NoteEditor />
                        </Route>
                        <Route path="/new">
                            <NoteCreate />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
}

export default App;
