import React from 'react';
import { PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Product } from '../App';

interface FeaturedProductsProps {
  onAddToCart: (product: Product) => void;
  onViewAll: () => void;
}

export default function FeaturedProducts({ onAddToCart, onViewAll }: FeaturedProductsProps) {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <section className="py-24 bg-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-bakery-accent font-semibold tracking-widest uppercase text-xs mb-2 block">Our Daily Selection</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-bakery-soft-brown tracking-tighter italic">Today's Specials</h2>
          </div>
          <button 
            onClick={onViewAll}
            className="text-bakery-brown font-bold uppercase tracking-widest text-xs hover:underline mb-2 flex items-center gap-2"
          >
            Explore All Treats
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}
