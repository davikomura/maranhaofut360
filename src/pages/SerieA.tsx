import { LeagueTable } from "../components/LeagueTable";

export const SerieA = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <main className="max-w-6xl mx-auto py-8 px-4">
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">
            Tabela do Campeonato Maranhense Série A
          </h2>
          <LeagueTable league="A" />
        </section>
      </main>
    </div>
  );
};