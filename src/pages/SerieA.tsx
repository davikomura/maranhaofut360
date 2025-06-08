import { LeagueTable } from "../components/LeagueTable";

export const SerieA = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-black via-gray-900 to-black text-gray-100">
      <main className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-500 drop-shadow-sm tracking-tight mb-10">
          Tabela do Maranhense Série A
        </h2>
        <LeagueTable league="A" />
      </main>
    </div>
  );
};
