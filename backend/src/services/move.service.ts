import { Move } from "../models/move.model";
import { Game } from "../models/game.model";
import { isValidMove } from "../rules/chess-rules";
import {MoveOutputDTO, MoveSideOutputDTO} from "../dto/move.dto";
import errorHandler from "../middlewares/errorHandler"
import {notFound} from "../error/NotFoundError";
import {invalidMoveError, turnMoveError} from "../error/TurnMoveError";
import {MoveMapper} from "../mapper/move.mapper";

export class MoveService {
    public async makeMove(
        gameId: number,
        move: Move,
        playerColor: "white" | "black"
    ): Promise<MoveOutputDTO> {
        const game = await Game.findByPk(gameId);

        if (!game) {
            notFound("game");
        }

        if (game.turn !== playerColor) {
            turnMoveError(game.turn);
        }

        const board = JSON.parse(game.board || "[]");
        const piece = board[move.fromRow]?.[move.fromCol];

        if (!piece || piece.color !== playerColor) {
            throw { status: 400, message: "Invalid move: No piece at the position or wrong player." };
        }

        const isValid = isValidMove(board, move, piece.piece, piece.color);
        if (!isValid) {
            invalidMoveError();
        }

        board[move.toRow][move.toCol] = board[move.fromRow][move.fromCol];
        board[move.fromRow][move.fromCol] = null;

        game.turn = playerColor === "white" ? "black" : "white";

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

    public async getMovesByGameId(gameId: number): Promise<MoveSideOutputDTO[]> {
        try {
            const moves = await Move.findAll({
                where: {
                    gameId: gameId
                },
                order: [['createdAt', 'ASC']]
            });

            return await MoveMapper.toSideOutputDtoList(moves);
        } catch (error: any) {
            throw new Error("Error retrieving moves: " + error.message);
        }
    }

}


export const moveService = new MoveService();
