import { LeagueTable } from "../components/LeagueTable";

export const SerieB = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <main className="max-w-6xl mx-auto py-12 px-4">
        <section className="bg-gray-950/60 p-6 md:p-10 rounded-2xl shadow-xl backdrop-blur-md border border-white/10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-blue-600 tracking-wide drop-shadow-md">
            Tabela do Campeonato Maranhense Série B
          </h2>
          <LeagueTable league="B" />
        </section>
      </main>
    </div>
  );
};