import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/shared/routes';

// Token Manager for Server Environment (Next.js API route)
class ServerTokenManager {
    constructor() {
        this.tokenCache = null;
        this.tokenExpiry = null;
        this.refreshPromise = null;
    }

    isTokenValid() {
        return this.tokenCache && this.tokenExpiry && Date.now() < this.tokenExpiry;
    }

    setToken(token, expiresIn) {
        this.tokenCache = token;
        // Set expiry 5 minutes before actual expiry for safety buffer
        this.tokenExpiry = Date.now() + ((expiresIn - 300) * 1000);
    }

    clearToken() {
        this.tokenCache = null;
        this.tokenExpiry = null;
        this.refreshPromise = null;
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
        console.log('New token fetched for dashboard API');
        return token;
    }

    async getToken(forceRefresh = false) {
        // Return cached token if valid and not forcing refresh
        if (!forceRefresh && this.isTokenValid()) {
            return this.tokenCache;
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

// Create singleton instance for the API route
const serverTokenManager = new ServerTokenManager();

// Wrapper function for authenticated requests
async function makeAuthenticatedRequest(url, options = {}) {
    let token = await serverTokenManager.getToken();

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
        console.log('Token expired in dashboard API, refreshing...');
        token = await serverTokenManager.getToken(true); // Force refresh
        response = await makeRequest(token);
    }

    return response;
}

// Updated function to get user details with expand params and bearer token
async function getUserDetailsWithExpand(decryptedID) {
    const expandParams = '$expand=Stock_Receivables,PriorClaimStatus,PendingPILLiability';
    const url = `${API_CONFIG.userDetailsURL}('${decryptedID}')?${expandParams}`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed to fetch dashboard data. Status:", response.status, "Response:", errText);
        throw new Error('Failed to get dashboard data');
    }

    const data = await response.json();
    return data;
}

export async function POST(request) {
    try {
        const { reqNo } = await request.json();

        if (!reqNo) {
            return NextResponse.json(
                { success: false, error: 'Missing reqNo parameter' },
                { status: 400 }
            );
        }

        // Use reqNo directly as decryptedID (since you mentioned they're the same)
        const dashboardData = await getUserDetailsWithExpand(reqNo);

        return NextResponse.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error("❌ Error in get-dashboard-data:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}