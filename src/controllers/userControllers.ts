import { Request, Response } from "express"
import prisma from "../lib/prisma"
import { errorResponse, successResponse } from "../utils/response"

export const  getAllUsers = async (req:any, res:any) => {
    try {
        const users:any = []
        res.status(200).json(users)
    }catch (err) {
        res.status(500).json(err)
    }
}


export const createUser = async (req:Request, res:Response)=>{
    try {
        const {username, email, password} = req.body
        const user = await prisma.user.create({
            data:{
                email:email,
                password: password,
                username: username
            }
        })
        res.status(201).json(
            successResponse(user)
            )
    } catch (err) {
        res.status(500).json(errorResponse(err.message))
    }
}