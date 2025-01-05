type SimplifiedMove = {
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
};

export function isValidMove(
    board: any[][],
    move: SimplifiedMove,
    pieceType: string,
    color: 'white' | 'black'
): boolean {
    const piece = board[move.fromRow][move.fromCol];

    if (!piece) {
        return false;
    }

    switch (pieceType) {
        case 'P':
            return isValidPawnMove(board, move, color);
        case 'K':
            return isValidKingMove(board, move, color);
        case 'Q':
            return isValidQueenMove(board, move, color);
        case 'N':
            return isValidKnightMove(board, move, color);
        case 'B':
            return isValidBishopMove(board, move, color);
        case 'R':
            return isValidRookMove(board, move, color);
        default:
            return false;
    }
}

function isValidPawnMove(board: any[][], move: SimplifiedMove, color: 'white' | 'black'): boolean {
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

function isValidKingMove(board: any[][], move: SimplifiedMove, color: 'white' | 'black'): boolean {
    const rowDiff = Math.abs(move.toRow - move.fromRow);
    const colDiff = Math.abs(move.toCol - move.fromCol);

    return rowDiff <= 1 && colDiff <= 1;
}

function isValidQueenMove(board: any[][], move: SimplifiedMove, color: 'white' | 'black'): boolean {
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

function isValidKnightMove(board: any[][], move: SimplifiedMove, color: 'white' | 'black'): boolean {
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

function isValidBishopMove(board: any[][], move: SimplifiedMove, color: 'white' | 'black'): boolean {
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

function isValidRookMove(board: any[][], move: SimplifiedMove, color: 'white' | 'black'): boolean {
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

export function isCheck(board: any[][], color: 'white' | 'black'): boolean {
    const kingPosition = findKing(board, color);
    const isAttacked = isSquareAttacked(board, kingPosition.row, kingPosition.col, color);

    if (isAttacked) {
        console.log(`Le roi ${color} est en échec !`);
    }

    return isAttacked;
}

export function isCheckmate(board: any[][], color: 'white' | 'black'): boolean {
    if (!isCheck(board, color)) {
        return false;
    }

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const moves = getPossibleMoves(board, row, col);
                for (const move of moves) {
                    const newBoard = simulateMove(board, {
                        fromRow: row,
                        fromCol: col,
                        toRow: move.row,
                        toCol: move.col,
                    });
                    if (!isCheck(newBoard, color)) {
                        return false;
                    }
                }
            }
        }
    }

    console.log(`Échec et mat pour ${color} !`);
    return true;
}


function findKing(board: any[][], color: 'white' | 'black') {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            if (piece && piece.type === 'K' && piece.color === color) {
                return { row, col };
            }
        }
    }
    throw new Error("King not found on the board");
}

function isSquareAttacked(board: any[][], row: number, col: number, color: 'white' | 'black'): boolean {
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const piece = board[r][c];
            if (piece && piece.color === opponentColor) {
                const move: SimplifiedMove = { fromRow: r, fromCol: c, toRow: row, toCol: col };
                if (isValidMove(board, move, piece.type, opponentColor)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getPossibleMoves(board: any[][], fromRow: number, fromCol: number): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    for (let toRow = 0; toRow < board.length; toRow++) {
        for (let toCol = 0; toCol < board[toRow].length; toCol++) {
            const move: SimplifiedMove = { fromRow, fromCol, toRow, toCol };
            const piece = board[fromRow][fromCol];
            if (piece && isValidMove(board, move, piece.type, piece.color)) {
                moves.push({ row: toRow, col: toCol });
            }
        }
    }
    return moves;
}

function simulateMove(board: any[][], move: SimplifiedMove): any[][] {
    const newBoard = board.map((row) => row.slice());
    const piece = newBoard[move.fromRow][move.fromCol];
    newBoard[move.fromRow][move.fromCol] = null;
    newBoard[move.toRow][move.toCol] = piece;
    return newBoard;
}