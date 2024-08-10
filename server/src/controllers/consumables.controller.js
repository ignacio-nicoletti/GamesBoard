import { Consumable } from "../models/consumables.js";
import { Player } from "../models/players.js";

export const AddConsumable = async (req, res) => {
  const { title, price, description, levelNecesary, url, image, category } =
    req.body;

  try {
    let consumable = new Consumable({
      title,
      price,
      description,
      levelNecesary,
      url,
      image,
      category,
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

export const BuyConsumable = async (req, res) => {
  const { id } = req.params;
  const { selectConsumable } = req.body;
  try {
    const player = await Player.findById(id);
    if (selectConsumable.category === "Avatar") {
      if (player.coins >= selectConsumable.price) {
        player.coins = player.coins - selectConsumable.price;
        player.avatares.push(selectConsumable);
        player.save();
      } else {
        throw new Error("Insufficient coins");
      }
    }
    res.status(200).json("compra hecha");
  } catch (error) {
    res.status(400).json(formatError(error.message));
  }
};
