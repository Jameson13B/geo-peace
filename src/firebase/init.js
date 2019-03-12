import firebase from "firebase";
import firestore from "firebase/firestore";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAcTpRuFDC_kmi3W-qI1nq87N1JzKdQRgs",
  authDomain: "geo-peace.firebaseapp.com",
  databaseURL: "https://geo-peace.firebaseio.com",
  projectId: "geo-peace",
  storageBucket: "",
  messagingSenderId: "309432790022"
};
const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore();
