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
            return isValidKingMove(board, move, color);
        case 'Q' :
            return isValidQueenMove(board, move, color);
        case 'N' :
            return isValidKnightMove(board, move, color);
        case 'B' :
            return isValidBishopMove(board, move, color);
        case 'R':
            return isValidRookMove(board, move, color);
        default:
            return false;
    }   
}

function isValidPawnMove(board: any[][], move: Move, color: 'white' | 'black'): boolean {
    console.log("isValidePawn");
    const direction = color === 'white' ? 1 : -1;
    const end = board[move.toRow][move.toCol];


    if (move.toRow === move.fromRow + direction && move.toCol === move.fromCol && !end) {
        return true;
    }

    if (
        move.fromRow === (color === 'white' ? 6 : 1) &&
        move.toRow === move.fromRow + 2 * direction &&
        move.toCol === move.fromCol &&
        !end &&
        !board[move.fromRow + direction][move.fromCol]
    ) {
        return true;
    }

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




function isValidKingMove(board: any[][], move: Move, color: 'white' | 'black'): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    return rowDiff <= 1 && colDiff <= 1;
}

function isValidQueenMove(board: any[][], move: Move, color: 'white' | 'black'): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    if (rowDiff === colDiff || move.fromRow === move.toRow || move.fromCol === move.toCol) {
        const rowDirection = Math.sign(move.toRow - move.fromRow);
        const colDirection = Math.sign(move.toCol - move.fromCol);

        let currentRow = move.fromRow + rowDirection;
        let currentCol = move.fromCol + colDirection;


        while (currentRow !== move.toRow || currentCol !== move.toCol) {
            if (board[currentRow][currentCol]) {
                return false;
            }

            currentRow += rowDirection;
            currentCol += colDirection;
        }

        const targetCell = board[move.toRow][move.toCol];
        if (targetCell && targetCell.color === color) {
            return false;
        }

        return true;
    }

    return false;
}


function isValidKnightMove(board: any[][], move: Move, color: 'white' | 'black'): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    const targetCell = board[move.toRow][move.toCol];

    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
        if (!targetCell || targetCell.color !== color) {
            return true;
        }
    }

    return false;
}


function isValidBishopMove(board: any[][], move: Move, color: 'white' | 'black'): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    if (rowDiff === colDiff) {
        const rowDirection = Math.sign(move.toRow - move.fromRow);
        const colDirection = Math.sign(move.toCol - move.fromCol);

        let currentRow = move.fromRow + rowDirection;
        let currentCol = move.fromCol + colDirection;

        while (currentRow !== move.toRow || currentCol !== move.toCol) {
            if (board[currentRow][currentCol]) {
                return false;
            }

            currentRow += rowDirection;
            currentCol += colDirection;
        }

        const targetCell = board[move.toRow][move.toCol];
        if (targetCell && targetCell.color === color) {
            return false;
        }

        return true;
    }

    return false;
}


function isValidRookMove(board: any[][], move: Move, color: 'white' | 'black'): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    if (rowDiff === 0 || colDiff === 0) {
        const rowDirection = rowDiff === 0 ? 0 : Math.sign(move.toRow - move.fromRow);
        const colDirection = colDiff === 0 ? 0 : Math.sign(move.toCol - move.fromCol);

        let currentRow = move.fromRow + rowDirection;
        let currentCol = move.fromCol + colDirection;

        while (currentRow !== move.toRow || currentCol !== move.toCol) {
            if (board[currentRow][currentCol]) {
                return false;
            }

            currentRow += rowDirection;
            currentCol += colDirection;
        }

        const targetCell = board[move.toRow][move.toCol];
        if (targetCell && targetCell.color === color) {
            return false;
        }

        return true;
    }

    return false;
}
