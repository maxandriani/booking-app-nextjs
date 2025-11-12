import { logoutAction } from "@/actions/auth";

export async function GET() {
    return logoutAction();
}