import express from "express";
const app = express();
export default app;

import cors from "cors";

import apiRouter from "#api/index";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(cors());
app.use(express.json());

app.use(getUserFromToken);

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).json({ message: err.message });
    // Unique constraint violation
    case "23505":
      // Foreign key violation
      const match = err.detail.match(/Key \((\w+)\)/);
      let field = match ? match[1] : "field"; // extracts "email"
      field = field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(409).json({ message: `${field} already exists.` });
    case "23503":
      return res.status(400).json({ message: err.detail });
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Sorry! Something went wrong." });
});
