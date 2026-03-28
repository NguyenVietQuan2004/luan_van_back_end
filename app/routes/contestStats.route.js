// routes/contest.stats.route.js

import express from "express";
import * as statsController from "../controllers/contestStats.controller.js";

const router = express.Router();

router.get("/", statsController.getContestParticipationStats);

export default router;
