import { Player } from "../models/players.js";
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

    // Configurar la experiencia inicial en el formato deseado
    const initialExperience = [
      { "Berenjena": { level: 1, xp: 0, xpRemainingForNextLevel: 100 } },
      { "Poker": { level: 1, xp: 0, xpRemainingForNextLevel: 100 } },
      { "Horserace": { level: 1, xp: 0, xpRemainingForNextLevel: 100 } },
      { "Truco": { level: 1, xp: 0, xpRemainingForNextLevel: 100 } },
    ];

    player = new Player({
      email,
      password,
      userName,
      admission: currentDate,
      experience: initialExperience, // Asignar la experiencia inicial
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
  const emaillower = email.toLowerCase(); // Convertir el email a minúsculas

  try {
    const player = await Player.findOne({ email: emaillower });

    if (!player) {
      return res.status(404).json({ error: "No existe este usuario" });
    }

    // Comparar que las contraseñas coincidan
    const respuestaPassword = await player.comparePassword(password);

    if (!respuestaPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const dataToken = {
      id: player.id,
    };
    const { token, expiresIn } = generateToken(dataToken);
    generateRefreshToken(player.id, res);

    return res.status(200).json({ token, expiresIn, rol: player.Rol });
  } catch (error) {
    console.error("Error en el servidor:", error); // Log the error for debugging purposes
    return res
      .status(400)
      .json({ error: error.message || "Error en el servidor" });
  }
};
