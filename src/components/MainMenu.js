import './MainMenu.css';
import { Box } from "@mui/joy";

function MainMenu() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          justifyItems: "center",
        }}
        className="homeTextContainer"
      >
        <h1 className="title">
          Welcome to Notable
        </h1>
        <h1 className="description">
          You can add tasks, set reminders and take notes, all in one place!
        </h1>
        {/* <img src="logo.svg" className="logo" /> */}
      </Box>
    </>
  );
}

export default MainMenu;
