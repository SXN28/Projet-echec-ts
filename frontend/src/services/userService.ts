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
        return axios.get(`${API_URL}/users/username/${username}`);
    },

    register(payload: { username: string; password: string }) {
        return axios.post(`${API_URL}/users`, payload);
    },
    async getAllUsers(): Promise<Array<{ id: number; name: string; elo: number }>> {
        try {
            const response = await fetch("http://localhost:8000/users");
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des utilisateurs.");
            }
            return await response.json();
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Erreur inconnue lors de la récupération des utilisateurs."
            );
        }
    },
    async updateUser(userId: number, payload: { shareReplays?: boolean }) {
        return axios.patch(`${API_URL}/users/${userId}/share-replays`, payload);
    },

    getSharedUsers(userId: number) {
        return axios.get(`${API_URL}/users/${userId}/share-replays`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
    }
};


