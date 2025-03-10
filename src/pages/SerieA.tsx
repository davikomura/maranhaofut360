import { LeagueTable } from "../components/LeagueTable";
// import TeamList from "../components/TeamList";

export const SerieA = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Seção da Tabela */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">
            Tabela do Campeonato Maranhense Série A
          </h2>
          <LeagueTable league="A" />
        </section>

        {/* Estatísticas */}
        {/* <section className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">
            Artilheiros e Estatísticas
          </h2>
        </section> */}

        {/* Lista de Times */}
        {/* <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">
          Times Participantes
        </h2>
        <TeamList status="A" /> */}

        {/* Histórico de edições */}
        {/* <section className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-300 mb-6">
            Histórico de Campeões
          </h2>
        </section> */}
      </main>
    </div>
  );
};
