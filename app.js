const express = require('express')
const app = express()

const mongoose = require('mongoose')
const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },

    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.json())
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
    const status = error.statusCode
    const message = error.message
    res.status(status).json({
        message: message
    })
})

mongoose.connect('mongodb+srv://omarelghazalynweave:HM5ip9T6LomkmVpX@cluster0.hbxmz04.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    const server = app.listen(8080)
    const io = require('./socket').init(server)
})