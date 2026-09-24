import { ARCHETYPES, type ArchetypeId } from "@/lib/quiz-data";
import { fetchArchetypeCounts } from "@/lib/supabase-server";

export type StatsResponse = {
  total: number;
  byArchetype: Record<ArchetypeId, { count: number; pct: number }>;
};

/** GET /api/stats -> how many people got each archetype so far. */
export async function GET() {
  let rows: Awaited<ReturnType<typeof fetchArchetypeCounts>>;
  try {
    rows = await fetchArchetypeCounts();
  } catch (err) {
    console.error("Failed to load stats", err);
    return Response.json({ error: "Stats unavailable" }, { status: 503 });
  }

  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const byArchetype = Object.fromEntries(
    (Object.keys(ARCHETYPES) as ArchetypeId[]).map((id) => {
      const count = rows.find((r) => r.archetype === id)?.count ?? 0;
      return [id, { count, pct: total ? Math.round((count / total) * 100) : 0 }];
    }),
  ) as StatsResponse["byArchetype"];

  return Response.json({ total, byArchetype } satisfies StatsResponse, {
    // Never cached: result pages poll this so new completions show up live.
    headers: { "Cache-Control": "no-store" },
  });
}
