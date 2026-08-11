import axios from "axios";

// URL 100% complète et exacte sans omission de sous-domaine ni de dossier
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tiavinaarmel.alwaysdata.net/pharmacie/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

api.defaults.withCredentials = true;

export default api;