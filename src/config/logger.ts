import { format, createLogger, transports } from 'winston'
import { IS_PRODUCTION } from '.'

const { combine, colorize, splat, printf, timestamp, errors, json } = format

const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack })
    }
    return info
})

const prodFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `[${timestamp}] ${level}: ${message} `
    if (metadata) {
        msg += JSON.stringify(metadata)
    }
    return msg
});


const devLogger = createLogger({
    level: 'debug',
    format: combine(
        enumerateErrorFormat(),
        colorize({ all: true }),
        splat(),
        printf(({ level, message }) => `${level}: ${message}`),
    ),
    transports: [
        new transports.Console({ stderrLevels: ['error'] }),
    ]
})

const prodLogger = createLogger({
    level: 'info',
    format: combine(
        enumerateErrorFormat(),
        timestamp(),
        splat(),
        errors({ stack: true }),
        json(),
    ),
    defaultMeta: { service: 'binary-api' },
    transports: [
        new transports.Console({ stderrLevels: ['error'] }),
        // - Write all logs error (and below) to `quick-start-error.log`.
        new transports.File({ filename: 'error.log', level: 'error' }),
        // - Write to all logs with level `info` and below to `combined.log`.
        new transports.File({ filename: 'combined.log' })
    ],
})

export default IS_PRODUCTION ? prodLogger : devLogger