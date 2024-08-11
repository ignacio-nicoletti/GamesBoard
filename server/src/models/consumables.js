import mongoose from "mongoose";

const consumableSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  description: { type: String },
  levelNecesary: { type: [], default: { levelB: 0, levelH: 0 } },
  url: { type: String },
  image: { type: Boolean },
  category: { type: String, default: "Avatar" },
  value:{type:Number}
});

consumableSchema.methods.toJSON = function () {
  const { __v, _id, ...consumable } = this.toObject();
  consumable.uid = _id;
  return consumable;
};

export const Consumable = mongoose.model("consumable", consumableSchema);
