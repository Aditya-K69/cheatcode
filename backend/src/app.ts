import "dotenv/config";
import express from "express";

import healthRoutes from "./routes/health.js";
import notFoundHandler from "./middleware/not-found.js";
import errorHandler from "./middleware/error.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/health", healthRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
