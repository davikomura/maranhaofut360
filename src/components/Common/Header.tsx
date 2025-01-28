import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-900 text-gray-300 shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          <span className="text-red-500">Futebol</span>{" "}
          <span className="text-blue-500">Maranhense</span>{" "}
          <span className="text-white">360</span>
        </h1>
        <nav>
          <ul className="flex space-x-4 md:space-x-6 text-base md:text-lg font-medium">
            <li className="hover:text-red-500 transition duration-300">
              <Link to="/">Início</Link>
            </li>
            <li className="hover:text-blue-500 transition duration-300">
              <Link to="/teams">Times</Link>
            </li>
            <li className="hover:text-white transition duration-300">
              <Link to="/about">Sobre</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}