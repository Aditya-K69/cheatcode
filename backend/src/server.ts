import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start HTTP server:", error);
  process.exitCode = 1;
});
