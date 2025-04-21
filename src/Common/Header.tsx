import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-md border-b border-red-600">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <Link to="/" title="FutMA 360 - Página inicial" className="flex items-center space-x-3">
          <img
            src="/logo/futma360_2.png"
            alt="FutMA 360 - Logo"
            className="h-12 md:h-16 object-contain drop-shadow hover:scale-105 transition duration-300"
          />
          <span className="text-xl md:text-2xl font-extrabold tracking-wide text-white">
            FutMA <span className="text-red-500">360</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-4 md:space-x-8 text-sm md:text-lg font-semibold">
            <li>
              <Link
                to="/"
                className="text-white hover:text-red-500 transition duration-300 border-b-2 border-transparent hover:border-red-500"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/teams"
                className="text-white hover:text-blue-500 transition duration-300 border-b-2 border-transparent hover:border-blue-500"
              >
                Times
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-white hover:text-yellow-400 transition duration-300 border-b-2 border-transparent hover:border-yellow-400"
              >
                Sobre
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}