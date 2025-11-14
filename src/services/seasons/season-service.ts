"use server";

import { asJsonResponse, createUrl, fetchWithAuthorization, PaginationQuery, SortQuery } from "@/lib/fetch-utils";
import { requireServerSession } from "@/services/auth/auth-service";
import { trace } from "@opentelemetry/api";

export interface Season {
    id: string;
    name: string;
    created_by: string;
    created_at: number;
}

export interface CreateSeason {
    name: string;
}

export type SearchSeasonsQuery = PaginationQuery & SortQuery & {
    [key: string]: string | string[] | undefined;
    search?: string;
}

export async function searchSeasons(query?: SearchSeasonsQuery, abort?: AbortSignal): Promise<Season[]> {
    return trace
        .getTracer('season-service')
        .startActiveSpan(searchSeasons.name, async (span) => {
            try {
                await requireServerSession(searchSeasons.name);
                const response = await fetchWithAuthorization(createUrl('/v2/seasons', process.env.APP_API_ENDPOINT_URL, query), { signal: abort })
                return response.json();
            } finally {
                span.end();
            }
        });
}

export async function getSeasonById(id: string, abort?: AbortSignal): Promise<Season> {
    return trace
        .getTracer('season-service')
        .startActiveSpan(getSeasonById.name, async (span) => {
            try {
                await requireServerSession(getSeasonById.name);
                return fetchWithAuthorization(createUrl(`/v2/seasons/${id}`, process.env.APP_API_ENDPOINT_URL), { signal: abort })
                    .then(asJsonResponse<Season>);
            } finally {
                span.end();
            }
        });
}

export async function createSeason(season: CreateSeason, abort?: AbortSignal): Promise<Season> {
    return trace
        .getTracer('season-service')
        .startActiveSpan(createSeason.name, async (span) => {
            try {
                await requireServerSession(createSeason.name);
                return fetchWithAuthorization(createUrl('/v2/seasons', process.env.APP_API_ENDPOINT_URL), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(season),
                    signal: abort
                })
                    .then(asJsonResponse<Season>);
            } finally {
                span.end();
            }
        });
}

export async function deleteSeasonById(id: string, abort?: AbortSignal): Promise<void> {
    return trace
        .getTracer('season-service')
        .startActiveSpan(deleteSeasonById.name, async (span) => {
            try {
                await requireServerSession(deleteSeasonById.name);
                await fetchWithAuthorization(createUrl(`/v2/seasons/${id}`, process.env.APP_API_ENDPOINT_URL), {
                    method: 'DELETE',
                    signal: abort
                });
            } finally {
                span.end();
            }
        });
}

export async function updateSeasonById(id: string, season: Partial<CreateSeason>, abort?: AbortSignal): Promise<Season> {
    return trace
        .getTracer('season-service')
        .startActiveSpan(updateSeasonById.name, async (span) => {
            try {
                await requireServerSession(updateSeasonById.name);
                return fetchWithAuthorization(createUrl(`/v2/seasons/${id}`, process.env.APP_API_ENDPOINT_URL), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(season),
                    signal: abort
                })
                    .then(asJsonResponse<Season>);
            } finally {
                span.end();
            }
        });
}