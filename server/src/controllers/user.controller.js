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
    const { userName,selectedAvatar } = req.body;
   console.log( req.body);
   try {
      let player = await Player.findByIdAndUpdate(
        id,
        {
          ...req.body.player,
          userName:userName
        },
        { new: true }
      );
      return res.status(200).json({ player });
    } catch (error) {
      console.log(error);
      res.status(400).json(formatError(error.message));
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