import { loginAction } from "@/actions/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const from = req.nextUrl.searchParams.get('from') ?? '/';
    return loginAction(from);
}