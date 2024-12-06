import styles from "./Tasks.module.css";
import * as React from "react";
import PropTypes from "prop-types";
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
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";

function parseStatus(status) {
  return Math.min(Math.max(0, status), 100) + "% complete";
}

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

function TaskDialog(props) {
  const { onClose, open, addData } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#191919",
          color: "#ffffff",
          borderRadius: 5,
          width: 600,
          borderWidth: "0.2vmin",
          borderColor: "#2B2B2B",
          borderStyle: "solid",
        },
      }}
      onClose={handleClose}
      open={open}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const title = formJson.title;
          const description = formJson.description;
          const status = formJson.status;
          addData(title, description, parseInt(status));
          handleClose();
        },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>Add new task</DialogTitle>
      <DialogContent>
        <TextField
          sx={{
            color: "#aaaaaa !important",
            borderRadius: "50px",
            boxShadow: 5,
            backgroundColor: "#202020",
            "& .MuiInputBase-input": {
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              color: "#aaaaaa !important",
            },
            "& .MuiInputLabel-root": {
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              color: "#aaaaaa !important",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#2B2B2B",
                borderWidth: "2px",
                borderRadius: "50px",
              },
              "&:hover fieldset": {
                borderColor: "#404040",
                borderWidth: "2px",
                borderRadius: "50px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#505050",
                borderWidth: "2px",
                borderRadius: "50px",
              },
            },
          }}
          autoFocus
          required
          margin="dense"
          id="title"
          name="title"
          label="Title"
          type="title"
          fullWidth
          variant="outlined"
        />
        <TextField
          sx={{
            color: "#aaaaaa !important",
            borderRadius: "50px",
            boxShadow: 5,
            backgroundColor: "#202020",
            "& .MuiInputBase-input": {
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              color: "#aaaaaa !important",
            },
            "& .MuiInputLabel-root": {
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              color: "#aaaaaa !important",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#2B2B2B",
                borderWidth: "2px",
                borderRadius: "50px",
              },
              "&:hover fieldset": {
                borderColor: "#404040",
                borderWidth: "2px",
                borderRadius: "50px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#505050",
                borderWidth: "2px",
                borderRadius: "50px",
              },
            },
          }}
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="descripotion"
          fullWidth
          variant="outlined"
        />
        <TextField
          sx={{
            color: "#aaaaaa !important",
            borderRadius: "50px",
            boxShadow: 5,
            backgroundColor: "#202020",
            "& .MuiInputBase-input": {
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              color: "#aaaaaa !important",
            },
            "& .MuiInputLabel-root": {
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              color: "#aaaaaa !important",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#2B2B2B",
                borderWidth: "2px",
                borderRadius: "50px",
              },
              "&:hover fieldset": {
                borderColor: "#404040",
                borderWidth: "2px",
                borderRadius: "50px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#505050",
                borderWidth: "2px",
                borderRadius: "50px",
              },
            },
          }}
          required
          margin="dense"
          id="status"
          name="status"
          label="Status"
          type="status"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            textTransform: "none",
            color: "#aaaaaa",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
          }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          sx={{
            textTransform: "none",
            color: "#5798f7",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
          }}
          type="submit"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TaskDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default function Tasks() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [tasks, setTasks] = useState([]);

  const addData = async (title, description, status) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: title,
        description: description,
        status: status,
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
      <Typography className={styles.header}>Tasks</Typography>
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
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <TaskDialog open={open} onClose={handleClose} addData={addData} />
    </Box>
  );
}
