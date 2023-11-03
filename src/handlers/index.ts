import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IErrorDto } from "../dto/error";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { AuthStatus } from "../middleware/jwt";
import { IContentsDto, ICreateContentDto } from "../dto/content";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;

  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;

  selfCheck: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
}

export interface IContentHandler {
  createContent: RequestHandler<
    {},
    IContentsDto | IErrorDto,
    ICreateContentDto,
    unknown,
    AuthStatus
  >;
}
