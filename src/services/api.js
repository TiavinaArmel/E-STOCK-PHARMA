import axios from "axios";

// Forcez temporairement l'URL complète avec /api pour être 100% sûr
const API_BASE_URL = 'https://alwaysdata.net';

const api = axios.create({
    baseURL: API_BASE_URL, 
    headers: {
        "Content-Type": "application/json"
    }
});

api.defaults.withCredentials = true;

export default api;
