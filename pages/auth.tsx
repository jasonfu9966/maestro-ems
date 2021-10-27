import { initializeApp } from '@firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { emailRegex, passwordRegex } from '../components/util';
import React, { useState } from 'react';

// TODO: read up on firebase security rules
// TODO: determine if putting this into another file is better
// https://firebase.google.com/docs/rules
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// includes firebaase features
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const signInScreen = () => {
  const [registerFlag, setRegisterFlag] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [passMatch, setPassMatch] = useState(true);
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (user) => {
    if (user !== null) {
      setUser(user);
      console.log(`logged in as ${auth.currentUser.email}`);
    } else {
      console.log(`Not logged in: ${user}`);
    }
  });

  const register = async () => {
    const emailCheck = new RegExp(emailRegex);
    const passwordCheck = new RegExp(passwordRegex);
    if (!emailCheck.test(loginEmail)) {
      console.log('invalid email');
      setValidEmail(false);
      return;
    } else {
      setValidEmail(true);
    }

    if (!passwordCheck.test(loginPassword)) {
      console.log('invalid password');
      setValidPassword(false);
      return;
    } else {
      setValidPassword(true);
    }

    if (!passMatch) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      setUser(userCredential.user);
      console.log(`user created: ${userCredential.user.email}`);

      // TODO: add a redirect
    } catch (error) {
      // TODO: handle error messages
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setUser(userCredential.user);
      console.log(`successful login with username: ${userCredential.user.email}`);

      // TODO: add a redirect
    } catch (error) {
      // TODO: handle error messages
      console.log(error.message);
    }
  };

  const logout = async () => {
    try {
      console.log(`logging out: ${auth.currentUser?.email}`);
      await signOut(auth);
      console.log(`logout successful`);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main // TODO: style this better
      style={{
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {!registerFlag ? <h1>Log in to Maestro</h1> : <h1>Register for Maestro</h1>}
      {auth.currentUser == null ? (
        <h3>You are not logged in.</h3>
      ) : (
        <h3>Logged in as user: {auth.currentUser?.email}</h3>
      )}
      <input
        type='email'
        className='login'
        placeholder='Email'
        onChange={(e) => {
          setLoginEmail(e.target.value);
        }}
      />
      <input
        type='password'
        className='login'
        placeholder='Password'
        id='pass'
        onChange={(e) => {
          setLoginPassword(e.target.value);
        }}
      />
      {registerFlag ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <input
            type='password'
            className='login'
            placeholder='Confirm Password'
            id='confPass'
            onChange={(e) => {
              if (e.target.value !== loginPassword) {
                setPassMatch(false);
              } else {
                console.log('passwords match');
                setPassMatch(true);
              }
            }}
          />
          <p>
            Passwords must be at least eight characters long, include an uppercase and lowercase letter, and a number.
          </p>

          {!passMatch ? (
            <div className='registError' style={{ color: 'red' }}>
              Passwords must match.
            </div>
          ) : (
            <div />
          )}
          {!validEmail ? (
            <div className='registError' style={{ color: 'red' }}>
              Please enter a valid email address.
            </div>
          ) : (
            <div />
          )}
          {!validPassword ? (
            <div className='registError' style={{ color: 'red' }}>
              Please enter a valid password.
            </div>
          ) : (
            <div />
          )}
        </div>
      ) : (
        <div />
      )}

      {!registerFlag ? (
        <div>
          <button onClick={login}> Login </button>
          <button onClick={() => setRegisterFlag(true)}> New User? Register </button>
        </div>
      ) : (
        <div>
          <button onClick={register}> Create Account </button>
          <button onClick={() => setRegisterFlag(false)}> Already have an account? Log in </button>
        </div>
      )}
      <div>
        <button onClick={logout}> Log out </button>
      </div>
    </main>
  );
};

export default signInScreen;
