import express from "express";
import { DeletePlayerById, GetAllUsers, GetPlayerById, UpdatePlayerById } from "../controllers/user.controller.js";
// import { rulesAuthRegister, rulesAuthLogin } from "../helpers/rulesAuth.js";

const router = express.Router();

router.get("/",  GetAllUsers);
router.get("/:id", GetPlayerById);
router.put("/:id",  UpdatePlayerById);
router.delete("/:id",  DeletePlayerById);

export default router;