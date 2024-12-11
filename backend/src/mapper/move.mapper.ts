import {Move} from "../models/move.model";
import {Game} from "../models/game.model";
import {MoveOutputDTO, MoveSideOutputDTO} from "../dto/move.dto";


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

    public static async toSideOutputDto(move: Move): Promise<MoveSideOutputDTO> {
        const game = await Game.findByPk(move.gameId);
        if (!game) {
            throw new Error("Game not found");
        }

        const playerColor = game.whitePlayerId === move.playerId ? "white" : "black";

        return {
            gameId: move.gameId,
            from: { row: move.fromRow, col: move.fromCol },
            to: { row: move.toRow, col: move.toCol },
            playerColor: playerColor,
            createdAt: move.createdAt,
        };
    }

    public static async toSideOutputDtoList(moves: Move[]): Promise<MoveSideOutputDTO[]> {
        return await Promise.all(moves.map(async (move) => {
            return this.toSideOutputDto(move);
        }));
    }
}
