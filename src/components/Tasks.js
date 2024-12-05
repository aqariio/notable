import "./Tasks.css";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./Firebase";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: "homework",
        description: "do homework",
        status: 50,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched tasks: ", tasksArray); // Debugging statement
      setTasks(tasksArray);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
      <Box className="tasks">
        <p className="task">
          {tasks.map((task) => (
            <a key={task.id}>
              {task.title + " | "}
              {task.description + " | "}
              {parseStatus(task.status)}
            </a>
          ))}
        </p>
      </Box>
      <button className="button" onClick={addData}>
        +
      </button>
    </Box>
  );
}

function parseStatus(status) {
  return Math.min(Math.max(0, status), 100) + "% complete";
}

export default Tasks;
