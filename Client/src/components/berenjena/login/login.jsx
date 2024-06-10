import React, { useState } from "react";
import styles from "./login.module.css";
import CloseIcon from "@mui/icons-material/Close";

const Login = ({ isLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </button>
        <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Nombre de Usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
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
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
