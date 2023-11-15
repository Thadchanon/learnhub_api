import { PrismaClient, User } from "@prisma/client";
import { IBlacklistRepository, IUser, IUserRepository } from ".";
import { ICreateUserDto } from "../dto/user";
import { SAFE_USER_SELECT } from "../const";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(user: ICreateUserDto): Promise<IUser> {
    return await this.prisma.user.create({
      data: user,
      select: SAFE_USER_SELECT,
    });
  }

  public async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }
  public async findById(id: string): Promise<IUser> {
    return await this.prisma.user.findUniqueOrThrow({
      select: SAFE_USER_SELECT,
      where: { id },
    });
  }
}
