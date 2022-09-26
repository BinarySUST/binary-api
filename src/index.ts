import logger from './services/logger'
import { start } from './server'

start()

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ' + err)
})