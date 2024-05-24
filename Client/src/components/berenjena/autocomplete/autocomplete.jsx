import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import style from "./autocomplete.module.css";

export default function AutocompleteExample() {
  const [selectedRoom, setSelectedRoom] = React.useState("");
  const [selectedPlayer, setSelectedPlayer] = React.useState("");
  const [roomNumber, setRoomNumber] = React.useState(null); 

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  const handleRoomNumberChange = (event, newValue) => {
    setRoomNumber(newValue);
  };

  const roomOptions = ["Room 101", "Room 102", "Room 103", "Room 104"];

  return (
    <div className={style.container}>
      <FormControl
        sx={{ m: 1, minWidth: 120, backgroundColor: "white" }}
        size="small"
      >
        <InputLabel
          id="room-select-label"
          sx={{
            backgroundColor: "white",
            paddingInline: "3px",
            borderRadius: "3px",
          }}
        >
          Rooms
        </InputLabel>
        <Select
          labelId="room-select-label"
          id="room-select"
          value={selectedRoom}
          onChange={handleRoomChange}
        >

          <MenuItem value="room">All</MenuItem>
          <MenuItem value="room1">Open</MenuItem>
          <MenuItem value="room2">In progress</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        sx={{ m: 1, minWidth: 120, backgroundColor: "white" }}
        size="small"
      >
        <InputLabel
          id="player-select-label"
          sx={{
            backgroundColor: "white",
            paddingInline: "3px",
            borderRadius: "3px",
          }}
        >
          Players
        </InputLabel>
        <Select
          labelId="player-select-label"
          id="player-select"
          value={selectedPlayer}
          onChange={handlePlayerChange}
        >
          {[...Array(5)].map((_, index) => (
            <MenuItem key={index} value={index + 2}>
              {index + 2}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete
        sx={{ m: 1, minWidth: 150, backgroundColor: "white" }}
        size="small"
        options={roomOptions}
        value={roomNumber}
        onChange={handleRoomNumberChange}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="N° Room"
            variant="outlined"
            size="small"
            InputLabelProps={{
              sx: {
                backgroundColor: "white",
                paddingInline: "3px",
                borderRadius: "3px",
              },
            }}
          />
        )}
      />
    </div>
  );
}
