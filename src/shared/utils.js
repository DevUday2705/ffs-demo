export const storage = {
    // Access Token management
    setAccessToken: (token, expiresIn = 3600) => {
        if (typeof window === 'undefined') {
            console.warn("setAccessToken: Running on server side, skipping localStorage");
            return false;
        }

        try {

            const expiryTime = Date.now() + (expiresIn * 1000);

            localStorage.setItem('accessToken', token);
            localStorage.setItem('tokenExpiry', expiryTime.toString());

            // Verify storage immediately
            const storedToken = localStorage.getItem('accessToken');
            const storedExpiry = localStorage.getItem('tokenExpiry');


            return true;
        } catch (error) {
            console.error("setAccessToken: Error storing token:", error);
            return false;
        }
    },

    getAccessToken: () => {
        if (typeof window === 'undefined') {
            console.warn("getAccessToken: Running on server side, returning null");
            return null;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const expiry = localStorage.getItem('tokenExpiry');


            if (!token || !expiry) {
                return null;
            }

            const expiryTime = parseInt(expiry);
            const currentTime = Date.now();
            const isExpired = currentTime > expiryTime;


            if (isExpired) {
                storage.clearAccessToken();
                return null;
            }

            return token;
        } catch (error) {
            console.error("getAccessToken: Error retrieving token:", error);
            return null;
        }
    },

    clearAccessToken: () => {
        if (typeof window === 'undefined') {
            console.warn("clearAccessToken: Running on server side, skipping localStorage");
            return;
        }

        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenExpiry');
        } catch (error) {
            console.error("clearAccessToken: Error clearing token:", error);
        }
    },

    setDecryptedID: (id) => {
        if (typeof window === 'undefined') {
            console.warn("setDecryptedID: Running on server side, skipping localStorage");
            return false;
        }

        try {
            localStorage.setItem('decryptedID', id);

            // Verify storage
            const stored = localStorage.getItem('decryptedID');
            return true;
        } catch (error) {
            console.error("setDecryptedID: Error storing ID:", error);
            return false;
        }
    },

    getDecryptedID: () => {
        if (typeof window === 'undefined') {
            console.warn("getDecryptedID: Running on server side, returning null");
            return null;
        }

        try {
            const id = localStorage.getItem('decryptedID');
            return id;
        } catch (error) {
            console.error("getDecryptedID: Error retrieving ID:", error);
            return null;
        }
    },

    setUserData: (userData) => {
        if (typeof window === 'undefined') {
            console.warn("setUserData: Running on server side, skipping localStorage");
            return false;
        }

        try {
            const dataString = JSON.stringify(userData);
            localStorage.setItem('userData', dataString);

            // Verify storage
            const stored = localStorage.getItem('userData');
            return true;
        } catch (error) {
            console.error("setUserData: Error storing user data:", error);
            return false;
        }
    },

    getUserData: () => {
        if (typeof window === 'undefined') {
            console.warn("getUserData: Running on server side, returning null");
            return null;
        }

        try {
            const data = localStorage.getItem('userData');

            if (!data) return null;

            const parsed = JSON.parse(data);
            return parsed;
        } catch (error) {
            console.error("getUserData: Error retrieving/parsing user data:", error);
            return null;
        }
    },

    clearSession: () => {
        if (typeof window === 'undefined') {
            console.warn("clearSession: Running on server side, skipping localStorage");
            return;
        }

        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('decryptedID');
            localStorage.removeItem('userData');

            // Verify clearing
            const remainingItems = [
                localStorage.getItem('accessToken'),
                localStorage.getItem('tokenExpiry'),
                localStorage.getItem('decryptedID'),
                localStorage.getItem('userData')
            ].filter(item => item !== null);

        } catch (error) {
            console.error("clearSession: Error clearing session:", error);
        }
    },

    hasValidSession: () => {
        if (typeof window === 'undefined') {
            console.warn("hasValidSession: Running on server side, returning false");
            return false;
        }

        try {
            const hasToken = storage.getAccessToken() !== null;
            const hasDecryptedID = storage.getDecryptedID() !== null;


            return hasToken && hasDecryptedID;
        } catch (error) {
            console.error("hasValidSession: Error checking session validity:", error);
            return false;
        }
    },

    // Debug function to inspect all stored data
    debugStorage: () => {
        if (typeof window === 'undefined') {
            return {};
        }

        try {
            const debug = {
                accessToken: !!localStorage.getItem('accessToken'),
                tokenExpiry: localStorage.getItem('tokenExpiry'),
                decryptedID: !!localStorage.getItem('decryptedID'),
                userData: !!localStorage.getItem('userData'),
                currentTime: Date.now()
            };

            return debug;
        } catch (error) {
            console.error("debugStorage: Error inspecting storage:", error);
            return {};
        }
    }
};