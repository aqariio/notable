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
  getDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db, auth } from "./Firebase";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TodayIcon from "@mui/icons-material/Today";
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
import Slider from "@mui/material/Slider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Popover from "@mui/material/Popover";
import dayjs from "dayjs";

function parseStatus(status) {
  return Math.min(Math.max(0, status), 100) + "% complete";
}

function parsePriority(priority) {
  return "P" + Math.min(Math.max(0, priority), 4);
}

function Color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

function calculateColor(
  delta,
  startColor = new Color(0, 0, 0),
  endColor = new Color(0, 0, 0)
) {
  delta = Math.min(Math.max(0, delta), 1);

  const red = Math.floor(
    0.75 * Math.sqrt(lerp(startColor.r ** 2, endColor.r ** 2, delta))
  );
  const green = Math.floor(
    0.75 * Math.sqrt(lerp(startColor.g ** 2, endColor.g ** 2, delta))
  );
  const blue = Math.floor(
    0.75 * Math.sqrt(lerp(startColor.b ** 2, endColor.b ** 2, delta))
  );

  // Convert the red and green components to hexadecimal and pad with zeros if necessary
  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");
  const blueHex = blue.toString(16).padStart(2, "0");

  // Return the color in hexadecimal format
  return `#${redHex}${greenHex}${blueHex}`;
}

function lerp(a, b, delta) {
  return (1 - delta) * a + delta * b;
}

const statusMarks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

const priorityMarks = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
];

function TaskCard(props) {
  const { title, desc, date, status, priority, handleOpen } = props;

  return (
    <Card
      className={styles.card}
      sx={{
        backgroundColor: "#202020",
        borderColor: "#2B2B2B",
        borderWidth: 1.9,
        color: "#ffffff",
        maxHeight: 100,
        borderRadius: 8,
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
            {desc +
              " | " +
              parseStatus(status) +
              " | " +
              parsePriority(priority) +
              " | " +
              dayjs(date.toDate()).format("MMMM D, YYYY")}
          </Typography>
        </CardContent>
      </React.Fragment>
    </Card>
  );
}

TaskCard.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
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
    date,
    status,
    priority,
  } = props;

  const [completion, setCompletion] = React.useState(status);
  const [importance, setImportance] = React.useState(priority);
  const [dueDate, setDueDate] = React.useState(dayjs(date.toDate()));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCalendarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const calendarOpen = Boolean(anchorEl);
  const calId = calendarOpen ? "simple-popover" : undefined;

  useEffect(() => {
    if (open) {
      setCompletion(status);
      setImportance(priority);
      setDueDate(dayjs(date.toDate()).hour(23).minute(59).second(59).millisecond(999));
    }
  }, [open, status, priority, date]);

  const onCompletionChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setCompletion(newValue);
    }
  };

  const onImportanceChange = (event, newValue) => {
    if (typeof newValue === "number") {
      setImportance(invertImportance(newValue));
    }
  };

  const handleDelete = (id) => {
    deleteData(id);
    handleClose();
  };

  const invertImportance = (value) => {
    return 4 - value;
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
          dueDate.set("hour", 23);
          dueDate.set("minute", 59);
          dueDate.set("second", 59);
          dueDate.set("millisecond", 999);
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const title = formJson.title;
          const description = formJson.description;
          const date = Timestamp.fromDate(dueDate.toDate());
          const status = parseInt(completion);
          const priority = parseInt(importance);
          addData(id, title, description, date, status, priority);
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
          type="text"
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
          type="text"
          defaultValue={description}
          fullWidth
          variant="outlined"
        />
        <Typography
          gutterBottom
          sx={{
            marginTop: 2,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            color: "#aaaaaa",
          }}
        >
          {completion}% complete
        </Typography>
        <Slider
          aria-label="Completion"
          sx={{
            color: calculateColor(
              completion >= 50 ? (completion - 50) / 50 : completion / 50,
              completion >= 50 ? new Color(255, 191, 0) : new Color(255, 36, 0),
              completion >= 50 ? new Color(50, 205, 50) : new Color(255, 191, 0)
            ),
            "& .MuiSlider-track": {
              height: completion === 0 ? 0 : 14,
              marginLeft: "0.1rem !important",
              maxWidth: "99.6%",
              transition: "none",
            },
            "& .MuiSlider-thumb": {
              height: 0,
              width: 0,
              transition: "none",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#2b2b2b",
              border: "2px solid #505050",
              height: 16,
              transition: "none",
            },
            "& .MuiSlider-mark": {
              backgroundColor: "#505050",
              height: 8,
              width: 2,
              marginLeft: "0.13rem !important",
            },
            "& .MuiSlider-markLabel": {
              color: "#aaaaaa",
              fontSize: "12px",
            },
          }}
          defaultValue={status}
          valueLabelDisplay="off"
          onChange={onCompletionChange}
          marks={statusMarks}
          shiftStep={5}
          step={5}
          min={0}
          max={100}
        />
        <Typography
          gutterBottom
          sx={{
            marginTop: 2,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            color: "#aaaaaa",
          }}
        >
          Priority: P{importance}
        </Typography>
        <Slider
          aria-label="Priority"
          sx={{
            color: calculateColor(
              importance / 4,
              new Color(238, 75, 43),
              new Color(255, 191, 0)
            ),
            "& .MuiSlider-track": {
              height: importance === 4 ? 0 : 14,
              marginLeft: "0.1rem !important",
              maxWidth: "99.6%",
              transition: "none",
            },
            "& .MuiSlider-thumb": {
              height: 0,
              width: 0,
              transition: "none",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#2b2b2b",
              border: "2px solid #505050",
              height: 16,
              transition: "none",
            },
            "& .MuiSlider-mark": {
              backgroundColor: "#505050",
              height: 8,
              width: 2,
              marginLeft: "0.13rem !important",
            },
            "& .MuiSlider-markLabel": {
              color: "#aaaaaa",
              fontSize: "12px",
            },
          }}
          defaultValue={priority}
          value={invertImportance(importance)}
          valueLabelDisplay="off"
          onChange={onImportanceChange}
          marks={priorityMarks}
          shiftStep={1}
          step={1}
          min={0}
          max={4}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Typography
            gutterBottom
            sx={{
              marginTop: 2,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              textAlign: "left",
              alignItems: "flex-start !important",
              justifyContent: "flex-start !important",
              color: "#aaaaaa",
            }}
          >
            Due date: {dueDate.format("MMMM D, YYYY")}
          </Typography>
          <Button
            sx={{
              color: "#5798f7",
              alignSelf: "flex-end !important",
              textTransform: "none",
              display: "flex",
              gap: 1,
            }}
            onClick={handleCalendarClick}
          >
            <TodayIcon />
          </Button>
        </Box>
        <Popover
          id={calId}
          open={calendarOpen}
          anchorEl={anchorEl}
          onClose={handleCalendarClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              borderRadius: "10px",
              backgroundColor: "#2b2b2b",
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              sx={{
                backgroundColor: "#202020",
                border: "2px solid",
                borderColor: "#2B2B2B",
                borderRadius: "10px",
                color: "#aaaaaa",
                "& .MuiPickersDay-root": {
                  color: "#aaaaaa",
                  "&.Mui-selected": {
                    backgroundColor: "#505050",
                    color: "#aaaaaa",
                  },
                  "&:hover": {
                    backgroundColor: "#404040",
                  },
                },
                "& .MuiPickersDay-dayOutsideMonth": {
                  color: "#404040",
                },
                "& .MuiPickersCalendarHeader-root": {
                  backgroundColor: "#202020",
                  color: "#aaaaaa",
                },
                "& .MuiPickersYear-yearButton": {
                  color: "#808080",
                  "&.Mui-selected": {
                    backgroundColor: "#202020",
                    color: "#aaaaaa",
                  },
                },
                "& .MuiPickersCalendarHeader-label": {
                  color: "#aaaaaa",
                },
                "& .MuiPickersArrowSwitcher-button": {
                  color: "#aaaaaa",
                  "&:hover": {
                    backgroundColor: "#404040",
                  },
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  color: "#808080",
                },
              }}
              views={["day"]}
              value={dueDate}
              onChange={(value) => setDueDate(value)}
            />
          </LocalizationProvider>
        </Popover>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: deleteData ? "space-between" : "flex-end",
        }}
      >
        {deleteData && (
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
  handleDelete: PropTypes.func,
  open: PropTypes.bool.isRequired,
  addData: PropTypes.func.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.object,
  status: PropTypes.number,
  priority: PropTypes.number,
};

export default function Tasks() {
  const [addOpen, setAddOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState({
    id: null,
    title: "",
    description: "",
    date: Timestamp.fromDate(new Date()),
    status: "",
    priority: "",
  });

  const handleOpenAdd = () => {
    setAddOpen(true);
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
  };

  const handleOpenEdit = (task) => {
    setCurrentTask(task);
  };

  const handleCloseEdit = () => {
    setCurrentTask({
      id: null,
      title: "",
      description: "",
      date: Timestamp.fromDate(new Date()),
      status: "",
      priority: "",
    });
  };

  const [tasks, setTasks] = useState([]);

  const sortTasks = (arr) => {
    arr.sort((a, b) => {
      const dateA = dayjs(a.date.toDate());
      const dateB = dayjs(b.date.toDate());

      // Reciprocal of the time difference in milliseconds
      let weightA = 1 / (dateA.toDate().getTime() - new Date().getTime());
      let weightB = 1 / (dateB.toDate().getTime() - new Date().getTime());

      // 100% = 0, 50% = 0.5, 0% = 1
      weightA *= Math.abs(100 - a.status) / 100;
      weightB *= Math.abs(100 - b.status) / 100;

      // P0 = 1, P1 = 0.75, P2 = 0.5, P3 = 0.25, P4 = 0
      weightA *= Math.abs(4 - a.priority) / 4;
      weightB *= Math.abs(4 - b.priority) / 4;

      // Invert the weight if the task is overdue, so its always larger
      if (weightA < 0) {
        weightA = -1 / weightA;
      }
      if (weightB < 0) {
        weightB = -1 / weightB;
      }

      console.log("-------------------")
      console.log(a.title, weightA);
      console.log(b.title, weightB);
      console.log("signum", Math.sign(weightA - weightB));

      return weightB - weightA;
    });
  };

  const addData = async (id, title, description, date, status, priority) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, `userdata/${user.uid}/tasks`),
        {
          title: title,
          description: description,
          date: date,
          status: status,
          priority: priority,
        }
      );
      getData();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getData = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const querySnapshot = await getDocs(
        collection(db, `userdata/${user.uid}/tasks`)
      );
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({ id: doc.id, ...doc.data() });
      });
      sortTasks(tasksArray);
      setTasks(tasksArray);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  const editData = async (id, title, description, date, status, priority) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const taskDoc = doc(db, `userdata/${user.uid}/tasks`, id);
      await updateDoc(taskDoc, {
        title: title,
        description: description,
        date: date,
        status: status,
        priority: priority,
      });
      getData();
      console.log("Document updated with ID: ", id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteData = async (id) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      await deleteDoc(doc(db, `userdata/${user.uid}/tasks`, id));
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
              date={task.date}
              status={task.status}
              priority={task.priority}
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
        title=""
        description=""
        date={dayjs()}
        status={0}
        priority={4}
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
        date={currentTask.date}
        status={currentTask.status}
        priority={currentTask.priority}
        open={currentTask.id !== null}
        handleClose={handleCloseEdit}
        deleteData={() => deleteData(currentTask.id)}
        addData={editData}
      />
    </Box>
  );
}
