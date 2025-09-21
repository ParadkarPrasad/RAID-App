const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Mongoose for DB connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('Error connecting to MongoDB:', err));

// Registered Routes
const authRoutes = require('./controllers/auth')
const projectRouter = require('./controllers/project')
const riskRouter = require('./controllers/risks')
const assumptionRouter = require("./controllers/assumptions")
app.use(cors())
// Middleware to parse JSON requests
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.get('/', (req, res) => {
  res.send("Backend is running")
})

app.use("/api/auth", authRoutes)
app.use('/api/projects', projectRouter)
app.use('/api', riskRouter)
app.use('/api', assumptionRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app