import { Player } from "../models/players.js";
import { formatError } from "../utils/formatError.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    let player = await Player.findOne({ email });
    if (player) {
      throw new Error("Email ya registrado");
    }

    let currentDate = new Date();
    const timeZoneOffset = -3; // La diferencia de la zona horaria en horas
    currentDate.setHours(currentDate.getHours() + timeZoneOffset);

    player = new Player({
      email,
      password,
      userName,
      admission: currentDate,
    });

    const { token, expiresIn } = generateToken(player._id);

    await player.save();
    // sendConfirmationEmail(token, email);
    return res.status(200).json("usuario creado");
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
 
  let player;
  let emaillower = email.toLowerCase();
  try {
    // user = await User.findOne({ email });
    if (!player) {
      player = await Player.findOne({ email: emaillower });
    }
    if (!player) {
      return res.status(404).json({ error: "No existe este usuario" });
    }
    // compara que las contraseñas coincidan
    const respuestaPassword = await player.comparePassword(password);
    if (!respuestaPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const { token, expiresIn } = generateToken(player.id);
    generateRefreshToken(player.id, res);
    return res.status(200).json({ token, expiresIn, rol: player.Rol });
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};
