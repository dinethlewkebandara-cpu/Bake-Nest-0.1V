import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, CheckCircle, Package, Loader2 } from 'lucide-react';
import { CartItem } from '../App';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CheckoutProps {
  items: CartItem[];
  onComplete: () => void;
}

export default function Checkout({ items, onComplete }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    firstName: '',
    lastName: '',
    email: auth.currentUser?.email || '',
    address: '',
    city: '',
    postalCode: ''
  });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleNext = async (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setLoading(true);
      setError(null);
      try {
        await addDoc(collection(db, 'orders'), {
          userId: auth.currentUser?.uid || 'guest',
          items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
          total: total + 5,
          shipping: orderDetails,
          status: 'paid',
          createdAt: serverTimestamp()
        });
        setStep(3);
      } catch (err) {
        console.error(err);
        handleFirestoreError(err, 'create', 'orders');
      } finally {
        setLoading(false);
      }
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-16 max-w-lg mx-auto">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
              step >= s ? 'bg-bakery-accent text-white' : 'bg-white text-bakery-brown/30 border border-bakery-brown/10'
            }`}>
              {step > s ? <CheckCircle size={20} /> : s}
            </div>
            <span className={`text-[10px] mt-2 uppercase tracking-widest font-bold ${
              step >= s ? 'text-bakery-accent' : 'text-bakery-brown/30'
            }`}>
              {s === 1 ? 'Details' : s === 2 ? 'Payment' : 'Complete'}
            </span>
            {s < 3 && (
              <div className={`absolute left-10 top-5 w-24 md:w-40 h-[2px] -z-10 ${
                step > s ? 'bg-bakery-accent' : 'bg-bakery-brown/10'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-12 rounded-[50px] shadow-xl border border-bakery-brown/5"
          >
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <h3 className="text-2xl font-serif text-bakery-brown mb-6 flex items-center gap-3">
                  <Truck className="text-bakery-accent" /> Shipping Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="First Name" 
                    required 
                    value={orderDetails.firstName}
                    onChange={(e) => setOrderDetails({...orderDetails, firstName: e.target.value})}
                    className="p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" 
                  />
                  <input 
                    placeholder="Last Name" 
                    required 
                    value={orderDetails.lastName}
                    onChange={(e) => setOrderDetails({...orderDetails, lastName: e.target.value})}
                    className="p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" 
                  />
                </div>
                <input 
                  placeholder="Email Address" 
                  type="email" 
                  required 
                  value={orderDetails.email}
                  onChange={(e) => setOrderDetails({...orderDetails, email: e.target.value})}
                  className="w-full p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" 
                />
                <input 
                  placeholder="Full Address" 
                  required 
                  value={orderDetails.address}
                  onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
                  className="w-full p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="City" 
                    required 
                    value={orderDetails.city}
                    onChange={(e) => setOrderDetails({...orderDetails, city: e.target.value})}
                    className="p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" 
                  />
                  <input 
                    placeholder="Postal Code" 
                    required 
                    value={orderDetails.postalCode}
                    onChange={(e) => setOrderDetails({...orderDetails, postalCode: e.target.value})}
                    className="p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" 
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-bakery-brown text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-bakery-soft-brown transition-all shadow-lg">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-6">
                <h3 className="text-2xl font-serif text-bakery-brown mb-6 flex items-center gap-3">
                  <CreditCard className="text-bakery-accent" /> Payment Method
                </h3>
                
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border-2 border-bakery-accent bg-bakery-pink/20 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <CreditCard size={24} className="text-bakery-accent" />
                      <div>
                        <p className="font-bold text-bakery-brown">Credit or Debit Card</p>
                        <p className="text-xs text-bakery-brown/60">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-4 border-bakery-accent" />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <input placeholder="Card Number" required className="w-full p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="MM/YY" required className="p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" />
                    <input placeholder="CVC" required className="p-4 bg-bakery-cream/50 rounded-2xl border border-bakery-brown/10 outline-none" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-bakery-accent text-white rounded-2xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Place Order Now"}
                </button>
                <div className="flex items-center justify-center gap-2 text-bakery-brown/60 text-xs">
                  <ShieldCheck size={14} />
                  <span>Your payment is encrypted and secure</span>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-4xl font-serif text-bakery-brown mb-4">Order Confirmed!</h3>
                <p className="text-bakery-brown/60 mb-10 italic">
                  Thank you for your order, #{Math.floor(Math.random() * 90000) + 10000}. <br />
                  We'll start preparing your freshly baked treats immediately.
                </p>
                <button 
                  onClick={onComplete}
                  className="px-12 py-4 bg-bakery-brown text-white rounded-full font-bold uppercase tracking-widest hover:bg-bakery-soft-brown transition-all shadow-lg"
                >
                  Return to Home
                </button>
              </div>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-bakery-brown text-white p-8 rounded-[40px] shadow-xl">
            <h3 className="text-xl font-serif mb-6 opacity-80">Order Summary</h3>
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center text-[10px]">{item.quantity}</span>
                    <span>{item.name}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10 my-4" />
            <div className="space-y-2 text-sm opacity-80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>$5.00</span>
              </div>
            </div>
            <div className="h-px bg-white/10 my-4" />
            <div className="flex justify-between text-2xl font-serif font-bold">
              <span>Total</span>
              <span>${(total + 5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
