// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

import * as dotenv from "dotenv"
dotenv.config()
// const
export default { 
firebaseConfig : {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET ,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.API_ID
},
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig);


// All firebsae link is bellow

// Import the functions you need from the SDKs you need
// -------import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// ---const firebaseConfig = {
//   apiKey: "AIzaSyCwP9iHqKF58Zq68sr5rjqGQsKGeF0OzWs",
//   authDomain: "social-media-app-4de05.firebaseapp.com",
//   projectId: "social-media-app-4de05",
//   storageBucket: "social-media-app-4de05.appspot.com",
//   messagingSenderId: "615185032261",
//   appId: "1:615185032261:web:eccc50044e59974effaf2c"
// };

// Initialize Firebase
// -----const app = initializeApp(firebaseConfig);