import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          <span className="text-yellow-400">Futebol</span> Maranhense 360
        </h1>
        <nav>
          <ul className="flex space-x-4 md:space-x-6 text-base md:text-lg font-medium">
            <li className="hover:text-yellow-400 transition duration-300">
              <Link to="/">Início</Link>
            </li>
            <li className="hover:text-yellow-400 transition duration-300">
              <Link to="/teams">Times</Link>
            </li>
            <li className="hover:text-yellow-400 transition duration-300">
              <Link to="/about">Sobre</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}