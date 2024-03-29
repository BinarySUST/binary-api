import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import compression from 'compression'
import cors from 'cors'
import httpStatus from 'http-status'

// load all env variables
dotenv.config()

import { APP_PORT, APP_PREFIX_PATH, IS_TEST } from './config'
import { morganSuccessHandler, morganErrorHandler } from './config/morgan'
import ApiError from './utils/apiError'
import { errorConverter, errorHandler } from './middlewares/errorHandler'
import logger from './services/logger'
import { connectDB } from './services/db'
import router from './routes'
import userRouter from './routes/user.router'
// import { connect } from './utils/db'

export const app = express()
// disable express powered by header
app.disable('x-powered-by')


if (!IS_TEST) {
    app.use(morganSuccessHandler)
    app.use(morganErrorHandler)
}


// parse json request body
app.use(json())
// parse urlencoded request body
app.use(urlencoded({ extended: true }))
// gzip compression
app.use(compression())

app.use(cors())

app.use(morgan('dev'))

app.get('/', (_req, res) => {
    res.status(httpStatus.OK).json({ msg: 'Server is running' })
})

app.use('/api/v1', userRouter)

//   app.use(APP_PREFIX_PATH, routes)

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, '404 Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

export async function start() {
    try {
        // await connectDB()
        logger.info('Database connected!!!')
        app.listen(APP_PORT, () => {
            logger.info(`REST API on localhost:${APP_PORT + APP_PREFIX_PATH}`)
        })
    } catch (e) {
        logger.error(e)
    }
}