// ---------------------------------------------------------------------------
// "What Kind of Pharmacist Are You?" — quiz content + scoring
//
// Content (questions, answer copy, result copy) is ported verbatim from the
// approved Figma file. The archetype tag on each answer (which of the 5
// archetypes it scores toward) was not stored anywhere retrievable from
// Figma — it only ever existed as design intent — so it was reconstructed
// here from each answer's tone/meaning, then balanced so every archetype
// scores exactly 8 times across the 40 answer slots (10 questions x 4
// options), and every question offers 4 different archetypes (one omitted
// per question, each archetype omitted exactly twice across the quiz).
// Review the `archetype` tags below if any feel off — they're easy to swap.
// ---------------------------------------------------------------------------

export type ArchetypeId =
  | "counselor"
  | "detective"
  | "sprinter"
  | "mentor"
  | "guardian";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  tagline: string;
  description: string;
  stat: string;
  color: string; // accent color
  colorEdge: string; // darker "3D edge" shade of the accent
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  counselor: {
    id: "counselor",
    name: "The Counselor",
    tagline: "You explain it until it clicks.",
    description:
      "You slow down for the person in front of you. Where others rush the counseling, you make sure the instructions actually land — because a prescription only works if someone understands it.",
    stat: "1 in 6 pharmacists test as The Counselor",
    color: "#0e8c7f",
    colorEdge: "#0b7065",
  },
  detective: {
    id: "detective",
    name: "The Detective",
    tagline: "You ask the one question everyone else forgot.",
    description:
      "You dig past the obvious — checking interactions, catching the error before it reaches the patient. Nothing gets dispensed until the puzzle adds up.",
    stat: "1 in 7 pharmacists test as The Detective",
    color: "#3462c4",
    colorEdge: "#28509c",
  },
  sprinter: {
    id: "sprinter",
    name: "The Sprinter",
    tagline: "You keep the line moving without missing a beat.",
    description:
      "Verify, count, label, check — you move through the queue with precision and pace, because patients waiting shouldn't mean patients waiting long.",
    stat: "1 in 5 pharmacists test as The Sprinter",
    color: "#ef962b",
    colorEdge: "#c97815",
  },
  mentor: {
    id: "mentor",
    name: "The Mentor",
    tagline: "You remember what it felt like to not know yet.",
    description:
      "You slow down for the new tech, the intern, the pharmacist a year behind you — because someone did the same for you once.",
    stat: "1 in 8 pharmacists test as The Mentor",
    color: "#8a5cb3",
    colorEdge: "#6d4590",
  },
  guardian: {
    id: "guardian",
    name: "The Guardian",
    tagline: "You catch what everyone else would have missed.",
    description:
      "Dosage, allergy, duplicate therapy — you're the last check before it reaches the patient, and you take that seriously every single time.",
    stat: "1 in 6 pharmacists test as The Guardian",
    color: "#287e44",
    colorEdge: "#1c5e32",
  },
};

// Tie-break order when two or more archetypes are level after all 10
// questions (established during the design phase).
export const TIE_BREAK_ORDER: ArchetypeId[] = [
  "counselor",
  "detective",
  "sprinter",
  "mentor",
  "guardian",
];

export interface Answer {
  id: string;
  text: string;
  archetype: ArchetypeId;
}

export interface Question {
  id: number; // 1-10
  prompt: string;
  answers: Answer[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt:
      "It's your first hour on shift. What's your instinct as the queue starts building?",
    answers: [
      { id: "q1a1", text: "Get through it fast and clean, no backlog", archetype: "sprinter" },
      { id: "q1a2", text: "Double-check anything that looks off before it's dispensed", archetype: "guardian" },
      { id: "q1a3", text: "Make sure whoever's shadowing you today can keep up", archetype: "mentor" },
      { id: "q1a4", text: "Slow down on anything you're not 100% sure about", archetype: "detective" },
    ],
  },
  {
    id: 2,
    prompt: "A regular patient looks confused reading their new label.",
    answers: [
      { id: "q2a1", text: "Walk them through it, slowly, until it clicks", archetype: "counselor" },
      { id: "q2a2", text: "Recheck the dose against their other medications first", archetype: "detective" },
      { id: "q2a3", text: "Answer their question quickly so the line keeps moving", archetype: "sprinter" },
      { id: "q2a4", text: "Ask what's confusing exactly, so it actually sticks this time", archetype: "mentor" },
    ],
  },
  {
    id: 3,
    prompt: "When you hand a patient their medicine, what matters most to you?",
    answers: [
      { id: "q3a1", text: "Making sure it's the right one, no mistakes", archetype: "guardian" },
      { id: "q3a2", text: "Making sure they understand how to take it", archetype: "counselor" },
      { id: "q3a3", text: "Getting them sorted quickly", archetype: "sprinter" },
      { id: "q3a4", text: "Catching anything that doesn't add up before they walk away", archetype: "detective" },
    ],
  },
  {
    id: 4,
    prompt: "You spot something slightly unusual on a prescription.",
    answers: [
      { id: "q4a1", text: "Pause everything and dig into it until it makes sense", archetype: "detective" },
      { id: "q4a2", text: "Flag it and confirm with the prescriber before moving on", archetype: "guardian" },
      { id: "q4a3", text: "Use it as a teaching moment for the intern next to you", archetype: "mentor" },
      { id: "q4a4", text: "Think about how you'd explain this to the patient if asked", archetype: "counselor" },
    ],
  },
  {
    id: 5,
    prompt: "A new tech asks a question you've answered a hundred times.",
    answers: [
      { id: "q5a1", text: "Explain it fully again, like it's the first time", archetype: "counselor" },
      { id: "q5a2", text: "Give the short answer, there's a queue", archetype: "sprinter" },
      { id: "q5a3", text: "Turn it back on them — what would you tell a patient?", archetype: "detective" },
      { id: "q5a4", text: "Ask what they think first, see how they reason it out", archetype: "mentor" },
    ],
  },
  {
    id: 6,
    prompt: "Two of a patient's meds could interact. How do you handle it?",
    answers: [
      { id: "q6a1", text: "You already caught it before they mentioned it", archetype: "detective" },
      { id: "q6a2", text: "Stop the dispense until it's fully resolved", archetype: "guardian" },
      { id: "q6a3", text: "Resolve it fast so they're not stuck waiting", archetype: "sprinter" },
      { id: "q6a4", text: "Walk the newer staff through how you spotted it", archetype: "mentor" },
    ],
  },
  {
    id: 7,
    prompt: "End of a brutal shift — what are you most proud of?",
    answers: [
      { id: "q7a1", text: "Nobody waited longer than they had to", archetype: "sprinter" },
      { id: "q7a2", text: "Not one mistake made it out the door", archetype: "guardian" },
      { id: "q7a3", text: "The new hire left knowing more than they came in with", archetype: "mentor" },
      { id: "q7a4", text: "A patient left actually understanding their treatment", archetype: "counselor" },
    ],
  },
  {
    id: 8,
    prompt: "A dosage looks technically correct, but something feels off.",
    answers: [
      { id: "q8a1", text: "You trust the feeling and look closer", archetype: "detective" },
      { id: "q8a2", text: "You verify against the full chart before dispensing", archetype: "guardian" },
      { id: "q8a3", text: "You ask the patient how they're actually taking it", archetype: "counselor" },
      { id: "q8a4", text: "You confirm it fast so you're not holding up the queue over nothing", archetype: "sprinter" },
    ],
  },
  {
    id: 9,
    prompt: "The compliment you'd actually want from a coworker:",
    answers: [
      { id: "q9a1", text: "You explain things better than anyone here", archetype: "mentor" },
      { id: "q9a2", text: "Nothing gets past you", archetype: "guardian" },
      { id: "q9a3", text: "You notice things nobody else would catch", archetype: "detective" },
      { id: "q9a4", text: "Patients actually relax when they talk to you", archetype: "counselor" },
    ],
  },
  {
    id: 10,
    prompt: "If your pharmacy gave an award, which would you want?",
    answers: [
      { id: "q10a1", text: "Fastest, most reliable turnaround", archetype: "sprinter" },
      { id: "q10a2", text: "Best mentor to new staff", archetype: "mentor" },
      { id: "q10a3", text: "Most trusted by patients", archetype: "counselor" },
      { id: "q10a4", text: "Best at catching what others miss", archetype: "guardian" },
    ],
  },
];

/** answerId -> archetype, computed once for fast lookups. */
const ANSWER_ARCHETYPE: Record<string, ArchetypeId> = QUESTIONS.reduce(
  (acc, q) => {
    q.answers.forEach((a) => {
      acc[a.id] = a.archetype;
    });
    return acc;
  },
  {} as Record<string, ArchetypeId>,
);

/**
 * Given an ordered list of chosen answer ids (one per question, in question
 * order), tally archetype points and resolve the winner. Ties are broken by
 * TIE_BREAK_ORDER.
 */
export function scoreQuiz(answerIds: string[]): ArchetypeId {
  const tally: Record<ArchetypeId, number> = {
    counselor: 0,
    detective: 0,
    sprinter: 0,
    mentor: 0,
    guardian: 0,
  };

  for (const id of answerIds) {
    const archetype = ANSWER_ARCHETYPE[id];
    if (archetype) tally[archetype] += 1;
  }

  let winner: ArchetypeId = TIE_BREAK_ORDER[0];
  let best = -1;
  for (const archetype of TIE_BREAK_ORDER) {
    if (tally[archetype] > best) {
      best = tally[archetype];
      winner = archetype;
    }
  }
  return winner;
}

export const TOTAL_QUESTIONS = QUESTIONS.length;

export const ANSWERS_STORAGE_KEY = "pharmacist-quiz-answers";
