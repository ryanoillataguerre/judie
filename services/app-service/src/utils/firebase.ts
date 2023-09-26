import firebase, { initializeApp } from "firebase-admin";
import { Environment, getEnv } from "./env.js";

const getFirebaseConfig = () => {
  const config: firebase.AppOptions = {};
  const env = getEnv();
  if (env === Environment.Local) {
    config.credential = firebase.credential.cert(
      require("./firebase-local-auth.json")
    );
    config.databaseURL = "https://sandbox-382905.firebaseio.com";
  }
  // If deployed, no auth is needed - env var GOOGLE_CLOUD_PROJECT is set and VPC works correctly
  return config;
};

const firebaseApp = initializeApp(getFirebaseConfig());

export default firebaseApp;
