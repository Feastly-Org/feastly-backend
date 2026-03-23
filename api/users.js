import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserByEmailAndPassword,
  getUserById,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";
import getUserFromToken from "#middleware/getUserFromToken";
import { getAllergiesByUserId } from "#db/queries/allergies";
import { getDietByUserId } from "#db/queries/diets";

router.post(
  "/register",
  requireBody(["email", "password"]),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await createUser(email, password);

    const token = createToken({ id: user.id });
    res.status(200).json({ token });
  },
);

router.post("/login", requireBody(["email", "password"]), async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmailAndPassword(email, password);
  if (!user) return res.status(401).send("Invalid email or password.");

  const token = createToken({ id: user.id });
  res.status(200).json(token);
});

router.param("id", requireUser, async (req, res, next, id) => {
  if (req.user.id !== Number(id)) return res.status(403);

  const [allergies, diet] = await [getAllergiesByUserId, getDietByUserId];
  req.allergies = allergies;
  req.diet = diet;
  next();
});

router.get(":/id/preferences", (req, res) => {
  res.status(200).send({ diet: req.diet, allergies: req.allergies });
});
