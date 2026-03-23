import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByEmailAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router.post(
  "/register",
  requireBody(["email", "password"]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await createUser(email, password);

    const token = createToken({ id: user.id });
    res.status(200).json({ token });
  },
);

router.post("/login", requireBody(["email", "password"]), async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmailAndPassword(email, password);
  if (!user)
    return res.status(401).json({ message: "Invalid email or password." });

  const token = createToken({ id: user.id });
  res.status(200).json({ token });
});
