import { RequestHandler } from "express";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IErrorDto } from "../dto/error";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { AuthStatus } from "../middleware/jwt";
import {
  IContentDto,
  IContentsDto,
  ICreateContentDto,
  IUpdateDto,
} from "../dto/content";

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
  getByUsername: RequestHandler<{ username: string }, IUserDto | IErrorDto>;
}

export interface IContentHandler {
  createContent: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    unknown,
    AuthStatus
  >;
  getAll: RequestHandler<{}, { data: IContentDto[] }>;
  getById: RequestHandler<{ id: string }, IContentDto | IErrorDto>;
  delById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
  updateById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    IUpdateDto,
    unknown,
    AuthStatus
  >;
}
