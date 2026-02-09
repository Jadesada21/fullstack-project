import { Router, Request, Response } from "express";

const router = Router();

// health check / test route
router.get("/", (req: Request, res: Response) => {
    res.json({
        message: "API is running 🚀",
    });
});

// example route
router.get("/hello", (req: Request, res: Response) => {
    res.json({
        message: "Hello world",
    });
});

export default router;