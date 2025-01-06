import axios from "axios";

const API_URL = "http://localhost:8000";

const getToken = () => {
    return localStorage.getItem("token1");
};

export const chessService = {
    loadBoard(gameId: number) {
        return axios.get(`${API_URL}/games/${gameId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then((response) => JSON.parse(response.data.board));
    },

    getCurrentTurn(gameId: number | null) {
        if (!gameId) {
            return Promise.reject(new Error("gameId est invalide ou nul"));
        }
        return axios.get(`${API_URL}/games/${gameId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then((response) => response.data.turn);
    },

    makeMove(payload: {
        gameId: number;
        fromRow: number;
        fromCol: number;
        toRow: number;
        toCol: number;
        playerColor: string;
    }) {
        return axios.post(`${API_URL}/moves`, payload, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    },

    createNewGame(payload: { whitePlayerId: number; blackPlayerId: number }) {
        return axios.post(`${API_URL}/games`, payload, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    },

    deleteGame(gameId: number) {
        return axios.delete(`${API_URL}/games/${gameId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    },

    getMoves(gameId: number) {
        return axios.get(`${API_URL}/moves/game/${gameId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    },

    getUserId() {
        return localStorage.getItem("id");
    },

    getUserGames() {
        const userId = this.getUserId();
        if (!userId) {
            return Promise.reject(new Error("ID utilisateur introuvable dans le localStorage"));
        }
        return axios.get(`${API_URL}/games?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then((response) => response.data);
    },

    getGameDetails(gameId: number) {
        return axios.get(`${API_URL}/games/${gameId}/details`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then((response) => response.data);
    },

    getUserGamesByUsername(username: string) {
        return axios.get(`${API_URL}/games/username/${username}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }).then((response) => response.data);
    },
};
