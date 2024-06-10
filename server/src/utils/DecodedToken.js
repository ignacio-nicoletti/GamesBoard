import jwt from 'jsonwebtoken';
export function DecodedToken(token) {
  try {
    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
      throw new Error('Token no válido');
    }
    return { success: true, id: decodedToken.value };
  } catch (error) {
    return { success: false, error: error.message };
  }
}