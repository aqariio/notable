import styles from "./Tasks.module.css";
import * as React from "react";
import PropTypes from "prop-types";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./Firebase";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";

function parseStatus(status) {
  return Math.min(Math.max(0, status), 100) + "% complete";
}

function TaskCard(props) {
  const { title, desc, status, handleOpen } = props;

  return (
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
      <React.Fragment>
        <CardContent onClick={handleOpen} className={styles.tasks}>
          <Typography className={styles.title}>{title}</Typography>
          <Typography className={styles.description}>
            {desc + " | " + parseStatus(status)}
          </Typography>
        </CardContent>
      </React.Fragment>
    </Card>
  );
}

TaskCard.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  handleOpen: PropTypes.func.isRequired,
};

function TaskDialog(props) {
  const {
    header,
    confirmButton,
    open,
    handleClose,
    deleteData,
    addData,
    id,
    title,
    description,
    status,
  } = props;

  const handleDelete = (id) => {
    deleteData(id);
    handleClose();
  }

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
          addData(id, title, description, parseInt(status));
          handleClose();
        },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>{header}</DialogTitle>
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
          defaultValue={title}
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
          defaultValue={description}
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
          defaultValue={status}
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: handleDelete ? "space-between" : "flex-end",
        }}
      >
        {handleDelete && (
          <Button
            sx={{
              textTransform: "none",
              color: "#dd5050",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              alignSelf: "flex-start !important",
            }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
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
            {confirmButton}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

TaskDialog.propTypes = {
  header: PropTypes.string.isRequired,
  confirmButton: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  addData: PropTypes.func.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.number,
};

export default function Tasks() {
  const [addOpen, setAddOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState({
    id: null,
    title: "",
    description: "",
    status: "",
  });

  const handleOpenAdd = () => {
    setAddOpen(true);
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
  };

  const handleOpenEdit = (task) => {
    console.log("task", task);
    setCurrentTask(task);
    console.log("current task", currentTask);
  };

  const handleCloseEdit = () => {
    setCurrentTask({
      id: null,
      title: "",
      description: "",
      status: "",
    });
  };

  const [tasks, setTasks] = useState([]);

  const addData = async (id, title, description, status) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: title,
        description: description,
        status: status,
      });
      getData();
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

  const editData = async (id, title, description, status) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, {
        title: title,
        description: description,
        status: status,
      });
      getData();
      console.log("Document updated with ID: ", id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      console.log("Document deleted with ID: ", id);
      getData();
    } catch (e) {
      console.error("Error deleting document: ", e);
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
        justifyItems: "center",
      }}
      className={styles.homeTextContainer}
    >
      <Typography className={styles.header}>Tasks</Typography>
      <Box className={styles.tasks}>
        {tasks.map((task) => (
          <Box key={task.id}>
            <TaskCard
              title={task.title}
              desc={task.description}
              status={task.status}
              handleOpen={() => handleOpenEdit(task)}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ marginBottom: 20 }} />
      <Fab
        className={styles.button}
        color="primary"
        aria-label="add-task"
        onClick={handleOpenAdd}
      >
        <AddIcon />
      </Fab>
      <TaskDialog
        header="Add new task"
        confirmButton="Create"
        open={addOpen}
        handleClose={handleCloseAdd}
        addData={addData}
      />
      <TaskDialog
        header="Edit task"
        confirmButton="Save"
        id={currentTask.id}
        title={currentTask.title}
        description={currentTask.description}
        status={currentTask.status}
        open={currentTask.id !== null}
        handleClose={handleCloseEdit}
        deleteData={() => deleteData(currentTask.id)}
        addData={editData}
      />
    </Box>
  );
}
