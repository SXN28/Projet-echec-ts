import { User } from '../models/user.model';
import { Game } from '../models/game.model';
import { GameOutputDTO } from "../dto/game.dto";
import {Op} from "sequelize";
import Move from "../models/move.model";

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

    static async getGamesByUser(userId: number): Promise<GameOutputDTO[]> {
        const games = await Game.findAll({
            where: {
                [Op.or]: [
                    { whitePlayerId: userId },
                    { blackPlayerId: userId },
                ],
            },
        });

        return games.map((game) => ({
            gameId: game.id,
            whitePlayerId: game.whitePlayerId,
            blackPlayerId: game.blackPlayerId,
            board: game.board,
            status: game.status,
            turn: game.turn,
        }));
    }


    static async getGameDetails(gameId: number): Promise<{ board: Array<any>; moves: Array<any> }> {
        const game = await Game.findByPk(gameId);

        if (!game) {
            throw new Error(`Game with ID ${gameId} does not exist.`);
        }

        const board = JSON.parse(game.board);

        const moves = await Move.findAll({
            where: { gameId },
            order: [["id", "ASC"]],
        });

        const formattedMoves = moves.map((move) => ({
            fromRow: move.fromRow,
            fromCol: move.fromCol,
            toRow: move.toRow,
            toCol: move.toCol,
        }));

        return { board, moves: formattedMoves };
    }




static async getGamesByUsername(username: string): Promise<GameOutputDTO[]> {
    const user = await User.findOne({ where: { username } });

    if (!user) {
        throw new Error(`User with username ${username} does not exist.`);
    }

    const games = await Game.findAll({
        where: {
            [Op.or]: [
                { whitePlayerId: user.id },
                { blackPlayerId: user.id },
            ],
        },
    });

    return games.map((game) => ({
        gameId: game.id,
        whitePlayerId: game.whitePlayerId,
        blackPlayerId: game.blackPlayerId,
        board: game.board,
        status: game.status,
        turn: game.turn,
    }));
}


}

export const gameService = new GameService();
