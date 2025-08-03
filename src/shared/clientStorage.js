// shared/utils/clientStorage.js
export const clientStorage = {
    // Only store user-related data on client side
    setUserData: (userData) => {
        if (typeof window === 'undefined') {
            console.warn("Client-side storage not available on server");
            return false;
        }

        try {
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userDataTimestamp', Date.now().toString());
            return true;
        } catch (error) {
            console.error("❌ Error storing user data:", error);
            return false;
        }
    },

    getUserData: () => {
        if (typeof window === 'undefined ') {
            return null;
        }

        try {
            const data = localStorage.getItem('userData');
            const timestamp = localStorage.getItem('userDataTimestamp');

            if (!data || !timestamp) return null;

            // Check if data is older than 1 hour
            const age = Date.now() - parseInt(timestamp);
            if (age > 3600000) { // 1 hour in milliseconds
                clientStorage.clearUserData();
                return null;
            }

            return JSON.parse(data);
        } catch (error) {
            console.error("❌ Error retrieving user data:", error);
            return null;
        }
    },

    setDecryptedID: (id) => {
        if (typeof window === 'undefined') {
            return false;
        }

        try {
            localStorage.setItem('decryptedID', id);
            localStorage.setItem('decryptedIDTimestamp', Date.now().toString());
            return true;
        } catch (error) {
            console.error("❌ Error storing decrypted ID:", error);
            return false;
        }
    },

    getDecryptedID: () => {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            const id = localStorage.getItem('decryptedID');
            const timestamp = localStorage.getItem('decryptedIDTimestamp');

            if (!id || !timestamp) return null;

            // Check if data is older than 30 minutes
            const age = Date.now() - parseInt(timestamp);
            if (age > 1800000) { // 30 minutes in milliseconds
                clientStorage.clearDecryptedID();
                return null;
            }

            return id;
        } catch (error) {
            console.error("❌ Error retrieving decrypted ID:", error);
            return null;
        }
    },

    clearUserData: () => {
        if (typeof window === 'undefined') return;

        localStorage.removeItem('userData');
        localStorage.removeItem('userDataTimestamp');
    },

    clearDecryptedID: () => {
        if (typeof window === 'undefined') return;

        localStorage.removeItem('decryptedID');
        localStorage.removeItem('decryptedIDTimestamp');
    },

    clearAll: () => {
        if (typeof window === 'undefined') return;

        clientStorage.clearUserData();
        clientStorage.clearDecryptedID();
    }
};