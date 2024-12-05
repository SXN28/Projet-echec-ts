export interface GameInputDTO {
    whitePlayerId: number;
    blackPlayerId: number;
}

export interface GameOutputDTO {
    gameId: number;
    whitePlayerId: number;
    blackPlayerId: number;
    board: string;
    status: string;
    turn: string;
}
