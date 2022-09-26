import mongoose from 'mongoose'
import { APP_PORT, DB, DB_URI, IS_TEST } from '../config'
import { app } from '../server'
import logger from './logger'


let dbURI: string
if (DB.HOST && DB.NAME && DB.PASSWORD && DB.USER) {
    dbURI = `mongodb://${DB.USER}:${encodeURIComponent(DB.PASSWORD)}@${DB.HOST}:${DB.PORT}/${DB.NAME}`
} else {
    dbURI = DB_URI
}

if (IS_TEST) {
    dbURI += '-test'
}

const options = {
    useNewUrlParser: true,
    autoIndex: true,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}


export async function connectDB(URI = dbURI, dbOptions = options) {
    logger.debug(URI)
    logger.info('connecting to database...')
    return mongoose
        .connect(URI, dbOptions)
}


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
    logger.debug('Mongoose default connection open to ' + dbURI)
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    logger.error('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected')
})