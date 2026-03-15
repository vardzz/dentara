import { handlers } from "@/auth";

// Explicit exports for Next.js App Router (avoids 404 / ClientFetchError)
export const GET = handlers.GET;
export const POST = handlers.POST;
