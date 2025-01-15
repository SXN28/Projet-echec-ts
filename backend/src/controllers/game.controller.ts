import {
    Controller,
    Post,
    Body,
    Route,
    Tags,
    Delete,
    Path,
    Get,
    Query,
    Security,
  } from "tsoa";
  import { GameService } from "../services/game.service";
  import { GameInputDTO, GameOutputDTO } from "../dto/game.dto";
  
  @Route("games")
  @Tags("Games")
  export class GameController extends Controller {
    @Security("jwt")
    @Post("/")
    public async createGame(
      @Body() requestBody: GameInputDTO,
    ): Promise<GameOutputDTO> {
      const { whitePlayerId, blackPlayerId } = requestBody;
  
      return GameService.createGame(whitePlayerId, blackPlayerId);
    }
  
    @Security("jwt")
    @Delete("/{gameId}")
    public async deleteGame(@Path() gameId: number): Promise<void> {
      await GameService.deleteGame(gameId);
    }
  
    @Security("jwt")
    @Get("/{gameId}")
    public async getGame(@Path() gameId: number): Promise<GameOutputDTO> {
      return GameService.getGame(gameId);
    }
  
    @Security("jwt")
    @Get("/")
    public async getGamesByUser(@Query() userId: number): Promise<GameOutputDTO[]> {
      return GameService.getGamesByUser(userId);
    }
  
    @Security("jwt")
    @Get("/{gameId}/details")
    public async getGameDetails(
      @Path() gameId: number,
    ): Promise<{ board: Array<any>; moves: Array<any> }> {
      return GameService.getGameDetails(gameId);
    }
  
    @Security("jwt")
    @Get("/username/{username}")
    public async getGamesByUsername(
      @Path() username: string,
    ): Promise<GameOutputDTO[]> {
      return GameService.getGamesByUsername(username);
    }
  }
  