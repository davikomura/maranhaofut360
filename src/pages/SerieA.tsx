import { LeagueTable } from "../components/LeagueTable";

export const SerieA = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-gray-200">
      <main className="w-full max-w-7xl mx-auto py-14 px-6">
        <section className="bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-red-500 tracking-wider drop-shadow-lg">
            Tabela do Maranhense Série A
          </h2>
          <LeagueTable league="A" />
        </section>
      </main>
    </div>
  );
};
