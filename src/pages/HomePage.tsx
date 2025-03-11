import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mt-6 md:mt-10 px-4 md:px-6 text-center">
        <p className="text-lg md:text-xl font-medium text-gray-300">Fique por dentro de tudo do futebol maranhense</p>
        <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Link
            to="/Serie-A"
            className="bg-gray-800 text-white p-4 md:p-8 rounded-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center border-t-4 border-yellow-500"
          >
            <span className="text-xl md:text-3xl font-extrabold">Série A</span>
            <p className="text-sm md:text-lg text-gray-400 mt-2">Primeira Divisão do Futebol Maranhense</p>
          </Link>
          <Link
            to="/Serie-B"
            className="bg-gray-800 text-white p-4 md:p-8 rounded-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center border-t-4 border-blue-500"
          >
            <span className="text-xl md:text-3xl font-extrabold">Série B</span>
            <p className="text-sm md:text-lg text-gray-400 mt-2">Segunda Divisão do Futebol Maranhense</p>
          </Link>
          <Link
            to="/Lista-de-campeoes"
            className="bg-gray-800 text-white p-4 md:p-8 rounded-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center border-t-4 border-green-500"
          >
            <span className="text-xl md:text-3xl font-extrabold">Campeões</span>
            <p className="text-sm md:text-lg text-gray-400 mt-2">Lista de todos os campeões maranhenses.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
