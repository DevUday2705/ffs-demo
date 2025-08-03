// utils/urlHelper.js - Simple helper to extract reqno from URL

/**
 * Extract reqno from a full URL
 * @param {string} fullUrl - The complete URL from the external system
 * @returns {string|null} - The extracted reqno parameter
 */
export function extractReqno(fullUrl) {
    try {
        const url = new URL(fullUrl);
        return url.searchParams.get('reqno');
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

/**
 * Example usage:
 * const fullUrl = 'https://dev-qas-lrnolmj4.launchpad.cfapps.us10.hana.ondemand.com/PidiliteFFSRoute.compidilitecustomerwssform/index.html?reqno=U2FsdGVkX18Ax1VBSDXemIe6HgAXlswQcp7OEVSyayyD66FD-5kmCgPzmKHKU-YS';
 * const reqno = extractReqno(fullUrl);
 * console.log(reqno); // U2FsdGVkX18Ax1VBSDXemIe6HgAXlswQcp7OEVSyayyD66FD-5kmCgPzmKHKU-YS
 */

// Alternative: If you need to redirect from the external URL to your login page
export function redirectToLogin(fullUrl) {
    const reqno = extractReqno(fullUrl);
    if (reqno) {
        // Redirect to your login page with the reqno parameter
        window.location.href = `/login?reqno=${encodeURIComponent(reqno)}`;
    } else {
        console.error('No reqno found in URL');
    }
}