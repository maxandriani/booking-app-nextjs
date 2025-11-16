"use server";

import { asJsonResponse, createUrl, fetchWithAuthorization, PaginationQuery, SortQuery } from "@/lib/fetch-utils";
import { requireServerSession } from "@/services/auth/auth-service";
import { trace } from "@opentelemetry/api";
import { AuditUser } from "../audit/audit";

export interface Season {
    id: string;
    name: string;
    created_by: AuditUser;
    created_at: number;
}

export interface CreateSeason {
    name: string;
}

export type SearchSeasonsQuery = PaginationQuery & SortQuery & {
    [key: string]: string | string[] | undefined;
    search?: string;
}

const mockSeasons: Season[] = [
    {
        "id": "7d2c4afa-bce8-468e-842e-465976a065df",
        "name": "Verão 2025",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    },
    {
        "id": "50a16080-fe71-4990-b57d-362decf16576",
        "name": "Verão 2024",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    },
    {
        "id": "641856db-5019-40b1-a08b-d97dbf958a65",
        "name": "Verão 2023",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    },
    {
        "id": "e76b558b-9ed5-44c0-bd3a-36f5197f2f04",
        "name": "Verão 2022",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    },
    {
        "id": "11f5b567-0e6d-42c8-80b4-11ff5c0bd3b9",
        "name": "Verão 2021",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    },
    {
        "id": "77554a24-ce26-456c-89cf-f61f2a217ade",
        "name": "Verão 2020",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    },
    {
        "id": "424e545f-010d-4045-9ab4-4ca183d841ae",
        "name": "Verão 2019",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    },
    {
        "id": "424e545f-010d-4045-9ab4-4ca183d841a2",
        "name": "Verão 2018",
        "created_by": {
            "id": "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
            "name": "Max Andriani"
        },
        "created_at": 1763075272786
    }
];

export async function searchSeasons(query?: SearchSeasonsQuery, abort?: AbortSignal): Promise<Season[]> {
    return trace
        .getTracer('season-service')
        .startActiveSpan(searchSeasons.name, async (span) => {
            try {
                return Promise.resolve(mockSeasons);
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
                return Promise.resolve(mockSeasons.find(season => season.id === id)!);
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
                mockSeasons.push({
                    id: (Math.random() * 1000000).toFixed(0),
                    name: season.name,
                    created_by: {
                        id: "w5sndawDHEjBgZskvOZLLpuOgUebPQVe5QE9BM4g1j8",
                        name: "Max Andriani"
                    },
                    created_at: Date.now()
                });
                return Promise.resolve(mockSeasons[mockSeasons.length - 1]);
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
                return Promise.resolve().then(() => {
                    const index = mockSeasons.findIndex(season => season.id === id);
                    if (index >= 0) {
                        mockSeasons.splice(index, 1);
                    }
                });
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
                return Promise.resolve().then(() => {
                    const existingSeason = mockSeasons.find(s => s.id === id);
                    if (!existingSeason) throw new Error('Season not found');
                    if (season.name !== undefined) existingSeason.name = season.name;
                }).then(() => {
                    return mockSeasons.find(s => s.id === id)!;
                });
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