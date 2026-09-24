// ---------------------------------------------------------------------------
// "What Kind of Pharmacist Are You?" — quiz content + scoring
//
// Every question offers all 5 archetypes as options (5 answers per
// question, one per archetype), so each pick is worth exactly 1 point to
// that archetype. After 10 questions, whichever archetype has the most
// points wins; ties are broken by TIE_BREAK_ORDER. Questions are written
// as quick, playful "which one sounds like you" prompts (Nollywood
// characters, Nigerian food, confessions) rather than literal workplace
// scenarios, and answer wording avoids naming the archetype or trait
// directly.
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
// questions. Ordered by rarity (rarest archetype wins the tie first), so a
// tied result leans toward the stat that feels more special.
export const TIE_BREAK_ORDER: ArchetypeId[] = [
  "mentor",
  "detective",
  "sprinter",
  "counselor",
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
    prompt: "If your pharmacist side was a Nollywood character, who would you be?",
    answers: [
      { id: "q1a1", text: "Always three steps ahead, never resting", archetype: "sprinter" },
      { id: "q1a2", text: "Nothing gets past them, they don't miss anything", archetype: "guardian" },
      { id: "q1a3", text: "Everyone comes to them for advice", archetype: "mentor" },
      { id: "q1a4", text: "Calms everybody down when there's trouble", archetype: "counselor" },
      { id: "q1a5", text: "Always finds the one clue everybody else missed", archetype: "detective" },
    ],
  },
  {
    id: 2,
    prompt: "What's playing in your head during your shift at the counter?",
    answers: [
      { id: "q2a1", text: "Fast music, to keep you moving", archetype: "sprinter" },
      { id: "q2a2", text: "No sound, you're thinking hard about something", archetype: "detective" },
      { id: "q2a3", text: "Calm music, you're watching everything closely", archetype: "guardian" },
      { id: "q2a4", text: "Something you'd hum while teaching someone", archetype: "mentor" },
      { id: "q2a5", text: "Something warm, like talking to a friend", archetype: "counselor" },
    ],
  },
  {
    id: 3,
    prompt: "Which one sounds like something you would actually say?",
    answers: [
      { id: "q3a1", text: "\"Let me explain it well, so you understand.\"", archetype: "counselor" },
      { id: "q3a2", text: "\"Something is not right, let me check it well.\"", archetype: "detective" },
      { id: "q3a3", text: "\"I can't relax until I'm sure.\"", archetype: "guardian" },
      { id: "q3a4", text: "\"Don't worry, ask me again if you forget.\"", archetype: "mentor" },
      { id: "q3a5", text: "\"No wahala, let's keep moving.\"", archetype: "sprinter" },
    ],
  },
  {
    id: 4,
    prompt: "What annoys you the most at the counter?",
    answers: [
      { id: "q4a1", text: "People who can't explain what's wrong with them", archetype: "detective" },
      { id: "q4a2", text: "Someone rushing you before you finish checking", archetype: "guardian" },
      { id: "q4a3", text: "A patient who nods but you can tell they don't understand", archetype: "counselor" },
      { id: "q4a4", text: "A queue that refuses to move", archetype: "sprinter" },
      { id: "q4a5", text: "New staff who don't ask questions when they should", archetype: "mentor" },
    ],
  },
  {
    id: 5,
    prompt: "If your work style was a Nigerian food, what would it be?",
    answers: [
      { id: "q5a1", text: "Jollof rice at a party, fast and everyone gets fed on time", archetype: "sprinter" },
      { id: "q5a2", text: "Pepper soup, you dig in to find out what's really inside", archetype: "detective" },
      { id: "q5a3", text: "Amala and gbegiri, the classic combo you'll explain to anyone new", archetype: "counselor" },
      { id: "q5a4", text: "Egusi soup your mother taught you, you learned it and now you teach it too", archetype: "mentor" },
      { id: "q5a5", text: "Moi moi, cooked slow and checked well before it's served", archetype: "guardian" },
    ],
  },
  {
    id: 6,
    prompt: "Which compliment means the most to you?",
    answers: [
      { id: "q6a1", text: "\"You never miss anything.\"", archetype: "guardian" },
      { id: "q6a2", text: "\"You explain things so well.\"", archetype: "counselor" },
      { id: "q6a3", text: "\"You're fast, but you never make mistakes.\"", archetype: "sprinter" },
      { id: "q6a4", text: "\"You taught me everything I know.\"", archetype: "mentor" },
      { id: "q6a5", text: "\"You notice things nobody else notices.\"", archetype: "detective" },
    ],
  },
  {
    id: 7,
    prompt: "Which of these sounds most like you?",
    answers: [
      { id: "q7a1", text: "\"It's better to catch a problem early.\"", archetype: "guardian" },
      { id: "q7a2", text: "\"Don't rush to answer, ask more questions first.\"", archetype: "detective" },
      { id: "q7a3", text: "\"Time doesn't wait for anybody.\"", archetype: "sprinter" },
      { id: "q7a4", text: "\"Teach one person, and you teach many.\"", archetype: "mentor" },
      { id: "q7a5", text: "\"Patience solves most problems.\"", archetype: "counselor" },
    ],
  },
  {
    id: 8,
    prompt: "What's your worst nightmare at work?",
    answers: [
      { id: "q8a1", text: "Something bad happens and you didn't catch it on time", archetype: "guardian" },
      { id: "q8a2", text: "You answered a question without checking well first", archetype: "detective" },
      { id: "q8a3", text: "A patient leaves still confused, and you didn't notice", archetype: "counselor" },
      { id: "q8a4", text: "Someone you were teaching learns it the wrong way", archetype: "mentor" },
      { id: "q8a5", text: "The queue gets so long, nobody can catch up", archetype: "sprinter" },
    ],
  },
  {
    id: 9,
    prompt: "Pick your pharmacy superpower.",
    answers: [
      { id: "q9a1", text: "X-ray eyes, you see what everyone else missed", archetype: "guardian" },
      { id: "q9a2", text: "Reading minds, you just know what's really going on", archetype: "detective" },
      { id: "q9a3", text: "Super speed, nothing slows you down", archetype: "sprinter" },
      { id: "q9a4", text: "Instant trust, people open up to you easily", archetype: "counselor" },
      { id: "q9a5", text: "Being in two places at once, teaching and working", archetype: "mentor" },
    ],
  },
  {
    id: 10,
    prompt: "Be honest, what would your coworkers call you?",
    answers: [
      { id: "q10a1", text: "\"The fast one\"", archetype: "sprinter" },
      { id: "q10a2", text: "\"The one who asks too many questions\"", archetype: "detective" },
      { id: "q10a3", text: "\"The one patients ask for by name\"", archetype: "counselor" },
      { id: "q10a4", text: "\"Oga/Madam teach-am\"", archetype: "mentor" },
      { id: "q10a5", text: "\"The one who catches everything\"", archetype: "guardian" },
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
