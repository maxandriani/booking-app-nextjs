import { processLoginCallbackAction } from "@/actions/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return processLoginCallbackAction({
        code: req.nextUrl.searchParams.get('code'),
        state: req.nextUrl.searchParams.get('state'),
        error: req.nextUrl.searchParams.get('error'),
        errorDescription: req.nextUrl.searchParams.get('error_description')
    });
}