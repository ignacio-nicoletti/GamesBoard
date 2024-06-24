import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import "./src/dataBase/connectDB.js";
import AuthRoute from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";

import BerenjenaSockets from "./src/sockets/berenjena/berenejena.js";

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

app.use(cors());
BerenjenaSockets(io)

app.use(morgan("dev"));
app.use(express.json());

app.use("/", AuthRoute);
app.use("/user", userRoutes);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("Server listening on port", port);
});
