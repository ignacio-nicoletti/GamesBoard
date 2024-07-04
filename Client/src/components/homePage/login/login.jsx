import React, { useState } from "react";
import styles from "./login.module.css";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import InstanceOfAxios from "../../../utils/intanceAxios";

const Login = ({ isLogin, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // Estado para almacenar el mensaje de error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reiniciar el mensaje de error al enviar el formulario
    if (isLogin) {
      const data = { email: formData.email, password: formData.password };
      try {
        const response = await InstanceOfAxios("/login", "POST", data);
        Cookies.remove("cookieToken");
        document.cookie =
          encodeURIComponent("cookieToken") +
          "=" +
          encodeURIComponent(response.token); // response.data.token
        onLoginSuccess(); // Llama a esta función después de un inicio de sesión exitoso
      } catch (err) {
        setError(err.response?.data?.message || "Error en el inicio de sesión");
      }
    } else {
      try {
        const response = await InstanceOfAxios("/register", "POST", formData);
        console.log(response);
        Cookies.remove("cookieToken");
        document.cookie =
          encodeURIComponent("cookieToken") +
          "=" +
          encodeURIComponent(response.token); // response.data.token
        onClose(); // Cerrar el modal después del registro
      } catch (error) {
        console.log(error.message);
        setError(error.response?.data?.message || "Error en el registro");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </button>
        <h2>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
        {error && <div className={styles.error}>{error}</div>} {/* Mostrar el mensaje de error */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="userName"
              placeholder="Nombre de Usuario"
              value={formData.userName}
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
