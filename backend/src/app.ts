import express, { Application } from 'express'
import routes from './routes/routes'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'

const app: Application = express()

app.use(cors())
app.use(express.json({ limit: "50mb" }))

app.use('/api', routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app
