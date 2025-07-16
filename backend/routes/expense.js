import express from 'express';
const router = express.Router();

import { expenses,expensesGetByid, expensesDelete} from "../controller/expensesController.js";

import { authenticateJWT } from "../helpers/helper.js"


router.post("/expenses",authenticateJWT, expenses);

router.post("/expensesGetByid/:id",authenticateJWT, expensesGetByid);

router.post("/expensesDelete",authenticateJWT, expensesDelete);


export default router;