import mockProducts from "../mocks/mockProducts";

const mockAxios = {
  get: jest.fn(() => Promise.resolve({ data: mockProducts })),
};

export default mockAxios;
