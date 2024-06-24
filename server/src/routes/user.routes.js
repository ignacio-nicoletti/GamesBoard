import express from "express";
import { AddExperience, DeletePlayerById, GetAllUsers, GetPlayerById, UpdatePlayerById } from "../controllers/user.controller.js";
// import { rulesAuthRegister, rulesAuthLogin } from "../helpers/rulesAuth.js";

const router = express.Router();

router.get("/",  GetAllUsers);
router.get("/:id", GetPlayerById);
router.put("/:id",  UpdatePlayerById);
router.put("/addexperience/:id",  AddExperience);
router.delete("/:id",  DeletePlayerById);

export default router;