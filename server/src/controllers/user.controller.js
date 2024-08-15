import { Player } from "../models/players.js";
import { formatError } from "../utils/formatError.js";

export const GetAllUsers = async (req, res) => {
  try {
    let player = await Player.find().select("-password");
    return res.status(200).json(player.reverse());
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetPlayerById = async (req, res) => {
  const { id } = req.params;
  try {
    let player = await Player.findById(id).select("-password");

    return res.status(200).json({ player });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const UpdatePlayerById = async (req, res) => {
  const { id } = req.params;
  const { userName, avatarUpdateProfile, selectedColorName } = req.body;

  try {
    let player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    player = await Player.findByIdAndUpdate(
      id,
      {
        userName: userName,
        avatarProfile:
          avatarUpdateProfile && avatarUpdateProfile.category === "Avatar"
            ? avatarUpdateProfile
            : player.avatarProfile,
        colorName:
          selectedColorName && avatarUpdateProfile.category === "Paint"
            ? selectedColorName
            : player.colorName,
      },
      { new: true }
    );

    return res.status(200).json({ player });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
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

export const AddExperience = async (req, res) => {
  const xpForNextLevel = (level) => Math.round(100 * Math.pow(1.2, level - 1));
  const { winner, dataRoom, players } = req.body;

  try {
    if (dataRoom.game === "Berenjena" || dataRoom.game === "Horserace") {
      // Función para actualizar la experiencia de un jugador
      const updatePlayerExperience = async (playerId, experienceToAdd) => {
        try {
          if (!playerId || playerId === "-") {
            console.error(`Invalid player ID: ${playerId}`);
            return null;
          }

          let player = await Player.findById(playerId);
          if (!player) {
            console.error(`Player not found: ${playerId}`);
            return null;
          }

          let gameExperience = player.experience.find(
            (exp) => exp.game === dataRoom.game
          );

          if (!gameExperience) {
            gameExperience = {
              game: dataRoom.game,
              level: 1,
              xp: 0,
              xpRemainingForNextLevel: xpForNextLevel(1),
            };
            player.experience.push(gameExperience);
          }

          // Update experience for the game
          gameExperience.xp += experienceToAdd;

          // Calculate new level or decrement level if necessary
          while (gameExperience.xp >= xpForNextLevel(gameExperience.level)) {
            gameExperience.xp -= xpForNextLevel(gameExperience.level);
            gameExperience.level++;
          }

          while (gameExperience.xp < 0 && gameExperience.level > 1) {
            gameExperience.level--;
            gameExperience.xp += xpForNextLevel(gameExperience.level);
          }

          // Ensure XP doesn't go negative at level 1
          if (gameExperience.level === 1 && gameExperience.xp < 0) {
            gameExperience.xp = 0;
          }

          // Calculate XP remaining for next level
          gameExperience.xpRemainingForNextLevel = Math.round(
            xpForNextLevel(gameExperience.level) - gameExperience.xp
          );

          // Save the updated player data
          await player.save();
          return player;
        } catch (error) {
          console.error(
            `Error updating experience for player ${playerId}:`,
            error
          );
          throw error;
        }
      };

      // Experiencia fija para el ganador y los otros jugadores
      const winnerExperience = 50;
      const otherPlayersExperience = 10;
      const loseExperience = -5;

      if (dataRoom.game === "Berenjena") {
        // Actualizar la experiencia del ganador si tiene un id válido
        if (winner.idDB && winner.idDB !== "-") {
          await updatePlayerExperience(winner.idDB, winnerExperience);
        }

        // Actualizar la experiencia de los otros jugadores
        const playersToUpdate = players.filter(
          (player) =>
            player.idDB && player.idDB !== "-" && player.idDB !== winner.idDB
        );

        for (const player of playersToUpdate) {
          await updatePlayerExperience(player.idDB, otherPlayersExperience);
        }
      } else if (dataRoom.game === "Horserace") {
        // Actualizar la experiencia de los ganadores
        for (const player of winner) {
          if (player.idDB && player.idDB !== "-") {
            await updatePlayerExperience(player.idDB, winnerExperience);
          }
        }

        // Actualizar la experiencia de los perdedores que apostaron
        const losers = players.filter(
          (player) =>
            player.inBet && !winner.some((w) => w.idDB === player.idDB)
        );
        for (const loser of losers) {
          if (loser.idDB && loser.idDB !== "-") {
            await updatePlayerExperience(loser.idDB, loseExperience);
          }
        }
      }

      return res.status(200).json({ message: "Experience added successfully" });
    } else {
      return res.status(400).json({ message: "Unsupported game type" });
    }
  } catch (error) {
    console.error("Error adding experience:", error);
    res.status(500).json({ error: error.message });
  }
};
