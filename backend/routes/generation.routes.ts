import express, { Request, Response, NextFunction } from "express";
import {
  generateIntro,
  generateSummary,
} from "../controllers/generation.controller";

const router = express.Router();

router.post(
  "/generate-intro",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ error: "No content Provided" });
        return;
      }

      const intro = await generateIntro(content);

      if (!intro) {
        throw new Error("Failed to generate intro");
      }

      res.json({ intro });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/generate-summary",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ error: "No content Provided" });
        return;
      }

      const summary = await generateSummary(content);

      if (!summary) {
        throw new Error("Failed to generate summary");
      }

      res.json({ summary });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
