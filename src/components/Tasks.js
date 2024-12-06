import styles from "./Tasks.module.css";
import * as React from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./Firebase";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const card = (title, desc, status) => (
  <React.Fragment>
    <CardContent className={styles.tasks}>
      <Typography className={styles.title}>{title}</Typography>
      <Typography className={styles.description}>
        {desc + " | " + status}
      </Typography>
    </CardContent>
  </React.Fragment>
);

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: "amongus",
        description: "bottom text",
        status: 69,
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
      setTasks(tasksArray);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  useEffect(() => {
    getData();
    console.log("tasks", tasks);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
      }}
      className={styles.homeTextContainer}
    >
      <h1 className={styles.header}>Tasks</h1>
      <Box className={styles.tasks}>
        {tasks.map((task) => (
          <Box key={task.id}>
            <Card
              className={styles.card}
              sx={{
                backgroundColor: "#202020",
                borderColor: "#2B2B2B",
                borderWidth: 1.9,
                color: "#ffffff",
                maxWidth: 600,
                minWidth: 600,
                maxHeight: 100,
                borderRadius: 10,
                boxShadow: 5,
                textAlign: "left",
              }}
              variant="outlined"
              raised={true}
            >
              {card(task.title, task.description, parseStatus(task.status))}
            </Card>
          </Box>
        ))}
      </Box>
      <Box sx={{ marginBottom: 20 }} />
      <Fab
        className={styles.button}
        color="primary"
        aria-label="add-task"
        onClick={addData}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

function parseStatus(status) {
  return Math.min(Math.max(0, status), 100) + "% complete";
}

export default Tasks;
