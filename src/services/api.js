import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tiavinaarmel.alwaysdata.net/pharmacie';



const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
api.defaults.withCredentials = true;

export default api;