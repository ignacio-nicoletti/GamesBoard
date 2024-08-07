import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import "./src/dataBase/connectDB.js";
import AuthRoute from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import consumableRoutes from "./src/routes/consumables.routes.js";
import "dotenv/config";

import BerenjenaSockets from "./src/sockets/berenejena.js";
import HorseRaceSockets from "./src/sockets/horseRace.js";
import GeneralSocket from "./src/sockets/general.js";

const app = express();
const server = http.createServer(app);

const whiteList = [process.env.DEPLOY_CLIENT_URL, "http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Añadir todos los métodos necesarios
  credentials: true,
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"], // Ajusta según tus necesidades
    credentials: true,
  },
  transports: ["websocket", "polling"], // Habilitar ambos transportes
});

GeneralSocket(io);
BerenjenaSockets(io);
HorseRaceSockets(io);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/", AuthRoute);
app.use("/user", userRoutes);
app.use("/consumable", consumableRoutes);

// Manejo de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("Server listening on port", port);
});
