import { Link } from "react-router-dom";

export default function TeamCard({ team }: { team: any }) {
  return (
    <div className="flex flex-col items-center border rounded-lg shadow-lg bg-white p-4 hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
      <div className="w-full aspect-square overflow-hidden rounded-md mb-4">
        <img
          src={team.image}
          alt={team.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-lg font-bold text-gray-800 text-center">
        {team.name}
      </h2>
      <Link
        to={`/team/${team.id}`}
        className="mt-2 text-blue-600 font-medium hover:text-blue-800 hover:underline"
      >
        Ver mais
      </Link>
    </div>
  );
}
