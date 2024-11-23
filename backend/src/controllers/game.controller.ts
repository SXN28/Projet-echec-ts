import {
    Controller,
    Post,
    Body,
    Route,
    Tags, Delete, Path,
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

        // Appel au service pour créer une nouvelle partie
        return GameService.createGame(whitePlayerId, blackPlayerId);
    }

    @Delete("/{gameId}")
    public async deleteGame(
        @Path() gameId: number
    ): Promise<void>{
        await GameService.deleteGame(gameId);
    }
}
