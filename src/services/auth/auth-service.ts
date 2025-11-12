'use server';

import { decodeJwt, JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies, headers } from "next/headers";
import { AuthenticationError, AuthorizationError, TokenExpiredError } from '@/services/auth/auth-errors';
import { fetchAccessTokenByRefreshToken, fetchOpenidConfiguration } from '@/lib/oauth-client';
import { cache } from 'react';

const SEVEN_DAYS_SECONDS = 7 * 60 * 60;
const APP_AUTH_SESSION_SECRET = new TextEncoder().encode(process.env.APP_AUTH_SESSION_SECRET);
const APP_AUTH_CLIENT_ID = process.env.APP_AUTH_CLIENT_ID;
const SESSION_COOKIE_NAME = 'session';
const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export interface UserSession extends JWTPayload {
    firstName: string,
    lastName: string,
    roles: string[],
    email: string
}

export interface Session {
    user: UserSession;
    accessToken: string;
}

export interface CreateSession {
    user: UserSession;
    accessToken: string;
    accessTokenExpiresSeconds?: number;
    refreshToken?: string;
}

/**
 * Get the current session if current access_token is valid, otherwise negotiates an new access_token or returns undefined if there are no session.
 */
export const getServerSession = cache(async () => {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!sessionToken) return undefined;

        const { payload: user } = await jwtVerify<UserSession>(sessionToken, APP_AUTH_SESSION_SECRET);
        const accessToken = await getAccessToken();
        return { user, accessToken };
    } catch (err) {
        console.error(err);
        return undefined;
    }
});

export async function createServerSession({ user, accessToken, accessTokenExpiresSeconds, refreshToken }: CreateSession) {
    const sessionExpiresSeconds = SEVEN_DAYS_SECONDS;
    const cookieStore = await cookies();
    const sessionToken = await new SignJWT(user)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('urn:booking-app:sessions')
        .setExpirationTime(Date.now() + (sessionExpiresSeconds * 1000))
        .sign(APP_AUTH_SESSION_SECRET);

    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, { httpOnly: true, maxAge: sessionExpiresSeconds, path: `/`, sameSite: 'lax' });
    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true, maxAge: accessTokenExpiresSeconds, path: `/`, sameSite: 'lax' });

    if (!!refreshToken) {
        cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, { httpOnly: true, maxAge: sessionExpiresSeconds, path: `/`, sameSite: 'lax' });
    }
}

export async function destroyServerSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
}

/**
 * Get the current valid access token, negotiation was made from middleware now.
 * 
 * @returns An access token string.
 */
export async function getAccessToken(): Promise<string> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)!.value;
    return accessToken;
}

export async function refreshAccessToken(origin?: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

    if (!accessToken) return;

    // @todo corrigir isso pra validar com as chaves do EntraID
    const accessTokenClaims = decodeJwt(accessToken);

    if (!!accessTokenClaims?.exp && accessTokenClaims.exp < (Date.now() / 1000)) {
        if (!refreshToken) throw new TokenExpiredError(getAccessToken.name, 'access_token');
        // negotiate a new access_token
        const { token_endpoint: tokenUrl } = await fetchOpenidConfiguration(new URL(process.env.APP_AUTH_AUTHORITY_URL!));
        const response = await fetchAccessTokenByRefreshToken({ clientId: APP_AUTH_CLIENT_ID!, refreshToken, tokenUrl, origin });
        cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, response.access_token, { httpOnly: true, maxAge: response.expires_in, path: `/`, sameSite: 'lax' });
        if (response.refresh_token)
            cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, response.refresh_token, { httpOnly: true, maxAge: (7 * 60 * 60), path: `/`, sameSite: 'lax' });

        return response.access_token;
    }

    return accessToken;
}

/**
 * Get and Authorization Header string with current valid access token
 */
export async function getAuthorizationHeaders(): Promise<{ 'Authorization': string }> {
    const accessToken = await getAccessToken();
    return { 'Authorization': `Bearer ${accessToken}` };
}

export async function requireServerSession(resource: string): Promise<Session> {
    const session = await getServerSession();
    if (!session) throw new AuthenticationError(resource);
    return session;
}

export async function requireSessionRoles(resource: string, roles: string[]) {
    const session = await getServerSession();
    if (!session) throw new AuthenticationError(resource);
    if (!roles.some(role => session.user.roles.includes(role)))
        throw new AuthorizationError(roles.join(`, `), resource);
    return session;
}

export async function resolveServerHost(): Promise<URL> {
    const headerStore = await headers();
    if (headerStore.has('x-oauth-origin'))
        return new URL(headerStore.get('x-oauth-origin')!.toString());
    throw new Error('Unable to resolve next base url.');
}