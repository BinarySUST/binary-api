import morgan from 'morgan'
import { IS_PRODUCTION } from '.'
import logger from '../services/logger'

// morgan.token('message', (_req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (IS_PRODUCTION ? ':remote-addr - ' : '')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
// const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`

export const morganSuccessHandler = morgan(successResponseFormat, {
    skip: (_req, res) => res.statusCode >= 400,
    stream: { write: (message) => logger.info(message.trim()) },
})

export const morganErrorHandler = morgan(errorResponseFormat, {
    skip: (_req, res) => res.statusCode < 400,
    stream: { write: (message) => logger.error(message.trim()) },
})
// something