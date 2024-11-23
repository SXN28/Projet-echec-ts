import { gameRepository } from '../repository/game.repository';
import { MoveOutputDTO } from "../dto/move.dto";
import Move from "../models/move.model";
import { MoveMapper } from "../mapper/move.mapper";
import { isValidMove } from "../rules/chess-rules";

export class MoveService {
    public async makeMove(
        gameId: number,
        move: Move,
        playerColor: "white" | "black"
    ): Promise<MoveOutputDTO> {


        // 1. Récupérer la partie depuis la base de données
        const game = await gameRepository.getGameById(gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} not found.`);
        }

        // 2. Charger le plateau
        const board = JSON.parse(game.board); // Conversion JSON -> objet
        const piece = board[move.fromRow][move.fromCol];
        if (!piece || piece.color !== playerColor) {
            throw new Error("Invalid move: No piece at the position or wrong player.");
        }

        // 3. Valider le mouvement
        const isValid = isValidMove(board, move, piece.type, piece.color);
        if (!isValid) {
            throw new Error("Invalid move.");
        }

        // 4. Mettre à jour le plateau
        board[move.toRow][move.toCol] = board[move.fromRow][move.fromCol]; // Déplacer la pièce
        board[move.fromRow][move.fromCol] = null; // Vider la case d'origine

        // 5. Sauvegarder le plateau mis à jour
        game.board = JSON.stringify(board); // Conversion objet -> JSON
        await game.save();

        // 6. Enregistrer le mouvement
        const createdMove = await Move.create({
            gameId,
            playerId: playerColor === 'white' ? game.whitePlayerId : game.blackPlayerId,
            fromRow: move.fromRow,
            fromCol: move.fromCol,
            toRow: move.toRow,
            toCol: move.toCol,
        });

        // 7. Retourner le résultat
        return {
            gameId,
            from: { row: move.fromRow, col: move.fromCol },
            to: { row: move.toRow, col: move.toCol },
            isValid,
            board: JSON.stringify(board), // Plateau mis à jour sous forme de JSON
        };
    }
}

export const moveService = new MoveService();
