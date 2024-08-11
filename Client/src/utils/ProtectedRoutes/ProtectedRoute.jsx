import { Navigate } from "react-router-dom";
import { GetDecodedCookie } from "../DecodedCookie";
import React, { useEffect, useState } from "react";
import styles from "./ProtectedRoutes.module.css";
import FadeLoader from "react-spinners/FadeLoader";
import { DecodedToken } from "../DecodedToken";

export const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = GetDecodedCookie("cookieToken");

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Verificar si el token es válido (podrías hacer una petición a tu backend si es necesario)
          const { success, id } = DecodedToken(token);
          console.log(success);
          if (success) {
            // Podrías agregar más validaciones aquí si es necesario
            setIsAuthenticated(true);
          } else {
            console.error("Token inválido");
          }
        } catch (error) {
          console.error("Error verificando la autenticación:", error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <FadeLoader
          color="#603e20"
          height={23}
          width={5}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
