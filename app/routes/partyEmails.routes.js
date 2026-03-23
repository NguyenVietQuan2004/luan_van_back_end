import express from "express";
const router = express.Router();

import { getEmailsString, updateEmails } from "../controllers/partyEmails.controller.js";

router.get("/", getEmailsString);
router.put("/", updateEmails); // hoặc POST cũng được

export default router;
