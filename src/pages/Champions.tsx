import data from "../../data.json";

export const Champions = () => {
  const { champions } = data;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Container centralizado e destacado pela borda */}
      <div className="max-w-4xl w-full mx-auto p-8 flex-1 border border-gray-600 rounded-md bg-transparent">
        <h1 className="text-3xl font-bold mb-6">Lista de Campeões</h1>
        
        {/* Tabela com rolagem horizontal em telas pequenas */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-white border-collapse">
            <thead>
              <tr className="border-b border-gray-600 bg-gray-800">
                <th className="px-4 py-2 text-left">Ano</th>
                <th className="px-4 py-2 text-left">Campeão</th>
                <th className="px-4 py-2 text-left">Vice</th>
              </tr>
            </thead>
            <tbody>
              {champions.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-2 border-b border-gray-600">
                    {item.year}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {item.champion}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {item.runner_up || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};