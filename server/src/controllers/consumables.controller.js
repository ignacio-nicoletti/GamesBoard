import { Consumable } from "../models/consumables.js";
import { Player } from "../models/players.js";
import { formatError } from "../utils/formatError.js";

export const AddConsumable = async (req, res) => {
  const {
    title,
    price,
    description,
    levelNecesary,
    url,
    image,
    category,
    value,
  } = req.body;

  try {
    let consumable = new Consumable({
      title,
      price,
      description,
      levelNecesary,
      url,
      image,
      category,
      value,
    });

    await consumable.save();
    return res.status(200).json("producto agregado");
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const GetAllConsumables = async (req, res) => {
  try {
    let consumable = await Consumable.find();
    return res.status(200).json(consumable.reverse());
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const GetConsumablesById = async (req, res) => {
  const { id } = req.params;
  try {
    let consumable = await Consumable.findById(id);
    return res.status(200).json({ consumable });
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};

export const DeleteConsumableById = async (req, res) => {
  const { id } = req.params;
  try {
    await Consumable.findByIdAndDelete(id);

    return res.status(200).json("consumable eliminado");
  } catch (error) {
    console.log(error);
    res.status(400).json(formatError(error.message));
  }
};

const updatePlayerExperience = (player, game, xpToAdd) => {
  const xpForNextLevel = (level) => Math.round(100 * Math.pow(1.2, level - 1));

  // Buscar el objeto que coincide con el juego en el array de experience
  let gameExperience = player.experience.find(
    (exp) => Object.keys(exp)[0] === game
  );

  if (!gameExperience) {
    // Si no se encuentra, crear una nueva entrada para ese juego
    gameExperience = {
      [game]: {
        level: 1,
        xp: 0,
        xpRemainingForNextLevel: xpForNextLevel(1),
      },
    };
    player.experience.push(gameExperience);
  }

  // Acceder al objeto del juego dentro de gameExperience
  const experienceData = gameExperience[game];

  // Añadir experiencia
  experienceData.xp += xpToAdd;

  // Ajustar niveles si es necesario
  while (experienceData.xp >= xpForNextLevel(experienceData.level)) {
    experienceData.xp -= xpForNextLevel(experienceData.level);
    experienceData.level++;
  }

  // Ajustar nivel y XP si la XP es negativa
  while (experienceData.xp < 0 && experienceData.level > 1) {
    experienceData.level--;
    experienceData.xp += xpForNextLevel(experienceData.level);
  }

  // Asegurarse de que la XP no sea negativa en el nivel 1
  if (experienceData.level === 1 && experienceData.xp < 0) {
    experienceData.xp = 0;
  }

  // Actualizar la XP restante para el próximo nivel
  experienceData.xpRemainingForNextLevel = Math.round(
    xpForNextLevel(experienceData.level) - experienceData.xp
  );

  return player;
};

export const BuyConsumable = async (req, res) => {
  const { id } = req.params;
  const { selectConsumable, selectedGame, selectedColorName } = req.body;

  try {
    const player = await Player.findById(id);
    if (!player) {
      throw new Error("Player not found");
    }
    if (player.coins < selectConsumable.price) {
      throw new Error("Insufficient coins");
    }

    if (selectConsumable.category === "Avatar") {
      player.avatares.push(selectConsumable);
    } else if (selectConsumable.category === "Paint") {
      if (selectConsumable.title === "Rainbow Name") {
        player.colorName = selectConsumable.title;
      } else {
        player.colorName = selectedColorName;
      }
      player.avatares.push(selectConsumable);
    } else if (selectConsumable.category === "XP") {
      const xpToAdd = selectConsumable.value;
      updatePlayerExperience(player, selectedGame, xpToAdd);
    }

    player.coins -= selectConsumable.price;
    player.markModified("experience");
    await player.save();

    res.status(200).json("Compra hecha");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
