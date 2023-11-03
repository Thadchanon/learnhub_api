import { IUserDto } from "./user";

export interface IContentsDto {
  id: string;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  postedBy: IUserDto;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateContentDto {
  videoUrl: string;
  comment: string;
  rating: number;
}
