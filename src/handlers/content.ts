import { RequestHandler } from "express";
import { IContentHandler } from ".";
import { IContentRepository } from "../repositories";
import { IErrorDto } from "../dto/error";
import {
  IContentDto,
  IContentsDto,
  ICreateContentDto,
  IUpdateDto,
} from "../dto/content";
import { AuthStatus } from "../middleware/jwt";
import { getOEmbedInfo } from "../utils/ombed";
import { contentMapper } from "../utils/content.mapper";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  updateById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    IUpdateDto,
    unknown,
    AuthStatus
  > = async (req, res) => {
    const userId = res.locals.user.id;
    try {
      const content = await this.repo.getByID(Number(req.params.id));
      if (userId !== content.User.id) {
        throw new Error("Can not update");
      }
      const result = await this.repo.updateById(
        Number(req.params.id),
        req.body
      );
      const contentResponse = contentMapper(result);

      return res.status(200).json(contentResponse).end();
    } catch (error) {
      return res.status(400).json({ message: "Can not update" }).end();
    }
  };

  delById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  > = async (req, res) => {
    const userId = res.locals.user.id;
    try {
      const content = await this.repo.getByID(Number(req.params.id));
      if (userId !== content.User.id) {
        throw new Error("Can not delete");
      }
      const result = await this.repo.delById(Number(req.params.id));
      const contentResponse = contentMapper(result);
      return res.status(200).json(contentResponse).end();
    } catch (error) {
      return res.status(400).json({ message: "Can not delete" }).end();
    }
  };

  getAll: RequestHandler<{}, { data: IContentDto[] }> = async (req, res) => {
    const contents = await this.repo.getAll();
    const mappedToDto = contents.map<IContentDto>(contentMapper);

    return res.status(200).json({ data: mappedToDto }).end();
  };

  getById: RequestHandler<{ id: string }, IContentDto | IErrorDto> = async (
    req,
    res
  ) => {
    const { id } = req.params;

    const numericId = Number(id);
    if (isNaN(numericId))
      return res.status(400).json({ message: "id is invalid" }).end();

    const content = await this.repo.getByID(numericId);

    return res.status(200).json(contentMapper(content)).end();
  };

  createContent: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    unknown,
    AuthStatus
  > = async (req, res) => {
    const { videoUrl, comment, rating } = req.body;

    if (typeof videoUrl !== "string" || videoUrl.length === 0)
      return res.status(400).json({ message: "VideoUrl is invalid" });
    if (typeof comment !== "string" || comment === undefined)
      return res.status(400).json({ message: "Comment is invalid" });
    if (typeof rating !== "number" || rating < 0 || rating > 5)
      return res.status(400).json({ message: "Rating is invalid" });

    try {
      const userId = res.locals.user.id;

      const { authorName, authorUrl, thumbnailUrl, title } =
        await getOEmbedInfo(videoUrl);

      const result = await this.repo.createContent(userId, {
        videoUrl,
        comment,
        rating,
        videoTitle: title,
        thumbnailUrl: thumbnailUrl,
        creatorName: authorName,
        creatorUrl: authorUrl,
      });

      const contentResponse: IContentDto = contentMapper(result);

      return res.status(201).json(contentResponse).end();
    } catch (error) {}
  };
}
