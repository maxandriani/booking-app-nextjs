import { registerOTel } from "@vercel/otel";

export function register() {
    registerOTel('booking-app-nextjs');
}