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


        const board = await this.getGame(gameId);

        if (!board) {
            throw new Error(`Game with ID ${gameId} not found or invalid board.`);
        }

        const piece = board[move.fromRow][move.fromCol];
        if (!piece || piece.color !== playerColor) {
            throw new Error("Invalid move: No piece at the position or wrong player.");
        }


        const isValid = isValidMove(board, move, piece.piece, piece.color);
        if (!isValid) {
            throw new Error("Invalid move.");
        }

        // 2. Appliquer le mouvement
        board[move.toRow][move.toCol] = board[move.fromRow][move.fromCol];
        board[move.fromRow][move.fromCol] = null;

        // 3. Sauvegarder le plateau mis à jour
        const game = await Game.findByPk(gameId);
        if (!game) {
            throw new Error("Game not found.");
        }

        game.board = JSON.stringify(board);
        await game.save();

        // 4. Enregistrer le mouvement
        const createdMove = await Move.create({
            gameId,
            playerId: playerColor === "white" ? game.whitePlayerId : game.blackPlayerId,
            fromRow: move.fromRow,
            fromCol: move.fromCol,
            toRow: move.toRow,
            toCol: move.toCol,
        });

        // 5. Retourner les résultats
        return {
            gameId,
            from: { row: move.fromRow, col: move.fromCol },
            to: { row: move.toRow, col: move.toCol },
            isValid,
            board: JSON.stringify(board),
        };
    }


    public async getGame(gameId: number): Promise<any[][] | null> {
        const game = await Game.findByPk(gameId);

        if (!game) {
            console.log("Jeu non trouvé");
            return null;
        }

        try {
            return JSON.parse(game.board);
        } catch (error) {
            console.error("Erreur de parsing JSON", error);
            return null;
        }
    }
}

export const moveService = new MoveService();
