import { Player } from "../models/players.js";
import { formatError } from "../utils/formatError.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    let player = await Player.findOne({ email });
    if (player) {
      return res.status(400).json({ error: "Email ya registrado" });
    }

    player = await Player.findOne({ userName });
    if (player) {
      return res.status(400).json({ error: "Nombre de usuario ya registrado" });
    }

    let currentDate = new Date();
    const timeZoneOffset = -3; // La diferencia de la zona horaria en horas
    currentDate.setHours(currentDate.getHours() + timeZoneOffset);

    player = new Player({
      email,
      password,
      userName,
      admission: currentDate,
      experience: [
        { game: "Berenjena", level: 1, xp: 0 }, // Valor inicial para experiencia
        { game: "Poker", level: 1, xp: 0 }, // Valor inicial para experiencia
        { game: "Horserace", level: 1, xp: 0 }, // Valor inicial para experiencia
        { game: "Truco", level: 1, xp: 0 }, // Valor inicial para experiencia
      ],
    });

    const { token, expiresIn } = generateToken(player._id);

    await player.save();
    return res.status(200).json({ token, expiresIn });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  let player;
  const emaillower = email.toLowerCase();

  try {
    player = await Player.findOne({ email: emaillower });
    
    if (!player) {
      return res.status(404).json({ error: "No existe este usuario" });
    }

    // compara que las contraseñas coincidan
    const respuestaPassword = await player.comparePassword(password);

    if (!respuestaPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const dataToken = {
      id: player.id,
      userName: player.userName,
      email: player.email,
      experience: player.experience
    };
    const { token, expiresIn } = generateToken(dataToken);
    generateRefreshToken(player.id, res);

    return res.status(200).json({ token, expiresIn, rol: player.Rol });
  } catch (error) {
    console.error('Error en el servidor:', error); // Log the error for debugging purposes
    return res.status(400).json({ error: error.message || "Error en el servidor" });
  }
};