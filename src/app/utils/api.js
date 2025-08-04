// utils/api.js - Fixed API utility functions with localStorage
import { API_CONFIG } from '@/shared/routes';
import { storage } from '../../shared/utils'
import { getCachedToken, storeToken } from '../../../utils/tokencache';



// Fixed function to get access token (checks localStorage first)

export async function getAccessToken() {
    const cached = getCachedToken();
    if (cached) {

        return cached;
    }

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
    console.log(token)
    const expiresIn = data.expires_in || 3600;

    if (!token) throw new Error("No access_token in response");

    storeToken(token, expiresIn);


    return token;
}

// Simple function to decrypt ID
async function decryptReqID(encryptedID, accessToken) {
    const response = await fetch(API_CONFIG.encryptURL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
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
    console.log(data.value)
    return data.value;
}

// Simple function to get user details
async function getUserDetails(decryptedID) {
    const url = `${API_CONFIG.userDetailsURL}('${decryptedID}')`;


    const response = await fetch(url);

    if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed to fetch user details. Status:", response.status, "Response:", errText);
        throw new Error('Failed to get user details');
    }

    const data = await response.json();
    return data;
}

// Main function that does all three API calls with localStorage optimization
export async function initializeUser(reqno) {
    try {

        // Check if we already have this data in localStorage
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



        // Step 1: Get token (will use cached if available)

        const accessToken = await getAccessToken();
        // Step 2: Decrypt the reqno to get the actual ID
        const decryptedID = await decryptReqID(reqno, accessToken);

        // Step 3: Get user details using the decrypted ID
        const userDetails = await getUserDetails(decryptedID);

        // Store everything in localStorage
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

// Optimized generateOTP function
export async function generateOTP(encryptedID) {
    try {
        // Use cached token if available
        const accessToken = await getAccessToken();
        const response = await fetch(API_CONFIG.sendOTP, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
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



// Optimized validateOTP function
export async function validateOTP(reqNo, otp) {
    try {
        // Use cached token if available
        const accessToken = await getAccessToken();

        const response = await fetch(API_CONFIG.validateOTP, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
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

// Utility function to clear all cached data (for logout)
export function clearUserSession() {
    storage.clearSession();
}

// export async function fetchDashboardData(reqNo) {
//     const decryptedID = storage.getDecryptedID();
//     const accessToken = storage.getAccessToken();

//     if (!decryptedID || !accessToken) {
//         throw new Error("Missing access token or decrypted ID");
//     }

//     console.log(
//         "Calling SAP API with token:",
//         accessToken.slice(0, 10) + "..."
//     );

//     const response = await fetch('/api/dashboard-data', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ accessToken, decryptedID }),
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//         throw new Error(result.error || "Failed to fetch dashboard data");
//     }

//     return result.data;
// }