import {
    Controller,
    Post,
    Body,
    Route,
    Tags, Delete, Path, Get,
} from "tsoa";
import {GameService} from "../services/game.service";
import {GameInputDTO, GameOutputDTO} from "../dto/game.dto";

@Route("games")
@Tags("Games")
export class GameController extends Controller {

    @Post("/")
    public async createGame(
        @Body() requestBody: GameInputDTO
    ): Promise<GameOutputDTO> {
        const {whitePlayerId, blackPlayerId} = requestBody;

        return GameService.createGame(whitePlayerId, blackPlayerId);
    }

    @Delete("/{gameId}")
    public async deleteGame(
        @Path() gameId: number
    ): Promise<void>{
        await GameService.deleteGame(gameId);
    }

    @Get("/{gameId}")
    public async getGame(
        @Path() gameId: number
    ): Promise<GameOutputDTO> {
        return GameService.getGame(gameId);
    }
}
