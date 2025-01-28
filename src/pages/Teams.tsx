import TeamList from "../components/TeamList";

const Teams = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-600 via-white to-blue-700">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto py-8 px-4">
            <h2 id="teams" className="text-3xl font-bold text-center text-gray-800 mb-6">
            Lista de Times
            </h2>
            <p className="text-center text-gray-600 mb-10">
            Clique em um time para explorar sua história e curiosidades.
            </p>
            <TeamList />
        </main>
    </div>
  )
}

export default Teams
