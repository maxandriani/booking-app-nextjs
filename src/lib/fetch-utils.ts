import { getAuthorizationHeaders } from "@/services/auth/auth-service";

export interface PaginationQuery {
    page?: number;
    pageSize?: number;
}

export interface SortQuery {
    sortBy?: string;
}

export function createUrl(path: string, base?: string, queryParams?: { [key: string]: string | string[] | undefined }): URL {
    const fetchUrl = new URL(path, base);
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (Array.isArray(value)) {
                value.forEach(x => fetchUrl.searchParams.append(key, x));
            } else if (value !== undefined) {
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