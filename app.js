import express from "express";
const app = express();
export default app;

import cors from "cors";

import apiRouter from "#api/index";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigin =
        /^https?:\/\/localhost(?::\d+)?$/.test(origin) ||
        /^https?:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin);

      if (allowedOrigin) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.use(getUserFromToken);

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
      // Foreign key violation
      const match = err.detail.match(/Key \((\w+)\)/);
      let field = match ? match[1] : "field"; // extracts "email"
      field = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(409).json({ message: `${field} already exists.` });
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
