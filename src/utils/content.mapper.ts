import { IContentDto } from "../dto/content";
import { IContent } from "../repositories";
import { userMapper } from "./user.mapper";

export const contentMapper = (content: IContent): IContentDto => {
  const contentDto: IContentDto = {
    id: content.id.toString(),
    videoTitle: content.videoTitle,
    videoUrl: content.videoUrl,
    comment: content.comment,
    rating: content.rating,
    thumbnailUrl: content.thumbnailUrl,
    creatorName: content.creatorName,
    creatorUrl: content.creatorUrl,
    postedBy: userMapper(content.User),
    createdAt: content.createdAt.toISOString(),
    updatedAt: content.updatedAt.toISOString(),
  };
  return contentDto;
};
