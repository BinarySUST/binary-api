import { format, createLogger, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file';
import { IS_PRODUCTION } from '../config'

const { combine, colorize, splat, printf, timestamp, errors } = format

const transport: DailyRotateFile = new DailyRotateFile({
    level: 'info',
    dirname: 'log',
    filename: 'application-%DATE%',
    extension: '.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '14d'
});

transport.on('rotate', function (oldFilename, newFilename) {
    // do something fun
    console.log("rotate", oldFilename, newFilename)
});

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
        prodFormat,
    ),
    defaultMeta: { service: 'binary-api' },
    transports: [
        new transports.Console({ stderrLevels: ['error'] }),
        // - Write all logs error (and below) to `quick-start-error.log`.
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // - Write to all logs with level `info` and below to `combined.log`.
        // new transports.File({ filename: 'combined.log' }),
        transport
    ],
})

export default IS_PRODUCTION ? prodLogger : devLogger