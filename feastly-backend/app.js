import express from "express";
const app = express();
export default app;

import cors from "cors";
app.use(cors({ origin: /localhost/ }));
