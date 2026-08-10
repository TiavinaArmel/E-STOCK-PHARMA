import axios from "axios";

// On utilise bien la même variable partout !
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tiavinaarmel.alwaysdata.net/pharmacie';

const api = axios.create({
    baseURL: API_BASE_URL, // <--- Correction ici : API_BASE_URL au lieu de API_URL
    headers: {
        "Content-Type": "application/json"
    }
});

api.defaults.withCredentials = true;

export default api;