import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "../utils/db.js";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

router.get("/db", async (_req, res) => {
  await db.execute(sql`SELECT 1`);

  res.status(200).json({
    success: true,
    message: "Database connection is healthy",
  });
});

export default router;
