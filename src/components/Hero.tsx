import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onOrderCustom: () => void;
}

export default function Hero({ onShopNow, onOrderCustom }: HeroProps) {
  return (
    <div className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <svg width="400" height="400" viewBox="0 0 400 400">
          <circle cx="300" cy="100" r="150" fill="#5A5A40" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-bakery-accent font-semibold tracking-widest uppercase text-xs">Since 1994</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-serif font-black leading-[0.9] mb-8 tracking-tighter italic text-bakery-soft-brown">
              Freshly Baked <br />
              Happiness.
            </h1>
            
            <p className="text-lg text-bakery-body leading-relaxed mb-10 max-w-md">
              Artisanal pastries and bespoke cakes crafted with organic ingredients and a pinch of magic. Delivered straight to your nest.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onShopNow}
                className="px-8 py-4 bg-bakery-brown text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Order Now
              </button>
              <button 
                onClick={onOrderCustom}
                className="px-8 py-4 border-2 border-bakery-brown text-bakery-brown rounded-full font-bold hover:bg-bakery-brown hover:text-white transition-all"
              >
                View Menu
              </button>
            </div>

            <div className="mt-12 flex items-center space-x-8 text-sm text-bakery-brown/60">
              <div className="flex flex-col">
                <span className="font-bold text-bakery-brown">100%</span>
                <span>Organic Ingredients</span>
              </div>
              <div className="w-px h-8 bg-bakery-brown/20" />
              <div className="flex flex-col">
                <span className="font-bold text-bakery-brown">24h</span>
                <span>Freshly Baked Guarantee</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-16 lg:mt-0 relative"
          >
            <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 aspect-[3/4] md:aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000&auto=format&fit=crop" 
                alt="Bakery Hero" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm uppercase tracking-widest mb-1">Our Signature</p>
                <h3 className="text-2xl font-serif font-bold">Classic Vanilla Cloud</h3>
              </div>
            </div>
            
            {/* Decal */}
            <div className="absolute -bottom-10 -right-10 bg-bakery-pink p-8 rounded-full shadow-xl z-20 animate-bounce-slow">
              <div className="w-20 h-20 border-2 border-dashed border-bakery-soft-brown rounded-full flex items-center justify-center text-center leading-tight">
                <span className="text-bakery-soft-brown font-serif font-bold text-sm tracking-tight text-center">HAND CRAFTED</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
