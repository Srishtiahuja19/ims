import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Ideally from env var
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token if available
api.interceptors.request.use((config) => {
    // Check sessionStorage first (new isolation mode), then localStorage (legacy/fallback)
    const storedUser = sessionStorage.getItem('ims_user') ||
        localStorage.getItem('ims_user') ||
        localStorage.getItem('admin_user');

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error("Failed to parse auth token", e);
        }
    }
    return config;
});

// Response interceptor to handle errors (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors (e.g. 401 logout)
        if (error.response?.status === 401) {
            // e.g., redirect to login or clear token
        }
        return Promise.reject(error);
    }
);

export default api;
