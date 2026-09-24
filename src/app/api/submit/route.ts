import { QUESTIONS, TOTAL_QUESTIONS, scoreQuiz } from "@/lib/quiz-data";
import { saveResult } from "@/lib/supabase-server";

/**
 * POST /api/submit  { answers: string[] }  ->  { archetype, id }
 *
 * Validates that there is exactly one answer per question (in order), scores
 * on the server, and records the result. If the database write fails the
 * archetype is still returned so the quiz flow never breaks.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const answers = (body as { answers?: unknown })?.answers;
  if (
    !Array.isArray(answers) ||
    answers.length !== TOTAL_QUESTIONS ||
    !answers.every(
      (id, i) =>
        typeof id === "string" && QUESTIONS[i].answers.some((a) => a.id === id),
    )
  ) {
    return Response.json(
      { error: `Expected ${TOTAL_QUESTIONS} valid answer ids, one per question` },
      { status: 400 },
    );
  }

  const archetype = scoreQuiz(answers);

  let id: string | null = null;
  try {
    id = await saveResult(archetype, answers);
  } catch (err) {
    console.error("Failed to save quiz result", err);
  }

  return Response.json({ archetype, id });
}
