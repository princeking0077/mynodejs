// Node.js Backend API Service
// Since the frontend is served by the same Node server in production, we use a relative path '/api'.
// In development, Vite proxys '/api' to 'http://localhost:3000/api' (check vite.config.js) or we can hardcode.

const API_BASE_URL = '/api';

export const api = {
    // Admin Login
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');
            return data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    },

    // Verify Backend Status
    checkStatus: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error("API Error", error);
            return { status: "error", message: "Could not connect to API" };
        }
    },

    // Get Content (for Students/Admin)
    getContent: async (subjectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/content?subject=${subjectId}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error("Fetch Content Error", error);
            return [];
        }
    },

    // Upload Content (for Admin) 
    uploadContent: async (formData) => {
        try {
            // Need to send token for auth
            const user = JSON.parse(localStorage.getItem('apex_user'));
            const token = user?.token;

            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do NOT set Content-Type header for FormData, browser does it automatically with boundary
                },
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error("Upload Error", error);
            throw error;
        }
    },

    // Save Topic (Create)
    saveTopic: async (topicData) => {
        try {
            const user = JSON.parse(localStorage.getItem('apex_user'));
            const response = await fetch(`${API_BASE_URL}/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(topicData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to save");
            return data;
        } catch (error) {
            console.error("Save Topic Error", error);
            throw error;
        }
    },

    // Update Topic
    updateTopic: async (topicData) => {
        try {
            const user = JSON.parse(localStorage.getItem('apex_user'));
            const response = await fetch(`${API_BASE_URL}/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(topicData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update");
            return data;
        } catch (error) {
            console.error("Update Topic Error", error);
            throw error;
        }
    },

    // Delete Topic
    deleteTopic: async (id) => {
        try {
            const user = JSON.parse(localStorage.getItem('apex_user'));
            const response = await fetch(`${API_BASE_URL}/content/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete");
            return data;
        } catch (error) {
            console.error("Delete Topic Error", error);
            throw error;
        }
    }
};

