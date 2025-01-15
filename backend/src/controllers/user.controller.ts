import {
  Controller,
  Get,
  Post,
  Delete,
  Route,
  Path,
  Body,
  Tags,
  Patch,
  Security,
} from "tsoa";
import { userService } from "../services/user.service";
import {
  UserInputDTO,
  UserInputPatchDTO,
  UserOutputDTO,
} from "../dto/user.dto";
import { notFound } from "../error/NotFoundError";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  @Security("jwt")
  @Get("/")
  public async getAllUsers(): Promise<UserOutputDTO[]> {
    return userService.getAllUsers();
  }

  @Security("jwt")
  @Get("{id}")
  public async getUserById(@Path() id: number): Promise<UserOutputDTO> {
    return userService.getUserById(id);
  }

  @Security("jwt")
  @Get("/username/{username}")
  public async getUserByUsername(
    @Path() username: string,
  ): Promise<UserOutputDTO> {
    return userService.getUserByUsername(username);
  }

  @Security("jwt")
  @Get("{id}/share-replays")
  public async getShareReplays(@Path() id: number): Promise<{ shareReplays: boolean }> {
    const user = await userService.findById(id);
    if (!user) {
      throw notFound("User");
    }
    return { shareReplays: user.shareReplays };
  }

  @Post("/")
  public async createUser(
    @Body() requestBody: UserInputDTO,
  ): Promise<UserOutputDTO> {
    const { username, password } = requestBody;
    return userService.createUser(username, password);
  }

  @Security("jwt")
  @Delete("{id}")
  public async deleteUser(@Path() id: number): Promise<void> {
    await userService.deleteUser(id);
  }

  @Security("jwt")
  @Patch("{id}")
  public async updateUser(
    @Path() id: number,
    @Body() requestBody: UserInputPatchDTO,
  ): Promise<UserOutputDTO> {
    const { username, password } = requestBody;
    return userService.updateUser(id, username, password);
  }

  @Security("jwt")
  @Patch("{id}/share-replays")
  public async updateShareReplays(
    @Path() id: number,
    @Body() body: { shareReplays: boolean },
  ): Promise<UserOutputDTO> {
    return userService.updateShareReplays(id, body.shareReplays);
  }
}
