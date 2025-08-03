let tokenData = {
    accessToken: null,
    expiry: 0,
};

export function getCachedToken() {
    const now = Date.now();
    if (tokenData.accessToken && now < tokenData.expiry) {
        return tokenData.accessToken;
    }
    return null;
}

export function storeToken(token, expiresInSeconds) {
    tokenData.accessToken = token;
    tokenData.expiry = Date.now() + (expiresInSeconds - 30) * 1000; // 30s buffer
}