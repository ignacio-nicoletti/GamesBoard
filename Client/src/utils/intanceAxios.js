import axios from "axios";

// Crear una instancia de Axios con opciones comunes
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_URL_API_LOCAL || process.env.REACT_APP_URL_API}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para realizar peticiones utilizando la instancia creada
async function InstanceOfAxios(ruta, metodo, datos, token) {
  try {
    // Configurar opciones de la petición
    const options = {
      method: metodo,
      url: ruta,
      data: datos,
      headers: {
        ...axiosInstance.defaults.headers, // Copiar encabezados comunes
        'user-token': token, // Añadir token como "user-token"
      },
    };

    const response = await axiosInstance.request(options);

    return response.data;
  } catch (error) {
    throw error; // Lanza el error para que pueda ser manejado en el frontend
  }
}

export default InstanceOfAxios;
