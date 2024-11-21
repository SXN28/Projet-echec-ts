import {
    Controller,
    Get,
    Post,
    Delete,
    Route,
    Path,
    Body,
    Tags,
    Patch,
} from "tsoa";

import { playerService } from "../services/player.service";
import { PlayerInputDTO, PlayerInputPatchDTO, PlayerOutputDTO } from "../dto/player.dto";

@Route("players")
@Tags("Players")
export class PlayerController extends Controller {
    // Récupère tous les joueurs
    @Get("/")
    public async getAllPlayers(): Promise<PlayerOutputDTO[]> {
        return playerService.getAllPlayers();
    }

    // Récupère un joueur par ID
    @Get("{id}")
    public async getPlayerById(@Path() id: number): Promise<PlayerOutputDTO> {
        return playerService.getPlayerById(id);
    }

    // Crée un nouveau joueur
    @Post("/")
    public async createPlayer(
        @Body() requestBody: PlayerInputDTO,
    ): Promise<PlayerOutputDTO> {
        const { username, email, password } = requestBody;
        return playerService.createPlayer(username, email, password);
    }

    // Supprime un joueur par ID
    @Delete("{id}")
    public async deletePlayer(@Path() id: number): Promise<void> {
        await playerService.deletePlayer(id);
    }

    // Met à jour un joueur par ID
    @Patch("{id}")
    public async updatePlayer(
        @Path() id: number,
        @Body() requestBody: PlayerInputPatchDTO,
    ): Promise<PlayerOutputDTO> {
        const { username, email, password } = requestBody;
        return playerService.updatePlayer(id, username, email, password);
    }
}
