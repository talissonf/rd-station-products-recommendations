import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import mockProducts from './mocks/mockProducts';
import productService from './services/product.service';

jest.mock('./services/product.service');
// mocando o hook useProducts para evitar o sort feito no retorno do product.service
jest.mock('./hooks/useProducts', () => ({
  __esModule: true,
  default: () => ({
    preferences: mockProducts.flatMap((p) => p.preferences),
    features: mockProducts.flatMap((p) => p.features),
    products: mockProducts,
  }),
}));

const selectOptions = async (options) => {
  for (const optionText of options) {
    const option = await screen.findByText(new RegExp(optionText, 'i'));
    fireEvent.click(option);
  }
};

const submitForm = async (recommendationType) => {
  const radioInput = screen.getByDisplayValue(recommendationType);
  fireEvent.click(radioInput);

  const submitButton = screen.getByText(/Obter recomendação/i);
  await waitFor(() => expect(submitButton).not.toBeDisabled());
  fireEvent.click(submitButton);
};

describe('App Test', () => {
  beforeEach(() => {
    productService.mockResolvedValue(mockProducts);
  });

  test('fluxo completo: Retorna recomendação correta para SingleProduct com base nas preferências selecionadas', async () => {
    render(<App />);

    expect(
      screen.getByText('Recomendador de Produtos RD Station')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('welcome-text')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Nenhuma recomendação encontrada.')
    ).toBeInTheDocument();

    await selectOptions([
      'Integração com chatbots',
      'Chat ao vivo e mensagens automatizadas',
    ]);

    await submitForm('SingleProduct');

    await waitFor(() => {
      const recommendationTitle = screen.getByText(/RD Conversas/i);
      expect(recommendationTitle).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByText('Nenhuma recomendação encontrada.')
      ).not.toBeInTheDocument();
    });
  });

  test('fluxo completo: Retorna recomendações corretas para MultipleProducts com base nas preferências selecionadas', async () => {
    render(<App />);

    await selectOptions([
      'Integração fácil com ferramentas de e-mail',
      'Personalização de funis de vendas',
      'Automação de marketing',
      'Rastreamento de interações com clientes',
      'Rastreamento de comportamento do usuário',
    ]);

    await submitForm('MultipleProducts');

    await waitFor(() => {
      expect(screen.getByText('RD Station CRM')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('RD Station Marketing')).toBeInTheDocument();
    });
  });

  test('fluxo completo: Retorna apenas um produto para SingleProduct com mais de um produto de match', async () => {
    render(<App />);

    await selectOptions([
      'Integração fácil com ferramentas de e-mail',
      'Automação de marketing',
      'Rastreamento de interações com clientes',
      'Rastreamento de comportamento do usuário',
    ]);

    await submitForm('SingleProduct');

    await waitFor(() => {
      expect(screen.getByText('RD Station Marketing')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('RD Station CRM')).not.toBeInTheDocument();
    });
  });

  test('fluxo completo: Retorna o último match em caso de empate para SingleProduct', async () => {
    render(<App />);

    await selectOptions(['Automação de marketing', 'Integração com chatbots']);

    await submitForm('SingleProduct');

    await waitFor(() => {
      expect(screen.getByText('RD Conversas')).toBeInTheDocument();
    });
  });
});
