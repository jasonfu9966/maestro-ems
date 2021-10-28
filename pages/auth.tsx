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
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import * as yup from 'yup';

// To be used in more depth later
const yupSchema = yup.object().shape({
  email: yup.string().email().required(),
});

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
const FirebaseApp = initializeApp(firebaseConfig);
const Auth = getAuth(FirebaseApp);

export const SignInScreen = () => {
  const [registerFlag, setRegisterFlag] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [passMatch, setPassMatch] = useState(true);
  const [user, setUser] = useState({});

  onAuthStateChanged(Auth, (user) => {
    if (user !== null) {
      setUser(user);
      console.log(`logged in as ${Auth.currentUser.email}`);
    } else {
      console.log(`Not logged in: ${user}`);
    }
  });

  const Register = async () => {
    yupSchema.isValid({ email: loginEmail }).then((valid) => {
      if (!valid) {
        console.log('invalid email');
        setValidEmail(false);
        return;
      } else {
        setValidEmail(true);
      }
    });

    // TODO: do this on the Firebase side (implement with error handling)
    const passwordCheck = new RegExp('^(?=.*[a-z]){1}(?=.*[A-Z]){1}(?=.*[0-9]){1}(?=.{8,})');
    if (!passwordCheck.test(loginPassword)) {
      console.log('invalid password');
      setValidPassword(false);
      return;
    } else {
      setValidPassword(true);
    }

    if (!passMatch) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(Auth, loginEmail, loginPassword);
      setUser(userCredential.user);
      console.log(`user created: ${userCredential.user.email}`);

      // TODO: add a redirect
    } catch (error) {
      // TODO: handle error messages
      console.log(error.message);
    }
  };

  const Login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(Auth, loginEmail, loginPassword);
      setUser(userCredential.user);
      console.log(`successful login with username: ${userCredential.user.email}`);

      // TODO: add a redirect
    } catch (error) {
      // TODO: handle error messages
      console.log(error.message);
    }
  };

  const Logout = async () => {
    try {
      console.log(`logging out: ${Auth.currentUser?.email}`);
      await signOut(Auth);
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
      {Auth.currentUser == null ? (
        <h3>You are not logged in.</h3>
      ) : (
        <h3>Logged in as user: {Auth.currentUser?.email}</h3>
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

          <div className={styles.registError}>
            {!passMatch ? `Passwords must match. ` : ``}
            {!validEmail ? `Please enter a valid email address. ` : ``}
            {!validPassword ? `Please enter a valid password.` : ``}
          </div>
        </div>
      ) : (
        <div />
      )}

      {!registerFlag ? (
        <div>
          <button onClick={Login}> Login </button>
          <button onClick={() => setRegisterFlag(true)}> New User? Register </button>
        </div>
      ) : (
        <div>
          <button onClick={Register}> Create Account </button>
          <button onClick={() => setRegisterFlag(false)}> Already have an account? Log in </button>
        </div>
      )}
      <div>
        <button onClick={Logout}> Log out </button>
      </div>
    </main>
  );
};

export default SignInScreen;
