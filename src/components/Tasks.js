import "./Tasks.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Box } from "@mui/joy";

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

function Tasks() {
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
      }}
      className="homeTextContainer"
    >
      <h1 className="title">Tasks</h1>
      <button className="button" onClick={addData}>
        Get Tasks
      </button>
    </Box>
  );
}

export default Tasks;
