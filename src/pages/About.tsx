export const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-300">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Sobre o Projeto
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-center">
          Este projeto tem como objetivo divulgar e organizar informações sobre o Campeonato Maranhense,
          permitindo que torcedores acompanhem a classificação dos times, conheçam mais sobre as equipes,
          e fiquem por dentro de curiosidades e estatísticas do torneio.
        </p>
      </main>
    </div>
  );
};
