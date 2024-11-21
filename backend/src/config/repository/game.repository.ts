// @ts-ignore
import { Game } from '../models/game.model';

export class GameRepository {
    public async getGameById(gameId: number) {
        // Cette méthode récupère un jeu par son ID
        return Game.findOne({ where: { id: gameId } });
    }
}

export const gameRepository = new GameRepository();
