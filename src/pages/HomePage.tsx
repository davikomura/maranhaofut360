import TeamList from "../components/TeamList";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-white to-blue-700">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-yellow-400">Futebol</span> Maranhense 360
          </h1>
          <nav>
            <ul className="flex space-x-6 text-lg font-medium">
              <li className="hover:text-yellow-400 transition duration-300">
                <a href="#home">Início</a>
              </li>
              <li className="hover:text-yellow-400 transition duration-300">
                <a href="#teams">Times</a>
              </li>
              <li className="hover:text-yellow-400 transition duration-300">
                <a href="#about">Sobre</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="text-center py-4 bg-blue-900 text-white">
        © 2025 - Futebol Maranhense. Todos os direitos reservados.
      </footer>
    </div>

  );
}
