import express from 'express'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import path from 'path'
import { dlpSlicer } from './controllers/api.controller.js'

// Initialize
const app = express()

// Settings
app.set('port', process.env.PORT || 3000)

// Middelwares
app.use(morgan('dev'))
app.use(fileUpload())

// Routes
app.post('/api/dlp', dlpSlicer)

// Static Routes
app.use(express.static(path.resolve('src/public')))

// Initialize the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})