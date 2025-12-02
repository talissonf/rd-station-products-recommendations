import React, { useState } from 'react';
import Form from './components/Form/Form';
import RecommendationList from './components/RecommendationList/RecommendationList';

function App() {
  const [recommendations, setRecommendations ] = useState([])

  /**
   * Dadas atualizações no formulário, necessário atualizar a lista de recomendações
   */

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center px-4">
        Recomendador de Produtos RD Station
      </h1>
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="col-span-1 md:col-span-2 mb-4">
          <p className="text-sm md:text-lg text-justify md:text-left" data-testid="welcome-text">
            Bem-vindo ao Recomendador de Produtos RD Station. Aqui você pode encontrar uma variedade de produtos da RD Station, cada um projetado para atender às necessidades específicas do seu negócio. De CRM a Marketing, de Conversas a Inteligência Artificial, temos uma solução para ajudar você a alcançar seus objetivos. Use o formulário abaixo para selecionar suas preferências e funcionalidades desejadas e receba recomendações personalizadas de produtos que melhor atendam às suas necessidades.
          </p>
        </div>
        <div className="w-full">
          <Form onRecommendationsChange={setRecommendations} />
        </div>
        <div className="w-full">
          <RecommendationList recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}

export default App;
