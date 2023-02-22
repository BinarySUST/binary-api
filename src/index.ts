import logger from './services/logger'
import { start } from './server'

start()

// Handle global errors and exceptions here so that we can log them to the console and file system before exiting the process
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ' + err)
})