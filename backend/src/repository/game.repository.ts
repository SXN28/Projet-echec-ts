// @ts-ignore
import { Game } from '../models/game.model';

export class GameRepository {
    public async getGameById(gameId: number) {
        return Game.findOne({ where: { id: gameId } });
    }
}

export const gameRepository = new GameRepository();
