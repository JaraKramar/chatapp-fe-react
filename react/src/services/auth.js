import { cognito_domain, client_id } from '../config';


// Utility function to safely get the user data from sessionStorage
const getUserFromSession = () => {
    const user_raw = sessionStorage.getItem(`oidc.user:https://${cognito_domain}:${client_id}`);
    if (!user_raw) return null;
    try {
      return JSON.parse(user_raw);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
};

const getHeader = (_user) => {
    const token = _user?.access_token || null;
    const header = token ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    } : null;
    return { header, token }; // Return both header and token as an object
};

const user = getUserFromSession() || null;
const { header, token } = getHeader(user);

export { header, token, user };