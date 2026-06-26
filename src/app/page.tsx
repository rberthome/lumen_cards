import { Button } from "@/design-system";

const principles = [
  { word: "sobre", note: "Le neutre porte ~90 % de l'écran." },
  {
    word: "initiatique",
    note: "L'or ne sert qu'au savoir et à la récompense.",
  },
  { word: "lumineux", note: "On lit la pensée en serif, on agit en sans." },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
      <div className="mb-7 flex items-center gap-3">
        <span
          className="h-11 w-11 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, #FEF3C7 0%, #FBBF24 38%, #D97706 100%)",
            boxShadow: "var(--shadow-gold)",
          }}
        />
        <span className="font-serif text-3xl font-semibold text-neutral-900">
          LumenCards
        </span>
      </div>

      <h1 className="mb-4 font-serif text-5xl font-semibold leading-tight text-neutral-900">
        La lumière de la connaissance
      </h1>
      <p className="mb-8 max-w-xl text-base leading-relaxed text-neutral-500">
        Révision par répétition espacée pour la philosophie, la Kabbale et le
        symbolisme maçonnique. Scaffold Next.js prêt — la boucle de révision
        arrive avec les prochaines issues.
      </p>

      <div className="mb-14 flex flex-wrap justify-center gap-3">
        {principles.map((p) => (
          <span
            key={p.word}
            title={p.note}
            className="rounded-full border border-gold-200 bg-gold-50 px-4 py-2 font-serif text-sm italic text-gold-700"
          >
            {p.word}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button>Réviser maintenant</Button>
        <Button variant="secondary">Voir les decks</Button>
        <Button variant="ghost">En savoir plus</Button>
      </div>
    </main>
  );
}
