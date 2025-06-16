import express from "express";

import generationRoutes from "./routes/generation.routes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/generate", generationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
