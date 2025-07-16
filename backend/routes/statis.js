import express from 'express';
const router = express.Router();

import { statisticstopDay,statisticsMonthlyChange, statisticsPredictednextMonth} from "../controller/StatisticsController.js";

import { authenticateJWT } from "../helpers/helper.js"


router.post("/statisticstopDay",authenticateJWT, statisticstopDay);

router.post("/statisticsMonthlyChange",authenticateJWT, statisticsMonthlyChange);

router.post("/statisticsPredictednextMonth",authenticateJWT, statisticsPredictednextMonth);


export default router;