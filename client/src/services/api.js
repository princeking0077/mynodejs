const API_BASE_URL = import.meta.env.PROD
    ? 'https://apexapps.in/api'
    : 'https://apexapps.in/api'; // In dev, we still hit the live Hostinger API if the PHP files are uploaded there

// Note: For this to work in dev (localhost), the PHP script on Hostinger must allow CORS from localhost (which we configured).

export const api = {
    // Admin Login
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
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
            const response = await fetch(`${API_BASE_URL}/test.php`);
            return await response.json();
        } catch (error) {
            console.error("API Error", error);
            return { status: "error", message: "Could not connect to API" };
        }
    },

    // Get Content (for Students)
    getContent: async (subjectSlug) => {
        try {
            const response = await fetch(`${API_BASE_URL}/get_content.php?subject=${subjectSlug}`);
            return await response.json();
        } catch (error) {
            console.error("Fetch Content Error", error);
            return [];
        }
    },

    // Upload Content (for Admin) - This will need to be handled by Electron specifically or a generic fetch
    uploadContent: async (formData) => {
        try {
            // We use fetch directly for FormData to let browser handle multipart headers
            const response = await fetch(`${API_BASE_URL}/upload.php`, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error("Upload Error", error);
            throw error;
        }
    },

    // Save Topic (Metadata + Code + Quiz)
    saveTopic: async (topicData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/save_topic.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            const response = await fetch(`${API_BASE_URL}/update_topic.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            const response = await fetch(`${API_BASE_URL}/delete_topic.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
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

