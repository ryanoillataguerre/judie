import * as firebase from "firebase-admin";
const { initializeApp } = firebase;
import { Environment, getEnv } from "./env.js";
import json from "./firebase-local-auth.json";

const getFirebaseConfig = () => {
  const config: firebase.AppOptions = {};
  const env = getEnv();
  if (env === Environment.Local || env === Environment.Test) {
    config.credential = firebase.credential.cert(
      JSON.stringify(json) || (process.env.FIREBASE_LOCAL_AUTH as string)
    );
    config.databaseURL = "https://sandbox-382905.firebaseio.com";
  }
  // If deployed, no auth is needed - env var GOOGLE_CLOUD_PROJECT is set and VPC works correctly
  return config;
};

const firebaseApp = initializeApp(getFirebaseConfig());

export default firebaseApp;
