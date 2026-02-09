import dotenv from 'dotenv'
import connectDb from './mongodb/connect'
import app from './app'

dotenv.config()

const startServer = async () => {
    try {
        const PORT = Number(process.env.PORT) || 3000

        const MONGO_URL = process.env.MONGODB_URL;
        if (!MONGO_URL) {
            throw new Error("MONGODB_URL is not defined");
        }


        await connectDb(MONGO_URL)

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Connection Failed", err)
        process.exit(1);
    }
}

startServer()