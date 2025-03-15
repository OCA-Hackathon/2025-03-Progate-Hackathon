export async function getCognitoPublicKey() {
    try {
        console.log("Fetching accessToken from /api/auth...");
        const response = await fetch("/api/auth", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            console.error("Failed to fetch token, Status:", response.status);
            return false;
        }

        const data = await response.json();

        return data.accessToken;
    } catch (error) {
        console.error("Token validation failed:", error);
        return false;
    }
}
