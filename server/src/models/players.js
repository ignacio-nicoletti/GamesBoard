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
  experience: {
    type: Array,
    default: [],
  },
  Rol: {
    type: String,
    default: "Rol_player",
  },
  coins: { type: Number, default: 0 },

  colorName: { type: String, default: "normal" },

  avatarProfile: {
    type: Object,
  },
  avatares: {
    type: [],
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
