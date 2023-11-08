import { IUserDto } from "../dto/user";
import { IUser } from "../repositories";

export const userMapper = (user: IUser): IUserDto => {
  const userDto: IUserDto = {
    id: user.id,
    username: user.username,
    name: user.name,
    registeredAt: user.registeredAt.toISOString(),
  };
  return userDto;
};
