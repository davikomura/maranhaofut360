import TeamList from "../components/TeamList";

const Teams = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <main className="max-w-6xl mx-auto py-12 px-4">
        <section className="bg-gray-950/60 p-6 md:p-10 rounded-2xl shadow-xl backdrop-blur-md border border-white/10">
          <h2 id="teams" className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-blue-500 drop-shadow-md">
            Lista de Times
          </h2>
          <p className="text-center text-gray-300 mb-10 text-lg">
            Clique em um time para explorar sua história e curiosidades.
          </p>
          <TeamList />
        </section>
      </main>
    </div>
  );
};

export default Teams;