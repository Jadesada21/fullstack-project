import dotenv from 'dotenv'
dotenv.config()
import app from './app'
import { pool } from './db/connectPostgre.repository'



const startServer = async () => {
    try {
        const PORT = Number(process.env.PORT) || 3000

        await pool.query("SELECT 1")
        console.log("PostgreSQL ready")

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Connection Failed", err)
        process.exit(1);
    }
}

startServer()