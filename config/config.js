//Banco de dados utilizado foi o Firebase.
import firebase from "firebase";
import 'firebase/database'
import 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
};

// Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export default firebase