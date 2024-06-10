import express from "express";
import { login, register } from "../controllers/auth.controller.js";
// import { rulesAuthRegister, rulesAuthLogin } from "../helpers/rulesAuth.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login)

export default router;