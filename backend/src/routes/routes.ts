import { Router, Request, Response } from "express";
import { pool } from "../db/connectPostgre";

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is running
 */
router.get("/", (req, res) => {
    res.json({ message: "API is running 🚀" })
})

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */


router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');  // query จาก PostgreSQL
        res.json(result.rows);  // ส่งข้อมูลกลับเป็น JSON
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;