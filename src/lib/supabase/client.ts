import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * 브라우저(Client Component)에서 사용하는 Supabase 클라이언트입니다.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
