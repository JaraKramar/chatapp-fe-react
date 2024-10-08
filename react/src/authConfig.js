import {api_domain, client_id, congnito_domain, JWKSDomain, userPoolId} from './config'

// const api_id = 'localhost:30000/dev'

export const authConfig = {
  accessTokenExpiringNotificationTimeInSeconds: 60,
  authority: `https://${congnito_domain}`,
  client_id: `${client_id}`,
  redirect_uri: `https://${api_domain}/callback`,
  post_logout_redirect_uri: `https://${api_domain}/`,
  response_type: 'code',
  scope: 'openid',
  useCodeChallenge: false,
  response_mode: 'query',
  metadata: {
    revokeAccessTokenOnSignout: true,
    issuer: `https://${congnito_domain}`,
    authorization_endpoint: `https://${congnito_domain}/oauth2/authorize`,
    token_endpoint: `https://${congnito_domain}/oauth2/token`,
    userinfo_endpoint: `https://${congnito_domain}/oauth2/userInfo`,
    end_session_endpoint: `https://${congnito_domain}/logout?client_id=${client_id}&redirect_uri=https://${api_domain}&response_type=code`,
    jwks_uri: `https://${JWKSDomain}/${userPoolId}/.well-known/jwks.json`,
    revocation_endpoint: `https://${congnito_domain}/oauth2/revoke`,
    revokeTokenTypes: "refresh_token"
  }
};