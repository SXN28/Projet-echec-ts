import { User } from '../models/user.model';
import { Game } from '../models/game.model';
import { GameOutputDTO } from "../dto/game.dto";

export class GameService {

    static async createGame(whitePlayerId: number, blackPlayerId: number): Promise<GameOutputDTO> {

        const whitePlayer = await User.findByPk(whitePlayerId);
        const blackPlayer = await User.findByPk(blackPlayerId);

        if (!whitePlayer || !blackPlayer) {
            throw new Error('One or both players do not exist.');
        }


        const initialBoard = [
            [
                { piece: "R", color: "white" },
                { piece: "N", color: "white" },
                { piece: "B", color: "white" },
                { piece: "Q", color: "white" },
                { piece: "K", color: "white" },
                { piece: "B", color: "white" },
                { piece: "N", color: "white" },
                { piece: "R", color: "white" },
            ],
            Array(8).fill({ piece: "P", color: "white" }),
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill(null),
            Array(8).fill({ piece: "P", color: "black" }),
            [
                { piece: "R", color: "black" },
                { piece: "N", color: "black" },
                { piece: "B", color: "black" },
                { piece: "Q", color: "black" },
                { piece: "K", color: "black" },
                { piece: "B", color: "black" },
                { piece: "N", color: "black" },
                { piece: "R", color: "black" },
            ],
        ];


        const game = await Game.create({
            whitePlayerId,
            blackPlayerId,
            status: "waiting",
            turn: "white",
            board: JSON.stringify(initialBoard),
        });

        return {
            gameId: game.id,
            whitePlayerId: game.whitePlayerId,
            blackPlayerId: game.blackPlayerId,
            board: game.board,
            status: game.status,
            turn: game.turn,
        };
    }

    static async deleteGame(gameId: number): Promise<void> {
        const game = await Game.findByPk(gameId);

        if(!game){
            throw new Error(`Game with ID ${gameId} does not exist.`);
        }

        await game.destroy();
    }

    static async getGame(gameId: number): Promise<GameOutputDTO> {
        const game = await Game.findByPk(gameId);

        if (!game) {
            throw new Error(`Game with ID ${gameId} does not exist.`);
        }

        return {
            gameId: game.id,
            whitePlayerId: game.whitePlayerId,
            blackPlayerId: game.blackPlayerId,
            board: game.board,
            status: game.status,
            turn: game.turn,
        };
    }
}

export const gameService = new GameService();
