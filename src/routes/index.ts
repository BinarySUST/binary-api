import { Router } from "express";
import httpStatus from "http-status";

const router = Router()

router.get('/random', (_, res)=>{
    res.status(httpStatus.OK).json({msg:'random'})
})


export default router