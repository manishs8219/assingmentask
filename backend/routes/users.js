import express from 'express';
const router = express.Router();

import { signup, login } from "../controller/authController.js";

router.post("/signup", signup);

router.post("/login", login);

export default router;
