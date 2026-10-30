// src/routes/problems.ts
import { Router } from "express";
import { getProblems } from "../controllers/problems.js";

const router = Router();

router.get("/", getProblems);

export default router;
