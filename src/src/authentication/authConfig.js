import {API_DOMAIN, COGNITO_CLIENT_ID, COGNITO_DOMAIN, JWKS_DOMAIN, USER_POOL_ID} from '../config'

export const authConfig = {
  accessTokenExpiringNotificationTimeInSeconds: 60,
  authority: `https://${COGNITO_DOMAIN}`,
  client_id: `${COGNITO_CLIENT_ID}`,
  redirect_uri: `https://${API_DOMAIN}/callback`,
  post_logout_redirect_uri: `https://${API_DOMAIN}/`,
  response_type: 'code',
  scope: 'openid',
  useCodeChallenge: false,
  response_mode: 'query',
  metadata: {
    revokeAccessTokenOnSignout: true,
    issuer: `https://${COGNITO_DOMAIN}`,
    authorization_endpoint: `https://${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `https://${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `https://${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `https://${COGNITO_DOMAIN}/logout?COGNITO_CLIENT_ID=${COGNITO_CLIENT_ID}&redirect_uri=https://${API_DOMAIN}&response_type=code`,
    jwks_uri: `https://${JWKS_DOMAIN}/${USER_POOL_ID}/.well-known/jwks.json`,
    revocation_endpoint: `https://${COGNITO_DOMAIN}/oauth2/revoke`,
    revokeTokenTypes: "refresh_token"
  }
};