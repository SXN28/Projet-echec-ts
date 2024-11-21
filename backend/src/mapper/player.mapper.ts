import { Player } from "../models/player.model";
import { PlayerOutputDTO } from "../dto/player.dto";

export class PlayerMapper {
    // Mapper un joueur en PlayerOutputDTO
    public static toOutputDto(player: Player): PlayerOutputDTO {
        return {
            id: player.id,
            username: player.username,
            email: player.email,
            createdAt: player.createdAt,
            updatedAt: player.updatedAt,
        };
    }

    // Mapper une liste de joueurs en une liste de PlayerOutputDTO
    public static toOutputDtoList(players: Player[]): PlayerOutputDTO[] {
        return players.map((player) => this.toOutputDto(player));
    }
}
