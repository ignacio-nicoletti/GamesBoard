import React, {useState, useEffect} from 'react';
import styles from './login.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';
import InstanceOfAxios from '../../../utils/intanceAxios';
import {GetDecodedCookie} from '../../../utils/DecodedCookie';
import {
  connectSocket,
} from '../../../functions/SocketIO/sockets/sockets';

const Login = ({isLogin, onClose}) => {
  const [formData, setFormData] = useState ({
    userName: '',
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData ({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    if (isLogin) {
      const data = {email: formData.email, password: formData.password};
      await InstanceOfAxios ('/login', 'POST', data).then (data => {
        Cookies.remove ('cookieToken');
        document.cookie =
          encodeURIComponent ('cookieToken') +
          '=' +
          encodeURIComponent (data.token);
        initializeSocket (); // Conectar el socket después de iniciar sesión
      });
    } else if (!isLogin) {
      await InstanceOfAxios ('/register', 'POST', formData).then (data => {
        Cookies.remove ('cookieToken');
        document.cookie =
          encodeURIComponent ('cookieToken') +
          '=' +
          encodeURIComponent (data.token);
      });
    }
    onClose (); // Cerrar el modal después del login o registro
  };

  const initializeSocket = async () => {
    await connectSocket ();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </button>
        <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin &&
            <input
              type="text"
              name="userName"
              placeholder="Nombre de Usuario"
              value={formData.userName}
              onChange={handleChange}
              required
            />}
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className={styles.submitBtn} type="submit">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
