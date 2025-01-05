import { UserOutputDTO } from "../dto/user.dto";
import { notFound } from "../error/NotFoundError";
import { UserMapper } from "../mapper/user.mapper";
import { User } from "../models/user.model";

export class UserService {
  public async getAllUsers(): Promise<UserOutputDTO[]> {
    let userList = await User.findAll();
    return UserMapper.toOutputDtoList(userList);
  }

  public async getUserById(id: number): Promise<UserOutputDTO> {
    let user = await User.findByPk(id);
    if (user) {
      return UserMapper.toOutputDto(user);
    } else {
      notFound("User");
    }
  }

  public async createUser(username: string, password: string): Promise<UserOutputDTO> {
    const encodedPassword = Buffer.from(password, "utf-8").toString("base64");

    const newUser = await User.create({
      username,
      password: encodedPassword,
      elo: 1200,
    });
    return UserMapper.toOutputDto(newUser);
  }


  public async getUserByUsername(username: string): Promise<UserOutputDTO> {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return UserMapper.toOutputDto(user);
    } else {
      notFound("User");
    }
  }



  public async deleteUser(id: number): Promise<void> {
    const user = await User.findByPk(id);
    if (user) {
      user.destroy();
    } else {
      notFound("User");
    }
  }

  public async updateUser(
    id: number,
    username?: string,
    password?: string,
  ): Promise<UserOutputDTO> {
    const user = await User.findByPk(id);
    if (user) {
      if (username) user.username = username;
      if (password) user.password = password;
      await user.save();
      return UserMapper.toOutputDto(user);
    } else {
      notFound("User");
    }
  }
}

export const userService = new UserService();
