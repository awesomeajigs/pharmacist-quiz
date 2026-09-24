import type { Metadata } from "next";
import PrimaryButton from "@/components/PrimaryButton";
import ResultView from "@/components/ResultView";
import { ARCHETYPES, ArchetypeId } from "@/lib/quiz-data";

function isArchetypeId(value: string): value is ArchetypeId {
  return value in ARCHETYPES;
}

export function generateStaticParams() {
  return Object.keys(ARCHETYPES).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/result/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isArchetypeId(slug)) return {};
  const archetype = ARCHETYPES[slug];
  const title = `I'm ${archetype.name}! What kind of pharmacist are you?`;
  return {
    title,
    description: archetype.tagline,
    openGraph: { title, description: archetype.tagline, type: "website" },
    twitter: { card: "summary", title, description: archetype.tagline },
  };
}

export default async function ResultPage(props: PageProps<"/result/[slug]">) {
  const { slug } = await props.params;

  if (!isArchetypeId(slug)) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[16px] text-ink-soft">
          We couldn&rsquo;t find that result.
        </p>
        <PrimaryButton href="/">Back to Home</PrimaryButton>
      </main>
    );
  }

  return <ResultView archetype={ARCHETYPES[slug]} />;
}
