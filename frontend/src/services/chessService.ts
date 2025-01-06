import axios from "axios";

const API_URL = "http://localhost:8000";

export const chessService = {
    loadBoard(gameId: number) {
        return axios.get(`${API_URL}/games/${gameId}`).then((response) => {
            return JSON.parse(response.data.board);
        });
    },
    getCurrentTurn(gameId: number | null) {
        if (!gameId) {
            return Promise.reject(new Error("gameId est invalide ou nul"));
        }
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
    },
    getUserId() {
        return localStorage.getItem("id");
    },
    getUserGames() {
        const userId = this.getUserId();
        if (!userId) {
            return Promise.reject(new Error("ID utilisateur introuvable dans le localStorage"));
        }
        return axios.get(`${API_URL}/games?userId=${userId}`).then((response) => response.data);
    },
    getGameDetails(gameId: number) {
        return axios.get(`${API_URL}/games/${gameId}/details`).then((response) => response.data);
    },
    getUserGamesByUsername(username: string) {
        return axios
            .get(`${API_URL}/games/username/${username}`)
            .then((response) => response.data);
    },
};
