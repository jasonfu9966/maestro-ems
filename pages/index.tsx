import Head from 'next/head';
import {Navbar} from '../components/Navbar';
import styles from '../styles/Home.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, setPersistence, browserLocalPersistence } from '@firebase/auth';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState('')


  return (
    <div>
      <Head>
        <title>Maestro</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <div>You aren't logged in.</div>
      {/* <div>You are logged in as </div> */}
      <div>'sup, world?</div>
    </div>
  );
}
