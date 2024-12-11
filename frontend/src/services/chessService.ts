import axios from "axios";

const API_URL = "http://localhost:8000";

export const chessService = {
    loadBoard(gameId: number) {
        return axios.get(`${API_URL}/games/${gameId}`).then((response) => {
            return JSON.parse(response.data.board);
        });
    },
    getCurrentTurn(gameId: number) {
        return axios
            .get(`${API_URL}/games/${gameId}`)
            .then((response) => response.data.turn);
    },
    makeMove(payload: {
        gameId: number;
        fromRow: number;
        fromCol: number;
        toRow: number;
        toCol: number;
        playerColor: string;
    }) {
        return axios.post(`${API_URL}/moves`, payload);
    },
    createNewGame(payload: { whitePlayerId: number; blackPlayerId: number }) {
        return axios.post(`${API_URL}/games`, payload);
    },
    deleteGame(gameId: number) {
        return axios.delete(`${API_URL}/games/${gameId}`);
    },
    getMoves(gameId: number) {
        return axios.get(`${API_URL}/moves/game/${gameId}`);
    }
};
