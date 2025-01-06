import axios from "axios";

const API_URL = "http://localhost:8000";

const getToken = () => {
    return localStorage.getItem("token1");
};

export const UserService = {
    login(payload: { username: string; password: string }) {
        return axios.post(`${API_URL}/auth`, {
            ...payload,
            grant_type: "password",
        });
    },

    getID(username: string) {
        return axios.get(`${API_URL}/users/username/${username}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    },

    register(payload: { username: string; password: string }) {
        return axios.post(`${API_URL}/users`, payload);
    },

    async getAllUsers(): Promise<Array<{ id: number; name: string; elo: number }>> {
        try {
            const response = await axios.get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error instanceof Error
                    ? error.message
                    : "Erreur inconnue lors de la récupération des utilisateurs.",
            );
        }
    },

    async updateUser(userId: number, payload: { shareReplays?: boolean }) {
        return axios.patch(`${API_URL}/users/${userId}/share-replays`, payload, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    },

    getSharedUsers(userId: number) {
        return axios.get(`${API_URL}/users/${userId}/share-replays`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    },
};
