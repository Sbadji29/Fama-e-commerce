import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onAddToCart, onViewDetails }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">Aucun produit trouvé dans cette catégorie.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 py-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
