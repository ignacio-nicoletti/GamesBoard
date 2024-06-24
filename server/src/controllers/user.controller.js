import { Player } from "../models/players.js";
import { formatError } from "../utils/formatError.js";

export const GetAllUsers = async (req, res) => {
  try {
    let player = await Player.find();
    return res.status(200).json(player.reverse());
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetPlayerById = async (req, res) => {
  const { id } = req.params;
  try {
    let player = await Player.findById(id);
    return res.status(200).json({ player });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const UpdatePlayerById = async (req, res) => {
  const { id } = req.params;
  const { userName, selectedAvatar } = req.body;
  console.log(req.body);
  try {
    let player = await Player.findByIdAndUpdate(
      id,
      {
        ...req.body.player,
        userName: userName,
      },
      { new: true }
    );
    return res.status(200).json({ player });
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};

// Función para calcular el XP necesario para el siguiente nivel
const xpForNextLevel = (level) => 100 * Math.pow(1.2, level - 1);

export const AddExperience = async (req, res) => {
  const { id } = req.params;
  const { room } = req.body; // Cambiado de room.xp a game

  try {
    let player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Initialize player's experience if not already done (though it should be initialized as per schema)
    // No es necesario inicializar player.experience ya que debería estar definido según el esquema

    // Find or create the experience entry for the given game
    let gameExperience = player.experience.find(
      (exp) => exp.game === room.game
    );

    if (!gameExperience) {
      gameExperience = { game, level: 1, xp: 0 }; // Crea una nueva entrada de experiencia si no existe
      player.experience.push(gameExperience);
    }

    // Agregar experiencia fija al ganar
    const fixedExperience = 50; // Aquí define la cantidad fija de experiencia que se agrega al ganar

    // Update experience for the game
    gameExperience.xp += fixedExperience;

    // Calculate new level
    while (gameExperience.xp >= xpForNextLevel(gameExperience.level)) {
      gameExperience.xp -= xpForNextLevel(gameExperience.level);
      gameExperience.level++;
    }

    // Save the updated player data
    await player.save();

    return res.status(200).json({ player });
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message)); // Asegúrate de que formatError esté definido
  }
};

export const DeletePlayerById = async (req, res) => {
  const { id } = req.params;
  try {
    await Player.findByIdAndDelete(id);

    return res.status(200).json("player eliminado");
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};
