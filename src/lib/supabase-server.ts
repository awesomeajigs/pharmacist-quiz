import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ArchetypeId } from "@/lib/quiz-data";

// Server-only Supabase access. Only imported from route handlers — the
// browser never talks to Supabase directly. The database exposes just two
// functions (see supabase/migrations): submit_quiz_result and
// archetype_stats; the quiz_results table itself is not readable.

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export async function saveResult(
  archetype: ArchetypeId,
  answers: string[],
): Promise<string | null> {
  const supabase = getClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("submit_quiz_result", {
    p_archetype: archetype,
    p_answers: answers,
  });
  if (error) throw error;
  return data as string;
}

export async function fetchArchetypeCounts(): Promise<
  { archetype: ArchetypeId; count: number }[]
> {
  const supabase = getClient();
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("archetype_stats");
  if (error) throw error;
  return (data ?? []).map((row: { archetype: ArchetypeId; count: number | string }) => ({
    archetype: row.archetype,
    count: Number(row.count),
  }));
}
