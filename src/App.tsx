/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, Cake, Home, Tag, Star, ChevronRight, X, Plus, Minus, Check, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Shop from './components/Shop';
import CustomCakeForm from './components/CustomCakeForm';
import Cart from './components/Cart';
import Reviews from './components/Reviews';
import Auth from './components/Auth';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import FeaturedProducts from './components/FeaturedProducts';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export type Page = 'home' | 'shop' | 'custom' | 'cart' | 'reviews' | 'login' | 'checkout';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bakenest-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('bakenest-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const renderPage = () => {
    if (authLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-bakery-brown animate-spin mb-4" />
          <p className="text-serif text-bakery-brown/60 italic">Gathering ingredients...</p>
        </div>
      );
    }

    switch (activePage) {
      case 'home': return (
        <>
          <Hero onShopNow={() => setActivePage('shop')} onOrderCustom={() => setActivePage('custom')} />
          <FeaturedProducts onAddToCart={addToCart} onViewAll={() => setActivePage('shop')} />
          <div className="py-24 text-center">
            <h2 className="text-4xl font-serif text-bakery-brown mb-8">What Our Flocks Say</h2>
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-2xl font-serif italic text-bakery-soft-brown mb-6">"The sourdough here is life-changing! Perfect crust and airy center."</p>
              <p className="uppercase tracking-widest text-xs font-bold text-bakery-accent">— Emily Johnson, Regular Customer</p>
              <button 
                onClick={() => setActivePage('reviews')}
                className="mt-12 px-8 py-3 border border-bakery-brown/20 rounded-full text-sm font-medium hover:bg-bakery-brown hover:text-white transition-all"
              >
                Read More Stories
              </button>
            </div>
          </div>
        </>
      );
      case 'shop': return <Shop onAddToCart={addToCart} />;
      case 'custom': return <CustomCakeForm />;
      case 'cart': return <Cart 
        items={cart} 
        onUpdateQty={updateQuantity} 
        onRemove={removeFromCart} 
        onCheckout={() => setActivePage('checkout')}
        onContinueShopping={() => setActivePage('shop')}
      />;
      case 'reviews': return <Reviews />;
      case 'login': return <Auth onLogin={() => setActivePage('home')} />;
      case 'checkout': return <Checkout items={cart} onComplete={() => { clearCart(); setActivePage('home'); }} />;
      default: return <Hero onShopNow={() => setActivePage('shop')} onOrderCustom={() => setActivePage('custom')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-bakery-accent selection:text-white">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        user={user}
      />
      
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
