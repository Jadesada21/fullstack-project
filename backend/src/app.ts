import express, { Application } from 'express'
import routes from './routes/index'
import cors from 'cors'
import { errorHandler } from './middleware/ErrorHandler'
import cookieParser from 'cookie-parser'

const app: Application = express()

app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json({ limit: "50mb" }))

app.use('/api', routes)


app.use(errorHandler)
export default app
