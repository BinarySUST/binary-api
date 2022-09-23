import mongoose from 'mongoose'
import logger from './config/logger'
import { start } from './server'

start()


// If the Node process ends, close the Mongoose connection (ctrl + c)
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        logger.info('Mongoose default connection disconnected through app termination')
        process.exit(0)
    })
})

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ' + err)
})