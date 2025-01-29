import TeamList from "../components/TeamList";

export const SerieB = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <main className="max-w-6xl mx-auto py-8 px-4">
          <h2 className="text-3xl font-bold text-center text-gray-300 mb-6">
          Lista de Times da Série B
          </h2>
          <p className="text-center text-gray-300 mb-10">
          Clique em um time para explorar sua história e curiosidades.
          </p>
          <TeamList status="B"/>
      </main>
    </div>
  )
}
