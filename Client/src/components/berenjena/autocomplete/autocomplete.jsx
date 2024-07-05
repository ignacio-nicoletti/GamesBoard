import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import style from './autocomplete.module.css';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

export default function AutocompleteExample({roomsInfo, onFilter}) {
  const [selectedRoom, setSelectedRoom] = React.useState ('all');
  const [selectedPlayer, setSelectedPlayer] = React.useState ('');
  const [roomNumber, setRoomNumber] = React.useState (null);

  React.useEffect (
    () => {
      filterRooms ();
    },
    [selectedRoom, selectedPlayer, roomNumber]
  );

  const handleRoomChange = event => {
    setSelectedRoom (event.target.value);
  };

  const handlePlayerChange = event => {
    setSelectedPlayer (event.target.value);
  };

  const handleRoomNumberChange = (event, newValue) => {
    setRoomNumber (newValue);
  };

  const filterRooms = () => {
    let filtered = roomsInfo;

    if (selectedRoom !== 'all') {
      if (selectedRoom === 'open') {
        filtered = filtered.filter (room => room.users.length < room.maxUser);
      } else if (selectedRoom === 'inProgress') {
        filtered = filtered.filter (room => room.users.length >= room.maxUser);
      }
    }

    if (selectedPlayer) {
      filtered = filtered.filter (
        room => room.users.length === Number (selectedPlayer)
      );
    }

    if (roomNumber && roomNumber.value) {
      filtered = filtered.filter (room =>
        room.roomId.toString ().includes (roomNumber.value.toString ())
      );
    }
    if (filtered) {
      onFilter (filtered);
    } else {
      onFilter (roomsInfo);
    }
  };

  const handleClearFilters = () => {
    setSelectedRoom ('all');
    setSelectedPlayer ('');
    setRoomNumber (null);
    onFilter (roomsInfo);
  };

  const roomOptions = roomsInfo.map (room => ({
    label: `Room ${room.roomId}`,
    value: room.roomId,
  }));

  React.useEffect (
    () => {
      filterRooms ();
    },
    [selectedRoom, selectedPlayer, roomNumber]
  );

  return (
    <div className={style.container}>
      <FormControl
        sx={{m: 1, minWidth: 120, backgroundColor: 'white'}}
        size="small"
      >
        <InputLabel
          id="room-select-label"
          sx={{
            backgroundColor: 'white',
            paddingInline: '3px',
            borderRadius: '3px',
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
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="inProgress">In progress</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        sx={{m: 1, minWidth: 120, backgroundColor: 'white'}}
        size="small"
      >
        <InputLabel
          id="player-select-label"
          sx={{
            backgroundColor: 'white',
            paddingInline: '3px',
            borderRadius: '3px',
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
          {[...Array (5)].map ((_, index) => (
            <MenuItem key={index} value={index + 2}>
              {index + 2}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete
        sx={{m: 1, minWidth: 150, backgroundColor: 'white'}}
        size="small"
        options={roomOptions}
        value={roomNumber}
        onChange={handleRoomNumberChange}
        freeSolo
        renderInput={params => (
          <TextField
            {...params}
            label="N° Room"
            variant="outlined"
            size="small"
            InputLabelProps={{
              sx: {
                backgroundColor: 'white',
                paddingInline: '3px',
                borderRadius: '3px',
              },
            }}
          />
        )}
      />
      <button
        className={style.clearFiltersBtn}
        variant="outlined"
        onClick={handleClearFilters}
      >
        <FilterAltOffIcon />
      </button>
    </div>
  );
}
