import {
    Controller,
    Post,
    Route,
    Body,
    Tags,
} from "tsoa";

import { MoveInputDTO, MoveOutputDTO } from "../dto/move.dto";
import { moveService } from "../services/move.service";
import Move from "../models/move.model";
import {Error} from "sequelize";

@Route("moves")
@Tags("Moves")
export class MoveController extends Controller {

    @Post("/")
    public async makeMove(@Body() requestBody: MoveInputDTO): Promise<MoveOutputDTO> {
        const { gameId, fromRow, fromCol, toRow, toCol, playerColor } = requestBody;


        const move = Move.createTemporaryMove({
            gameId,
            fromRow,
            fromCol,
            toRow,
            toCol,
            playerId: 0,
            createdAt: new Date(),
        });

        // Appel du service
        return moveService.makeMove(gameId, move, playerColor);

    }
}
