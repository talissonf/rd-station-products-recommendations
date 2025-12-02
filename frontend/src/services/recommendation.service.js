// recommendation.service.js

const calculateProductScore = (product, preferencesSet, featuresSet) => {
  let score = 0;

  if (preferencesSet.size > 0 && product.preferences) {
    const productPrefsSet = new Set(product.preferences);
    for (const pref of preferencesSet) {
      if (productPrefsSet.has(pref)) {
        score++;
      }
    }
  }

  if (featuresSet.size > 0 && product.features) {
    const productFeaturesSet = new Set(product.features);
    for (const feat of featuresSet) {
      if (productFeaturesSet.has(feat)) {
        score++;
      }
    }
  }

  return score;
};

const findBestSingleProduct = (products, preferencesSet, featuresSet) => {
  let bestProduct = null;
  let maxScore = 0;

  for (const product of products) {
    const score = calculateProductScore(product, preferencesSet, featuresSet);

    if (score > 0 && score >= maxScore) {
      maxScore = score;
      bestProduct = product;
    }
  }

  return bestProduct;
};

const getRecommendations = (
  formData = {
    selectedPreferences: [],
    selectedFeatures: [],
    selectedRecommendationType: '',
  },
  products = []
) => {
  if (
    !Array.isArray(products) ||
    products.length === 0 ||
    !formData.selectedRecommendationType === 'SingleProduct' ||
    !formData.selectedRecommendationType === 'MultipleProducts'
  ) {
    return [];
  }
  const { selectedPreferences, selectedFeatures, selectedRecommendationType } = formData;

  const preferencesSet = new Set(selectedPreferences);
  const featuresSet = new Set(selectedFeatures);

  if (selectedRecommendationType === 'SingleProduct') {
    const bestProduct = findBestSingleProduct(
      products,
      preferencesSet,
      featuresSet
    );
    return bestProduct ? [bestProduct] : [];
  }

  const productsWithScore = [];

  for (const product of products) {
    const score = calculateProductScore(product, preferencesSet, featuresSet);
    if (score > 0) {
      productsWithScore.push({ product, score });
    }
  }

  productsWithScore.sort((a, b) => b.score - a.score);

  return productsWithScore.map(({ product }) => product);
};

export default { getRecommendations };
