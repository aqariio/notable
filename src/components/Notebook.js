import "./Notebook.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Notebook() {
  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "newcollection"), {
        field: "amongus",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div className="notebook">
      <header className="header">
        <p>Notebook</p>
      </header>
      <textarea id="doc" className="doc" type="text" onInput={resize}/>
    </div>
  );
}

function resize(e) {
  e.target.style.height = 'inherit';
  e.target.style.height = `calc(${e.target.scrollHeight}px)`;
}

export default Notebook;
