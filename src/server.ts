import express from "express";
import studentRouter from "./routes/student.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { initDb } from "./db/pool.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/students", studentRouter);
app.use(notFoundHandler);
app.use(errorHandler);

async function start(): Promise<void> {
  await initDb();
  app.listen(PORT, () => {
    console.log(`API started on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
