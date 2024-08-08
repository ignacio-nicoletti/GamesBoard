import mongoose from "mongoose";

const consumableSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  description: { type: String },
  levelNecesary: { type: [], default: { levelB: 0, levelH: 0 } },
  url: { type: String },
  image: { type: Boolean },
  category: { type: String, default: "Avatar" },
});

consumableSchema.methods.toJSON = function () {
  const { __v, _id, ...avatar } = this.toObject();
  avatar.uid = _id;
  return avatar;
};

export const Consumable = mongoose.model("consumable", consumableSchema);
