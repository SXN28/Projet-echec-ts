export interface GameInputDTO {
    whitePlayerId: number; // ID du joueur blanc
    blackPlayerId: number; // ID du joueur noir
}

export interface GameOutputDTO {
    gameId: number;
    whitePlayerId: number;
    blackPlayerId: number;
    board: string; // Le plateau est envoyé sous forme de chaîne JSON
    status: string; // Statut de la partie
}
