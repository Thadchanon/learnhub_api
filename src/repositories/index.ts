import { User } from "@prisma/client";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IUpdateDto } from "../dto/content";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUser>;
}

export interface ICreateContent {
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
}

export interface IContent {
  id: number;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  createdAt: Date;
  updatedAt: Date;
  User: IUser;
  ownerId: string;
}

export interface IContentRepository {
  createContent(ownerId: string, content: ICreateContent): Promise<IContent>;
  getByID(id: number): Promise<IContent>;
  getAll(): Promise<IContent[]>;
  delById(id: number): Promise<IContent>;
  updateById(id: number, data: IUpdateDto): Promise<IContent>;
}

export interface IBlacklistRepository {
  addToBlacklist(token: string, exp: number): Promise<void>;
  isAlreadyBlacklisted(token: string): Promise<boolean>;
}
