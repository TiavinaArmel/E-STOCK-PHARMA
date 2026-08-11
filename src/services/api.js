import axios from "axios";

// On force l'URL absolue sans configuration dynamique pour le test
const api = axios.create({
    baseURL: 'https://alwaysdata.net',
    headers: {
        "Content-Type": "application/json"
    }
});

api.defaults.withCredentials = true;

export default api;
