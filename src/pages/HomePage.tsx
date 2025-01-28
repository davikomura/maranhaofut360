import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-600 via-white to-blue-700">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mt-6 md:mt-10 px-4 md:px-6 text-center">
        <p className="text-lg md:text-xl font-medium text-gray-800">Explore os clubes maranhenses por divisão ou veja os extintos</p>
        <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Link
            to="/divisao-a"
            className="bg-white text-gray-900 p-4 md:p-8 rounded-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center border-t-4 border-yellow-500"
          >
            <span className="text-xl md:text-3xl font-extrabold">Série A</span>
            <p className="text-sm md:text-lg text-gray-700 mt-2">Times da elite do futebol maranhense</p>
          </Link>
          <Link
            to="/divisao-b"
            className="bg-white text-gray-900 p-4 md:p-8 rounded-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center border-t-4 border-blue-500"
          >
            <span className="text-xl md:text-3xl font-extrabold">Série B</span>
            <p className="text-sm md:text-lg text-gray-700 mt-2">Clubes que disputam a segunda divisão</p>
          </Link>
          <Link
            to="/extintos"
            className="bg-white text-gray-900 p-4 md:p-8 rounded-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center border-t-4 border-red-500"
          >
            <span className="text-xl md:text-3xl font-extrabold">Times Extintos</span>
            <p className="text-sm md:text-lg text-gray-700 mt-2">Clubes que fizeram história no Maranhão</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

