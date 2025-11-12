import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "./services/auth/auth-service";

export default async function proxy(req: NextRequest) {
    await refreshAccessToken(req.nextUrl.origin); // refresh access token
    return NextResponse.next({
        headers: {
            'x-oauth-origin': req.nextUrl.origin
        }
    });
}