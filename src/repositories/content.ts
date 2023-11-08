import { Prisma, PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { SAFE_USER_SELECT } from "../const";
import { IUpdateDto } from "../dto/content";

const INCLUDE_OWNERS: Prisma.ContentInclude = {
  User: {
    select: SAFE_USER_SELECT,
  },
};

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createContent(ownerId: string, content: ICreateContent): Promise<IContent> {
    return this.prisma.content.create({
      data: {
        ...content,
        User: {
          connect: { id: ownerId },
        },
      },
      include: INCLUDE_OWNERS,
    });
  }

  getAll(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: INCLUDE_OWNERS,
    });
  }

  getByID(id: number): Promise<IContent> {
    return this.prisma.content.findUniqueOrThrow({
      where: { id },
      include: INCLUDE_OWNERS,
    });
  }
  delById(id: number): Promise<IContent> {
    return this.prisma.content.delete({
      where: { id },
      include: INCLUDE_OWNERS,
    });
  }

  updateById(id: number, data: IUpdateDto): Promise<IContent> {
    return this.prisma.content.update({
      where: { id },
      data: data,
      include: INCLUDE_OWNERS,
    });
  }
}
