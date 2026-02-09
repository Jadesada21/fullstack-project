import express, { Application } from 'express'
import routes from './routes'
import cors from 'cors'

const app: Application = express()

app.use(cors())
app.use(express.json({ limit: "50mb" }))

app.use('/api', routes)

export default app
