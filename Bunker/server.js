import cors from "cors";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from "./generated/prisma/index.js";

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const PREFIX = "/api/v1";

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.get(`${PREFIX}/health`, (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function validPipe(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }
    next();
  };
}

function gracefulShutdown() {
  console.log("Shutting down gracefully...");
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
