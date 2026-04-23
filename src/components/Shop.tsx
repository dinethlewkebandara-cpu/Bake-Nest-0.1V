import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Product } from '../App';
import { ProductCard } from './ProductCard';

interface ShopProps {
  onAddToCart: (product: Product) => void;
}

export default function Shop({ onAddToCart }: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-serif text-bakery-brown mb-4 tracking-tight">Our Bakery Shop</h2>
        <p className="text-bakery-brown/60 max-w-2xl mx-auto italic">Browse our selection of freshly prepared treats, from rustic breads to elegant celebration cakes.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat 
                  ? 'bg-bakery-brown text-white shadow-md' 
                  : 'bg-white text-bakery-brown border border-bakery-border hover:border-bakery-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search our treats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bakery-cream border border-bakery-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bakery-accent/20 focus:border-bakery-accent transition-all placeholder:opacity-30"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-bakery-brown/40" />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 rounded-[40px] border border-dashed border-bakery-brown/20">
          <p className="text-xl font-serif text-bakery-brown/40 italic">We couldn't find any treats matching your search.</p>
        </div>
      )}
    </div>
  );
}
