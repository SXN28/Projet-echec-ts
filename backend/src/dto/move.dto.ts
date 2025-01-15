export interface MoveInputDTO {
    gameId: number;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
    playerColor: "white" | "black";
}


export interface MoveOutputDTO {
    gameId: number;
    from: { row: number; col: number };
    to: { row: number; col: number };
    isValid: boolean;
    board: any;
}

export interface MoveSideOutputDTO {
    gameId: number;
    from: { row: number; col: number };
    to: { row: number; col: number };
    playerColor: "white" | "black";
    createdAt: Date;
}
