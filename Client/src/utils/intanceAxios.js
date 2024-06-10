import axios from "axios"

// Crear una instancia de Axios con opciones comunes
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_URL_API}`,
  headers: {
    'Content-Type': 'application/json',
    // Otros encabezados comunes
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
      // Otras opciones específicas de la petición
    };

    const response = await axiosInstance.request(options);

    // Manejar la respuesta según tus necesidades
    // console.log(response.data);

    return response.data;
  } catch (error) {
    // Manejar errores
    const apiError = {
      message: 'Error al procesar la solicitud.',
      errorMsg: error.response?.data.error,
      // Otros campos según la estructura de tus errores
    };

    return apiError;
  }
}

export default InstanceOfAxios;
