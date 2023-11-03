import { RequestHandler } from "express";
import { IContentHandler } from ".";
import { IContentRepository } from "../repositories";
import { IErrorDto } from "../dto/error";
import { IContentsDto, ICreateContentDto } from "../dto/content";
import { AuthStatus } from "../middleware/jwt";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  createContent: RequestHandler<
    {},
    IContentsDto | IErrorDto,
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

      const result = await this.repo.createContent(userId, {
        videoUrl,
        comment,
        rating,
        videoTitle: "",
        thumbnailUrl: "",
        creatorName: "",
        creatorUrl: "",
      });

      const contentResponse: IContentsDto = {
        id: result.id.toString(),
        videoTitle: result.videoTitle,
        videoUrl: result.videoUrl,
        comment: result.comment,
        rating: result.rating,
        thumbnailUrl: result.thumbnailUrl,
        creatorName: result.creatorName,
        creatorUrl: result.creatorUrl,
        postedBy: {
          id: result.User.id,
          username: result.User.username,
          name: result.User.name,
          registeredAt: result.User.registeredAt.toISOString(),
        },
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toDateString(),
      };

      return res.status(201).json(contentResponse).end();
    } catch (error) {}
  };
}
