const fs = require('fs');
const path = require('path');

// Import your weekly features data
const { weeklyFeatures } = require('./productData');

const updatedWeekly = weeklyFeatures.map((item, index) => {
  const {
    name,
    itemImg,
    newItemPrice,
    oldItemPrice,
    brand,
    category,
    color,
    OS,
    CPU,
  } = item.itemInfo;

  const cleanNewPrice = Number(newItemPrice) || 0;
  const cleanOldPrice =
    Number(
      typeof oldItemPrice === 'string'
        ? oldItemPrice.replace(/\$/g, '')
        : oldItemPrice,
    ) || 0;

  return {
    productId: `w-${index + 1}`,
    name: name || '',
    images: itemImg || [],
    newItemPrice: cleanNewPrice,
    oldItemPrice: cleanOldPrice,
    price: cleanNewPrice,
    brand: brand || '',
    category: category || '',
    color: color || '',
    OS: OS || '',
    CPU: CPU || '',
    collection: '',
    discount: '',
    badge: '',
    isRecentlyAdded: false,
    feature: 'weekly',
  };
});

const output = `const product = ${JSON.stringify(updatedWeekly, null, 2)};\n\nmodule.exports = { product };`;

fs.writeFileSync(
  path.join(__dirname, 'weeklyFeatureCleaned.js'),
  output,
  'utf8',
);

console.log(
  '✅ Weekly featured products cleaned and written to weeklyFeatureCleaned.js',
);
