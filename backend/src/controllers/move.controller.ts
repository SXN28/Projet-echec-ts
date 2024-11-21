import {
    Controller,
    Get,
    Post,
    Route,
    Body,
    Tags,
} from "tsoa";

import { MoveInputDTO, MoveOutputDTO } from "../dto/move.dto";
import { moveService } from "../services/move.service";

@Route("moves")
@Tags("Moves")
export class MoveController extends Controller {
    @Get("/")
    public async getAllMoves(): Promise<MoveOutputDTO[]> {
        return moveService.getAllMoves();
    }

    @Post("/")
    public async makeMove(@Body() requestBody: MoveInputDTO): Promise<MoveOutputDTO> {
        const { gameId, from, to, playerColor } = requestBody;
        return moveService.makeMove(gameId, from, to, playerColor);
    }
}
