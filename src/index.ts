import express from "express";
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";

const PORT = Number(process.env.PORT || 8080);
const app = express();
const clnt = new PrismaClient();

const userRepo: IUserRepository = new UserRepository(clnt);
const userHandler: IUserHandler = new UserHandler(userRepo);
const jwtMiddleware = new JWTMiddleware();

app.use(express.json());

app.get("/", jwtMiddleware.auth, (req, res) => {
  console.log(res.locals);
  return res.status(200).send("Welcome to LearnHub").end();
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.post("/login", userHandler.login);

app.listen(PORT, () => {
  console.log(`LearnHub API is up at ${PORT} `);
});
