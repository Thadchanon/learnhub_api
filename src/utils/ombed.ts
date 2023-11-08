import { response } from "express";
import { OEmbedResponseDto, OEmbedError } from "../dto/oembed";
import axios from "axios";

export interface videoMetaData {
  authorName: string;
  authorUrl: string;
  thumbnailUrl: string;
  title: string;
}

const isError = (data: OEmbedResponseDto | OEmbedError): data is OEmbedError =>
  Object.keys(data).includes("error");

export const getOEmbedInfo = async (
  videoUrl: string
): Promise<videoMetaData> => {
  const res = await axios.get<OEmbedResponseDto | OEmbedError>(
    `https://noembed.com/embed?url=${videoUrl}`
  );

  const oEmbedData = res.data;
  if (isError(oEmbedData)) throw new Error("Invalid video link");

  const { title, thumbnail_url, author_name, author_url } = oEmbedData;

  return {
    title,
    thumbnailUrl: thumbnail_url,
    authorName: author_name,
    authorUrl: author_url,
  };
};
