// utils/api.js - Cookie-based API utility functions
import { API_CONFIG } from '@/shared/routes';
import { storage } from '../../shared/utils';

// Cookie Token Manager with environment checks
class CookieTokenManager {
    constructor() {
        this.tokenCookieName = 'api_access_token';
        this.expiryCookieName = 'api_token_expiry';
        this.refreshPromise = null; // Prevent multiple concurrent token requests
        this.isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

        // Fallback to in-memory storage if cookies aren't available
        if (!this.isBrowser) {
            this.memoryStore = new Map();
        }
    }

    setCookie(name, value, expiresIn) {
        if (!this.isBrowser) {
            // Store in memory with expiration time
            this.memoryStore.set(name, {
                value,
                expires: Date.now() + expiresIn * 1000
            });
            return;
        }

        const expires = new Date(Date.now() + expiresIn * 1000);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
    }

    getCookie(name) {
        if (!this.isBrowser) {
            const stored = this.memoryStore.get(name);
            if (stored && Date.now() < stored.expires) {
                return stored.value;
            }
            this.memoryStore.delete(name); // Clean up expired
            return null;
        }

        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    deleteCookie(name) {
        if (!this.isBrowser) {
            this.memoryStore.delete(name);
            return;
        }

        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    }

    isTokenValid() {
        const token = this.getCookie(this.tokenCookieName);
        const expiry = this.getCookie(this.expiryCookieName);
        return token && expiry && Date.now() < parseInt(expiry);
    }

    getToken() {
        if (this.isTokenValid()) {
            return this.getCookie(this.tokenCookieName);
        }
        return null;
    }

    setToken(token, expiresIn) {
        this.setCookie(this.tokenCookieName, token, expiresIn);
        // Set expiry with 5-minute buffer to prevent edge cases
        this.setCookie(this.expiryCookieName, (Date.now() + (expiresIn - 300) * 1000).toString(), expiresIn);
    }

    clearToken() {
        this.deleteCookie(this.tokenCookieName);
        this.deleteCookie(this.expiryCookieName);

        // Also clear memory store if used
        if (!this.isBrowser) {
            this.memoryStore.clear();
        }
    }

    async fetchNewToken() {
        const credentials = btoa(`${API_CONFIG.clientId}:${API_CONFIG.clientSecret}`);
        const response = await fetch(API_CONFIG.tokenURL, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: API_CONFIG.clientId,
                client_secret: API_CONFIG.clientSecret,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get access token');
        }

        const data = await response.json();
        const token = data.access_token;
        const expiresIn = data.expires_in || 3600;

        if (!token) throw new Error("No access_token in response");

        this.setToken(token, expiresIn);
        console.log('New token fetched and stored in cookies');
        return token;
    }

    async getValidToken(forceRefresh = false) {
        // Return cached token if valid and not forcing refresh
        if (!forceRefresh && this.isTokenValid()) {
            return this.getToken();
        }

        // If already refreshing, wait for that promise
        if (this.refreshPromise) {
            return await this.refreshPromise;
        }

        // Start token refresh
        this.refreshPromise = this.fetchNewToken();

        try {
            const token = await this.refreshPromise;
            return token;
        } finally {
            this.refreshPromise = null;
        }
    }
}

// Create singleton instance
const cookieTokenManager = new CookieTokenManager();

// Main function to get access token
export async function getAccessToken(forceRefresh = false) {
    return await cookieTokenManager.getValidToken(forceRefresh);
}

// Wrapper function that automatically handles token refresh on 401
async function makeAuthenticatedRequest(url, options = {}) {
    let token = await getAccessToken();

    const makeRequest = async (authToken) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${authToken}`,
            },
        });
    };

    let response = await makeRequest(token);

    // If we get 401, try refreshing token once
    if (response.status === 401) {
        console.log('Token expired, refreshing...');
        token = await getAccessToken(true); // Force refresh
        response = await makeRequest(token);
    }

    return response;
}

// Function to decrypt ID with automatic token handling
async function decryptReqID(encryptedID) {
    const response = await makeAuthenticatedRequest(API_CONFIG.encryptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            urlSafeEncryptedID: encryptedID
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to decrypt ID');
    }

    const data = await response.json();
    console.log('Decrypted ID:', data.value);
    return data.value;
}

// Function to get user details with automatic token handling
async function getUserDetails(decryptedID) {
    const url = `${API_CONFIG.userDetailsURL}('${decryptedID}')`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed to fetch user details. Status:", response.status, "Response:", errText);
        throw new Error('Failed to get user details');
    }

    const data = await response.json();
    return data;
}

// Main function that handles the complete user initialization flow
export async function initializeUser(reqno) {
    try {
        // Check if we already have this data in storage
        const existingDecryptedID = storage.getDecryptedID();
        const existingUserData = storage.getUserData();

        if (existingDecryptedID && existingUserData && storage.hasValidSession()) {
            return {
                success: true,
                data: existingUserData,
                decryptedID: existingDecryptedID,
                fromCache: true
            };
        }

        // Step 1: Get token (will use cached token from cookies if available)
        await getAccessToken();

        // Step 2: Decrypt the reqno to get the actual ID
        const decryptedID = await decryptReqID(reqno);

        // Step 3: Get user details using the decrypted ID
        const userDetails = await getUserDetails(decryptedID);

        // Store everything in storage (keeping your existing storage for user data)
        storage.setDecryptedID(decryptedID);
        storage.setUserData(userDetails);

        return {
            success: true,
            data: userDetails,
            decryptedID: decryptedID,
            fromCache: false
        };
    } catch (error) {
        console.error("Error in initializeUser:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Generate OTP function with automatic token handling
export async function generateOTP(encryptedID) {
    try {
        const response = await makeAuthenticatedRequest(API_CONFIG.sendOTP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                EncryptedID: encryptedID,
                forceOTP: true,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to generate OTP');
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error in generateOTP:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Validate OTP function with automatic token handling
export async function validateOTP(reqNo, otp) {
    try {
        const response = await makeAuthenticatedRequest(API_CONFIG.validateOTP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ReqNo: reqNo,
                OTP: otp
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to validate OTP');
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error in validateOTP:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Upload document function with automatic token handling
export async function uploadDocumentToService(uploadData) {
    try {
        const serviceEndpoint = API_CONFIG.uploadDoc

        const response = await makeAuthenticatedRequest(serviceEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Service error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Document upload service error:', error);
        return {
            success: false,
            error: error.message || 'Failed to upload document to service'
        };
    }
}

// Utility function to clear all cached data (for logout)
export function clearUserSession() {
    // Clear token cookies
    cookieTokenManager.clearToken();

    // Clear other user data from storage
    if (storage && storage.clearSession) {
        storage.clearSession();
    }
}

// Utility function to check if user is authenticated
export function isAuthenticated() {
    return cookieTokenManager.isTokenValid();
}

// Utility function to manually refresh token
export async function refreshToken() {
    try {
        const token = await getAccessToken(true);
        return { success: true, token };
    } catch (error) {
        return { success: false, error: error.message };
    }
}