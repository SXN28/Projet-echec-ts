import {
    Controller,
    Post,
    Route,
    Body,
    Tags, Get, Path,
} from "tsoa";

import {MoveInputDTO, MoveOutputDTO, MoveSideOutputDTO} from "../dto/move.dto";
import { moveService } from "../services/move.service";
import Move from "../models/move.model";
import {Error} from "sequelize";

@Route("moves")
@Tags("Moves")
export class MoveController extends Controller {

    @Post("/")
    public async makeMove(@Body() requestBody: MoveInputDTO): Promise<MoveOutputDTO> {
        try {
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

            return moveService.makeMove(gameId, move, playerColor);

        } catch (error: any) {
            const statusCode = error.status || 500;
            const message = error.message || "Internal Server Error";
        
            this.setStatus(statusCode);
            throw { status: statusCode, message };
          } 

    }

    @Get("/game/{gameId}")
    public async getMovesByGameId(
        @Path() gameId: number
    ): Promise<MoveSideOutputDTO[]> {
        try {
            return await moveService.getMovesByGameId(gameId);
        } catch (error: any) {
            const statusCode = error.status || 500;
            const message = error.message || "Internal Server Error";

            this.setStatus(statusCode);
            throw { status: statusCode, message };
        }
    }
}
