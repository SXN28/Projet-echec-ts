import axios from "axios";

const API_URL = "http://localhost:8000";

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
};


