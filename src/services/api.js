// API Configuration for Node.js Backend
const getBaseUrl = () => {
    // If we are in dev mode (npm run dev), use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // In production, assume API is at /api relative to the domain
    // Modify this if your production setup differs (e.g., https://api.yourdomain.com)
    return '/api';
};

const API_BASE_URL = getBaseUrl();

export const api = {
    // Helper to get token
    getHeaders: () => {
        const token = localStorage.getItem('token');
        return token ? {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        } : { 'Content-Type': 'application/json' };
    },

    // Helper: Upload Headers (Multipart - do not set Content-Type manually)
    getAuthHeadersOnly: () => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // Verify Token Validity
    verifyToken: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                headers: api.getHeaders()
            });
            return response.ok;
        } catch {
            return false;
        }
    },

    // Admin Login
    login: async (email, password) => {
        try {
                const useNode = await detectNodeApi();
                const url = useNode ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/login.php`;
                const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');

            // Store Token
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            return data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    },

    // Verify Backend Status
    checkStatus: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`); // Simple GET to check connectivity
            return response.ok ? { status: "ok" } : { status: "error" };
        } catch (error) {
            console.error("API Error", error);
            return { status: "error", message: "Could not connect to API" };
        }
    },

    // Get Content (for Students)
    getContent: async (subjectSlug) => {
        try {
            const url = `${API_BASE_URL}/content?subject=${encodeURIComponent(subjectSlug)}`;
            const response = await fetch(url);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Fetch Content Error", error);
            return [];
        }
    },

    // Search Content
    searchContent: async (query) => {
        try {
            const url = `${API_BASE_URL}/content/search?q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Search Error", error);
            return [];
        }
    },

    // Get Content by Slug
    getTopicBySlug: async (subjectSlug, topicSlug) => {
        try {
            const url = `${API_BASE_URL}/content/${encodeURIComponent(subjectSlug)}/${encodeURIComponent(topicSlug)}`;
            const response = await fetch(url);
            if (!response.ok) return null;
            const data = await response.json();
            // Node API returns object for single item, but check just in case
            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            console.error("Fetch Topic Error", error);
            return null;
        }
    },

    // Upload Content (for Admin)
    uploadContent: async (formData) => {
        try {
            const url = `${API_BASE_URL}/upload`;
            const response = await fetch(url, {
                method: 'POST',
                headers: api.getAuthHeadersOnly(), // Important: Let browser set Content-Type for FormData
                body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Upload failed");
            return data;
        } catch (error) {
            console.error("Upload Error", error);
            throw error;
        }
    },

    // Save Topic (Create)
    saveTopic: async (topicData) => {
        try {
            const url = `${API_BASE_URL}/content`;
            const response = await fetch(url, {
                method: 'POST',
                headers: api.getHeaders(),
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
            const response = await fetch(`${API_BASE_URL}/content`, {
                method: 'PUT',
                headers: api.getHeaders(),
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
            const response = await fetch(`${API_BASE_URL}/content/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: api.getHeaders()
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete");
            return data;
        } catch (error) {
            console.error("Delete Topic Error", error);
            throw error;
        }
    },

    // Get Site Settings
    getSettings: async () => {
        try {
            const url = `${API_BASE_URL}/settings`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error("Get Settings Error", error);
            throw error;
        }
    },

    // Save Site Settings
    saveSettings: async (settings) => {
        try {
            const url = `${API_BASE_URL}/settings`;
            const response = await fetch(url, {
                method: 'POST',
                headers: api.getHeaders(),
                body: JSON.stringify(settings)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to save settings");
            return data;
        } catch (error) {
            console.error("Save Settings Error", error);
            throw error;
        }
    }
};

