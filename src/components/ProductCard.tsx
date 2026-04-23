import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../App';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-bakery-border">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#8B5E3C] border border-bakery-border">
          {product.category}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 right-4 w-12 h-12 bg-bakery-brown text-white rounded-2xl flex items-center justify-center shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-bakery-soft-brown">{product.name}</h3>
          <span className="text-lg font-serif font-bold text-bakery-brown">Rs. {product.price.toLocaleString()}</span>
        </div>
        <p className="text-sm text-bakery-body line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}
