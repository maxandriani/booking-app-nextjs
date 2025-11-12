'use server';

import { createAuthorizationFlowUrl, createLogoutUrl, fetchAccessTokenByAuthCode, fetchOpenidConfiguration } from "@/lib/oauth-client";
import { generatePkcePair } from "@/lib/pkce";
import { createServerSession, destroyServerSession, getServerSession, resolveServerHost, Session, UserSession } from "@/services/auth/auth-service";
import { decodeJwt, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";

const { APP_AUTH_CLIENT_ID, APP_AUTH_AUTHORITY_URL } = process.env;

function redirectWithError(error: string, error_description?: string | null, path?: string | null) {
    const searchParams = new URLSearchParams();
    searchParams.set('error', error);
    if (!!error_description)
        searchParams.set('error_description', error_description);
    if (!!path)
        searchParams.set('from', path);
    const redirectPath = searchParams.size > 0 ? `/auth/error?${searchParams}` : '/auth/error';
    redirect(redirectPath);
}

export async function loginAction(callback: string = '/') {
    const cookieStore = await cookies();
    const session = await getServerSession();
    const clientId = APP_AUTH_CLIENT_ID!;
    const authorityUrl = new URL(APP_AUTH_AUTHORITY_URL!);
    const redirectUri = new URL('auth/callback', await resolveServerHost());
    
    // se existe uma sessão, então redireciona de volta para o from
    if (!!session) {
        redirect(callback);
    }

    await destroyServerSession();
    const [codeVerifier, codeChallenge] = await generatePkcePair();
    cookieStore.set('code_verifier', codeVerifier);

    const authServer = await fetchOpenidConfiguration(authorityUrl);

    const authUrl = createAuthorizationFlowUrl({
        authorizationUrl: new URL(authServer.authorization_endpoint),
        clientId,
        state: callback,
        redirectUri,
        codeChallenge,
        scope: `openid profile email offline_access ${clientId}/.default`
    });

    redirect(authUrl.toString());
}

export async function logoutAction(callback: string = '/') {
    await destroyServerSession();
    const authServer = await fetchOpenidConfiguration(new URL(APP_AUTH_AUTHORITY_URL!));
    const endSessionUrl = createLogoutUrl({
        endSessionUrl: new URL(authServer.end_session_endpoint),
        clientId: APP_AUTH_CLIENT_ID!,
        redirectUri: new URL(callback, await resolveServerHost())
    });
    redirect(endSessionUrl.toString());
}

export interface OAuthCallbackParams {
    code?: string | null;
    state?: string | null;
    error?: string | null;
    errorDescription?: string | null;
}

interface AzureIdentity extends JWTPayload {
    given_name: string,
    family_name: string,
    roles: string[],
    email: string
}

export async function processLoginCallbackAction({ code, state, error, errorDescription }: OAuthCallbackParams) {

    if (!!error)
        redirectWithError(error, errorDescription, state);

    try {
        const cookieStore = await cookies();
        const authServer = await fetchOpenidConfiguration(new URL(APP_AUTH_AUTHORITY_URL!));
        const redirectUri = new URL('auth/callback', await resolveServerHost());
        const tokenResponse = await fetchAccessTokenByAuthCode({
            tokenUrl: new URL(authServer.token_endpoint),
            authCode: code as string,
            clientId: process.env.APP_AUTH_CLIENT_ID!,
            codeVerifier: cookieStore.get(`code_verifier`)?.value ?? ``,
            redirectUri
        });

        // @todo corrigir isso aqui para validar de verdade o token da microsoft.
        const { sub, given_name: firstName, family_name: lastName, roles, email } = decodeJwt<AzureIdentity>(tokenResponse.access_token);
        const { access_token: accessToken, refresh_token: refreshToken, expires_in: accessTokenExpiresSeconds } = tokenResponse;

        const user: UserSession = {
            firstName,
            lastName,
            sub,
            roles,
            email
        }

        await createServerSession({
            user,
            accessToken,
            accessTokenExpiresSeconds,
            refreshToken
        });

        redirect(decodeURIComponent(state as string));
    } catch (err) {
        if (err instanceof Error) {
            if (err.message == 'NEXT_REDIRECT') throw err;

            redirectWithError(err.name, err.message);
        }
        redirectWithError('AuthorizationError', 'Unable to process the callback response due unknown issue.');
    }
}

export async function requiresAuthenticationPolicy(path: string): Promise<Session> {
    const session = await getServerSession();
    if (!session)
        redirect(`/auth/login?from=${path}`);
    return session;
}

export async function requiresRolesPolicy(roles: string[]): Promise<Session> {
    const session = await getServerSession();
    if (!session || !roles.some(role => session.user.roles.includes(role)))
        forbidden();
    return session;
}
