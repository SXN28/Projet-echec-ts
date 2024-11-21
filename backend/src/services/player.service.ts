import { PlayerOutputDTO } from "../dto/player.dto";
import { notFound } from "../error/NotFoundError";
import { PlayerMapper } from "../mapper/player.mapper";
import { Player } from "../models/player.model";

export class PlayerService {
    // Récupère tous les joueurs
    public async getAllPlayers(): Promise<PlayerOutputDTO[]> {
        let playerList = await Player.findAll();
        return PlayerMapper.toOutputDtoList(playerList);
    }

    // Récupère un joueur par ID
    public async getPlayerById(id: number): Promise<PlayerOutputDTO> {
        let player = await Player.findByPk(id);
        if (player) {
            return PlayerMapper.toOutputDto(player);
        } else {
            notFound("Player");
        }
    }

    // Crée un nouveau joueur
    public async createPlayer(
        username: string,
        email: string,
        password: string,
    ): Promise<PlayerOutputDTO> {
        return PlayerMapper.toOutputDto(
            await Player.create({ username, email, password }),
        );
    }

    // Supprime un joueur par ID
    public async deletePlayer(id: number): Promise<void> {
        const player = await Player.findByPk(id);
        if (player) {
            await player.destroy();
        } else {
            notFound("Player");
        }
    }

    // Met à jour un joueur
    public async updatePlayer(
        id: number,
        username?: string,
        email?: string,
        password?: string,
    ): Promise<PlayerOutputDTO> {
        const player = await Player.findByPk(id);
        if (player) {
            if (username) player.username = username;
            if (email) player.email = email;
            if (password) player.password = password;
            await player.save();
            return PlayerMapper.toOutputDto(player);
        } else {
            notFound("Player");
        }
    }
}

export const playerService = new PlayerService();
