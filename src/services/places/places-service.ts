"use server";

import { trace } from "@opentelemetry/api";
import { AuditUser } from "@/services/audit/audit";
import { asJsonResponse, createUrl, fetchWithAuthorization, PaginationQuery, SortQuery } from "@/lib/fetch-utils";
import { requireServerSession } from "@/services/auth/auth-service";


export interface CreateUpdatePlace {
  name: string;
  address: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  created_at: number;
  created_by: AuditUser;
}

export async function createPlace(place: CreateUpdatePlace, abort?: AbortSignal): Promise<Place> {
  return trace.getTracer('places-service')
    .startActiveSpan(createPlace.name, async (span) => {
      try {
        await requireServerSession(createPlace.name);
        return fetchWithAuthorization(createUrl('/v2/places', process.env.APP_API_ENDPOINT_URL), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(place),
          signal: abort
        }).then(asJsonResponse<Place>);
      } finally {
        span.end();
      }
    });
}

export async function getPlaceById(id: string, abort?: AbortSignal): Promise<Place> {
  return trace.getTracer('places-service')
    .startActiveSpan(getPlaceById.name, async (span) => {
      try {
        await requireServerSession(getPlaceById.name);
        return fetchWithAuthorization(createUrl(`/v2/places/${id}`, process.env.APP_API_ENDPOINT_URL), {
          signal: abort
        }).then(asJsonResponse<Place>);
      } finally {
        span.end();
      }
    });
}

export async function updatePlaceById(id: string, place: Partial<CreateUpdatePlace>, abort?: AbortSignal): Promise<Place> {
  return trace.getTracer('places-service')
    .startActiveSpan(updatePlaceById.name, async (span) => {
      try {
        await requireServerSession(updatePlaceById.name);
        return fetchWithAuthorization(createUrl(`/v2/places/${id}`, process.env.APP_API_ENDPOINT_URL), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(place),
          signal: abort
        }).then(asJsonResponse<Place>);
      } finally {
        span.end();
      }
    });
}

export async function deletePlaceById(id: string, abort?: AbortSignal): Promise<void> {
  return trace.getTracer('places-service')
    .startActiveSpan(deletePlaceById.name, async (span) => {
      try {
        await requireServerSession(deletePlaceById.name);
        await fetchWithAuthorization(createUrl(`/v2/places/${id}`, process.env.APP_API_ENDPOINT_URL), {
          method: 'DELETE',
          signal: abort
        });
      } finally {
        span.end();
      }
    });
}

export type SearchPlacesQuery = PaginationQuery & SortQuery & {
  [key: string]: string | string[] | undefined;
  search?: string;
}

export async function searchPlaces(query?: SearchPlacesQuery, abort?: AbortSignal): Promise<Place[]> {
  return trace.getTracer('places-service')
    .startActiveSpan(searchPlaces.name, async (span) => {
      try {
        await requireServerSession(searchPlaces.name);
        return fetchWithAuthorization(createUrl('/v2/places', process.env.APP_API_ENDPOINT_URL, query), {
          signal: abort
        }).then(response => response.json());
      } finally {
        span.end();
      }
    });
}
