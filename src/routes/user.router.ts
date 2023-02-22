import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userControllers";

const userRouter = Router()

userRouter.get("/user", getAllUsers)
userRouter.post("/user", createUser)

export default userRouter