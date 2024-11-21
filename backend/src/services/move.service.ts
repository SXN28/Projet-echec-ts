import { gameRepository } from '../repository/game.repository';
import {MoveOutputDTO} from "../dto/move.dto";
import Move from "../models/move.model";
import {MoveMapper} from "../mapper/move.mapper";
import {isValidMove} from "../rules/chess-rules";

export class MoveService {
    public async getAllMoves(): Promise<MoveOutputDTO[]> {
        let moveList = await Move.findAll();
        return MoveMapper.toOutputDtoList(moveList);
    }

    public async makeMove(gameId: number, from: { row: number; col: number }, to: { row: number; col: number }, playerColor: "white" | "black"): Promise<MoveOutputDTO> {
        // Utilisation du gameRepository pour obtenir le jeu
        const game = await gameRepository.getGameById(gameId);  // Maintenant, gameRepository est défini
        const board = game.board;

        const piece = board[from.row][from.col];
        if (!piece || piece.color !== playerColor) {
            throw new Error("Invalid move: No piece at the position or wrong player.");
        }

        // Valide le mouvement avec la fonction isValidMove
        const isValid = isValidMove(board, { from, to }, piece.type, piece.color);

        const move = await Move.create({
            gameId,
            playerId: playerColor === 'white' ? game.whitePlayerId : game.blackPlayerId, // Choisir le bon joueur
            fromRow: from.row,
            fromCol: from.col,
            toRow: to.row,
            toCol: to.col,
        });

        return {
            gameId,
            from,
            to,
            isValid,  // Calculé avec isValidMove
            board,    // Gérer ou recalculer l'état du board
        };
    }
}

export const moveService = new MoveService();
