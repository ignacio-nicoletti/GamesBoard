import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const playerSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  experience: [
    {
      game: { type: String, required: true },
      level: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
      xpRemainingForNextLevel: { type: Number, default: 0 }
    }
  ],
  Rol: {
    type: String,
    default: "Rol_player",
  },
});

playerSchema.pre("save", async function (next) {
  const player = this;
  if (!player.isModified("password")) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    player.password = await bcryptjs.hash(player.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

playerSchema.methods.comparePassword = async function (canditatePassword) {
  return await bcryptjs.compare(canditatePassword, this.password);
};

playerSchema.methods.toJSON = function () {
  const { __v, _id, ...player } = this.toObject();
  player.uid = _id;
  return player;
};

export const Player = mongoose.model("Player", playerSchema);
