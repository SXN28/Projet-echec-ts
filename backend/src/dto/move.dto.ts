export interface MoveInputDTO {
    gameId: number;
    from: { row: number; col: number };
    to: { row: number; col: number };
    playerColor: "white" | "black";
}

export interface MoveOutputDTO {
    gameId: number;
    from: { row: number; col: number };
    to: { row: number; col: number };
    isValid: boolean;
    board: any;
}
