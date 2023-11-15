import express from "express";
import { PrismaClient } from "@prisma/client";
import { IContentRepository, IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentRepository from "./repositories/content";
import ContentHandler from "./handlers/content";
import cors from "cors";
import { RedisClientType, createClient } from "redis";
import { REDIS_URL } from "./const";
import BlacklistRepository from "./repositories/blacklist";

const PORT = Number(process.env.PORT || 8080);
const app = express();
const clnt = new PrismaClient();
const redisClnt: RedisClientType = createClient({
  url: REDIS_URL,
});

clnt
  .$connect()
  .then(() => redisClnt.connect())
  .catch((err) => {
    console.error("Error", err);
  });

const blacklistRepo = new BlacklistRepository(redisClnt);

const userRepo = new UserRepository(clnt);
const userHandler = new UserHandler(userRepo, blacklistRepo);
const contentRepo: IContentRepository = new ContentRepository(clnt);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);
const jwtMiddleware = new JWTMiddleware(blacklistRepo);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to LearnHub").end();
});

const userRouter = express.Router();

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.get("/", contentHandler.getAll);

contentRouter.get("/:id", contentHandler.getById);

contentRouter.post("/", jwtMiddleware.auth, contentHandler.createContent);

contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.delById);

contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateById);

app.use("/user", userRouter);

userRouter.get("/:username", userHandler.getByUsername);

userRouter.post("/", userHandler.registration);

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.get("/logout", jwtMiddleware.auth, userHandler.logout);

authRouter.post("/login", userHandler.login);

authRouter.get("/me", jwtMiddleware.auth, userHandler.selfCheck);

app.listen(PORT, () => {
  console.log(`LearnHub API is up at ${PORT} `);
});
