import axios from "axios";

// Supprimez temporairement le import.meta.env pour forcer l'URL
const api = axios.create({
    baseURL: 'https://alwaysdata.net', 
    headers: {
        "Content-Type": "application/json"
    }
});

api.defaults.withCredentials = true;

export default api;
