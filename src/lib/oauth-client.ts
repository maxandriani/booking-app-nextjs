export type CreateAuthorizationFlowUrlArgs = {
    authorizationUrl: URL;
    clientId: string;
    redirectUri: URL;
    scope?: string;
    codeChallenge?: string;
    state?: string;
};

export type FetchAccessTokenByRefreshTokenArgs = {
    tokenUrl: string;
    clientId: string;
    refreshToken: string;
    origin?: string;
};

export type FetchAccessTokenByAuthCoreArgs = {
    tokenUrl: URL;
    authCode: string;
    redirectUri: URL;
    codeVerifier: string;
    clientId: string;
};

export interface AccessTokenResponse {
    access_token: string,
    refresh_token?: string,
    token_type: string,
    expires_in: number,
    refresh_expires_in?: number,
    scope?: string,
    session_state?: string,
    id_token?: string
}

export interface OAuthErrorResponse {
    error: string,
    error_description?: string,
    error_uri?: string,
    state?: string
}

export class OAuthError extends Error {
    type: string;
    description?: string;
    uri?: string;
    state?: string;

    constructor(response: OAuthErrorResponse) {
        super(`${response.error}: ${response.error_description}`);
        this.name = 'OAuthError';
        this.type = response.error;
        this.description = response.error_description;
        this.uri = response.error_uri;
        this.state = response.state;
    }
}

export interface OpenidConfiguration {
    issuer: string,
    authorization_endpoint: string,
    token_endpoint: string,
    userinfo_endpoint: string,
    end_session_endpoint: string,
    jwks_uri: string
}

export async function asJsonResponse<T>(res: Response): Promise<T> {
    return res.json();
}

export async function handleOAuthErrorResponse(res: Response): Promise<Response> {
    if (res.ok) return res;
    const body = await res.json();
    throw new OAuthError(body);
}

export function createAuthorizationFlowUrl({ authorizationUrl, clientId, redirectUri, scope, codeChallenge, state }: CreateAuthorizationFlowUrlArgs): URL {
    const authUrl = new URL(authorizationUrl); // better clone the reference to avoid issues.
    const { searchParams } = authUrl;
    searchParams.set('response_type', 'code');
    searchParams.set('client_id', clientId);
    if (scope) searchParams.set('scope', scope);
    if (state) searchParams.set('state', state);
    if (codeChallenge) {
        searchParams.set('code_challenge_method', 'S256');
        searchParams.set('code_challenge', codeChallenge);
    }
    searchParams.set('redirect_uri', redirectUri.toString());
    return authUrl;
}

export interface CreateLogoutUrlParams {
    endSessionUrl: URL,
    clientId: string,
    redirectUri: URL
}

export function createLogoutUrl({ endSessionUrl, clientId, redirectUri }: CreateLogoutUrlParams): URL {
    const endSession = new URL(endSessionUrl);
    const { searchParams } = endSession;
    searchParams.set('client_id', clientId);
    searchParams.set('post_logout_redirect_uri', redirectUri.toString());
    return endSession;
}

export async function fetchAccessTokenByRefreshToken({ clientId, refreshToken, tokenUrl, origin }: FetchAccessTokenByRefreshTokenArgs): Promise<AccessTokenResponse> {
    const body = new URLSearchParams();

    body.set('client_id', clientId);
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);

    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    if (origin)
        headers.set('Origin', origin.toString());

    return fetch(tokenUrl, {
        headers,
        body,
        method: 'POST'
    })
        .then(handleOAuthErrorResponse)
        .then<AccessTokenResponse>(asJsonResponse);
}

export async function fetchAccessTokenByAuthCode({ authCode, clientId, codeVerifier, redirectUri, tokenUrl }: FetchAccessTokenByAuthCoreArgs): Promise<AccessTokenResponse> {
    const body = new URLSearchParams();

    body.set('client_id', clientId);
    body.set('grant_type', 'authorization_code');
    body.set('code', authCode);

    if (codeVerifier) {
        body.set('code_verifier', codeVerifier);
    }

    body.set('redirect_uri', redirectUri.toString());

    return fetch(tokenUrl, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Origin': redirectUri.origin },
        body,
        method: 'POST'
    })
        .then(handleOAuthErrorResponse)
        .then<AccessTokenResponse>(asJsonResponse);
}

export async function fetchOpenidConfiguration(authServer: URL): Promise<OpenidConfiguration> {
    return fetch(`${authServer}/.well-known/openid-configuration`)
        .then<OpenidConfiguration>(asJsonResponse)
}