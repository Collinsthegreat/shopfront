import { type NextRequest } from "next/server";
import { User, createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerCookieClient } from "@/lib/supabase/server";

export interface AuthResult {
  user: User | null;
  error: string | null;
}

/**
 * Validates authentication from incoming HTTP requests.
 * Supports BOTH:
 * 1. Bearer JWT token header (used by mobile app: Authorization: Bearer <token>)
 * 2. Next.js HTTP cookie sessions (used by web storefront via @supabase/ssr)
 */
export async function getUserFromRequest(request: Request | NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");

  if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
    const token = authHeader.replace(/^bearer\s*/i, "").trim();
    if (!token) {
      return { user: null, error: "Missing bearer token" };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

    // Validate token directly with Supabase Auth
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return { user: null, error: error?.message || "Invalid or expired token" };
    }

    return { user: data.user, error: null };
  }

  // Fallback to cookie-based session (web browser)
  try {
    const cookieClient = await createServerCookieClient();
    const {
      data: { user },
      error,
    } = await cookieClient.auth.getUser();

    if (error || !user) {
      return { user: null, error: error?.message || "Unauthorized" };
    }

    return { user, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Authentication error";
    return { user: null, error: msg };
  }
}
