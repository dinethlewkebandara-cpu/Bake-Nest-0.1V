import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartItem } from '../App';

interface CartProps {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function Cart({ items, onUpdateQty, onRemove, onCheckout, onContinueShopping }: CartProps) {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-bakery-pink rounded-full flex items-center justify-center text-bakery-accent">
            <ShoppingBag size={48} />
          </div>
        </div>
        <h2 className="text-4xl font-serif text-bakery-brown mb-4">Your basket is empty</h2>
        <p className="text-bakery-brown/60 mb-8 italic">It looks like you haven't added any treats to your basket yet.</p>
        <button 
          onClick={onContinueShopping}
          className="px-8 py-3 bg-bakery-brown text-white rounded-full font-medium hover:bg-bakery-soft-brown transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl md:text-5xl font-serif text-bakery-brown mb-12">Your Shopping Basket</h2>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-bakery-brown/5 shadow-sm">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 rounded-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-serif font-bold text-bakery-brown">{item.name}</h3>
                <p className="text-sm text-bakery-brown/60 mb-4">{item.category}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-bakery-brown/10 rounded-full px-2 py-1">
                    <button 
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="p-1 text-bakery-brown hover:text-bakery-accent"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="p-1 text-bakery-brown hover:text-bakery-accent"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif font-bold text-bakery-brown text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-bakery-brown/40">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}

          <button 
            onClick={onContinueShopping}
            className="flex items-center gap-2 text-bakery-accent font-medium hover:underline py-4"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-bakery-brown/5 sticky top-32">
            <h3 className="text-2xl font-serif text-bakery-brown mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-bakery-brown/60">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-bakery-brown/60">
                <span>Delivery</span>
                <span>$5.00</span>
              </div>
              <div className="h-px bg-bakery-brown/10 my-4" />
              <div className="flex justify-between text-xl font-bold text-bakery-brown">
                <span>Total</span>
                <span>${(total + 5).toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-bakery-accent text-white rounded-2xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
            >
              Proceed to Checkout
            </button>
            <p className="text-center text-[10px] text-bakery-brown/40 mt-4 px-4 uppercase tracking-tighter">
              Secure payments powered by BakeNest Pay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
