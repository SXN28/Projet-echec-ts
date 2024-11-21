import { Move } from "../models/move.model";
import { MoveOutputDTO } from "../dto/move.dto";

export class MoveMapper {
    public static toOutputDto(move: Move): MoveOutputDTO {
        return {
            gameId: move.gameId,
            from: { row: move.fromRow, col: move.fromCol },
            to: { row: move.toRow, col: move.toCol },
            isValid: true,
            board: null,
        };
    }

    public static toOutputDtoList(moves: Move[]): MoveOutputDTO[] {
        return moves.map(this.toOutputDto);
    }
}
