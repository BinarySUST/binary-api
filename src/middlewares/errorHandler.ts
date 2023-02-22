import httpStatus from 'http-status'

import logger from '../services/logger'
import ApiError from '../utils/apiError'
import { IS_PRODUCTION, IS_TEST } from '../config'

export const errorConverter = (err: any, _req: any, _res: any, next: any) => {
    let error = err
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode 
        const message = error.message || httpStatus[statusCode]
        error = new ApiError(statusCode, message as string, true, err.stack)
    }
    next(error)
}

export const errorHandler = (err: any, _req: any, res: any, _next: any) => {
    let { statusCode, message } = err
    if (IS_PRODUCTION && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    }

    res.locals.errorMessage = err.message

    const response = {
        code: statusCode,
        message,
        ...(!IS_PRODUCTION && { stack: err.stack }),
    }

    if (!IS_PRODUCTION && !IS_TEST) {
        logger.error(err)
    }

    res.status(statusCode).send(response)
}