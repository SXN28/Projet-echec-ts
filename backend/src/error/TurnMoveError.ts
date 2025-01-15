export function turnMoveError(name: string): never {
    const error = new Error(`It's not your turn! It's ${name}'s turn.`);
    (error as any).status = 420;
    throw error;
}

export function invalidMoveError(text?: string): never {
    let textError = text || "Invalid move";
    const error = new Error(textError);
    (error as any).status = 411;
    throw error;
}