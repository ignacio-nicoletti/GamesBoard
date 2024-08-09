import express from "express";

import { AddConsumable, BuyConsumable, DeleteConsumableById, GetAllConsumables, GetConsumablesById } from "../controllers/consumables.controller.js";

const router = express.Router();

router.post("/", AddConsumable);
router.get("/", GetAllConsumables);
router.get("/:id", GetConsumablesById);
router.put("/:id", BuyConsumable);
router.delete("/:id", DeleteConsumableById);

export default router;
