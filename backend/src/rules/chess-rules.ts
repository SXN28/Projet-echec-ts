import { Move } from "../models/move.model";

export function isValidMove(board: any[][], move: Move, pieceType: string, color: 'white' | 'black'): boolean {

    const piece = board[move.fromRow][move.fromCol];

    if (!piece) {
        return false;
    }

    switch (pieceType) {
        case 'P':
            return isValidPawnMove(board, move, color);
        case 'K':
            return isValidKingMove(board, move);
        default:
            return false;
    }
}

function isValidPawnMove(board: any[][], move: Move, color: 'white' | 'black'): boolean {
    console.log("isValidePawn");
    const direction = color === 'white' ? 1 : -1;
    const end = board[move.toRow][move.toCol];


    // Déplacement simple d'une case
    if (move.toRow === move.fromRow + direction && move.toCol === move.fromCol && !end) {
        return true;
    }

    // Déplacement initial de deux cases
    if (
        move.fromRow === (color === 'white' ? 6 : 1) &&
        move.toRow === move.fromRow + 2 * direction &&
        move.toCol === move.fromCol &&
        !end &&
        !board[move.fromRow + direction][move.fromCol]
    ) {
        return true;
    }

    // Prise diagonale
    if (
        move.toRow === move.fromRow + direction &&
        Math.abs(move.toCol - move.fromCol) === 1 &&
        end &&
        end.color !== color
    ) {
        return true;
    }
    

    return false;
}




function isValidKingMove(board: any[][], move: Move): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    return rowDiff <= 1 && colDiff <= 1;
}