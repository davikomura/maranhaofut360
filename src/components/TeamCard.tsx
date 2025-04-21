import { Link } from "react-router-dom";

export default function TeamCard({ team }: { team: any }) {
  return (
    <div className="flex flex-col items-center border border-gray-700 rounded-2xl shadow-md bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
      <div className="w-full aspect-square overflow-hidden rounded-xl mb-4 border border-gray-700">
        <img
          src={team.image}
          alt={team.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h2 className="text-lg font-semibold text-gray-200 text-center">
        {team.name}
      </h2>
      <Link
        to={`/team/${team.id}`}
        className="mt-2 text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors"
      >
        Ver mais
      </Link>
    </div>
  );
}
