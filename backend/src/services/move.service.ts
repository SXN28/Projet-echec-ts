import { Move } from "../models/move.model";
import { Game } from "../models/game.model";
import { isValidMove } from "../rules/chess-rules";
import { MoveOutputDTO } from "../dto/move.dto";

export class MoveService {
    public async makeMove(
        gameId: number,
        move: Move,
        playerColor: "white" | "black"
    ): Promise<MoveOutputDTO> {
        const game = await Game.findByPk(gameId);

        if (!game) {
            throw { status: 404, message: `Game with ID ${gameId} not found.` };
        }

        if (game.turn !== playerColor) {
            throw { status: 400, message: `It's not your turn! It's ${game.turn}'s turn.` };
        }

        const board = JSON.parse(game.board || "[]");
        const piece = board[move.fromRow]?.[move.fromCol];

        if (!piece || piece.color !== playerColor) {
            throw { status: 400, message: "Invalid move: No piece at the position or wrong player." };
        }

        const isValid = isValidMove(board, move, piece.piece, piece.color);
        if (!isValid) {
            throw { status: 400, message: "Invalid move." };
        }

        // Applique le mouvement
        board[move.toRow][move.toCol] = board[move.fromRow][move.fromCol];
        board[move.fromRow][move.fromCol] = null;

        game.board = JSON.stringify(board);
        await game.save();

        const createdMove = await Move.create({
            gameId,
            playerId: playerColor === "white" ? game.whitePlayerId : game.blackPlayerId,
            fromRow: move.fromRow,
            fromCol: move.fromCol,
            toRow: move.toRow,
            toCol: move.toCol,
        });

        return {
            gameId,
            from: { row: move.fromRow, col: move.fromCol },
            to: { row: move.toRow, col: move.toCol },
            isValid,
            board: JSON.stringify(board),
        };
    }
}


export const moveService = new MoveService();
