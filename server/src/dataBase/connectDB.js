import mongoose from "mongoose";
import "dotenv/config";

try {
  await mongoose.connect(process.env.URI_MONGO);
  console.log("DataBase connected");
} catch (error) {
  console.log("Error al conectarse a la base");
}
