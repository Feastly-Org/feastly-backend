import express from "express";
const app = express();
export default app;

import cors from "cors";

import usersRouter from "#api/users";
import dailyTotalsRouter from "#api/dailyTotals";
import ingredientsRouter from "#api/ingredients";
import mealIngredientsRouter from "#api/mealIngredients";
import mealsRouter from "#api/meals";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/dailyTotals", dailyTotalsRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/mealIngredients", mealIngredientsRouter);
app.use("/meals", mealsRouter);

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
