import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import style from './joinRoom.module.css';
import {
  getAllRoomsInfo,
  CreateGameRoom,
  socket,
  joinGameRoom,
} from '../../../functions/SocketIO/sockets/sockets';
import avatar1 from '../../../assets/berenjena/jugadores/avatar1.png';
import avatar2 from '../../../assets/berenjena/jugadores/avatar2.png';
import avatar3 from '../../../assets/berenjena/jugadores/avatar3.png';
import avatar4 from '../../../assets/berenjena/jugadores/avatar4.png';
import avatar5 from '../../../assets/berenjena/jugadores/avatar5.png';
import avatar6 from '../../../assets/berenjena/jugadores/avatar6.png';
import imgRoom from '../../../assets/berenjena/jugadores/imgRoom.png';
import logoBerenjena from '../../../assets/berenjena/home/logoBerenjena.png';
import AutocompleteExample
  from '../../../components/berenjena/autocomplete/autocomplete';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';

const JoinRoom = () => {
  const [rooms, setRooms] = useState ([]);
  const [filteredRooms, setFilteredRooms] = useState ([]);
  const [game, setGame] = useState ('Berenjena');
  const [userName, setUserName] = useState ('');
  const [roomId, setRoomId] = useState ('');
  const [tempMaxUsers, setTempMaxUsers] = useState ('');
  const [error, setError] = useState ('');
  const [maxUsers, setMaxUsers] = useState (6);
  const [selectedAvatar, setSelectedAvatar] = useState ('avatar1');
  const [showModal, setShowModal] = useState (true);
  const navigate = useNavigate ();

  const CreateRoom = async e => {
    e.preventDefault ();
    try {
      if (roomId !== '' && userName !== '') {
        await CreateGameRoom (game, roomId, userName, maxUsers, selectedAvatar);
        navigate (`/berenjena/multiplayer/${roomId}`);
      }
    } catch (error) {
      Swal.fire ({
        title: 'Error!',
        text: error || 'An error occurred while creating the room.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal2-container',
        },
      });
    }
  };

  const handlerJoinRoom = async roomId => {
    try {
      if (roomId !== '' && userName !== '') {
        await joinGameRoom (game, roomId, userName, selectedAvatar);
        navigate (`/berenjena/multiplayer/${roomId}`);
      }
    } catch (error) {
      console.error (error);
      Swal.fire ({
        title: 'Error!',
        text: error || 'Room is full.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal2-container',
        },
      });
    }
  };

  useEffect (
    () => {
      const initializeSocket = async () => {
        const roomsInfo = await getAllRoomsInfo (game);
        setRooms (roomsInfo);
        setFilteredRooms (roomsInfo);
      };
      initializeSocket ();
    },
    [game]
  );

  useEffect (
    () => {
      const handlePlayerList = playerList => {
        navigate (`/berenjena/multiplayer/${playerList.round.roomId}`);
      };
      socket.on ('player_list', handlePlayerList);
      return () => {
        socket.off ('player_list', handlePlayerList);
      };
    },
    [navigate]
  );

  useEffect (
    () => {
      const handleRoomJoined = data => {
        navigate (`/berenjena/multiplayer/${data.round.roomId}`);
      };
      socket.on ('room_joined', handleRoomJoined);
      return () => {
        socket.off ('room_joined', handleRoomJoined);
      };
    },
    [navigate]
  );

  useEffect (() => {
    const handleRoomCreationError = data => {
      Swal.fire ({
        title: 'Error!',
        text: data.message || 'An error occurred while creating the room.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal2-container',
        },
      });
      console.log (data);
    };
    socket.on ('room_creation_error', handleRoomCreationError);
    return () => {
      socket.off ('room_creation_error', handleRoomCreationError);
    };
  }, []);

  useEffect (() => {
    const handleRoomJoinError = data => {
      Swal.fire ({
        title: 'Error!',
        text: data.error || 'Room is full.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal2-container',
        },
      });
    };
    socket.on ('room_join_error', handleRoomJoinError);
    return () => {
      socket.off ('room_join_error', handleRoomJoinError);
    };
  }, []);

  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

  const handleSubmit = () => {
    if (userName && selectedAvatar) {
      setShowModal (false);
    } else {
      Swal.fire ({
        title: 'Error!',
        text: 'Please enter your name and select an avatar to continue.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal2-container',
        },
      });
    }
  };

  const handleEditProfile = () => {
    setShowModal (true);
  };

  const handleChange = e => {
    const value = e.target.value;
    if (['2', '3', '4', '5', '6'].includes (value)) {
      setTempMaxUsers (value);
      setError ('');
    } else {
      setTempMaxUsers ('');
      setError ('Please enter a value between 2 and 6');
    }
  };

  const handleBlur = e => {
    const value = parseInt (e.target.value, 10);
    if (isNaN (value) || value < 2 || value > 6) {
      setError ('Please enter a value between 2 and 6');
    } else {
      setMaxUsers (value);
      setError ('');
    }
  };

  const handleFilter = filteredRooms => {
    setFilteredRooms (filteredRooms);
  };

  return (
    <div className={style.containRoom}>
      {showModal &&
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <div className={style.modalContent}>
              <h2>Enter your name and choose an avatar</h2>
              <div className={style.DivName}>
                <span>Name: </span>
                <input
                  type="text"
                  placeholder="Type your name here..."
                  value={userName}
                  onChange={e => setUserName (e.target.value)}
                  maxLength={15}
                />
              </div>
              <div className={style.DivAvatars}>
                <p>Choose your Avatar</p>
                <div className={style.DivAvatarsGrid}>
                  {avatars.map ((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className={
                        selectedAvatar === `avatar${index + 1}`
                          ? style.selectedAvatar
                          : ''
                      }
                      onClick={() => setSelectedAvatar (`avatar${index + 1}`)}
                    />
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>}
      {!showModal &&
        <>
          <div className={style.sideBar}>
            <div className={style.DivButtonBack}>
              <Link to="/berenjena">Back to menu</Link>
            </div>
            <div className={style.profile}>
              <img
                src={
                  avatars[
                    parseInt (selectedAvatar.replace ('avatar', ''), 10) - 1
                  ]
                }
                alt="Selected Avatar"
                className={style.profileAvatar}
              />
              <span className={style.userName}>{userName}</span>
              <button className={style.editIcon} onClick={handleEditProfile}>
                <EditIcon />
              </button>
            </div>
            <div className={style.DivInputRoom}>
              <span>Create a new room: </span>
              <input
                type="number"
                placeholder="room number... "
                value={roomId}
                onChange={e => setRoomId (e.target.value)}
                className={style.inputPlaceholder}
              />
              <input
                type="text"
                placeholder="players: 2 to 6..."
                value={tempMaxUsers}
                onChange={handleChange}
                onBlur={handleBlur}
                min={2}
                max={6}
                className={style.inputPlaceholder}
              />
              {error &&
                <div className={style.errorMsgContainer}>
                  <p className={style.errorMsg}>{error}</p>
                </div>}
              <button className={style.createButton} onClick={CreateRoom}>
                Create
              </button>
            </div>
          </div>

          <div className={style.DivRooms}>
            <div className={style.autocomplete}>
              <div className={style.logoContainer}>
                <img
                  src={logoBerenjena}
                  alt=""
                  className={style.logoBerenjena}
                />
              </div>
              <div>
                <AutocompleteExample
                  roomsInfo={rooms}
                  onFilter={handleFilter}
                />
              </div>
            </div>
            <div className={style.roomsContainer}>
              {filteredRooms.map (el => (
                <div key={el.roomId} className={style.DivRoom}>
                  <div className={style.textRoom}>
                    <p>Room {el.roomId}</p>

                    <p className={style.groupIcon}>
                      <GroupIcon />
                      {el.users.length}/{el.maxUsers || 6}
                    </p>
                  </div>
                  <img src={imgRoom} alt="" className={style.imgRoom} />
                  <button
                    onClick={() => {
                      handlerJoinRoom (el.roomId);
                    }}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>}
    </div>
  );
};

export default JoinRoom;
