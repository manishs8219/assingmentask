import express from 'express';
const router = express.Router();

import { addCategory } from "../controller/categoryController.js";

import { authenticateJWT } from "../helpers/helper.js"

router.post("/addCategory", authenticateJWT,addCategory);



export default router;