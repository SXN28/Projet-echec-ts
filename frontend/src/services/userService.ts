import axios from "axios";

const API_URL = "http://localhost:8000";

export const UserService = {
    login(payload: { username: string; password: string }) {
        return axios.post(`${API_URL}/auth`, {
            ...payload,
            grant_type: "password",
        });
    },

    register(payload: { username: string; password: string }) {
        return axios.post(`${API_URL}/users`, payload);
    },
};


