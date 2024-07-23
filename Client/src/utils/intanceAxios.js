import axios from "axios";

const URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_URL_API
    : process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_URL_API_LOCAL
    : "";

// Crear una instancia de Axios con opciones comunes
const axiosInstance = axios.create({
  baseURL: URL,
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
    if (error.response) {
      // console.error('Error en la respuesta del servidor:', {
      //   status: error.response.status,
      //   data: error.response.data,
      // });
      
      // Propaga el mensaje de error recibido del backend
      throw new Error(error.response.data.error || `Error ${error.response.status}: Ocurrió un error`);
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      throw new Error('No se recibió respuesta del servidor. Por favor, inténtalo de nuevo más tarde.');
    } else {
      // Algo sucedió al configurar la petición que desencadenó un error
      console.error('Error en la configuración de la petición:', error.message);
      throw new Error(`Error en la configuración de la petición: ${error.message}`);
    }
  }
}

export default InstanceOfAxios;
