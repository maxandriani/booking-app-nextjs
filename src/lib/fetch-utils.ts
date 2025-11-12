import { getAuthorizationHeaders } from "@/services/auth/auth-service";

export function createUrl(path: string, base?: string, queryParams?: { [key: string]: string | string[] }): URL {
    const fetchUrl = new URL(path, base);
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (Array.isArray(value)) {
                value.forEach(x => fetchUrl.searchParams.append(key, x));
            } else {
                fetchUrl.searchParams.set(key, value);
            }
        }
    }
    return fetchUrl;
}

export async function fetchWithAuthorization(input: string | URL | Request, init?: RequestInit) {
    const authHeaders = await getAuthorizationHeaders();
    return fetch(input, { ...init, headers: { ...init?.headers ?? {}, ...authHeaders } });
}

export async function asJsonResponse<T>(res: Response): Promise<T> {
    return res.json();
}