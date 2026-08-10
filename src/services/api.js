import axios from "axios";

const API_URL = "http://localhost/E_STOCK_PHARMA/backend/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
api.defaults.withCredentials = true;

export default api;