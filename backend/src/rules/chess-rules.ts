import { Board } from "../models/board.model";
import { Move } from "../models/move.model";

export function isValidMove(board: Board, move: Move, pieceType: string, color: 'white' | 'black'): boolean {
    const positions = board.getPositions();
    const piece = positions[move.fromRow][move.fromCol];

    if (!piece) {
        return false;
    }

    switch (pieceType) {
        case 'pawn':
            return isValidPawnMove(positions, move, color);
        case 'king':
            return isValidKingMove(positions, move);
        default:
            return false;
    }
}

function isValidPawnMove(positions: string[][], move: Move, color: 'white' | 'black'): boolean {
    const start = positions[move.fromRow][move.fromCol];
    const end = positions[move.toRow][move.toCol];

    const direction = color === 'white' ? -1 : 1;

    if (move.toRow === move.fromRow + direction && move.toCol === move.fromCol && !end) {
        return true;
    }

    return move.toRow === move.fromRow + direction && Math.abs(move.toCol - move.fromCol) === 1;


}

function isValidKingMove(positions: string[][], move: Move): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    return rowDiff <= 1 && colDiff <= 1;
}