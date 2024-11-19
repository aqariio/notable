import logo from './logo.svg';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  // apiKey: process.env.API_KEY,
  // authDomain: process.env.AUTH_DOMAIN,
  // projectId: process.env.PROJECT_ID,
  // storageBucket: process.env.STORAGE_BUCKET,
  // messagingSenderId: process.env.SENDER_ID,
  // appId: process.env.APP_ID
  apiKey: "AIzaSyAjzwfnycL-s4HAZopwD9tJSH72q-4POE0",
  authDomain: "notable-max.firebaseapp.com",
  projectId: "notable-max",
  storageBucket: "notable-max.firebasestorage.app",
  messagingSenderId: "916202186075",
  appId: "1:916202186075:web:870f31559bb5e2e5eae67e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "newcollection"), {
        field: "amongus"
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          I sure love learning react
        </p>
        <button
          className="App-link"
          onClick={addData}
        >
          Add Data Among Us
        </button>
      </header>
    </div>
  );
}

export default App;
