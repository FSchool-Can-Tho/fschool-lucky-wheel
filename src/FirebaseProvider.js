import React, { createContext } from "react";
import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAYJURBkcYTmZQRhNXQ-1lFejouD4tlugc",
  authDomain: "fschool-spin.firebaseapp.com",
  databaseURL: "https://fschool-spin.firebaseio.com",
  projectId: "fschool-spin",
  storageBucket: "fschool-spin.appspot.com",
  messagingSenderId: "531575938935",
  appId: "1:531575938935:web:0f17a3da02e96803984b72",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

export const FirebaseContext = createContext({ db });

function FirebaseProvider({ children }) {
  return (
    <FirebaseContext.Provider
      value={{ db, serverValue: firebase.database.ServerValue }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseProvider;
